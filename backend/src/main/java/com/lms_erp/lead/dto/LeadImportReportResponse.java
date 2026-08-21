package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadImportReportResponse {

    private Long stagingId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String phone;

    private String rejectReason;

    private LocalDateTime createdAt;
}