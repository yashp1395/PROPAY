package com.payroll.service;

import com.payroll.dto.SalaryRequest;
import com.payroll.dto.SalaryResponse;
import com.payroll.entity.Employee;
import com.payroll.entity.SalaryDetails;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.SalaryDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalaryService {
    
    @Autowired
    private SalaryDetailsRepository salaryDetailsRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    public SalaryResponse createOrUpdateSalary(Long employeeId, SalaryRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
        
        // Check if salary already exists for this month/year
        SalaryDetails existingSalary = salaryDetailsRepository
                .findByEmployeeEmployeeIdAndMonthAndYear(employeeId, request.getMonth(), request.getYear())
                .orElse(null);
        
        SalaryDetails salaryDetails;
        if (existingSalary != null) {
            // Update existing salary
            salaryDetails = existingSalary;
            salaryDetails.setBasicSalary(request.getBasicSalary());
            salaryDetails.setAllowances(request.getAllowances());
            salaryDetails.setDeductions(request.getDeductions());
            salaryDetails.setTaxPercent(request.getTaxPercent());
            salaryDetails.calculateSalary();
        } else {
            // Create new salary record
            salaryDetails = new SalaryDetails(
                employee,
                request.getBasicSalary(),
                request.getAllowances(),
                request.getDeductions(),
                request.getTaxPercent(),
                request.getMonth(),
                request.getYear()
            );
        }
        
        SalaryDetails savedSalary = salaryDetailsRepository.save(salaryDetails);
        return convertToResponse(savedSalary);
    }
    
    public SalaryResponse getSalaryById(Long salaryId) {
        SalaryDetails salaryDetails = salaryDetailsRepository.findById(salaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found with id: " + salaryId));
        return convertToResponse(salaryDetails);
    }
    
    public List<SalaryResponse> getEmployeeSalaryHistory(Long employeeId) {
        List<SalaryDetails> salaryHistory = salaryDetailsRepository
                .findByEmployeeEmployeeIdOrderByYearDescMonthDesc(employeeId);
        return salaryHistory.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<SalaryResponse> getEmployeeSalaryHistoryPaged(Long employeeId, Pageable pageable) {
        Page<SalaryDetails> salaryHistory = salaryDetailsRepository
                .findByEmployeeEmployeeIdOrderByYearDescMonthDesc(employeeId, pageable);
        return salaryHistory.map(this::convertToResponse);
    }
    
    public SalaryResponse getEmployeeSalaryByMonth(Long employeeId, Integer month, Integer year) {
        SalaryDetails salaryDetails = salaryDetailsRepository
                .findByEmployeeEmployeeIdAndMonthAndYear(employeeId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException(
                    String.format("Salary record not found for employee %d in %d/%d", employeeId, month, year)));
        return convertToResponse(salaryDetails);
    }
    
    public List<SalaryResponse> getAllSalariesByMonth(Integer month, Integer year) {
        List<SalaryDetails> salaries = salaryDetailsRepository.findByMonthAndYear(month, year);
        return salaries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<SalaryResponse> getAllSalariesByYear(Integer year) {
        List<SalaryDetails> salaries = salaryDetailsRepository.findByYearOrderByMonth(year);
        return salaries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteSalary(Long salaryId) {
        SalaryDetails salaryDetails = salaryDetailsRepository.findById(salaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found with id: " + salaryId));
        
        if (salaryDetails.getIsProcessed()) {
            throw new IllegalArgumentException("Cannot delete processed salary record");
        }
        
        salaryDetailsRepository.delete(salaryDetails);
    }
    
    public SalaryResponse markSalaryAsProcessed(Long salaryId) {
        SalaryDetails salaryDetails = salaryDetailsRepository.findById(salaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found with id: " + salaryId));
        
        salaryDetails.setIsProcessed(true);
        SalaryDetails savedSalary = salaryDetailsRepository.save(salaryDetails);
        return convertToResponse(savedSalary);
    }
    
    public List<SalaryResponse> getUnprocessedSalaries() {
        List<SalaryDetails> unprocessedSalaries = salaryDetailsRepository.findByProcessedStatus(false);
        return unprocessedSalaries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Long getSalaryRecordCount(Long employeeId) {
        return salaryDetailsRepository.countSalaryRecordsByEmployee(employeeId);
    }
    
    private SalaryResponse convertToResponse(SalaryDetails salaryDetails) {
        SalaryResponse response = new SalaryResponse();
        response.setSalaryId(salaryDetails.getSalaryId());
        response.setEmployeeId(salaryDetails.getEmployee().getEmployeeId());
        response.setEmployeeName(salaryDetails.getEmployee().getFullName());
        response.setBasicSalary(salaryDetails.getBasicSalary());
        response.setAllowances(salaryDetails.getAllowances());
        response.setDeductions(salaryDetails.getDeductions());
        response.setTaxPercent(salaryDetails.getTaxPercent());
        response.setMonth(salaryDetails.getMonth());
        response.setYear(salaryDetails.getYear());
        response.setGrossSalary(salaryDetails.getGrossSalary());
        response.setTaxAmount(salaryDetails.getTaxAmount());
        response.setNetSalary(salaryDetails.getNetSalary());
        response.setIsProcessed(salaryDetails.getIsProcessed());
        response.setCreatedAt(salaryDetails.getCreatedAt());
        response.setUpdatedAt(salaryDetails.getUpdatedAt());
        
        return response;
    }
}