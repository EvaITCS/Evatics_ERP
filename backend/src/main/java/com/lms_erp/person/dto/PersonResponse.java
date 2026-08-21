package com.lms_erp.person.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Data
public class PersonResponse {

    private Long personId;

    private String firstName;

    private String middleName;

    private String lastName;

    private Long genderId;
    private String genderName;

    private Year birthYear;

    private Long nationalityId;
    private String nationalityName;



    private LocalDateTime createdAt;

    private List<PersonContactDto> contacts;

    private List<PersonAddressDto> addresses;

    private List<PersonEducationDto> educations;

    private List<PersonVisaDto> visas;

    private List<PersonDocumentDto> documents;

    private List<PersonWorkExperienceDto> workExperiences;
}