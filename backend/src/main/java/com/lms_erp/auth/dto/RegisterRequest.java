package com.lms_erp.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phone;
//    SRSIHTI
    private String password;
    private String confirmPassword;
}