package com.lms_erp.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSecurityDto {

    private Long userId;



    private Long personId;

    private String fullName;

    private String email;

    private String role;

    private Boolean isLocked;

    private Integer failedAttempts;
}