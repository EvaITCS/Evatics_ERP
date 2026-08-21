package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonWorkExperienceDto;
import com.lms_erp.person.entity.Person;

import java.util.List;

public interface PersonWorkExperienceService {

    void saveExperiences(
            Person person,
            List<PersonWorkExperienceDto> experiences
    );

}