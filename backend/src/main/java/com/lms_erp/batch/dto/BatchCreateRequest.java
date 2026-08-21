package com.lms_erp.batch.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BatchCreateRequest {

    private String batchCode;

    private String batchName;

    private Long programId;

    private Long personId;

    private Long batchStatusId;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer minStudents;

    private Integer maxStudents;
}