package com.lms_erp.student.controller;

import com.lms_erp.student.dto.AdminStudentResponse;
import com.lms_erp.student.service.AdminStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor

@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    private final AdminStudentService adminStudentService;

    @GetMapping("/students")
    public List<AdminStudentResponse> getAllEnrolledStudents() {
        return adminStudentService.getAllEnrolledStudents();
    }
}