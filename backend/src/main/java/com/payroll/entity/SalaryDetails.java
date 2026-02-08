package com.payroll.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_details")
@EntityListeners(AuditingEntityListener.class)
public class SalaryDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salary_id")
    private Long salaryId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", referencedColumnName = "employee_id", nullable = false)
    private Employee employee;
    
    @NotNull(message = "Basic salary is required")
    @DecimalMin(value = "0.0", message = "Basic salary must be positive")
    @Column(name = "basic_salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal basicSalary;
    
    @Column(name = "allowances", precision = 10, scale = 2)
    private BigDecimal allowances = BigDecimal.ZERO;
    
    @Column(name = "deductions", precision = 10, scale = 2)
    private BigDecimal deductions = BigDecimal.ZERO;
    
    @Column(name = "tax_percent", precision = 5, scale = 2)
    private BigDecimal taxPercent = BigDecimal.ZERO;
    
    @Column(name = "month")
    private Integer month;
    
    @Column(name = "year")
    private Integer year;
    
    @Column(name = "gross_salary", precision = 10, scale = 2)
    private BigDecimal grossSalary;
    
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount;
    
    @Column(name = "net_salary", precision = 10, scale = 2)
    private BigDecimal netSalary;
    
    @Column(name = "is_processed")
    private Boolean isProcessed = false;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public SalaryDetails() {}
    
    public SalaryDetails(Employee employee, BigDecimal basicSalary, BigDecimal allowances, 
                        BigDecimal deductions, BigDecimal taxPercent, Integer month, Integer year) {
        this.employee = employee;
        this.basicSalary = basicSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.taxPercent = taxPercent;
        this.month = month;
        this.year = year;
        calculateSalary();
    }
    
    // Calculate salary components
    public void calculateSalary() {
        // Gross Salary = Basic + Allowances
        this.grossSalary = basicSalary.add(allowances);
        
        // Tax Amount = (Gross Salary * Tax Percent) / 100
        this.taxAmount = grossSalary.multiply(taxPercent).divide(BigDecimal.valueOf(100));
        
        // Net Salary = Gross - Tax - Other Deductions
        this.netSalary = grossSalary.subtract(taxAmount).subtract(deductions);
    }
    
    // Getters and Setters
    public Long getSalaryId() {
        return salaryId;
    }
    
    public void setSalaryId(Long salaryId) {
        this.salaryId = salaryId;
    }
    
    public Employee getEmployee() {
        return employee;
    }
    
    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    
    public BigDecimal getBasicSalary() {
        return basicSalary;
    }
    
    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
        calculateSalary();
    }
    
    public BigDecimal getAllowances() {
        return allowances;
    }
    
    public void setAllowances(BigDecimal allowances) {
        this.allowances = allowances;
        calculateSalary();
    }
    
    public BigDecimal getDeductions() {
        return deductions;
    }
    
    public void setDeductions(BigDecimal deductions) {
        this.deductions = deductions;
        calculateSalary();
    }
    
    public BigDecimal getTaxPercent() {
        return taxPercent;
    }
    
    public void setTaxPercent(BigDecimal taxPercent) {
        this.taxPercent = taxPercent;
        calculateSalary();
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