package com.lms_erp.trainer.dto;

import com.lms_erp.trainer.enums.RecommendationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CounselorRecommendationRequest {

    @NotBlank(message = "Counselor remarks are required")
    private String counselorRemarks;

    @NotNull(message = "Recommendation is required")
    private RecommendationType recommendation;
}