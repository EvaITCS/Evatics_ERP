package com.lms_erp.student.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyBatchResponse {

    private Long batchId;
    private String batchCode;
    private String batchName;
    private String programName;
    private String trainerName;
    private String status;
    private String startDate;
    private String endDate;
    private Integer durationInDays;
}