package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonEducationRepository
        extends JpaRepository<PersonEducation, Long> {

    List<PersonEducation> findByPersonPersonId(Long personId);

    void deleteByPersonPersonId(Long personId);
}