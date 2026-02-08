package com.payroll.controller;

import com.payroll.dto.EmployeeResponse;
import com.payroll.entity.Employee;
import com.payroll.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
@Tag(name = "Employee", description = "Employee self-service APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @Operation(summary = "Get employee profile", description = "Get current logged in employee's profile")
    public ResponseEntity<EmployeeResponse> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee employee = (Employee) authentication.getPrincipal();
        
        EmployeeResponse employeeResponse = employeeService.getEmployeeById(employee.getEmployeeId());
        return ResponseEntity.ok(employeeResponse);
    }
    
    @GetMapping("/profile/{id}")
    @PreAuthorize("(hasRole('EMPLOYEE') and #id == authentication.principal.employeeId) or hasRole('ADMIN')")
    @Operation(summary = "Get employee profile by ID", description = "Get employee profile by ID (own profile or admin)")
    public ResponseEntity<EmployeeResponse> getProfileById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }
}