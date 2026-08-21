package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.DepartmentRequest;
import com.lms_erp.employee.dto.DepartmentResponse;
import com.lms_erp.employee.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {

    private final DepartmentService departmentService;

    // =====================================================
    // CREATE DEPARTMENT
    // =====================================================

    @PostMapping
    public DepartmentResponse createDepartment(
            @RequestBody DepartmentRequest request) {

        return departmentService.createDepartment(request);
    }

    // =====================================================
    // UPDATE DEPARTMENT
    // =====================================================

    @PutMapping("/{departmentId}")
    public DepartmentResponse updateDepartment(
            @PathVariable Long departmentId,
            @RequestBody DepartmentRequest request) {

        return departmentService.updateDepartment(departmentId, request);
    }

    // =====================================================
    // GET DEPARTMENT BY ID
    // =====================================================

    @GetMapping("/{departmentId}")
    public DepartmentResponse getDepartmentById(
            @PathVariable Long departmentId) {

        return departmentService.getDepartmentById(departmentId);
    }

    // =====================================================
    // GET ALL DEPARTMENTS
    // =====================================================

    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {

        return departmentService.getAllDepartments();
    }

    // =====================================================
    // DELETE DEPARTMENT
    // =====================================================

    @DeleteMapping("/{departmentId}")
    public String deleteDepartment(@PathVariable Long departmentId) {

        departmentService.deleteDepartment(departmentId);

        return "Department deleted successfully";
    }
}