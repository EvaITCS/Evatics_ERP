package com.lms_erp.person.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class PersonAddressDto {

    private Long addressId;

    private Long addressTypeId;

    private String addressTypeName;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String state;

    private String country;

    @JsonAlias({
            "zipcode",
            "zipCode"
    })
    private String zipCode;
}