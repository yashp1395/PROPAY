package com.payroll.controller;

import com.payroll.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getOverviewAnalytics() {
        Map<String, Object> analytics = analyticsService.getOverviewAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/monthly/{year}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getMonthlyAnalytics(@PathVariable int year) {
        Map<String, Object> analytics = analyticsService.getMonthlyAnalytics(year);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/department")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getDepartmentAnalytics() {
        Map<String, Object> analytics = analyticsService.getDepartmentAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/salary-distribution")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getSalaryDistribution() {
        Map<String, Object> analytics = analyticsService.getSalaryDistribution();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/attendance/{year}/{month}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getAttendanceAnalytics(
            @PathVariable int year, @PathVariable int month) {
        Map<String, Object> analytics = analyticsService.getAttendanceAnalytics(year, month);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/leave/{year}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getLeaveAnalytics(@PathVariable int year) {
        Map<String, Object> analytics = analyticsService.getLeaveAnalytics(year);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/payroll/{year}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getPayrollAnalytics(@PathVariable int year) {
        Map<String, Object> analytics = analyticsService.getPayrollAnalytics(year);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/employee-growth/{years}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<Map<String, Object>> getEmployeeGrowthTrend(@PathVariable int years) {
        Map<String, Object> analytics = analyticsService.getEmployeeGrowthTrend(years);
        return ResponseEntity.ok(analytics);
    }
}