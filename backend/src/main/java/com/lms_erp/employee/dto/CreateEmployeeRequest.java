package com.lms_erp.employee.dto;

import com.lms_erp.person.dto.*;
import lombok.*;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmployeeRequest {

    // =====================================================
    // PERSON DETAILS
    // =====================================================

    private String firstName;
    private String middleName;
    private String lastName;

    private Long genderId;
    private Year birthYear;
    private Long nationalityId;
    private Boolean isMarried;

    // =====================================================
    // EMPLOYEE DETAILS
    // =====================================================

    private String employeeCode;

    private LocalDate joiningDate;

    private Long departmentId;
    private Long designationId;

    private String employmentType;

    private Long employeeStatusId;
    private Long workModeId;
    private Long shiftId;
    private Long locationId;

    private LocalDate probationEndDate;

    // =====================================================
    // PERSON RELATED DETAILS
    // =====================================================

    private List<PersonAddressDto> addresses;

    private List<PersonContactDto> contacts;

    private List<PersonEducationDto> educations;

    private List<PersonVisaDto> visas;

    private List<PersonDocumentDto> documents;

    private List<PersonWorkExperienceDto> workExperiences;

    // =====================================================
    // EMERGENCY CONTACTS
    // =====================================================

    private List<PersonEmergencyContactRequest> emergencyContacts;
}