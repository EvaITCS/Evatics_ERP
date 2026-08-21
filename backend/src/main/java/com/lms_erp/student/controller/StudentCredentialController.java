package com.lms_erp.student.controller;

import com.lms_erp.student.dto.StudentCredentialResponse;
import com.lms_erp.student.service.StudentCredentialService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/counselor")
@RequiredArgsConstructor

public class StudentCredentialController {

    private final StudentCredentialService service;

    @PreAuthorize("hasAnyRole('COUNSELLOR','ADMIN')")
    @GetMapping("/student-credentials")
    public List<StudentCredentialResponse> getAll() {

        return service.getAllCredentials();
    }
}