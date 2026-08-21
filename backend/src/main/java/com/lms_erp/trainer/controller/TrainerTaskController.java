package com.lms_erp.trainer.controller;

import com.lms_erp.security.CurrentUserService;
import com.lms_erp.trainer.dto.TrainerTaskCreateRequest;
import com.lms_erp.trainer.dto.TrainerTaskResponse;
import com.lms_erp.trainer.enums.TaskStatus;
import com.lms_erp.trainer.service.TrainerTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer-tasks")
@RequiredArgsConstructor

public class TrainerTaskController {

    private final TrainerTaskService taskService;
    private final CurrentUserService currentUserService;
    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping
    public ResponseEntity<TrainerTaskResponse> createTask(@RequestBody TrainerTaskCreateRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping

    public ResponseEntity<List<TrainerTaskResponse>> getTasksByTrainer() {

        return ResponseEntity.ok(
                taskService.getTasksByTrainer()
        );
    }
    @PreAuthorize("hasRole('TRAINER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<TrainerTaskResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }
}