package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.LeaveStatusRequest;
import com.lms_erp.employee.dto.LeaveStatusResponse;
import com.lms_erp.employee.service.LeaveStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-statuses")
@RequiredArgsConstructor
public class LeaveStatusController {

    private final LeaveStatusService leaveStatusService;


    // =====================================================
    // CREATE
    // ADMIN ONLY
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveStatusResponse> createLeaveStatus(
            @Valid
            @RequestBody LeaveStatusRequest request
    ) {

        return ResponseEntity.ok(
                leaveStatusService.createLeaveStatus(
                        request
                )
        );
    }


    // =====================================================
    // UPDATE
    // ADMIN ONLY
    // =====================================================

    @PutMapping("/{leaveStatusId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveStatusResponse> updateLeaveStatus(
            @PathVariable Long leaveStatusId,

            @Valid
            @RequestBody LeaveStatusRequest request
    ) {

        return ResponseEntity.ok(
                leaveStatusService.updateLeaveStatus(
                        leaveStatusId,
                        request
                )
        );
    }


    // =====================================================
    // GET BY ID
    // AUTHENTICATED
    // =====================================================

    @GetMapping("/{leaveStatusId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LeaveStatusResponse> getLeaveStatusById(
            @PathVariable Long leaveStatusId
    ) {

        return ResponseEntity.ok(
                leaveStatusService.getLeaveStatusById(
                        leaveStatusId
                )
        );
    }


    // =====================================================
    // GET ALL
    // AUTHENTICATED
    // =====================================================

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LeaveStatusResponse>>
    getAllLeaveStatuses() {

        return ResponseEntity.ok(
                leaveStatusService.getAllLeaveStatuses()
        );
    }


    // =====================================================
    // DELETE
    // ADMIN ONLY
    // =====================================================

    @DeleteMapping("/{leaveStatusId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteLeaveStatus(
            @PathVariable Long leaveStatusId
    ) {

        leaveStatusService.deleteLeaveStatus(
                leaveStatusId
        );

        return ResponseEntity.ok(
                "Leave status deleted successfully"
        );
    }
}