package com.lms_erp.employee.dto;

import com.lms_erp.person.dto.PersonAddressDto;
import com.lms_erp.person.dto.PersonContactDto;
import com.lms_erp.person.dto.PersonDocumentDto;
import com.lms_erp.person.dto.PersonEducationDto;
import com.lms_erp.person.dto.PersonEmergencyContactRequest;
import com.lms_erp.person.dto.PersonVisaDto;
import com.lms_erp.person.dto.PersonWorkExperienceDto;
import lombok.*;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateEmployeeRequest {

    // =====================================================
    // PERSON DETAILS
    // =====================================================

    private Long genderId;

    private Year birthYear;

    private Long nationalityId;

    private Boolean isMarried;


    // =====================================================
    // EMPLOYEE DETAILS
    // =====================================================

    private Long departmentId;

    private Long designationId;

    private String employmentType;

    private Long employeeStatusId;

    private Long workModeId;

    private Long shiftId;

    private Long locationId;

    private LocalDate probationEndDate;


    // =====================================================
    // PERSON SUB MODULES
    // =====================================================

    private List<PersonAddressDto> addresses;

    private List<PersonContactDto> contacts;

    private List<PersonEducationDto> educations;

    private List<PersonVisaDto> visas;

    private List<PersonDocumentDto> documents;

    private List<PersonEmergencyContactRequest> emergencyContacts;

    private List<PersonWorkExperienceDto> workExperiences;

}