package com.lms_erp.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentCredentialResponse {

    private Long personId;

    private String studentName;

    private String username;

    private String temporaryPassword;


}