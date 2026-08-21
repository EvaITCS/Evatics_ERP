package com.lms_erp.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationResponse {

    private Long personId;

    private String username;

    private String temporaryPassword;

    private String message;
}