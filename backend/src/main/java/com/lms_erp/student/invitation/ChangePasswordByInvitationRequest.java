package com.lms_erp.student.invitation;

import lombok.Data;

@Data
public class ChangePasswordByInvitationRequest {

    private String token;

    private String currentPassword;

    private String newPassword;

    private String confirmPassword;

}