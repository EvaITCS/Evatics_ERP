package com.lms_erp.trainer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor

@Builder
public class TrainerBatchSummaryResponse {

    private Long batchId;

    private String batchCode;

    private String batchName;

    private Long enrolledStudentCount;

    private Long graduatedStudentCount;

    private Long droppedStudentCount;

    public TrainerBatchSummaryResponse(
            Long batchId,
            String batchCode,
            String batchName,
            Long enrolledStudentCount,
            Long graduatedStudentCount,
            Long droppedStudentCount
    ) {
        this.batchId = batchId;
        this.batchCode = batchCode;
        this.batchName = batchName;
        this.enrolledStudentCount = enrolledStudentCount;
        this.graduatedStudentCount = graduatedStudentCount;
        this.droppedStudentCount = droppedStudentCount;
    }
}