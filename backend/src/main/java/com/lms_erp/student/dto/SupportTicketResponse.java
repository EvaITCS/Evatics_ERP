package com.lms_erp.student.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SupportTicketResponse {

    private Long ticketId;

    private String applicationStage;

    // StudentApplication.personId
    private Long personId;

    // Person Details
    private String studentName;

    private String subject;

    private String message;

    private String status;

    private LocalDateTime createdAt;
}