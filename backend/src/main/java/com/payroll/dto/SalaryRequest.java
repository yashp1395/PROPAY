package com.payroll.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class SalaryRequest {
    
    @NotNull(message = "Basic salary is required")
    @DecimalMin(value = "0.0", message = "Basic salary must be positive")
    private BigDecimal basicSalary;
    
    private BigDecimal allowances = BigDecimal.ZERO;
    
    private BigDecimal deductions = BigDecimal.ZERO;
    
    private BigDecimal taxPercent = BigDecimal.ZERO;
    
    @NotNull(message = "Month is required")
    private Integer month;
    
    @NotNull(message = "Year is required")
    private Integer year;
    
    // Constructors
    public SalaryRequest() {}
    
    public SalaryRequest(BigDecimal basicSalary, BigDecimal allowances, 
                        BigDecimal deductions, BigDecimal taxPercent, 
                        Integer month, Integer year) {
        this.basicSalary = basicSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.taxPercent = taxPercent;
        this.month = month;
        this.year = year;
    }
    
    // Getters and Setters
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
}