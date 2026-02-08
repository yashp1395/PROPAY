package com.payroll.dto;

public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private String email;
    private String role;
    private Long employeeId;
    private String fullName;
    
    // Constructors
    public JwtResponse() {}
    
    public JwtResponse(String token, String email, String role, Long employeeId, String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.employeeId = employeeId;
        this.fullName = fullName;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public Long getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}