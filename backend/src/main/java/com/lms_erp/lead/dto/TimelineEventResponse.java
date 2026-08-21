package com.lms_erp.lead.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineEventResponse {

    // =====================================================
    // EVENT TYPE
    // =====================================================

    private String eventType;

    // =====================================================
    // DISPLAY
    // =====================================================

    private String title;

    private String message;

    private String status;

    // =====================================================
    // EMPLOYEE WHO PERFORMED THE ACTION
    // =====================================================

    private Long employeePersonId;

    private String employeeName;

    // =====================================================
    // TIMESTAMP
    // =====================================================

    private LocalDateTime date;
}