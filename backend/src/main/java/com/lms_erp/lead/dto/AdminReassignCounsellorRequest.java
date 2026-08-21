package com.lms_erp.lead.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminReassignCounsellorRequest {

    @NotNull(message = "Employee person ID is required")
    private Long employeePersonId;
}