package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.EmployeeLeaveRequestDto;
import com.lms_erp.employee.dto.EmployeeLeaveResponseDto;
import com.lms_erp.employee.service.EmployeeLeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee-leaves")
@RequiredArgsConstructor
public class EmployeeLeaveController {


    private final EmployeeLeaveService employeeLeaveService;


    // =====================================================
    // APPLY LEAVE
    // EMPLOYEE / COUNSELLOR / ADMIN
    // =====================================================

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmployeeLeaveResponseDto> applyLeave(

            @Valid
            @RequestBody
            EmployeeLeaveRequestDto request

    ) {

        return ResponseEntity.ok(
                employeeLeaveService.applyLeave(request)
        );
    }


    // =====================================================
    // APPROVE LEAVE
    // ADMIN ONLY
    // =====================================================

    @PutMapping("/{leaveRequestId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeLeaveResponseDto> approveLeave(

            @PathVariable
            Long leaveRequestId,

            Authentication authentication

    ) {

        return ResponseEntity.ok(
                employeeLeaveService.approveLeave(
                        leaveRequestId,
                        authentication.getName()
                )
        );
    }


    // =====================================================
    // REJECT LEAVE
    // ADMIN ONLY
    // =====================================================

    @PutMapping("/{leaveRequestId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeLeaveResponseDto> rejectLeave(

            @PathVariable
            Long leaveRequestId,

            Authentication authentication

    ) {

        return ResponseEntity.ok(
                employeeLeaveService.rejectLeave(
                        leaveRequestId,
                        authentication.getName()
                )
        );
    }


    // =====================================================
    // GET MY / EMPLOYEE LEAVES
    // AUTHENTICATED
    // =====================================================

    @GetMapping("/employee/{personId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmployeeLeaveResponseDto>>
    getLeavesByEmployee(

            @PathVariable
            Long personId

    ) {

        return ResponseEntity.ok(
                employeeLeaveService.getLeavesByEmployee(
                        personId
                )
        );
    }


    // =====================================================
    // GET ALL LEAVES
    // ADMIN ONLY
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeLeaveResponseDto>>
    getAllLeaveRequests() {

        return ResponseEntity.ok(
                employeeLeaveService.getAllLeaveRequests()
        );
    }
}