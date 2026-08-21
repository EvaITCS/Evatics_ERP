package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonEmergencyContactRequest;
import com.lms_erp.person.dto.PersonEmergencyContactResponse;

import java.util.List;

public interface PersonEmergencyContactService {

    // =====================================================
    // CREATE
    // =====================================================

    PersonEmergencyContactResponse create(
            Long personId,
            PersonEmergencyContactRequest request
    );

    // =====================================================
    // GET ONE
    // =====================================================

    PersonEmergencyContactResponse getById(
            Long personId,
            Long emergencyContactId
    );

    // =====================================================
    // GET ALL FOR PERSON
    // =====================================================

    List<PersonEmergencyContactResponse> getByPersonId(
            Long personId
    );

    // =====================================================
    // UPDATE
    // =====================================================

    PersonEmergencyContactResponse update(
            Long personId,
            Long emergencyContactId,
            PersonEmergencyContactRequest request
    );

    // =====================================================
    // DELETE
    // =====================================================

    void delete(
            Long personId,
            Long emergencyContactId
    );
}