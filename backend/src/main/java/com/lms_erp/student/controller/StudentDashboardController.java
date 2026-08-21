package com.lms_erp.student.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.dto.MyBatchResponse;
import com.lms_erp.student.dto.StudentDashboardResponse;
import com.lms_erp.student.service.StudentDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentDashboardController {


    private final StudentDashboardService service;
    private final CurrentUserService currentUserService;

    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @GetMapping("/dashboard")
    public StudentDashboardResponse dashboard() {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        return service.resolve(email);
    }
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my-batch")
    public ResponseEntity<?> getMyBatch() {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        return ResponseEntity.ok(
                service.getMyBatch(email)
        );
    }
}