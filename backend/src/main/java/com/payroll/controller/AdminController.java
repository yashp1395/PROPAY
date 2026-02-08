package com.payroll.controller;

import com.payroll.dto.EmployeeRequest;
import com.payroll.dto.EmployeeResponse;
import com.payroll.entity.Department;
import com.payroll.enums.Role;
import com.payroll.service.DepartmentService;
import com.payroll.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Admin management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private DepartmentService departmentService;
    
    // Employee Management
    @GetMapping("/employees")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all employees", description = "Retrieve all active employees")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        List<EmployeeResponse> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/paged")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get employees with pagination", description = "Retrieve employees with pagination support")
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployeesPaged(Pageable pageable) {
        Page<EmployeeResponse> employees = employeeService.getAllEmployeesPaged(pageable);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get employee by ID", description = "Retrieve employee details by ID")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }
    
    @PostMapping("/employees")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new employee", description = "Create a new employee record")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse employee = employeeService.createEmployee(request);
        return new ResponseEntity<>(employee, HttpStatus.CREATED);
    }
    
    @PutMapping("/employees/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update employee", description = "Update existing employee details")
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id, 
                                                          @Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse employee = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(employee);
    }
    
    @DeleteMapping("/employees/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete employee", description = "Soft delete employee (set inactive)")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee deleted successfully");
    }
    
    @GetMapping("/employees/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search employees", description = "Search employees by keyword")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(@RequestParam String keyword, 
                                                                 Pageable pageable) {
        Page<EmployeeResponse> employees = employeeService.searchEmployees(keyword, pageable);
        return ResponseEntity.ok(employees);
    }
    
    // New search endpoints
    @GetMapping("/employees/search/name")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search employees by name", description = "Search employees by first or last name")
    public ResponseEntity<List<EmployeeResponse>> searchByName(@RequestParam String name) {
        List<EmployeeResponse> employees = employeeService.searchByName(name);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/search/id/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search employee by ID", description = "Search employee by employee ID")
    public ResponseEntity<EmployeeResponse> searchById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.searchById(id);
        return ResponseEntity.ok(employee);
    }
    
    @GetMapping("/employees/search/code")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search employees by code", description = "Search employees by employee code")
    public ResponseEntity<List<EmployeeResponse>> searchByEmployeeCode(@RequestParam String code) {
        List<EmployeeResponse> employees = employeeService.searchByEmployeeCode(code);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/search/department")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search employees by department", description = "Search employees by department name")
    public ResponseEntity<List<EmployeeResponse>> searchByDepartmentName(@RequestParam String deptName) {
        List<EmployeeResponse> employees = employeeService.searchByDepartmentName(deptName);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/search/advanced")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Advanced employee search", description = "Search employees with multiple criteria")
    public ResponseEntity<Page<EmployeeResponse>> advancedSearch(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String employeeCode,
            @RequestParam(required = false) Long deptId,
            Pageable pageable) {
        Page<EmployeeResponse> employees = employeeService.advancedSearch(name, employeeId, employeeCode, deptId, pageable);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get employees by department", description = "Retrieve employees by department ID")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        List<EmployeeResponse> employees = employeeService.getEmployeesByDepartment(departmentId);
        return ResponseEntity.ok(employees);
    }
    
    @GetMapping("/employees/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get employees by role", description = "Retrieve employees by role")
    public ResponseEntity<List<EmployeeResponse>> getEmployeesByRole(@PathVariable Role role) {
        List<EmployeeResponse> employees = employeeService.getEmployeesByRole(role);
        return ResponseEntity.ok(employees);
    }
    
    // Department Management
    @GetMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all departments", description = "Retrieve all departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    
    @GetMapping("/departments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get department by ID", description = "Retrieve department details by ID")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        Department department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }
    
    @PostMapping("/departments")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new department", description = "Create a new department")
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody Department department) {
        Department createdDepartment = departmentService.createDepartment(department);
        return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
    }
    
    @PutMapping("/departments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update department", description = "Update existing department")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, 
                                                      @Valid @RequestBody Department department) {
        Department updatedDepartment = departmentService.updateDepartment(id, department);
        return ResponseEntity.ok(updatedDepartment);
    }
    
    @DeleteMapping("/departments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete department", description = "Delete department (only if no employees)")
    public ResponseEntity<String> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok("Department deleted successfully");
    }
    
    // Statistics
    @GetMapping("/statistics/employees/count")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get active employee count", description = "Get total count of active employees")
    public ResponseEntity<Long> getActiveEmployeeCount() {
        Long count = employeeService.getActiveEmployeeCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistics/employees/count/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get employee count by department", description = "Get count of active employees in a department")
    public ResponseEntity<Long> getActiveEmployeeCountByDepartment(@PathVariable Long departmentId) {
        Long count = employeeService.getActiveEmployeeCountByDepartment(departmentId);
        return ResponseEntity.ok(count);
    }
}