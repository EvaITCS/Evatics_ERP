package com.lms_erp.person.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonEmergencyContactRequest {

    // =====================================================
    // BASIC DETAILS
    // =====================================================

    @NotBlank(message = "Contact name is required")
    @Size(max = 100, message = "Contact name cannot exceed 100 characters")
    private String contactName;

    @NotBlank(message = "Relationship is required")
    @Size(max = 50, message = "Relationship cannot exceed 50 characters")
    private String relationship;

    @NotBlank(message = "Phone number is required")
    @Size(max = 30, message = "Phone number cannot exceed 30 characters")
    private String phoneNumber;

    // =====================================================
    // ADDRESS
    // =====================================================

    @NotBlank(message = "Address Line 1 is required")
    @Size(max = 255, message = "Address Line 1 cannot exceed 255 characters")
    private String addressLine1;

    @Size(max = 255, message = "Address Line 2 cannot exceed 255 characters")
    private String addressLine2;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State cannot exceed 100 characters")
    private String state;

    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country cannot exceed 100 characters")
    private String country;

    @NotBlank(message = "Zipcode is required")
    @Size(max = 20, message = "Zipcode cannot exceed 20 characters")
    private String zipcode;
}