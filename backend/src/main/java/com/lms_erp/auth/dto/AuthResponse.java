package com.lms_erp.auth.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String message;

    private String token;

    private String role;

    private Long userId;

    private String firstName;

    private String lastName;

    private String fullName;

    private Boolean mustChangePassword;

    private Long personId;
}
