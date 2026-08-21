package com.lms_erp.person.service.impl;

import com.lms_erp.person.dto.PersonEmergencyContactRequest;
import com.lms_erp.person.dto.PersonEmergencyContactResponse;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonEmergencyContact;
import com.lms_erp.person.exception.PersonNotFoundException;
import com.lms_erp.person.repository.PersonEmergencyContactRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.service.PersonEmergencyContactService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonEmergencyContactServiceImpl
        implements PersonEmergencyContactService {

    private final PersonEmergencyContactRepository emergencyContactRepository;

    private final PersonRepository personRepository;

    // =====================================================
    // CREATE
    // =====================================================

    @Override
    public PersonEmergencyContactResponse create(
            Long personId,
            PersonEmergencyContactRequest request
    ) {

        Person person = getPerson(personId);

        PersonEmergencyContact contact =
                PersonEmergencyContact.builder()
                        .person(person)
                        .contactName(request.getContactName().trim())
                        .relationship(request.getRelationship().trim())
                        .phoneNumber(request.getPhoneNumber().trim())
                        .addressLine1(request.getAddressLine1().trim())
                        .addressLine2(
                                request.getAddressLine2() == null
                                        ? null
                                        : request.getAddressLine2().trim()
                        )
                        .city(request.getCity().trim())
                        .state(request.getState().trim())
                        .country(request.getCountry().trim())
                        .zipcode(request.getZipcode().trim())
                        .build();

        PersonEmergencyContact saved =
                emergencyContactRepository.save(contact);

        return mapToResponse(saved);
    }

    // =====================================================
    // GET ONE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public PersonEmergencyContactResponse getById(
            Long personId,
            Long emergencyContactId
    ) {

        PersonEmergencyContact contact =
                emergencyContactRepository
                        .findByEmergencyContactIdAndPersonPersonId(
                                emergencyContactId,
                                personId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Emergency contact not found"
                                )
                        );

        return mapToResponse(contact);
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<PersonEmergencyContactResponse> getByPersonId(
            Long personId
    ) {

        getPerson(personId);

        return emergencyContactRepository
                .findByPersonPersonId(personId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @Override
    public PersonEmergencyContactResponse update(
            Long personId,
            Long emergencyContactId,
            PersonEmergencyContactRequest request
    ) {

        PersonEmergencyContact contact =
                emergencyContactRepository
                        .findByEmergencyContactIdAndPersonPersonId(
                                emergencyContactId,
                                personId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Emergency contact not found"
                                )
                        );

        contact.setContactName(
                request.getContactName().trim()
        );

        contact.setRelationship(
                request.getRelationship().trim()
        );

        contact.setPhoneNumber(
                request.getPhoneNumber().trim()
        );

        contact.setAddressLine1(
                request.getAddressLine1().trim()
        );

        contact.setAddressLine2(
                request.getAddressLine2() == null
                        ? null
                        : request.getAddressLine2().trim()
        );

        contact.setCity(
                request.getCity().trim()
        );

        contact.setState(
                request.getState().trim()
        );

        contact.setCountry(
                request.getCountry().trim()
        );

        contact.setZipcode(
                request.getZipcode().trim()
        );

        PersonEmergencyContact updated =
                emergencyContactRepository.save(contact);

        return mapToResponse(updated);
    }

    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void delete(
            Long personId,
            Long emergencyContactId
    ) {

        PersonEmergencyContact contact =
                emergencyContactRepository
                        .findByEmergencyContactIdAndPersonPersonId(
                                emergencyContactId,
                                personId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Emergency contact not found"
                                )
                        );

        emergencyContactRepository.delete(contact);
    }

    // =====================================================
    // PERSON LOOKUP
    // =====================================================

    private Person getPerson(Long personId) {

        return personRepository.findById(personId)
                .orElseThrow(() ->
                        new PersonNotFoundException(
                                "Person not found with id : " + personId
                        )
                );
    }

    // =====================================================
    // MAPPER
    // =====================================================

    private PersonEmergencyContactResponse mapToResponse(
            PersonEmergencyContact contact
    ) {

        return PersonEmergencyContactResponse.builder()
                .emergencyContactId(
                        contact.getEmergencyContactId()
                )
                .personId(
                        contact.getPerson().getPersonId()
                )
                .contactName(
                        contact.getContactName()
                )
                .relationship(
                        contact.getRelationship()
                )
                .phoneNumber(
                        contact.getPhoneNumber()
                )
                .addressLine1(
                        contact.getAddressLine1()
                )
                .addressLine2(
                        contact.getAddressLine2()
                )
                .city(
                        contact.getCity()
                )
                .state(
                        contact.getState()
                )
                .country(
                        contact.getCountry()
                )
                .zipcode(
                        contact.getZipcode()
                )
                .createdAt(
                        contact.getCreatedAt()
                )
                .updatedAt(
                        contact.getUpdatedAt()
                )
                .build();
    }
}