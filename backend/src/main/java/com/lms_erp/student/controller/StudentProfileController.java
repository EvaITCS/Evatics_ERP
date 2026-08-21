package com.lms_erp.student.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.dto.EducationRequest;
import com.lms_erp.student.dto.ExperienceRequest;
import com.lms_erp.student.dto.StudentProfileResponse;
import com.lms_erp.student.service.StudentProfileService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/student/profile")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentProfileService service;
    private final CurrentUserService currentUserService;

    // ===========================
    // Get Student Profile
    // ===========================
    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @GetMapping
    public StudentProfileResponse getProfile() {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        return service.getProfile(email);
    }

    // ===========================
    // Update Personal Details
    // ===========================
    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PostMapping("/personal")
    public ResponseEntity<String> updatePersonal(
            @RequestBody StudentProfileResponse request) {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        service.updatePersonal(email, request);

        return ResponseEntity.ok(
                "Personal Details Updated Successfully"
        );
    }


    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PostMapping("/address")
    public ResponseEntity<?> updateAddress(
            @RequestBody StudentProfileResponse request
    ) {

        String email =
                currentUserService.getCurrentUserPrimaryEmail();

        service.updateAddress(
                email,
                request
        );

        return ResponseEntity.ok(
                "Address change request submitted successfully."
        );
    }


    // ===========================
    // Update Visa
    // ===========================
    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PostMapping("/visa")
    public ResponseEntity<String> updateVisa(
            @RequestBody StudentProfileResponse request) {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        service.updateVisa(email, request);

        return ResponseEntity.ok("Visa Updated Successfully");
    }

    // ===========================
    // Add Education
    // ===========================
    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PostMapping("/education")
    public ResponseEntity<String> addEducation(
            @RequestBody EducationRequest request) {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        service.addEducation(email, request);

        return ResponseEntity.ok(
                "Education Added Successfully"
        );
    }

    // ===========================
    // Add Experience
    // ===========================
    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PostMapping("/experience")
    public ResponseEntity<String> addExperience(
            @RequestBody ExperienceRequest request) {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        service.addExperience(email, request);

        return ResponseEntity.ok(
                "Experience Added Successfully"
        );
    }

    // ==========================================
    // Upload Document
    // (Enable after uploadDocument() is created
    // inside StudentProfileService)
    // ==========================================
    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PostMapping("/upload-document")
    public ResponseEntity<String> uploadDocument(
            @RequestParam("documentType") String documentType,
            @RequestPart("file") MultipartFile file) {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        service.uploadDocument(
                email,
                documentType,
                file
        );

        return ResponseEntity.ok(
                "Document Uploaded Successfully"
        );
    }
}