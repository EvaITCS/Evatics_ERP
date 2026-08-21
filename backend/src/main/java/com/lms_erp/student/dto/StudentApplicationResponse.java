package com.lms_erp.student.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class StudentApplicationResponse {

    // Person
    private Long personId;

    private String firstName;
    private String middleName;
    private String lastName;

    private String email;
    private String alternateEmail;

    private String phoneCountryCode;
    private String phone;

    private String alternateCountryCode;
    private String alternatePhone;

    // Application
    private Long applicationStageId;
    private String applicationStage;


    private LocalDate appliedDate;
    private LocalDate admissionDate;

    private String recheckReason;

    private Integer currentStep;

    // Address
    private String houseNumber;
    private String addressLine;
    private String city;
    private String state;
    private String country;
    private String zipcode;


    // Visa
    private String visaType;
    private String eadType;
    private LocalDate visaExpiryDate;

    // Documents
    private String resume;
    private String transcript;
    private String idProof;

    // Education
    private List<EducationRequest> educations;

    // Experience
    private List<ExperienceRequest> experiences;

    // Invitation
    private boolean invitationSent;
}