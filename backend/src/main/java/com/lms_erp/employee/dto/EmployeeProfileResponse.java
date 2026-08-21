package com.lms_erp.employee.dto;

import com.lms_erp.person.dto.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeProfileResponse {

    // =====================================================
    // EMPLOYEE
    // =====================================================

    private Long personId;

    private String employeeCode;

    private LocalDate joiningDate;

    private LocalDate probationEndDate;

    private String employmentType;

    // =====================================================
    // PERSON
    // =====================================================

    private String fullName;

    private String firstName;

    private String middleName;

    private String lastName;

    private String gender;

    private Year birthYear;

    private String nationality;

    private Boolean isMarried;

    // =====================================================
    // CONTACT
    // =====================================================

    private String email;

    private String phone;

    // =====================================================
    // ORGANIZATION
    // =====================================================

    private Long departmentId;
    private String departmentName;

    private Long designationId;
    private String designationName;

    private Long employeeStatusId;
    private String employeeStatus;

    private Long workModeId;
    private String workMode;

    private Long shiftId;
    private String shiftName;

    private Long locationId;
    private String locationName;
    private Long genderId;

    private Long nationalityId;
    // =====================================================
    // AUDIT
    // =====================================================

    private LocalDateTime createdAt;

    // =====================================================
    // PERSON SUB MODULES
    // =====================================================

    private List<PersonAddressDto> addresses;

    private List<PersonContactDto> contacts;

    private List<PersonEducationDto> educations;

    private List<PersonVisaDto> visas;
    private List<PersonEmergencyContactResponse> emergencyContacts;
    private List<PersonDocumentDto> documents;

    private List<PersonWorkExperienceDto> workExperiences;
}