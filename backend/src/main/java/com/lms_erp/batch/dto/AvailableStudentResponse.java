package com.lms_erp.batch.dto;

import lombok.Data;

@Data
public class AvailableStudentResponse {

    private Long personId;

    private String studentName;

    private String email;
}