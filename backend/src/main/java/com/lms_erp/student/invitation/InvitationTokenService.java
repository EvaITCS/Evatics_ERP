package com.lms_erp.student.invitation;

import com.lms_erp.student.entity.StudentApplication;

public interface InvitationTokenService {

    String generateInvitationLink(StudentApplication studentApplication);

    ApplicationInvitationToken validateToken(String token);

    void markInvitationSent(StudentApplication studentApplication);

    Long getPersonIdFromToken(String token);

    void changePasswordByInvitation(
            ChangePasswordByInvitationRequest request
    );
}