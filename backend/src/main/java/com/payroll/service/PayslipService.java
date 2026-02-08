package com.payroll.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.payroll.entity.Employee;
import com.payroll.entity.SalaryDetails;
import com.payroll.exception.ResourceNotFoundException;
import com.payroll.repository.SalaryDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class PayslipService {
    
    @Autowired
    private SalaryDetailsRepository salaryDetailsRepository;
    
    public byte[] generatePayslip(Long employeeId, Integer month, Integer year) throws DocumentException, IOException {
        SalaryDetails salaryDetails = salaryDetailsRepository
                .findByEmployeeEmployeeIdAndMonthAndYear(employeeId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException(
                    String.format("Salary record not found for employee %d in %d/%d", employeeId, month, year)));
        
        return createPayslipPDF(salaryDetails);
    }
    
    public byte[] generatePayslipBySalaryId(Long salaryId) throws DocumentException, IOException {
        SalaryDetails salaryDetails = salaryDetailsRepository.findById(salaryId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary record not found with id: " + salaryId));
        
        return createPayslipPDF(salaryDetails);
    }
    
    private byte[] createPayslipPDF(SalaryDetails salaryDetails) throws DocumentException, IOException {
        Employee employee = salaryDetails.getEmployee();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        // Add company header
        addCompanyHeader(document);
        
        // Add payslip title
        addPayslipTitle(document, salaryDetails.getMonth(), salaryDetails.getYear());
        
        // Add employee information
        addEmployeeInfo(document, employee);
        
        // Add salary breakdown
        addSalaryBreakdown(document, salaryDetails);
        
        // Add footer
        addFooter(document);
        
        document.close();
        
        return baos.toByteArray();
    }
    
    private void addCompanyHeader(Document document) throws DocumentException {
        // Company name
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph companyName = new Paragraph("Employee Payroll System", titleFont);
        companyName.setAlignment(Element.ALIGN_CENTER);
        companyName.setSpacingAfter(10);
        document.add(companyName);
        
        // Company address
        Font addressFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.GRAY);
        Paragraph address = new Paragraph("123 Business Street, City, State - 12345", addressFont);
        address.setAlignment(Element.ALIGN_CENTER);
        address.setSpacingAfter(20);
        document.add(address);
        
        // Add a line separator
        Paragraph line = new Paragraph("_".repeat(80));
        line.setAlignment(Element.ALIGN_CENTER);
        line.setSpacingAfter(15);
        document.add(line);
    }
    
    private void addPayslipTitle(Document document, Integer month, Integer year) throws DocumentException {
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLACK);
        Paragraph title = new Paragraph(String.format("PAYSLIP - %s %d", getMonthName(month), year), titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);
    }
    
    private void addEmployeeInfo(Document document, Employee employee) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20);
        
        // Employee details
        addTableRow(table, "Employee ID:", employee.getEmployeeCode(), true);
        addTableRow(table, "Employee Name:", employee.getFullName(), false);
        addTableRow(table, "Email:", employee.getEmail(), true);
        addTableRow(table, "Department:", 
                   employee.getDepartment() != null ? employee.getDepartment().getDeptName() : "N/A", false);
        addTableRow(table, "Join Date:", 
                   employee.getHireDate() != null ? employee.getHireDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) : "N/A", true);
        
        document.add(table);
    }
    
    private void addSalaryBreakdown(Document document, SalaryDetails salaryDetails) throws DocumentException {
        // Earnings section
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.BLACK);
        Paragraph earningsTitle = new Paragraph("EARNINGS", sectionFont);
        earningsTitle.setSpacingBefore(10);
        earningsTitle.setSpacingAfter(10);
        document.add(earningsTitle);
        
        PdfPTable earningsTable = new PdfPTable(2);
        earningsTable.setWidthPercentage(100);
        earningsTable.setSpacingAfter(15);
        
        addSalaryRow(earningsTable, "Basic Salary", salaryDetails.getBasicSalary());
        addSalaryRow(earningsTable, "Allowances", salaryDetails.getAllowances());
        addSalaryRow(earningsTable, "Gross Salary", salaryDetails.getGrossSalary(), true);
        
        document.add(earningsTable);
        
        // Deductions section
        Paragraph deductionsTitle = new Paragraph("DEDUCTIONS", sectionFont);
        deductionsTitle.setSpacingAfter(10);
        document.add(deductionsTitle);
        
        PdfPTable deductionsTable = new PdfPTable(2);
        deductionsTable.setWidthPercentage(100);
        deductionsTable.setSpacingAfter(15);
        
        addSalaryRow(deductionsTable, String.format("Tax (%s%%)", salaryDetails.getTaxPercent()), 
                    salaryDetails.getTaxAmount());
        addSalaryRow(deductionsTable, "Other Deductions", salaryDetails.getDeductions());
        addSalaryRow(deductionsTable, "Total Deductions", 
                    salaryDetails.getTaxAmount().add(salaryDetails.getDeductions()), true);
        
        document.add(deductionsTable);
        
        // Net salary
        Paragraph netSalaryTitle = new Paragraph("NET SALARY", sectionFont);
        netSalaryTitle.setSpacingBefore(10);
        netSalaryTitle.setSpacingAfter(10);
        document.add(netSalaryTitle);
        
        PdfPTable netTable = new PdfPTable(2);
        netTable.setWidthPercentage(100);
        netTable.setSpacingAfter(20);
        
        addSalaryRow(netTable, "Net Pay", salaryDetails.getNetSalary(), true);
        
        document.add(netTable);
    }
    
    private void addFooter(Document document) throws DocumentException {
        Paragraph footer = new Paragraph("This is a computer-generated payslip and does not require a signature.");
        footer.setAlignment(Element.ALIGN_CENTER);
        Font footerFont = new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY);
        footer.setFont(footerFont);
        footer.setSpacingBefore(30);
        document.add(footer);
        
        Paragraph generatedDate = new Paragraph("Generated on: " + 
                java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")));
        generatedDate.setAlignment(Element.ALIGN_CENTER);
        generatedDate.setFont(footerFont);
        document.add(generatedDate);
    }
    
    private void addTableRow(PdfPTable table, String label, String value, boolean shaded) {
        Font labelFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
        Font valueFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
        
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        
        if (shaded) {
            labelCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            valueCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        }
        
        labelCell.setPadding(8);
        valueCell.setPadding(8);
        labelCell.setBorder(Rectangle.BOX);
        valueCell.setBorder(Rectangle.BOX);
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
    
    private void addSalaryRow(PdfPTable table, String description, BigDecimal amount) {
        addSalaryRow(table, description, amount, false);
    }
    
    private void addSalaryRow(PdfPTable table, String description, BigDecimal amount, boolean bold) {
        Font descFont = bold ? new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD) : 
                              new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
        Font amountFont = bold ? new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD) : 
                                new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
        
        PdfPCell descCell = new PdfPCell(new Phrase(description, descFont));
        PdfPCell amountCell = new PdfPCell(new Phrase("₹ " + String.format("%.2f", amount), amountFont));
        
        if (bold) {
            descCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            amountCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        }
        
        descCell.setPadding(8);
        amountCell.setPadding(8);
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        descCell.setBorder(Rectangle.BOX);
        amountCell.setBorder(Rectangle.BOX);
        
        table.addCell(descCell);
        table.addCell(amountCell);
    }
    
    private String getMonthName(Integer month) {
        String[] months = {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };
        return months[month - 1];
    }
}