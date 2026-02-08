package com.payroll.service;

import com.payroll.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SalaryDetailsRepository salaryDetailsRepository;

    public Map<String, Object> getOverviewAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        long totalEmployees = employeeRepository.count();
        long totalDepartments = departmentRepository.count();
        
        // Mock data for demonstration
        analytics.put("totalEmployees", totalEmployees);
        analytics.put("totalDepartments", totalDepartments);
        analytics.put("totalSalaryBudget", 2850000.0);
        analytics.put("averageSalary", totalEmployees > 0 ? 2850000.0 / totalEmployees : 0);
        
        return analytics;
    }

    public Map<String, Object> getMonthlyAnalytics(int year) {
        Map<String, Object> analytics = new HashMap<>();
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        
        // Mock monthly data for demonstration
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", months[i]);
            monthData.put("employees", 58 + i);
            monthData.put("salaryBudget", 2400000 + (i * 50000));
            monthData.put("attendanceRate", 85 + (i % 10));
            monthlyData.add(monthData);
        }
        
        analytics.put("monthlyData", monthlyData);
        return analytics;
    }

    public Map<String, Object> getDepartmentAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        List<Map<String, Object>> departmentData = new ArrayList<>();
        
        // Mock department data
        departmentData.add(createDepartmentData("IT", 15, 900000));
        departmentData.add(createDepartmentData("Operations", 20, 800000));
        departmentData.add(createDepartmentData("Finance", 12, 600000));
        departmentData.add(createDepartmentData("Marketing", 10, 350000));
        departmentData.add(createDepartmentData("HR", 8, 200000));
        
        analytics.put("departmentData", departmentData);
        return analytics;
    }

    public Map<String, Object> getSalaryDistribution() {
        Map<String, Object> analytics = new HashMap<>();
        List<Map<String, Object>> salaryDistribution = new ArrayList<>();
        
        // Mock salary distribution data
        salaryDistribution.add(createSalaryRangeData("30K-40K", 15));
        salaryDistribution.add(createSalaryRangeData("40K-50K", 25));
        salaryDistribution.add(createSalaryRangeData("50K-60K", 15));
        salaryDistribution.add(createSalaryRangeData("60K-70K", 7));
        salaryDistribution.add(createSalaryRangeData("70K+", 3));
        
        analytics.put("salaryDistribution", salaryDistribution);
        return analytics;
    }

    public Map<String, Object> getAttendanceAnalytics(int year, int month) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Mock attendance analytics
        analytics.put("totalWorkingDays", 22);
        analytics.put("averageAttendance", 88.5);
        analytics.put("presentDays", 1540);
        analytics.put("absentDays", 200);
        analytics.put("lateDays", 120);
        
        List<Map<String, Object>> dailyAttendance = new ArrayList<>();
        for (int i = 1; i <= 22; i++) {
            Map<String, Object> dailyData = new HashMap<>();
            dailyData.put("date", i);
            dailyData.put("present", 58 + (i % 7));
            dailyData.put("absent", 7 - (i % 7));
            dailyData.put("late", i % 5);
            dailyAttendance.add(dailyData);
        }
        
        analytics.put("dailyAttendance", dailyAttendance);
        return analytics;
    }

    public Map<String, Object> getLeaveAnalytics(int year) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Mock leave analytics
        analytics.put("totalLeaveApplications", 156);
        analytics.put("approvedLeaves", 142);
        analytics.put("pendingLeaves", 8);
        analytics.put("rejectedLeaves", 6);
        
        List<Map<String, Object>> leaveTypeData = new ArrayList<>();
        leaveTypeData.add(createLeaveTypeData("Annual", 89, 85, 2, 2));
        leaveTypeData.add(createLeaveTypeData("Sick", 34, 32, 1, 1));
        leaveTypeData.add(createLeaveTypeData("Casual", 28, 22, 4, 2));
        leaveTypeData.add(createLeaveTypeData("Maternity", 3, 2, 1, 0));
        leaveTypeData.add(createLeaveTypeData("Paternity", 2, 1, 0, 1));
        
        analytics.put("leaveTypeData", leaveTypeData);
        return analytics;
    }

    public Map<String, Object> getPayrollAnalytics(int year) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Mock payroll analytics
        analytics.put("totalPayrollCost", 34200000.0);
        analytics.put("averageMonthlyPayroll", 2850000.0);
        analytics.put("totalTaxDeducted", 5130000.0);
        analytics.put("totalProvidentFund", 1710000.0);
        
        List<Map<String, Object>> monthlyPayroll = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", months[i]);
            monthData.put("gross", 2400000 + (i * 50000));
            monthData.put("deductions", 360000 + (i * 7500));
            monthData.put("net", 2040000 + (i * 42500));
            monthlyPayroll.add(monthData);
        }
        
        analytics.put("monthlyPayroll", monthlyPayroll);
        return analytics;
    }

    public Map<String, Object> getEmployeeGrowthTrend(int years) {
        Map<String, Object> analytics = new HashMap<>();
        List<Map<String, Object>> growthData = new ArrayList<>();
        
        int currentYear = LocalDate.now().getYear();
        for (int i = years; i >= 0; i--) {
            Map<String, Object> yearData = new HashMap<>();
            yearData.put("year", currentYear - i);
            yearData.put("employees", 45 + (years - i) * 5);
            yearData.put("joinings", 8 + (i % 3));
            yearData.put("separations", 3 + (i % 2));
            growthData.add(yearData);
        }
        
        analytics.put("growthData", growthData);
        return analytics;
    }

    private Map<String, Object> createDepartmentData(String name, int employees, double budget) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", name);
        data.put("employees", employees);
        data.put("budget", budget);
        return data;
    }

    private Map<String, Object> createSalaryRangeData(String range, int count) {
        Map<String, Object> data = new HashMap<>();
        data.put("range", range);
        data.put("count", count);
        return data;
    }

    private Map<String, Object> createLeaveTypeData(String type, int total, int approved, int pending, int rejected) {
        Map<String, Object> data = new HashMap<>();
        data.put("type", type);
        data.put("total", total);
        data.put("approved", approved);
        data.put("pending", pending);
        data.put("rejected", rejected);
        return data;
    }
}