package com.lms_erp.dashboard.controller;

import com.lms_erp.dashboard.dto.CounsellorDashboardResponse;
import com.lms_erp.dashboard.dto.LeadAnalyticsResponse;
import com.lms_erp.dashboard.dto.MyEmployeeDashboardResponse;
import com.lms_erp.dashboard.service.DashboardService;
import com.lms_erp.security.CurrentUserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    private final CurrentUserService currentUserService;


    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminDashboard() {

        return ResponseEntity.ok(
                dashboardService.adminDashboard()
        );
    }


    // =====================================================
    // COUNSELLOR DASHBOARD
    // =====================================================

    @GetMapping("/counsellor")
    @PreAuthorize("hasRole('COUNSELLOR')")
    public ResponseEntity<CounsellorDashboardResponse>
    counsellorDashboard() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();

        return ResponseEntity.ok(
                dashboardService.counsellorDashboard(
                        employeePersonId
                )
        );
    }


    // =====================================================
    // EMPLOYEE DASHBOARD
    // =====================================================

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<MyEmployeeDashboardResponse>
    employeeDashboard(
            @PathVariable Long employeeId
    ) {

        return ResponseEntity.ok(
                dashboardService.employeeDashboard(
                        employeeId
                )
        );
    }


    // =====================================================
    // LEAD ANALYTICS
    // =====================================================

    @GetMapping("/lead-analytics")
    @PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
    public ResponseEntity<LeadAnalyticsResponse>
    getLeadAnalytics(

            @RequestParam(
                    required = false
            )
            Long employeePersonId,

            @RequestParam(
                    required = false
            )
            String fromDate,

            @RequestParam(
                    required = false
            )
            String toDate
    ) {

        LocalDateTime start = null;

        LocalDateTime end = null;


        // =================================================
        // FROM DATE
        // =================================================

        if (
                fromDate != null
                        && !fromDate.isBlank()
        ) {

            start =
                    LocalDate
                            .parse(fromDate)
                            .atStartOfDay();
        }


        // =================================================
        // TO DATE
        //
        // +1 day makes the end date inclusive.
        //
        // Example:
        //
        // toDate = 2026-08-13
        //
        // end = 2026-08-14 00:00:00
        //
        // Query can therefore use:
        //
        // createdAt < end
        // =================================================

        if (
                toDate != null
                        && !toDate.isBlank()
        ) {

            end =
                    LocalDate
                            .parse(toDate)
                            .plusDays(1)
                            .atStartOfDay();
        }


        // =================================================
        // CALL SERVICE
        // =================================================

        return ResponseEntity.ok(
                dashboardService.getLeadAnalytics(
                        employeePersonId,
                        start,
                        end
                )
        );
    }
}