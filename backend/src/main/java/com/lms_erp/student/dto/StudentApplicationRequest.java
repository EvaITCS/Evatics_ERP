package com.lms_erp.student.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class StudentApplicationRequest {

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

    private Integer currentStep;

    // ==========================================
    // ADDRESS
    // ==========================================

    private String houseNumber;
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
    private String visaExpiryDate;

    // ==========================================
    // DOCUMENTS
    // ==========================================

    private MultipartFile resume;
    private MultipartFile transcript;
    private MultipartFile idProof;

    // ==========================================
    // EDUCATION
    // ==========================================

    private List<EducationRequest> educations;

    // ==========================================
    // EXPERIENCE
    // ==========================================

    private List<ExperienceRequest> experiences;
}