package com.lms_erp.person.service.impl;

import com.lms_erp.person.dto.PersonContactDto;
import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.CountryMaster;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.CountryMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.service.PersonContactService;

import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonContactServiceImpl implements PersonContactService {

    private final PersonRepository personRepository;
    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeRepository;
    private final CountryMasterRepository countryRepository;
    private final UserRepository userRepository;


    // =====================================================
    // ADD CONTACT
    // =====================================================

    @Override
    public PersonContactDto addContact(
            Long personId,
            PersonContactDto dto) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Person not found"));

        // Object-level authorization
        checkOwnership(personId);

        if (personContactRepository.existsByContactValue(
                dto.getContactValue())) {

            throw new RuntimeException("Contact already exists");
        }

        ContactTypeMaster contactType =
                contactTypeRepository.findById(dto.getContactTypeId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Contact Type"));

        PersonContact contact = new PersonContact();

        contact.setPerson(person);
        contact.setContactType(contactType);
        contact.setContactValue(dto.getContactValue());

        contact.setIsPrimary(
                dto.getIsPrimary() != null
                        ? dto.getIsPrimary()
                        : false
        );

        if (dto.getCountryId() != null) {

            CountryMaster country =
                    countryRepository.findById(dto.getCountryId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Invalid Country"));

            contact.setCountry(country);
        }

        PersonContact savedContact =
                personContactRepository.save(contact);

        return mapToDto(savedContact);
    }


    // =====================================================
    // GET CONTACTS
    // =====================================================

    @Override
    public List<PersonContactDto> getContactsByPersonId(
            Long personId) {

        checkOwnership(personId);

        return personContactRepository
                .findByPersonPersonId(personId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    // =====================================================
    // UPDATE CONTACT
    // =====================================================

    @Override
    public PersonContactDto updateContact(
            Long contactId,
            PersonContactDto dto) {

        PersonContact contact =
                personContactRepository.findById(contactId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Contact not found"));

        /*
         * IMPORTANT:
         * Ownership is checked against the ACTUAL person
         * attached to this contactId.
         *
         * This prevents a student from changing another
         * student's contact simply by guessing contactId.
         */
        checkOwnership(
                contact.getPerson().getPersonId()
        );

        if (!contact.getContactValue()
                .equals(dto.getContactValue())
                && personContactRepository
                .existsByContactValue(dto.getContactValue())) {

            throw new RuntimeException(
                    "Contact already exists");
        }

        ContactTypeMaster contactType =
                contactTypeRepository
                        .findById(dto.getContactTypeId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Contact Type"));

        contact.setContactType(contactType);
        contact.setContactValue(dto.getContactValue());

        contact.setIsPrimary(
                dto.getIsPrimary() != null
                        ? dto.getIsPrimary()
                        : false
        );

        if (dto.getCountryId() != null) {

            CountryMaster country =
                    countryRepository
                            .findById(dto.getCountryId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Invalid Country"));

            contact.setCountry(country);

        } else {

            contact.setCountry(null);
        }

        PersonContact updatedContact =
                personContactRepository.save(contact);

        return mapToDto(updatedContact);
    }


    // =====================================================
    // DELETE CONTACT
    // =====================================================

    @Override
    public void deleteContact(Long contactId) {

        PersonContact contact =
                personContactRepository.findById(contactId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Contact not found"));

        // Object-level authorization
        checkOwnership(
                contact.getPerson().getPersonId()
        );

        personContactRepository.delete(contact);
    }


    // =====================================================
    // OWNERSHIP CHECK
    // =====================================================

    public boolean isOwner(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        /*
         * ADMIN and COUNSELLOR can access
         * any person's data.
         */
        boolean privilegedUser =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                                        ||
                                        authority.getAuthority()
                                                .equals("ROLE_COUNSELLOR")
                        );

        if (privilegedUser) {
            return true;
        }

        String username =
                authentication.getName();

        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        return user.getPerson() != null
                && user.getPerson()
                .getPersonId()
                .equals(personId);
    }


    // =====================================================
    // ENFORCE OWNERSHIP
    // =====================================================

    private void checkOwnership(Long personId) {

        if (!isOwner(personId)) {

            throw new RuntimeException(
                    "You are not authorized to access this person's data"
            );
        }
    }


    // =====================================================
    // MAP TO DTO
    // =====================================================

    private PersonContactDto mapToDto(
            PersonContact contact) {

        PersonContactDto dto =
                new PersonContactDto();

        dto.setPersonContactId(
                contact.getContactId());

        if (contact.getContactType() != null) {

            dto.setContactTypeId(
                    contact.getContactType()
                            .getContactTypeId());

            dto.setContactTypeName(
                    contact.getContactType()
                            .getContactTypeName());
        }

        dto.setContactValue(
                contact.getContactValue());

        dto.setIsPrimary(
                contact.getIsPrimary());

        if (contact.getCountry() != null) {

            dto.setCountryId(
                    contact.getCountry()
                            .getCountryId());

            dto.setCountryName(
                    contact.getCountry()
                            .getCountryName());
        }

        return dto;
    }
}