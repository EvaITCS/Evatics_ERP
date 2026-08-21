package com.lms_erp.trainer.dto;

import com.lms_erp.trainer.enums.RecommendationType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DropStudentRequest {

    @NotBlank(message = "Drop reason is required")
    private String dropReason;

    private RecommendationType recommendation;
}