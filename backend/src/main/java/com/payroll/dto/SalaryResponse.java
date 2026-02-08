package com.payroll.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SalaryResponse {
    
    private Long salaryId;
    private Long employeeId;
    private String employeeName;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal taxPercent;
    private Integer month;
    private Integer year;
    private BigDecimal grossSalary;
    private BigDecimal taxAmount;
    private BigDecimal netSalary;
    private Boolean isProcessed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public SalaryResponse() {}
    
    // Getters and Setters
    public Long getSalaryId() {
        return salaryId;
    }
    
    public void setSalaryId(Long salaryId) {
        this.salaryId = salaryId;
    }
    
    public Long getEmployeeId() {
        return employeeId;
    }
    
    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
    
    public String getEmployeeName() {
        return employeeName;
    }
    
    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
    
    public BigDecimal getBasicSalary() {
        return basicSalary;
    }
    
    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
    }
    
    public BigDecimal getAllowances() {
        return allowances;
    }
    
    public void setAllowances(BigDecimal allowances) {
        this.allowances = allowances;
    }
    
    public BigDecimal getDeductions() {
        return deductions;
    }
    
    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
    }
    
    public BigDecimal getTaxPercent() {
        return taxPercent;
    }
    
    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
    }
    
    public Integer getMonth() {
        return month;
    }
    
    public void setMonth(Integer month) {
        this.month = month;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public BigDecimal getGrossSalary() {
        return grossSalary;
    }
    
    public void setGrossSalary(BigDecimal grossSalary) {
        this.grossSalary = grossSalary;
    }
    
    public BigDecimal getTaxAmount() {
        return taxAmount;
    }
    
    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
    
    public BigDecimal getNetSalary() {
        return netSalary;
    }
    
    public void setNetSalary(BigDecimal netSalary) {
        this.netSalary = netSalary;
    }
    
    public Boolean getIsProcessed() {
        return isProcessed;
    }
    
    public void setIsProcessed(Boolean isProcessed) {
        this.isProcessed = isProcessed;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}