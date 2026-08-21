package com.lms_erp.email;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Profile("!prod")
public class EmailController {

    private final EmailService emailService;

    @GetMapping("/test")
    public String sendTestEmail() {

        emailService.sendEmail(

                "srishti02.nigam@gmail.com",

                "ERP Test Email",

                "Congratulations Email Sending Is Working"

        );

        return "Email Sent Successfully";
    }
}