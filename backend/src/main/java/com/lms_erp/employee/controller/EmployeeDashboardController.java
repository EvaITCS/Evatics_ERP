package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.EmployeeDashboardResponse;
import com.lms_erp.employee.dto.EmployeeStatisticsResponse;
import com.lms_erp.employee.service.EmployeeDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeDashboardController {

    private final EmployeeDashboardService employeeDashboardService;

    // =====================================================
    // DASHBOARD STATS
    // =====================================================

    @GetMapping("/statistics")
    public EmployeeDashboardResponse getDashboardStatistics() {

        return employeeDashboardService.getDashboardStatistics();
    }

    // =====================================================
    // DEPARTMENT WISE STATS
    // =====================================================

    @GetMapping("/department-stats")
    public List<EmployeeStatisticsResponse>
    getDepartmentWiseEmployeeStats() {

        return employeeDashboardService
                .getDepartmentWiseEmployeeStats();
    }

    // =====================================================
    // EMPLOYEE STATUS STATS
    // =====================================================

    @GetMapping("/status-stats")
    public List<EmployeeStatisticsResponse>
    getEmployeeStatusStats() {

        return employeeDashboardService
                .getEmployeeStatusStats();
    }
}