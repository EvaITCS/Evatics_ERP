package com.lms_erp.lead.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LeadAssignmentResponse {

    private Long assignmentId;

    private Long employeePersonId;

    private String employeeName;

    private String remarks;

    private Boolean isActive;

    private LocalDateTime assignedAt;
}