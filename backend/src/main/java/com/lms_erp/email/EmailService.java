
package com.lms_erp.email;

public interface EmailService {

    void sendEmail(
            String to,
            String subject,
            String body
    );

    void sendCredentialsEmail(
            String to,
            String username,
            String password
    );

//    added by shweta

    void sendApplicationInvitationEmail(
            String to,
            String studentName,
            String username,
            String temporaryPassword,
            String applicationLink
    );
}