package com.lms_erp.batch.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateBatchRequest {

    private String batchName;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer maxStudents;

    private Long personId;

    private Long programId;

    private Long batchStatusId;
}