package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonEducationDto;
import java.util.List;

public interface PersonEducationService {

    PersonEducationDto addEducation(Long personId,
                                    PersonEducationDto dto);

    List<PersonEducationDto> getEducationsByPersonId(Long personId);

    PersonEducationDto updateEducation(Long educationId,
                                       PersonEducationDto dto);

    void deleteEducation(Long educationId);
}