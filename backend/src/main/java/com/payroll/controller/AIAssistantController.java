package com.payroll.controller;

import com.payroll.dto.SalaryResponse;
import com.payroll.entity.Employee;
import com.payroll.service.GeminiAIService;
import com.payroll.service.SalaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/ai")
@Tag(name = "AI Assistant", description = "AI-powered payroll insights and recommendations")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AIAssistantController {
    
    @Autowired
    private GeminiAIService geminiAIService;
    
    @Autowired
    private SalaryService salaryService;
    
    @GetMapping("/salary-insights/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and #employeeId == authentication.principal.employeeId)")
    @Operation(summary = "Get AI-powered salary insights", 
               description = "Get personalized salary insights and recommendations using Gemini AI")
    public Mono<ResponseEntity<String>> getSalaryInsights(@PathVariable Long employeeId) {
        try {
            List<SalaryResponse> salaryHistory = salaryService.getEmployeeSalaryHistory(employeeId);
            
            if (salaryHistory.isEmpty()) {
                return Mono.just(ResponseEntity.ok("No salary data available for analysis."));
            }
            
            SalaryResponse latestSalary = salaryHistory.get(0);
            String employeeName = latestSalary.getEmployeeName();
            
            StringBuilder salaryData = new StringBuilder();
            salaryData.append("Employee: ").append(employeeName).append("\n");
            salaryData.append("Latest Salary Details:\n");
            salaryData.append("Basic Salary: ₹").append(latestSalary.getBasicSalary()).append("\n");
            salaryData.append("Allowances: ₹").append(latestSalary.getAllowances()).append("\n");
            salaryData.append("Deductions: ₹").append(latestSalary.getDeductions()).append("\n");
            salaryData.append("Tax Percentage: ").append(latestSalary.getTaxPercent()).append("%\n");
            salaryData.append("Gross Salary: ₹").append(latestSalary.getGrossSalary()).append("\n");
            salaryData.append("Tax Amount: ₹").append(latestSalary.getTaxAmount()).append("\n");
            salaryData.append("Net Salary: ₹").append(latestSalary.getNetSalary()).append("\n");
            
            if (salaryHistory.size() > 1) {
                salaryData.append("\nSalary History (").append(salaryHistory.size()).append(" records):\n");
                for (int i = 1; i < Math.min(salaryHistory.size(), 4); i++) {
                    SalaryResponse historic = salaryHistory.get(i);
                    salaryData.append("Month ").append(historic.getMonth()).append("/").append(historic.getYear())
                             .append(": Net ₹").append(historic.getNetSalary()).append("\n");
                }
            }
            
            return geminiAIService.generateSalaryInsights(employeeName, salaryData.toString())
                    .map(ResponseEntity::ok);
                    
        } catch (Exception e) {
            return Mono.just(ResponseEntity.ok("Unable to generate salary insights at this time."));
        }
    }
    
    @GetMapping("/my-salary-insights")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get my salary insights", 
               description = "Get personalized salary insights for the current employee")
    public Mono<ResponseEntity<String>> getMySalaryInsights() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee employee = (Employee) authentication.getPrincipal();
        
        return getSalaryInsights(employee.getEmployeeId());
    }
    
    @GetMapping("/tax-advice/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('EMPLOYEE') and #employeeId == authentication.principal.employeeId)")
    @Operation(summary = "Get AI-powered tax advice", 
               description = "Get personalized tax optimization advice using Gemini AI")
    public Mono<ResponseEntity<String>> getTaxAdvice(@PathVariable Long employeeId) {
        try {
            List<SalaryResponse> salaryHistory = salaryService.getEmployeeSalaryHistory(employeeId);
            
            if (salaryHistory.isEmpty()) {
                return Mono.just(ResponseEntity.ok("No salary data available for tax advice."));
            }
            
            SalaryResponse latestSalary = salaryHistory.get(0);
            
            StringBuilder salaryStructure = new StringBuilder();
            salaryStructure.append("Current Salary Structure:\n");
            salaryStructure.append("Basic Salary: ₹").append(latestSalary.getBasicSalary()).append("\n");
            salaryStructure.append("Allowances: ₹").append(latestSalary.getAllowances()).append("\n");
            salaryStructure.append("Current Tax Rate: ").append(latestSalary.getTaxPercent()).append("%\n");
            salaryStructure.append("Annual Gross: ₹").append(latestSalary.getGrossSalary().multiply(java.math.BigDecimal.valueOf(12))).append("\n");
            salaryStructure.append("Annual Tax: ₹").append(latestSalary.getTaxAmount().multiply(java.math.BigDecimal.valueOf(12))).append("\n");
            
            return geminiAIService.generateTaxAdvice(salaryStructure.toString())
                    .map(ResponseEntity::ok);
                    
        } catch (Exception e) {
            return Mono.just(ResponseEntity.ok("Unable to generate tax advice at this time."));
        }
    }
    
    @GetMapping("/my-tax-advice")
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "Get my tax advice", 
               description = "Get personalized tax advice for the current employee")
    public Mono<ResponseEntity<String>> getMyTaxAdvice() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Employee employee = (Employee) authentication.getPrincipal();
        
        return getTaxAdvice(employee.getEmployeeId());
    }
    
    @GetMapping("/payroll-report/{month}/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Generate AI payroll report", 
               description = "Generate comprehensive payroll analysis report using Gemini AI")
    public Mono<ResponseEntity<String>> generatePayrollReport(@PathVariable Integer month, 
                                                             @PathVariable Integer year) {
        try {
            List<SalaryResponse> monthlyPayroll = salaryService.getAllSalariesByMonth(month, year);
            
            if (monthlyPayroll.isEmpty()) {
                return Mono.just(ResponseEntity.ok("No payroll data available for the specified month."));
            }
            
            StringBuilder payrollData = new StringBuilder();
            payrollData.append("Payroll Report for ").append(month).append("/").append(year).append("\n");
            payrollData.append("Total Employees: ").append(monthlyPayroll.size()).append("\n\n");
            
            double totalGross = 0, totalNet = 0, totalTax = 0, totalDeductions = 0;
            
            for (SalaryResponse salary : monthlyPayroll) {
                totalGross += salary.getGrossSalary().doubleValue();
                totalNet += salary.getNetSalary().doubleValue();
                totalTax += salary.getTaxAmount().doubleValue();
                totalDeductions += salary.getDeductions().doubleValue();
            }
            
            payrollData.append("Financial Summary:\n");
            payrollData.append("Total Gross Payroll: ₹").append(String.format("%.2f", totalGross)).append("\n");
            payrollData.append("Total Net Payroll: ₹").append(String.format("%.2f", totalNet)).append("\n");
            payrollData.append("Total Tax Deducted: ₹").append(String.format("%.2f", totalTax)).append("\n");
            payrollData.append("Total Other Deductions: ₹").append(String.format("%.2f", totalDeductions)).append("\n");
            payrollData.append("Average Gross Salary: ₹").append(String.format("%.2f", totalGross / monthlyPayroll.size())).append("\n");
            payrollData.append("Average Net Salary: ₹").append(String.format("%.2f", totalNet / monthlyPayroll.size())).append("\n");
            
            return geminiAIService.generatePayrollReport(payrollData.toString())
                    .map(ResponseEntity::ok);
                    
        } catch (Exception e) {
            return Mono.just(ResponseEntity.ok("Unable to generate payroll report at this time."));
        }
    }
    
    @PostMapping("/compensation-benchmark")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get compensation benchmarking", 
               description = "Get AI-powered compensation benchmarking data")
    public Mono<ResponseEntity<String>> getCompensationBenchmark(@RequestParam String jobRole,
                                                                @RequestParam String experience,
                                                                @RequestParam String location) {
        try {
            return geminiAIService.generateCompensationBenchmark(jobRole, experience, location)
                    .map(ResponseEntity::ok);
        } catch (Exception e) {
            return Mono.just(ResponseEntity.ok("Unable to generate compensation benchmark at this time."));
        }
    }
    
    @PostMapping("/ask-question")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Ask AI assistant", 
               description = "Ask general payroll-related questions to the AI assistant")
    public Mono<ResponseEntity<String>> askQuestion(@RequestBody QuestionRequest request) {
        try {
            String enhancedPrompt = "As a payroll and HR expert, please answer the following question: " + 
                                  request.getQuestion() + 
                                  "\n\nProvide practical, accurate, and helpful information related to payroll, " +
                                  "compensation, taxes, and HR best practices.";
            
            return geminiAIService.generateText(enhancedPrompt)
                    .map(ResponseEntity::ok);
        } catch (Exception e) {
            return Mono.just(ResponseEntity.ok("Unable to process your question at this time."));
        }
    }
    
    // Inner class for request body
    public static class QuestionRequest {
        private String question;
        
        public String getQuestion() {
            return question;
        }
        
        public void setQuestion(String question) {
            this.question = question;
        }
    }
}