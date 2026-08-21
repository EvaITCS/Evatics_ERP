package com.lms_erp.person.service.impl;

import com.lms_erp.person.entity.NationalityMaster;
import com.lms_erp.person.repository.NationalityMasterRepository;
import com.lms_erp.person.service.NationalityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NationalityServiceImpl implements NationalityService {

    private final NationalityMasterRepository nationalityMasterRepository;

    @Override
    public List<NationalityMaster> getAllNationalities() {

        return nationalityMasterRepository.findAll();

    }
}