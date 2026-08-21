package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.EmployeeActivityLogResponse;
import com.lms_erp.employee.service.EmployeeActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-activity-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeActivityLogController {

    private final EmployeeActivityLogService activityLogService;

    @GetMapping("/employee/{employeeId}")
    public List<EmployeeActivityLogResponse>
    getEmployeeActivityLogs(
            @PathVariable Long employeeId) {

        return activityLogService
                .getEmployeeActivityLogs(employeeId);
    }
}