package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonVisaDto;

import java.util.List;

public interface PersonVisaService {

    PersonVisaDto addVisa(
            Long personId,
            PersonVisaDto dto
    );

    List<PersonVisaDto> getVisasByPersonId(
            Long personId
    );

    PersonVisaDto updateVisa(
            Long visaId,
            PersonVisaDto dto
    );

    void deleteVisa(
            Long visaId
    );
}