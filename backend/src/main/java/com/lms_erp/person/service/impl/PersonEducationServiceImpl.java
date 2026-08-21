package com.lms_erp.person.service.impl;

import com.lms_erp.person.dto.PersonEducationDto;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonEducation;
import com.lms_erp.person.repository.PersonEducationRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.service.PersonEducationService;

import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("personEducationService")
@RequiredArgsConstructor
public class PersonEducationServiceImpl
        implements PersonEducationService {

    private final PersonRepository personRepository;
    private final PersonEducationRepository personEducationRepository;
    private final UserRepository userRepository;


    @Override
    public PersonEducationDto addEducation(
            Long personId,
            PersonEducationDto dto
    ) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Person not found"));

        checkOwnership(personId);

        PersonEducation education = new PersonEducation();

        education.setPerson(person);
        education.setQualification(dto.getQualification());
        education.setInstituteName(dto.getInstituteName());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setPassingYear(dto.getPassingYear());

        PersonEducation saved =
                personEducationRepository.save(education);

        return mapToDto(saved);
    }


    @Override
    public List<PersonEducationDto> getEducationsByPersonId(
            Long personId
    ) {

        checkOwnership(personId);

        return personEducationRepository
                .findByPersonPersonId(personId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    @Override
    public PersonEducationDto updateEducation(
            Long educationId,
            PersonEducationDto dto
    ) {

        PersonEducation education =
                personEducationRepository.findById(educationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education record not found"));

        checkOwnership(
                education.getPerson().getPersonId()
        );

        education.setQualification(dto.getQualification());
        education.setInstituteName(dto.getInstituteName());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setPassingYear(dto.getPassingYear());

        PersonEducation updated =
                personEducationRepository.save(education);

        return mapToDto(updated);
    }


    @Override
    public void deleteEducation(Long educationId) {

        PersonEducation education =
                personEducationRepository.findById(educationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education record not found"));

        checkOwnership(
                education.getPerson().getPersonId()
        );

        personEducationRepository.delete(education);
    }


    /**
     * Used by @PreAuthorize for POST/GET.
     */
    public boolean isOwner(Long personId) {

        return isCurrentUserOwner(personId);
    }


    /**
     * Used by @PreAuthorize for PUT/DELETE.
     * Gets the Person through Education record and
     * verifies that the logged-in student owns it.
     */
    public boolean isEducationOwner(Long educationId) {

        PersonEducation education =
                personEducationRepository.findById(educationId)
                        .orElse(null);

        if (education == null ||
                education.getPerson() == null) {
            return false;
        }

        return isCurrentUserOwner(
                education.getPerson().getPersonId()
        );
    }


    private void checkOwnership(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException("Unauthorized");
        }

        boolean privilegedUser =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                                        ||
                                        authority.getAuthority()
                                                .equals("ROLE_COUNSELLOR"));

        if (privilegedUser) {
            return;
        }

        if (!isCurrentUserOwner(personId)) {

            throw new RuntimeException(
                    "You are not authorized to access this person's data"
            );
        }
    }


    private boolean isCurrentUserOwner(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();

        User user =
                userRepository.findByUsername(username)
                        .orElse(null);

        if (user == null ||
                user.getPerson() == null) {
            return false;
        }

        return user.getPerson()
                .getPersonId()
                .equals(personId);
    }


    private PersonEducationDto mapToDto(
            PersonEducation education
    ) {

        PersonEducationDto dto =
                new PersonEducationDto();

        dto.setPersonEducationId(
                education.getPersonEducationId()
        );

        dto.setQualification(
                education.getQualification()
        );

        dto.setInstituteName(
                education.getInstituteName()
        );

        dto.setFieldOfStudy(
                education.getFieldOfStudy()
        );

        dto.setPassingYear(
                education.getPassingYear()
        );

        return dto;
    }
}