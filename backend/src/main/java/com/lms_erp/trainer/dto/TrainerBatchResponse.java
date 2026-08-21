package com.lms_erp.trainer.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerBatchResponse {

    private Long batchId;

    private String batchCode;

    private String batchName;

    private String programName;

    private Integer currentStrength;

    private String batchStatus;

    private LocalDate startDate;

    public TrainerBatchResponse(
            Long batchId,
            String batchCode,
            String batchName,
            String programName,
            Integer currentStrength,
            LocalDate startDate,
            String batchStatus
    ) {
        this.batchId = batchId;
        this.batchCode = batchCode;
        this.batchName = batchName;
        this.programName = programName;
        this.currentStrength = currentStrength;
        this.startDate = startDate;
        this.batchStatus = batchStatus;
    }

    // Explicit setter
    public void setBatchStatus(String batchStatus) {
        this.batchStatus = batchStatus;
    }
}