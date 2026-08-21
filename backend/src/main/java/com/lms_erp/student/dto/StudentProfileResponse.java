package com.lms_erp.student.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class StudentProfileResponse {

    // ==========================================
    // PERSON
    // ==========================================

    private Long personId;

    private String firstName;
    private String middleName;
    private String lastName;

    // ==========================================
    // CONTACT
    // ==========================================

    private String email;
    private String alternateEmail;

    private String phoneCountryCode;
    private String phone;

    private String alternateCountryCode;
    private String alternatePhone;

    // ==========================================
    // APPLICATION
    // ==========================================

    private Long applicationStageId;
    private String applicationStage;

    private LocalDate appliedDate;
    private LocalDate admissionDate;

    private String recheckReason;

    // ==========================================
    // ADDRESS
    // ==========================================

    private String addressLine;

    private String city;
    private String state;
    private String country;

    private String zipcode;

    // ==========================================
    // VISA
    // ==========================================

    private String visaType;

    private String eadType;

    private LocalDate visaExpiryDate;

    // ==========================================
    // DOCUMENTS
    // ==========================================

    private String resume;
    private String transcript;
    private String idProof;

    // ==========================================
    // EDUCATION
    // ==========================================

    private List<EducationRequest> educations;

    // ==========================================
    // EXPERIENCE
    // ==========================================

    private List<ExperienceRequest> experiences;
}