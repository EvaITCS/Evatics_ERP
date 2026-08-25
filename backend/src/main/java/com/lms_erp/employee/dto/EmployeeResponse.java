package com.lms_erp.employee.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {

    // =====================================================
    // EMPLOYEE
    // =====================================================

    private Long personId;

    private String employeeCode;

    private String fullName;

    // =====================================================
    // CONTACT DETAILS
    // =====================================================

    private String primaryEmail;
    private String alternateEmail;

    private String primaryPhone;
    private String alternatePhone;

    // =====================================================
    // PROFESSIONAL DETAILS
    // =====================================================

    private String departmentName;

    private String designationName;

    private String employmentType;

    private String employeeStatus;

    private String workMode;

    private String shiftName;

    private String locationName;

    private LocalDate joiningDate;

    private LocalDate probationEndDate;

    private BigDecimal experienceYears; // Remove if not maintained

    // =====================================================
    // AUDIT
    // =====================================================

    private LocalDateTime createdAt;

    // =====================================================
    // USER ACCOUNT
    // =====================================================

    private Long userId;

    private String generatedUsername;

    private String assignedRole;

    // Set only when the credentials email could not be delivered,
    // so the admin can hand the password over manually
    private String temporaryPassword;
}