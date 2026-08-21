package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.LeaveTypeRequest;
import com.lms_erp.employee.dto.LeaveTypeResponse;
import com.lms_erp.employee.service.LeaveTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-types")
@RequiredArgsConstructor
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;


    // =====================================================
    // CREATE LEAVE TYPE
    // ADMIN ONLY
    // =====================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveTypeResponse> createLeaveType(
            @Valid
            @RequestBody
            LeaveTypeRequest request
    ) {

        return ResponseEntity.ok(
                leaveTypeService.createLeaveType(
                        request
                )
        );
    }


    // =====================================================
    // UPDATE LEAVE TYPE
    // ADMIN ONLY
    // =====================================================

    @PutMapping("/{leaveTypeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveTypeResponse> updateLeaveType(
            @PathVariable
            Long leaveTypeId,

            @Valid
            @RequestBody
            LeaveTypeRequest request
    ) {

        return ResponseEntity.ok(
                leaveTypeService.updateLeaveType(
                        leaveTypeId,
                        request
                )
        );
    }


    // =====================================================
    // GET LEAVE TYPE BY ID
    // AUTHENTICATED USERS
    // =====================================================

    @GetMapping("/{leaveTypeId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LeaveTypeResponse> getLeaveTypeById(
            @PathVariable
            Long leaveTypeId
    ) {

        return ResponseEntity.ok(
                leaveTypeService.getLeaveTypeById(
                        leaveTypeId
                )
        );
    }


    // =====================================================
    // GET ALL LEAVE TYPES
    // EMPLOYEE / COUNSELLOR / ADMIN
    // =====================================================

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<LeaveTypeResponse>>
    getAllLeaveTypes() {

        return ResponseEntity.ok(
                leaveTypeService.getAllLeaveTypes()
        );
    }


    // =====================================================
    // DELETE LEAVE TYPE
    // ADMIN ONLY
    // =====================================================

    @DeleteMapping("/{leaveTypeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteLeaveType(
            @PathVariable
            Long leaveTypeId
    ) {

        leaveTypeService.deleteLeaveType(
                leaveTypeId
        );

        return ResponseEntity.ok(
                "Leave type deleted successfully"
        );
    }
}