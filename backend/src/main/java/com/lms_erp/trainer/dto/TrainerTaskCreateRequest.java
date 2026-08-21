package com.lms_erp.trainer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerTaskCreateRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private LocalDate dueDate;
}