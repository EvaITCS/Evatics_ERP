package com.lms_erp.trainer.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDashboardResponse {

    private Long trainerPersonId;

    private String trainerName;

    private Long totalBatchCount;

    private Long totalStudentCount;
}