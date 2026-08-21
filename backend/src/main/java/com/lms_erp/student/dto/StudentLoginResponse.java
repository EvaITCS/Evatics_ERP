package com.lms_erp.student.dto;

import lombok.Data;

@Data
public class StudentLoginResponse {

    private String role;
    private String dashboardType;
}