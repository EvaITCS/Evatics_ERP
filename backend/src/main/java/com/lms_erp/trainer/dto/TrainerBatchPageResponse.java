package com.lms_erp.trainer.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerBatchPageResponse {

    private Long batchId;

    private String batchCode;

    private String batchName;

    private String programName;

    private String batchStatus;

    private Long enrolledStudentCount;

    private Long graduatedStudentCount;

    private Long droppedStudentCount;

    private LocalDate startDate;

    private LocalDate endDate;

    public TrainerBatchPageResponse(
            Long batchId,
            String batchCode,
            String batchName,
            String programName,
            String batchStatus,
            LocalDate startDate,
            LocalDate endDate,
            Long enrolledStudentCount,
            Long graduatedStudentCount,
            Long droppedStudentCount
    ) {
        this.batchId = batchId;
        this.batchCode = batchCode;
        this.batchName = batchName;
        this.programName = programName;
        this.batchStatus = batchStatus;
        this.startDate = startDate;
        this.endDate = endDate;
        this.enrolledStudentCount = enrolledStudentCount;
        this.graduatedStudentCount = graduatedStudentCount;
        this.droppedStudentCount = droppedStudentCount;
    }
}