package com.lms_erp.batch.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchResponse {

    private Long batchId;

    private String batchCode;

    private String batchName;

    private String trainerName;

    private String programName;

    private String status;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer currentStrength;

    private Integer maxStudents;
}