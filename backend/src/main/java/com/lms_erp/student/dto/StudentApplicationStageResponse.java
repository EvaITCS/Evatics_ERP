package com.lms_erp.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentApplicationStageResponse {

    private Long applicationStageId;

    private String applicationStage;

    private String currentStage;

    private String recheckReason;

}