package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadDistributionRequest {

    // =====================================================
    // IMPORT JOB
    // =====================================================

    @NotNull(message = "Import job ID is required")
    private Long importJobId;

    // =====================================================
    // EMPLOYEE (PERSON) WHO WILL RECEIVE THE LEADS
    // =====================================================

    @NotNull(message = "Employee person ID is required")
    private Long employeePersonId;

    // =====================================================
    // PERSON WHO DISTRIBUTED THE LEADS
    // =====================================================

    @NotNull(message = "Assigned by person ID is required")
    private Long assignedByPersonId;
}