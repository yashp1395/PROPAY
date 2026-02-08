package com.payroll.controller;

import com.payroll.dto.SalaryRequest;
import com.payroll.dto.SalaryResponse;
import com.payroll.entity.Employee;
import com.payroll.service.PayslipService;
import com.payroll.service.SalaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/salary")
@Tag(name = "Salary", description = "Salary management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SalaryController {
    
    @Autowired
    private SalaryService salaryService;
    
    @Autowired
    private PayslipService payslipService;
    
    // Admin endpoints
    @PostMapping("/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create or update salary", description = "Create or update salary details for an employee")
    public ResponseEntity<SalaryResponse> createOrUpdateSalary(@PathVariable Long employeeId,
                                                              @Valid @RequestBody SalaryRequest request) {
        SalaryResponse salary = salaryService.createOrUpdateSalary(employeeId, request);
        return new ResponseEntity<>(salary, HttpStatus.CREATED);
    }
    
    @GetMapping("/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and #employeeId == authentication.principal.employeeId)")
    @Operation(summary = "Get employee salary history", description = "Get salary history for an employee")
    public ResponseEntity<List<SalaryResponse>> getEmployeeSalaryHistory(@PathVariable Long employeeId) {
        List<SalaryResponse> salaryHistory = salaryService.getEmployeeSalaryHistory(employeeId);
        return ResponseEntity.ok(salaryHistory);
    }
    
    @GetMapping("/{employeeId}/paged")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and #employeeId == authentication.principal.employeeId)")
    @Operation(summary = "Get employee salary history with pagination", description = "Get paginated salary history for an employee")
    public ResponseEntity<Page<SalaryResponse>> getEmployeeSalaryHistoryPaged(@PathVariable Long employeeId, 
                                                                             Pageable pageable) {
        Page<SalaryResponse> salaryHistory = salaryService.getEmployeeSalaryHistoryPaged(employeeId, pageable);
        return ResponseEntity.ok(salaryHistory);
    }
    
    @GetMapping("/{employeeId}/{month}/{year}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and #employeeId == authentication.principal.employeeId)")
    @Operation(summary = "Get salary by month", description = "Get salary details for specific month and year")
    public ResponseEntity<SalaryResponse> getEmployeeSalaryByMonth(@PathVariable Long employeeId,
                                                                  @PathVariable Integer month,
                                                                  @PathVariable Integer year) {
        SalaryResponse salary = salaryService.getEmployeeSalaryByMonth(employeeId, month, year);
        return ResponseEntity.ok(salary);
    }
    
    @GetMapping("/month/{month}/year/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all salaries by month", description = "Get all employee salaries for specific month and year")
    public ResponseEntity<List<SalaryResponse>> getAllSalariesByMonth(@PathVariable Integer month,
                                                                     @PathVariable Integer year) {
        List<SalaryResponse> salaries = salaryService.getAllSalariesByMonth(month, year);
        return ResponseEntity.ok(salaries);
    }
    
    @GetMapping("/year/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all salaries by year", description = "Get all employee salaries for specific year")
    public ResponseEntity<List<SalaryResponse>> getAllSalariesByYear(@PathVariable Integer year) {
        List<SalaryResponse> salaries = salaryService.getAllSalariesByYear(year);
        return ResponseEntity.ok(salaries);
    }
    
    @DeleteMapping("/record/{salaryId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete salary record", description = "Delete salary record (only if not processed)")
    public ResponseEntity<String> deleteSalary(@PathVariable Long salaryId) {
        salaryService.deleteSalary(salaryId);
        return ResponseEntity.ok("Salary record deleted successfully");
    }
    
    @PutMapping("/process/{salaryId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark salary as processed", description = "Mark salary record as processed")
    public ResponseEntity<SalaryResponse> markSalaryAsProcessed(@PathVariable Long salaryId) {
        SalaryResponse salary = salaryService.markSalaryAsProcessed(salaryId);
        return ResponseEntity.ok(salary);
    }
    
    @GetMapping("/unprocessed")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get unprocessed salaries", description = "Get all unprocessed salary records")
    public ResponseEntity<List<SalaryResponse>> getUnprocessedSalaries() {
        List<SalaryResponse> salaries = salaryService.getUnprocessedSalaries();
        return ResponseEntity.ok(salaries);
    }
    
    // Payslip endpoints
    @GetMapping("/{employeeId}/payslip/{month}/{year}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and #employeeId == authentication.principal.employeeId)")
    @Operation(summary = "Download payslip", description = "Download payslip PDF for specific month and year")
    public ResponseEntity<byte[]> downloadPayslip(@PathVariable Long employeeId,
                                                 @PathVariable Integer month,
                                                 @PathVariable Integer year) {
        try {
            byte[] pdfContent = payslipService.generatePayslip(employeeId, month, year);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                    String.format("payslip_%d_%d_%d.pdf", employeeId, month, year));
            headers.setContentLength(pdfContent.length);
            
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error generating payslip: " + e.getMessage());
        }
    }
    
    @GetMapping("/payslip/{salaryId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Download payslip by salary ID", description = "Download payslip PDF by salary record ID")
    public ResponseEntity<byte[]> downloadPayslipBySalaryId(@PathVariable Long salaryId) {
        try {
            byte[] pdfContent = payslipService.generatePayslipBySalaryId(salaryId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                    String.format("payslip_%d.pdf", salaryId));
            headers.setContentLength(pdfContent.length);
            
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error generating payslip: " + e.getMessage());
        }
    }
    
    // Employee self-service endpoints
    @GetMapping("/my-salary")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get my salary history", description = "Get current employee's salary history")
    public ResponseEntity<List<SalaryResponse>> getMySalaryHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee employee = (Employee) authentication.getPrincipal();
        
        List<SalaryResponse> salaryHistory = salaryService.getEmployeeSalaryHistory(employee.getEmployeeId());
        return ResponseEntity.ok(salaryHistory);
    }
    
    @GetMapping("/my-salary/{month}/{year}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get my salary by month", description = "Get current employee's salary for specific month and year")
    public ResponseEntity<SalaryResponse> getMySalaryByMonth(@PathVariable Integer month,
                                                           @PathVariable Integer year) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee employee = (Employee) authentication.getPrincipal();
        
        SalaryResponse salary = salaryService.getEmployeeSalaryByMonth(employee.getEmployeeId(), month, year);
        return ResponseEntity.ok(salary);
    }
    
    @GetMapping("/my-payslip/{month}/{year}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Download my payslip", description = "Download current employee's payslip for specific month and year")
    public ResponseEntity<byte[]> downloadMyPayslip(@PathVariable Integer month,
                                                   @PathVariable Integer year) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Employee employee = (Employee) authentication.getPrincipal();
            
            byte[] pdfContent = payslipService.generatePayslip(employee.getEmployeeId(), month, year);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                    String.format("payslip_%s_%d_%d.pdf", employee.getEmployeeCode(), month, year));
            headers.setContentLength(pdfContent.length);
            
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error generating payslip: " + e.getMessage());
        }
    }
}