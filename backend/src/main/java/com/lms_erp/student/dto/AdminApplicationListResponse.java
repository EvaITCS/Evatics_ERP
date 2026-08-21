package com.lms_erp.student.dto;

import lombok.Data;

@Data
public class AdminApplicationListResponse {

    private Long personId;

    private String firstName;
    private String middleName;
    private String lastName;

    private String email;

    private String applicationStage;

    private String batchName;
}