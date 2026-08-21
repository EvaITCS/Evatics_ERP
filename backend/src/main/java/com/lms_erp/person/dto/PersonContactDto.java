package com.lms_erp.person.dto;

import lombok.Data;

@Data
public class PersonContactDto {

    private Long personContactId;

    private Long contactTypeId;
    private String contactTypeName;

    private String contactValue;

    private Boolean isPrimary;

    private Long countryId;
    private String countryName;
}