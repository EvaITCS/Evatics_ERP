package com.lms_erp.batch.dto;

import lombok.Data;

@Data
public class BatchStudentResponse {

    private Long personId;

    private String studentName;

    private String email;

    private Long applicationStageId;

    private String applicationStage;
}