package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.*;
import com.lms_erp.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // =====================================================
    // CREATE EMPLOYEE
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(
            consumes = "multipart/form-data"
    )
    public EmployeeResponse createEmployee(

            @RequestPart("employee")
            CreateEmployeeRequest request,

            @RequestPart(
                    value = "documents",
                    required = false
            )
            List<MultipartFile> documents
    ) {

        return employeeService.createEmployee(
                request,
                documents
        );
    }

    // =====================================================
    // UPDATE EMPLOYEE
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(
            value = "/{personId}",
            consumes = "multipart/form-data"
    )
    public EmployeeResponse updateEmployee(

            @PathVariable Long personId,

            @RequestPart("employee")
            UpdateEmployeeRequest request,

            @RequestPart(
                    value = "documents",
                    required = false
            )
            List<MultipartFile> documents
    ) {

        return employeeService.updateEmployee(
                personId,
                request,
                documents
        );
    }

    // =====================================================
    // GET EMPLOYEE BY PERSON ID
    // =====================================================

    @PreAuthorize("hasAnyRole('ADMIN','Counsellors')")
    @GetMapping("/{personId}")
    public EmployeeProfileResponse getEmployeeById(
            @PathVariable Long personId) {

        return employeeService.getEmployeeById(personId);
    }

    // =====================================================
    // GET ALL EMPLOYEES
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<EmployeeResponse> getAllEmployees() {

        return employeeService.getAllEmployees();
    }

    // =====================================================
    // DELETE EMPLOYEE
    // =====================================================

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{personId}")
    public String deleteEmployee(
            @PathVariable Long personId) {

        employeeService.deleteEmployee(personId);

        return "Employee deleted successfully";
    }

    // =====================================================
    // GET COUNSELLORS
    // =====================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR')")
    @GetMapping("/Counsellors")
    public List<CounsellorDropdownResponse> getCounsellors() {

        return employeeService.getCounsellorDropdown();
    }

    // =====================================================
    // GET MY PROFILE
    // =====================================================

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public EmployeeProfileResponse getMyProfile() {

        return employeeService.getMyProfile();
    }
}