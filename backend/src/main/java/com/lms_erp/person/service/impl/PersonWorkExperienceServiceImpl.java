package com.lms_erp.person.service.impl;


import java.util.List;

import com.lms_erp.person.dto.PersonWorkExperienceDto;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonWorkExperience;
import com.lms_erp.person.repository.PersonWorkExperienceRepository;
import com.lms_erp.person.service.PersonWorkExperienceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonWorkExperienceServiceImpl
        implements PersonWorkExperienceService {

    private final PersonWorkExperienceRepository
            personWorkExperienceRepository;

    @Override
    public void saveExperiences(
            Person person,
            List<PersonWorkExperienceDto> experiences) {

        if (experiences == null ||
                experiences.isEmpty()) {

            return;
        }

        for (PersonWorkExperienceDto dto : experiences) {

            if (dto == null) {
                continue;
            }

            PersonWorkExperience experience =
                    new PersonWorkExperience();

            experience.setPerson(person);

            experience.setCompanyName(
                    dto.getCompanyName());

            experience.setDesignation(
                    dto.getDesignation());

            experience.setStartDate(
                    dto.getStartDate());

            experience.setEndDate(
                    dto.getEndDate());

            experience.setCurrentlyWorking(
                    dto.getCurrentlyWorking());

            experience.setSkillsUsed(
                    dto.getSkillsUsed());

            experience.setJobDescription(
                    dto.getJobDescription());

            personWorkExperienceRepository
                    .save(experience);
        }
    }
}

