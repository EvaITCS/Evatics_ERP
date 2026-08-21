package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonEmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonEmergencyContactRepository
        extends JpaRepository<PersonEmergencyContact, Long> {

    // =====================================================
    // GET ALL EMERGENCY CONTACTS OF A PERSON
    // =====================================================

    List<PersonEmergencyContact> findByPersonPersonId(
            Long personId
    );

    // =====================================================
    // GET ONE CONTACT OF A PERSON
    // =====================================================

    Optional<PersonEmergencyContact> findByEmergencyContactIdAndPersonPersonId(
            Long emergencyContactId,
            Long personId
    );

    // =====================================================
    // DELETE ALL CONTACTS OF A PERSON
    // =====================================================

    void deleteByPersonPersonId(Long personId);
}