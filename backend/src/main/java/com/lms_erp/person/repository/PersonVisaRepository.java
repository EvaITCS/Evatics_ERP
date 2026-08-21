package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonVisa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonVisaRepository
        extends JpaRepository<PersonVisa, Long> {

    List<PersonVisa> findByPersonPersonId(Long personId);

    void deleteByPersonPersonId(Long personId);
}