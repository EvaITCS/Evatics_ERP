package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonWorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonWorkExperienceRepository
        extends JpaRepository<PersonWorkExperience, Long> {

    List<PersonWorkExperience>
    findByPersonPersonId(Long personId);

    void deleteByPersonPersonId(Long personId);
}