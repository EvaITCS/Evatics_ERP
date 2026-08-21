package com.lms_erp.trainer.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.trainer.dto.TrainerStudentResponse;
import com.lms_erp.trainer.service.TrainerStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor

public class TrainerStudentController {

    private final TrainerStudentService trainerStudentService;

    private final CurrentUserService currentUserService;
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/students")
    public List<TrainerStudentResponse> getMyStudents() {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        return trainerStudentService.getMyStudents(userId);
    }
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/current-students")
    public List<TrainerStudentResponse> getCurrentStudents() {

        Long userId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        return trainerStudentService
                .getCurrentBatchStudents(userId);
    }
}