package com.lms_erp.person.service.impl;

import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.service.ContactTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactTypeServiceImpl implements ContactTypeService {

    private final ContactTypeMasterRepository contactTypeMasterRepository;

    @Override
    public List<ContactTypeMaster> getAllContactTypes() {

        return contactTypeMasterRepository.findAll();

    }
}