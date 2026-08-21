package com.lms_erp.person.service.impl;

import com.lms_erp.person.entity.CountryMaster;
import com.lms_erp.person.repository.CountryMasterRepository;
import com.lms_erp.person.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements CountryService {

    private final CountryMasterRepository countryMasterRepository;

    @Override
    public List<CountryMaster> getAllCountries() {

        return countryMasterRepository.findAll();

    }
}