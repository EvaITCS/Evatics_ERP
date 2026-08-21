package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeadNoteRequest {

    // =====================================================
    // LEAD (PERSON)
    // =====================================================

    @NotNull(message = "Person ID is required")
    private Long personId;

    // =====================================================
    // EMPLOYEE (PERSON) WHO ADDED THE NOTE
    // =====================================================

    @NotNull(message = "Employee person ID is required")
    private Long employeePersonId;

    // =====================================================
    // NOTE
    // =====================================================

    @NotBlank(message = "Note cannot be empty")
    private String noteText;
}