package com.lms_erp.lead.dto;

import com.lms_erp.lead.enums.LeadPriority;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateLeadRequest {

    // =====================================================
    // PERSON INFORMATION
    // (Saved in persons table)
    // =====================================================

    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;

    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    // =====================================================
    // CANDIDATE INFORMATION
    // (Saved in candidates table)
    // =====================================================

    private String visaType;

    private Boolean computerExperience = false;

    // =====================================================
    // LEAD INFORMATION
    // =====================================================

    @NotNull(message = "Lead source is required")
    private Long leadSourceId;
    private String customLeadSource;
    private Long leadStatusId;

    private LeadPriority leadPriority = LeadPriority.WARM;

    // =====================================================
    // LEAD ASSIGNMENT
    // =====================================================

    private Long employeePersonId;

    // =====================================================
    // FIRST NOTE
    // (Saved in lead_notes table)
    // =====================================================

    private String notes;

    // =====================================================
    // AUDIT
    // =====================================================

    private Long createdByPersonId;
}