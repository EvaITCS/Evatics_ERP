package com.lms_erp.person.service.impl;

import com.lms_erp.common.util.NameFormatterUtil;
import com.lms_erp.person.dto.PersonRequest;
import com.lms_erp.person.dto.PersonResponse;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.exception.PersonNotFoundException;
import com.lms_erp.person.repository.GenderMasterRepository;
import com.lms_erp.person.repository.NationalityMasterRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.service.PersonService;
import com.lms_erp.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;

    private final GenderMasterRepository genderRepository;

    private final NationalityMasterRepository nationalityRepository;

    private final UserRepository userRepository;


    // =========================================================
    // CREATE PERSON
    // =========================================================

    @Override
    public PersonResponse createPerson(PersonRequest request) {

        Person person = new Person();

        person.setFirstName(
                NameFormatterUtil.toTitleCase(
                        request.getFirstName()
                )
        );

        person.setMiddleName(
                NameFormatterUtil.toTitleCase(
                        request.getMiddleName()
                )
        );

        person.setLastName(
                NameFormatterUtil.toTitleCase(
                        request.getLastName()
                )
        );

        person.setBirthYear(
                request.getBirthYear()
        );

        person.setGender(
                genderRepository.findById(request.getGenderId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Gender"
                                )
                        )
        );

        person.setNationality(
                nationalityRepository.findById(
                                request.getNationalityId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Nationality"
                                )
                        )
        );

        Person savedPerson =
                personRepository.save(person);

        return mapToResponse(savedPerson);
    }


    // =========================================================
    // UPDATE PERSON
    // =========================================================

    @Override
    public PersonResponse updatePerson(
            Long personId,
            PersonRequest request
    ) {

        Person person =
                personRepository.findById(personId)
                        .orElseThrow(() ->
                                new PersonNotFoundException(
                                        "Person not found with id : "
                                                + personId
                                )
                        );

        person.setFirstName(
                NameFormatterUtil.toTitleCase(
                        request.getFirstName()
                )
        );

        person.setMiddleName(
                NameFormatterUtil.toTitleCase(
                        request.getMiddleName()
                )
        );

        person.setLastName(
                NameFormatterUtil.toTitleCase(
                        request.getLastName()
                )
        );

        person.setBirthYear(
                request.getBirthYear()
        );

        person.setGender(
                genderRepository.findById(
                                request.getGenderId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Gender"
                                )
                        )
        );

        person.setNationality(
                nationalityRepository.findById(
                                request.getNationalityId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Nationality"
                                )
                        )
        );

        Person updatedPerson =
                personRepository.save(person);

        return mapToResponse(updatedPerson);
    }


    // =========================================================
    // GET PERSON BY ID
    // =========================================================

    @Override
    public PersonResponse getPersonById(
            Long personId
    ) {

        Person person =
                personRepository.findById(personId)
                        .orElseThrow(() ->
                                new PersonNotFoundException(
                                        "Person not found with id : "
                                                + personId
                                )
                        );

        return mapToResponse(person);
    }


    // =========================================================
    // GET ALL PERSONS
    // =========================================================

    @Override
    public List<PersonResponse> getAllPersons() {

        return personRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // DELETE PERSON
    // =========================================================

    @Override
    public void deletePerson(Long personId) {

        Person person =
                personRepository.findById(personId)
                        .orElseThrow(() ->
                                new PersonNotFoundException(
                                        "Person not found with id : "
                                                + personId
                                )
                        );

        personRepository.delete(person);
    }


    // =========================================================
    // MAP ENTITY -> RESPONSE
    // =========================================================

    private PersonResponse mapToResponse(
            Person person
    ) {

        PersonResponse response =
                new PersonResponse();

        response.setPersonId(
                person.getPersonId()
        );

        response.setFirstName(
                person.getFirstName()
        );

        response.setMiddleName(
                person.getMiddleName()
        );

        response.setLastName(
                person.getLastName()
        );

        response.setBirthYear(
                person.getBirthYear()
        );

        response.setCreatedAt(
                person.getCreatedAt()
        );

        if (person.getGender() != null) {

            response.setGenderId(
                    person.getGender().getGenderId()
            );

            response.setGenderName(
                    person.getGender().getGenderName()
            );
        }

        if (person.getNationality() != null) {

            response.setNationalityId(
                    person.getNationality()
                            .getNationalityId()
            );

            response.setNationalityName(
                    person.getNationality()
                            .getNationalityName()
            );
        }

        return response;
    }


    // =========================================================
    // CHECK PERSON OWNERSHIP
    // =========================================================
    //
    // Used by @PreAuthorize in PersonController.
    //
    // STUDENT:
    //     allowed only for his/her own personId.
    //
    // ADMIN / COUNSELLOR:
    //     controller allows them before this method is called.
    //
    // =========================================================

    public boolean isOwner(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        String username =
                authentication.getName();

        return userRepository
                .findByUsername(username)
                .map(user ->
                        user.getPerson() != null
                                &&
                                user.getPerson()
                                        .getPersonId()
                                        .equals(personId)
                )
                .orElse(false);
    }
}