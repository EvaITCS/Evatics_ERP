package com.lms_erp.person.service.impl;

import com.lms_erp.person.entity.AddressTypeMaster;
import com.lms_erp.person.repository.AddressTypeMasterRepository;
import com.lms_erp.person.service.AddressTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressTypeServiceImpl implements AddressTypeService {

    private final AddressTypeMasterRepository addressTypeMasterRepository;

    @Override
    public List<AddressTypeMaster> getAllAddressTypes() {

        return addressTypeMasterRepository.findAll();

    }
}