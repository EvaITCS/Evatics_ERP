package com.lms_erp.person.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonEmergencyContactResponse {

    private Long emergencyContactId;

    private Long personId;

    private String contactName;

    private String relationship;

    private String phoneNumber;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    private String zipcode;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}