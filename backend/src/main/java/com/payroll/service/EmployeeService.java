package com.payroll.service;

import com.payroll.dto.EmployeeRequest;
import com.payroll.dto.EmployeeResponse;
import com.payroll.entity.Department;
import com.payroll.entity.Employee;
import com.payroll.enums.Role;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.repository.DepartmentRepository;
import com.payroll.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employees = employeeRepository.findByIsActive(true);
        return employees.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<EmployeeResponse> getAllEmployeesPaged(Pageable pageable) {
        Page<Employee> employees = employeeRepository.findByIsActive(true, pageable);
        return employees.map(this::convertToResponse);
    }
    
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return convertToResponse(employee);
    }
    
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        // Check if email already exists
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }
        
        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setAddress(request.getAddress());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setHireDate(request.getHireDate() != null ? request.getHireDate() : LocalDate.now());
        employee.setRole(request.getRole());
        employee.setIsActive(true);
        
        // Generate employee code
        employee.setEmployeeCode(generateEmployeeCode());
        
        // Set department if provided
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
            employee.setDepartment(department);
        }
        
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToResponse(savedEmployee);
    }
    
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        
        // Check if email already exists for another employee
        if (!employee.getEmail().equals(request.getEmail()) && 
            employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }
        
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setAddress(request.getAddress());
        employee.setDateOfBirth(request.getDateOfBirth());
        
        if (request.getHireDate() != null) {
            employee.setHireDate(request.getHireDate());
        }
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Update department if provided
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
            employee.setDepartment(department);
        }
        
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToResponse(savedEmployee);
    }
    
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        
        // Soft delete - set isActive to false
        employee.setIsActive(false);
        employeeRepository.save(employee);
    }
    
    public Page<EmployeeResponse> searchEmployees(String keyword, Pageable pageable) {
        Page<Employee> employees = employeeRepository.searchActiveEmployees(keyword, pageable);
        return employees.map(this::convertToResponse);
    }
    
    public List<EmployeeResponse> getEmployeesByDepartment(Long departmentId) {
        List<Employee> employees = employeeRepository.findByDepartmentDeptId(departmentId);
        return employees.stream()
                .filter(Employee::getIsActive)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EmployeeResponse> getEmployeesByRole(Role role) {
        List<Employee> employees = employeeRepository.findByRole(role);
        return employees.stream()
                .filter(Employee::getIsActive)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Long getActiveEmployeeCount() {
        return employeeRepository.countActiveEmployees();
    }
    
    public Long getActiveEmployeeCountByDepartment(Long departmentId) {
        return employeeRepository.countActiveEmployeesByDepartment(departmentId);
    }
    
    private String generateEmployeeCode() {
        String prefix = "EMP";
        long count = employeeRepository.count() + 1;
        return prefix + String.format("%04d", count);
    }
    
    private EmployeeResponse convertToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setPhoneNumber(employee.getPhoneNumber());
        response.setAddress(employee.getAddress());
        response.setDateOfBirth(employee.getDateOfBirth());
        response.setHireDate(employee.getHireDate());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setRole(employee.getRole());
        response.setIsActive(employee.getIsActive());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        
        if (employee.getDepartment() != null) {
            response.setDepartmentName(employee.getDepartment().getDeptName());
        }
        
        return response;
    }
    
    // Search methods
    public List<EmployeeResponse> searchByName(String name) {
        List<Employee> employees = employeeRepository.searchByName(name);
        return employees.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public EmployeeResponse searchById(Long id) {
        Employee employee = employeeRepository.searchById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return convertToResponse(employee);
    }
    
    public List<EmployeeResponse> searchByEmployeeCode(String code) {
        List<Employee> employees = employeeRepository.searchByEmployeeCode(code);
        return employees.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EmployeeResponse> searchByDepartmentName(String deptName) {
        List<Employee> employees = employeeRepository.searchByDepartmentName(deptName);
        return employees.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<EmployeeResponse> advancedSearch(String name, Long employeeId, String employeeCode, Long deptId, Pageable pageable) {
        Page<Employee> employees = employeeRepository.advancedSearch(name, employeeId, employeeCode, deptId, pageable);
        return employees.map(this::convertToResponse);
    }
}