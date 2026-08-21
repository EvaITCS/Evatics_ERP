package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonRequest;
import com.lms_erp.person.dto.PersonResponse;
import java.util.List;

public interface PersonService {

    PersonResponse createPerson(PersonRequest request);

    PersonResponse updatePerson(Long personId, PersonRequest request);

    PersonResponse getPersonById(Long personId);

    List<PersonResponse> getAllPersons();

    void deletePerson(Long personId);
}