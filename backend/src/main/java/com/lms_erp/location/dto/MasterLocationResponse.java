package com.lms_erp.location.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MasterLocationResponse {

    private String country;
    private String countryCode;

    private String state;
    private String stateCode;

    private String city;

    private String zipcode;

    private String formatted;

    private Double latitude;
    private Double longitude;
    private String addressLine1;
}