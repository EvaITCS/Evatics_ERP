package com.lms_erp.lead.dto;

import com.lms_erp.lead.enums.LeadPriority;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadResponse {

    // =====================================================
    // PERSON
    // =====================================================

    private Long personId;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String phone;

    // =====================================================
    // CANDIDATE INFORMATION
    // =====================================================

    private Boolean computerExperience;

    // =====================================================
    // LEAD STATUS
    // =====================================================

    private Long leadStatusId;

    private String leadStatus;

    // =====================================================
    // PRIORITY
    // =====================================================

    private LeadPriority leadPriority;

    // =====================================================
    // SOURCE
    // =====================================================

    private Long leadSourceId;

    private String leadSourceName;
    private Long createdByPersonId;

    private String createdByName;
    // =====================================================
    // ASSIGNMENT
    // =====================================================

    private Long employeePersonId;

    private String assignedEmployeeName;
    private String customLeadSource;
    // =====================================================
    // FOLLOW-UP
    // =====================================================

    private LocalDateTime nextFollowupAt;

    // =====================================================
    // TIMELINE
    // =====================================================

    private List<TimelineEventResponse> timeline;
    private LocalDateTime actionPerformedAt;
    // =====================================================
    // AUDIT
    // =====================================================

    private LocalDateTime createdAt;
}