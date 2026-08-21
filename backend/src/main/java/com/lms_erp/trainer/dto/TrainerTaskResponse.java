package com.lms_erp.trainer.dto;

import com.lms_erp.trainer.enums.TaskStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerTaskResponse {

    private Long taskId;

    // Trainer
    private Long trainerPersonId;

    private String trainerName;

    // Created By
    private Long createdByPersonId;

    private String createdByName;

    // Task Details
    private String title;

    private String description;

    private LocalDate dueDate;

    private TaskStatus status;

    // Audit
    private LocalDateTime createdAt;
}