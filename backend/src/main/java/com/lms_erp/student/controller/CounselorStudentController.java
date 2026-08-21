package com.lms_erp.student.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.student.dto.CounselorStudentResponse;
import com.lms_erp.student.dto.StudentApplicationResponse;
import com.lms_erp.student.entity.StudentApplication;
import com.lms_erp.student.entity.StudentBatch;
import com.lms_erp.student.repository.StudentApplicationRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.student.service.AdminStudentApplicationService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/counselor")
@RequiredArgsConstructor
public class CounselorStudentController {

    private final StudentApplicationRepository applicationRepository;
    private final AdminStudentApplicationService adminStudentApplicationService;
    private final StudentBatchRepository studentBatchRepository;
    private final CurrentUserService currentUserService;

    @PreAuthorize("hasAnyRole('COUNSELLOR','ADMIN')")
    @Transactional(readOnly = true)
    @GetMapping("/my-students")
    public List<CounselorStudentResponse> getStudents() {

        Long counselorPersonId =
                currentUserService.getCurrentEmployee().getPersonId();

        List<StudentApplication> applications =
                applicationRepository.findByCounselorPersonId(counselorPersonId);

        List<CounselorStudentResponse> response = new ArrayList<>();

        for (StudentApplication application : applications) {

            Long applicationStageId =
                    application.getApplicationStage() != null
                            ? application.getApplicationStage().getApplicationStageId()
                            : null;

            String applicationStage =
                    application.getApplicationStage() != null
                            ? application.getApplicationStage().getApplicationStageName()
                            : "NOT_STARTED";

            StudentBatch studentBatch =
                    studentBatchRepository
                            .findTopByStudentApplicationOrderByAssignedDateDesc(application)
                            .orElse(null);

            String programName = "N/A";

            if (studentBatch != null &&
                    studentBatch.getBatch() != null &&
                    studentBatch.getBatch().getProgram() != null) {

                programName = studentBatch.getBatch()
                        .getProgram()
                        .getProgramName();
            }

            StudentApplicationResponse profile =
                    adminStudentApplicationService
                            .getStudentProfile(application.getPersonId());

            String fullName = "N/A";

            if (application.getPerson() != null) {
                fullName =
                        application.getPerson().getFirstName()
                                + " "
                                + (application.getPerson().getLastName() != null
                                ? application.getPerson().getLastName()
                                : "");
            }

            response.add(
                    new CounselorStudentResponse(
                            application.getPersonId(),
                            fullName.trim(),
                            profile.getEmail(),
                            programName,
                            applicationStageId,
                            applicationStage
                    )
            );
        }

        return response;
    }

    @PreAuthorize("hasAnyRole('COUNSELLOR','ADMIN')")
    @GetMapping("/application/{id}")
    public ResponseEntity<StudentApplicationResponse> getApplication(
            @PathVariable Long id
    ) {

        StudentApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application Not Found"));

        return ResponseEntity.ok(
                adminStudentApplicationService.getStudentProfile(app.getPersonId())
        );
    }
}