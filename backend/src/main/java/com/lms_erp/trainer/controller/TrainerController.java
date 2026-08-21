package com.lms_erp.trainer.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.trainer.service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;
    private final CurrentUserService currentUserService;
    // =========================
    // GET ALL TRAINERS
    // =========================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllTrainers() {
        return ResponseEntity.ok(trainerService.getAllTrainers());
    }


    // =========================
// MY DASHBOARD
// =========================
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {

        return ResponseEntity.ok(
                trainerService.getDashboard()
        );
    }
}