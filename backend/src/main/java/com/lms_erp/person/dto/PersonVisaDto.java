package com.lms_erp.person.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PersonVisaDto {

    private Long personVisaId;

    private String visaType;

    private String eadType;

//    private String visaNumber;

    private LocalDate visaExpiryDate;
}