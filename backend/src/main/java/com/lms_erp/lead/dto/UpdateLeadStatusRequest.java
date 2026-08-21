package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateLeadStatusRequest {

    // =====================================================
    // NEW LEAD STATUS
    // =====================================================
    private String customLeadSource;
    @NotNull(message = "Lead status is required")
    private Long leadStatusId;

    // =====================================================
    // REMARKS
    // =====================================================

    private String remarks;
}