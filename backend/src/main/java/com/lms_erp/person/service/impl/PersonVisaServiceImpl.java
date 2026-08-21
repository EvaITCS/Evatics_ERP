package com.lms_erp.person.service.impl;

import com.lms_erp.person.dto.PersonVisaDto;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonVisa;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.repository.PersonVisaRepository;
import com.lms_erp.person.service.PersonVisaService;

import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("personVisaService")
@RequiredArgsConstructor
@Transactional
public class PersonVisaServiceImpl implements PersonVisaService {


    private final PersonRepository personRepository;
    private final PersonVisaRepository personVisaRepository;
    private final UserRepository userRepository;


    // =====================================================
    // ADD VISA
    // =====================================================

    @Override
    public PersonVisaDto addVisa(
            Long personId,
            PersonVisaDto dto) {

        Person person =
                personRepository.findById(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Person not found"));

        // Object-level authorization
        checkOwnership(personId);

        PersonVisa visa = new PersonVisa();

        visa.setPerson(person);

        visa.setVisaType(dto.getVisaType());


        // =================================================
        // EAD TYPE
        // =================================================

        if ("EAD".equalsIgnoreCase(
                dto.getVisaType())) {

            visa.setEadType(
                    dto.getEadType());

        } else {

            visa.setEadType(null);
        }


        // =================================================
        // EXPIRY DATE
        // =================================================

        if ("US Citizen".equalsIgnoreCase(
                dto.getVisaType())
                ||
                "Green Card".equalsIgnoreCase(
                        dto.getVisaType())) {

            visa.setVisaExpiryDate(null);

        } else {

            visa.setVisaExpiryDate(
                    dto.getVisaExpiryDate());
        }


        PersonVisa savedVisa =
                personVisaRepository.save(visa);

        return mapToDto(savedVisa);
    }


    // =====================================================
    // GET VISAS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<PersonVisaDto> getVisasByPersonId(
            Long personId) {

        checkOwnership(personId);

        return personVisaRepository
                .findByPersonPersonId(personId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }


    // =====================================================
    // UPDATE VISA
    // =====================================================

    @Override
    public PersonVisaDto updateVisa(
            Long visaId,
            PersonVisaDto dto) {

        PersonVisa visa =
                personVisaRepository.findById(visaId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Visa record not found"));

        /*
         * IMPORTANT:
         *
         * We do NOT trust visaId.
         *
         * First find the actual visa record,
         * then get its real parent person,
         * then check ownership.
         */
        checkOwnership(
                visa.getPerson().getPersonId()
        );


        // =================================================
        // VISA TYPE
        // =================================================

        if (dto.getVisaType() != null) {

            visa.setVisaType(
                    dto.getVisaType());
        }


        // =================================================
        // EAD TYPE
        // =================================================

        if ("EAD".equalsIgnoreCase(
                visa.getVisaType())) {

            visa.setEadType(
                    dto.getEadType());

        } else {

            visa.setEadType(null);
        }


        // =================================================
        // EXPIRY DATE
        // =================================================

        if ("US Citizen".equalsIgnoreCase(
                visa.getVisaType())
                ||
                "Green Card".equalsIgnoreCase(
                        visa.getVisaType())) {

            visa.setVisaExpiryDate(null);

        } else {

            visa.setVisaExpiryDate(
                    dto.getVisaExpiryDate());
        }


        PersonVisa updatedVisa =
                personVisaRepository.save(visa);

        return mapToDto(updatedVisa);
    }


    // =====================================================
    // DELETE VISA
    // =====================================================

    @Override
    public void deleteVisa(Long visaId) {

        PersonVisa visa =
                personVisaRepository.findById(visaId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Visa record not found"));

        /*
         * Object-level authorization.
         *
         * The actual person's ID is obtained from
         * the database record instead of trusting
         * the request.
         */
        checkOwnership(
                visa.getPerson().getPersonId()
        );

        personVisaRepository.delete(visa);
    }


    // =====================================================
    // OWNERSHIP CHECK FOR @PreAuthorize
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
                &&
                user.getPerson()
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

    private PersonVisaDto mapToDto(
            PersonVisa visa) {

        PersonVisaDto dto =
                new PersonVisaDto();

        dto.setPersonVisaId(
                visa.getPersonVisaId());

        dto.setVisaType(
                visa.getVisaType());

        dto.setEadType(
                visa.getEadType());

        dto.setVisaExpiryDate(
                visa.getVisaExpiryDate());

        return dto;
    }
}