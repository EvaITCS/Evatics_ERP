package com.lms_erp.student.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.dto.*;
import com.lms_erp.student.service.StudentApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor

public class StudentApplicationController {

    private final StudentApplicationService studentApplicationService;
    private final CurrentUserService currentUserService;
    @PreAuthorize("hasAnyRole('COUNSELLOR','ADMIN')")
    @PostMapping(
            value = "/application",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<StudentRegistrationResponse> submitApplication(
            @ModelAttribute StudentApplicationRequest request) {

        StudentRegistrationResponse response =
                studentApplicationService.saveApplication(request);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('COUNSELLOR','ADMIN','STUDENT')")
    @PostMapping(
            value = "/profile/save",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> saveProfile(@ModelAttribute StudentApplicationRequest request) {
        studentApplicationService.saveStudentProfile(request);
        return ResponseEntity.ok("Profile Saved");
    }

    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PutMapping(
            value = "/application/update",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateApplication(@ModelAttribute StudentApplicationRequest request) {
        studentApplicationService.updateApplication(request);
        return ResponseEntity.ok("Application Updated Successfully");
    }

    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @GetMapping("/application")
    public ResponseEntity<StudentApplicationResponse> getApplication() {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        return ResponseEntity.ok(
                studentApplicationService.getStudentProfile(email)
        );
    }


    @PreAuthorize("hasRole('LEAD')")
    @PutMapping("/final-submit")
    public ResponseEntity<?> finalSubmitApplication() {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        studentApplicationService.finalSubmit(email);

        return ResponseEntity.ok(
                "Application submitted and locked successfully!"
        );
    }

    @PreAuthorize("hasAnyRole('COUNSELLOR','ADMIN')")
    @PostMapping("/send-invitation-email")
    public ResponseEntity<?> sendInvitationEmail(
            @RequestBody SendInvitationEmailRequest request
    ) {

        studentApplicationService.sendInvitationEmail(request);

        return ResponseEntity.ok(
                "Invitation email sent successfully."
        );

    }

    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @GetMapping("/application-stage")
    public ResponseEntity<StudentApplicationStageResponse>
    getApplicationStage() {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        return ResponseEntity.ok(
                studentApplicationService.getApplicationStage(email)
        );

    }

    @PreAuthorize("hasAnyRole('STUDENT','LEAD')")
    @PutMapping("/application-stage")
    public ResponseEntity<?> updateApplicationStage(
            @RequestBody UpdateApplicationStageRequest request
    ) {

        String email = currentUserService.getCurrentUserPrimaryEmail();

        studentApplicationService.updateApplicationStage(
                email,
                request.getApplicationStageId()
        );

        return ResponseEntity.ok("Application stage updated successfully.");
    }
}