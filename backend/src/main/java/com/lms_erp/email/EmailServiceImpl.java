package com.lms_erp.email;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl
        implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(
            String to,
            String subject,
            String body
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Override
    public void sendCredentialsEmail(
            String to,
            String username,
            String password
    ) {

        String subject =
                "Welcome To EVAITCS ERP";

        String body =

                "Hello,\n\n" +

                        "Your ERP account has been created successfully.\n\n" +

                        "Username : " + username + "\n" +

                        "Password : " + password + "\n\n" +

                        "Please change your password after first login.\n\n" +

                        "Regards,\n" +

                        "EVAITCS ERP Team";

        sendEmail(
                to,
                subject,
                body
        );
    }

    //added by shweta

    @Override
    public void sendApplicationInvitationEmail(
            String to,
            String studentName,
            String username,
            String temporaryPassword,
            String applicationLink
    ) {

        String subject =
                "Welcome to EVA IT Consulting Services";

        String body =
                "Hi " + studentName + ",\n\n"

                        + "Welcome to EVA IT Consulting Services.\n\n"

                        + "Your student account has been created successfully.\n\n"

                        + "Username : " + username + "\n"

                        + "Temporary Password : " + temporaryPassword + "\n\n"

                        + "Click the link below to start your application.\n\n"

                        + applicationLink + "\n\n"

                        + "Thank you,\n"

                        + "EVA IT Consulting Services";

        sendEmail(
                to,
                subject,
                body
        );
    }
}