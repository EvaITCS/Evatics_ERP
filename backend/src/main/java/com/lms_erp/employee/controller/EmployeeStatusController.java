package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.EmployeeStatusRequest;
import com.lms_erp.employee.dto.EmployeeStatusResponse;
import com.lms_erp.employee.service.EmployeeStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-statuses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeStatusController {

    private final EmployeeStatusService employeeStatusService;

    @PostMapping
    public EmployeeStatusResponse createEmployeeStatus(
            @RequestBody EmployeeStatusRequest request) {

        return employeeStatusService.createEmployeeStatus(request);
    }

    @PutMapping("/{employeeStatusId}")
    public EmployeeStatusResponse updateEmployeeStatus(
            @PathVariable Long employeeStatusId,
            @RequestBody EmployeeStatusRequest request) {

        return employeeStatusService.updateEmployeeStatus(
                employeeStatusId,
                request
        );
    }

    @GetMapping("/{employeeStatusId}")
    public EmployeeStatusResponse getEmployeeStatusById(
            @PathVariable Long employeeStatusId) {

        return employeeStatusService.getEmployeeStatusById(
                employeeStatusId
        );
    }

    @GetMapping
    public List<EmployeeStatusResponse>
    getAllEmployeeStatuses() {

        return employeeStatusService.getAllEmployeeStatuses();
    }

    @DeleteMapping("/{employeeStatusId}")
    public String deleteEmployeeStatus(
            @PathVariable Long employeeStatusId) {

        employeeStatusService.deleteEmployeeStatus(
                employeeStatusId
        );

        return "Employee status deleted successfully";
    }
}