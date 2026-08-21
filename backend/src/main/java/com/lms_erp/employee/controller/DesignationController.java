package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.DesignationRequest;
import com.lms_erp.employee.dto.DesignationResponse;
import com.lms_erp.employee.service.DesignationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DesignationController {

    private final DesignationService designationService;

    // =====================================================
    // CREATE DESIGNATION
    // =====================================================

    @PostMapping
    public DesignationResponse createDesignation(
            @RequestBody DesignationRequest request) {

        return designationService.createDesignation(request);
    }

    // =====================================================
    // UPDATE DESIGNATION
    // =====================================================

    @PutMapping("/{designationId}")
    public DesignationResponse updateDesignation(
            @PathVariable Long designationId,
            @RequestBody DesignationRequest request) {

        return designationService.updateDesignation(designationId, request);
    }

    // =====================================================
    // GET DESIGNATION BY ID
    // =====================================================

    @GetMapping("/{designationId}")
    public DesignationResponse getDesignationById(
            @PathVariable Long designationId) {

        return designationService.getDesignationById(designationId);
    }

    // =====================================================
    // GET ALL DESIGNATIONS
    // =====================================================

    @GetMapping
    public List<DesignationResponse> getAllDesignations() {

        return designationService.getAllDesignations();
    }

    // =====================================================
    // DELETE DESIGNATION
    // =====================================================

    @DeleteMapping("/{designationId}")
    public String deleteDesignation(@PathVariable Long designationId) {

        designationService.deleteDesignation(designationId);

        return "Designation deleted successfully";
    }
}