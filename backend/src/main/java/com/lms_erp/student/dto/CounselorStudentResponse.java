package com.lms_erp.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CounselorStudentResponse {

    private Long personId;

    private String studentName;

    private String email;

    private String programName;

    private Long applicationStageId;

    private String applicationStage;
}