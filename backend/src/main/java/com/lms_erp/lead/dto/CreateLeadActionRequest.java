package com.lms_erp.lead.dto;

import com.lms_erp.lead.enums.FollowupType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateLeadActionRequest {

    // =========================================
    // LEAD (PERSON)
    // =========================================

    @NotNull(message = "Person ID is required")
    private Long personId;

    // =========================================
    // EMPLOYEE (PERSON)
    // =========================================

    @NotNull(message = "Employee person ID is required")
    private Long employeePersonId;

    // =========================================
    // COMMUNICATION
    // =========================================

    @NotNull(message = "Communication type is required")
    private FollowupType communicationType;

    private String communicationStatus;

    // =========================================
    // REMARKS
    // =========================================

    private String notes;

    // =========================================
    // REMINDER
    // =========================================

    private LocalDateTime reminderTime;

    private String reminderType;
}