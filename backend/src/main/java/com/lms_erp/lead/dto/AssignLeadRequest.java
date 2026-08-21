package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignLeadRequest {

    // =========================================
    // EMPLOYEE (PERSON) WHO WILL HANDLE THE LEAD
    // =========================================
    @NotNull(message = "Employee person ID is required")
    private Long employeePersonId;

    // =========================================
    // PERSON WHO ASSIGNED THE LEAD
    // =========================================
    @NotNull(message = "Assigned by person ID is required")
    private Long assignedByPersonId;
}