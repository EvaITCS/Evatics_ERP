package com.lms_erp.student.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AdminStudentResponse {

    private Long personId;

    private String studentName;

    private String email;

    private String batchName;

    private Long applicationStageId;

    private String applicationStage;

    private LocalDate admissionDate;
}
