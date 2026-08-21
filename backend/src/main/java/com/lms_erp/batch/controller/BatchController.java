package com.lms_erp.batch.controller;

import com.lms_erp.batch.dto.*;
import com.lms_erp.batch.service.BatchService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor

public class BatchController {

    private final BatchService batchService;



    // ==========================================================
    // 1. DASHBOARD OVERVIEW
    // ==========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<BatchDashboardResponse> getDashboard() {
        return ResponseEntity.ok(batchService.getDashboard());
    }

    // ==========================================================
    // CREATE BATCH
    // ==========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createBatch(
            @RequestBody BatchCreateRequest request
    ) {
        return ResponseEntity.ok(
                batchService.createBatch(request)
        );
    }

    // ==========================================================
    // GENERATE BATCH CODE
    // ==========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/generate-code/{programId}")
    public ResponseEntity<?> generateBatchCode(
            @PathVariable Long programId
    ) {
        return ResponseEntity.ok(
                batchService.generateBatchCode(programId)
        );
    }

    // ==========================================================
    // GET ALL PROGRAMS
    // ==========================================================
    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/programs")
    public ResponseEntity<?> getAllPrograms() {
        return ResponseEntity.ok(
                batchService.getAllPrograms()
        );


    }

    // ==========================================================
    // GET ALL TRAINERS (DROPDOWN OPTIMIZED)
    // ==========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/trainers")
    public ResponseEntity<?> getAllTrainers() {
        return ResponseEntity.ok(
                batchService.getAllTrainers()
        );
    }

    // ==========================================================
    // GET ALL BATCHES
    // ==========================================================
    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping
    public ResponseEntity<List<BatchResponse>> getAllBatches() {
        return ResponseEntity.ok(
                batchService.getAllBatches()
        );
    }




    // ==========================================================
    // ASSIGN TRAINER TO BATCH
    // ==========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign-trainer")
    public ResponseEntity<?> assignTrainer(
            @RequestBody AssignTrainerRequest request
    ) {
        batchService.assignTrainer(request);
        return ResponseEntity.ok(
                "Trainer assigned successfully"
        );
    }

    // ==========================================================
    // GET BATCH DETAILS
    // ==========================================================
    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/{batchId}")
    public ResponseEntity<BatchDetailsResponse> getBatchDetails(
            @PathVariable Long batchId
    ) {
        return ResponseEntity.ok(
                batchService.getBatchDetails(batchId)
        );
    }

    // ==========================================================
    // UPDATE BATCH
    // ==========================================================
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{batchId}")
    public ResponseEntity<BatchResponse> updateBatch(
            @PathVariable Long batchId,
            @RequestBody UpdateBatchRequest request
    ) {
        return ResponseEntity.ok(
                batchService.updateBatch(
                        batchId,
                        request
                )
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{batchId}")
    public ResponseEntity<?> deleteBatch(
            @PathVariable Long batchId
    ) {
        batchService.deleteBatch(batchId);

        return ResponseEntity.ok(
                "Batch Deleted Successfully"
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/trainers/available")
    public ResponseEntity<?> getAvailableTrainers() {

        return ResponseEntity.ok(
                batchService.getAvailableTrainers()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/trainers/available/{batchId}")
    public ResponseEntity<?> getAvailableTrainersForEdit(
            @PathVariable Long batchId
    ) {

        return ResponseEntity.ok(
                batchService.getAvailableTrainersForEdit(batchId)
        );
    }
}