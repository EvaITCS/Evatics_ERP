package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminFollowupActionRequest {

    // =====================================================
    // LEAD
    // =====================================================

    @NotNull(message = "Person ID is required")
    private Long personId;

    // =====================================================
    // NEW COUNSELLOR
    //
    // Required only for REASSIGN action.
    // =====================================================

    private Long employeePersonId;
}