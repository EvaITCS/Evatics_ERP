package com.lms_erp.trainer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDecisionRequest {

    @NotNull(message = "Approval decision is required")
    private Boolean approved;

    @NotNull(message = "Drop status is required")
    private Long dropStatusId;

    @NotBlank(message = "Review remarks are required")
    private String reviewRemarks;
}