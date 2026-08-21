package com.lms_erp.trainer.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor

@Builder
public class TrainerBatchDetailsResponse {

    private Long batchId;

    private String batchCode;

    private String batchName;

    private String batchStatus;

    private Long enrolledStudentCount;

    private Long graduatedStudentCount;

    private LocalDate startDate;

    private LocalDate endDate;


    public TrainerBatchDetailsResponse(
            Long batchId,
            String batchCode,
            String batchName,
            String batchStatus,
            Long enrolledStudentCount,
            Long graduatedStudentCount,
            LocalDate startDate,
            LocalDate endDate
    ) {
        this.batchId = batchId;
        this.batchCode = batchCode;
        this.batchName = batchName;
        this.batchStatus = batchStatus;
        this.enrolledStudentCount = enrolledStudentCount;
        this.graduatedStudentCount = graduatedStudentCount;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}