package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonContactDto;

import java.util.List;

public interface PersonContactService {

    PersonContactDto addContact(Long personId,
                                PersonContactDto dto);

    List<PersonContactDto> getContactsByPersonId(Long personId);

    PersonContactDto updateContact(Long contactId,
                                   PersonContactDto dto);

    void deleteContact(Long contactId);
}