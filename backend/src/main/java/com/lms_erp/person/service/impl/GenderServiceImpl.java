package com.lms_erp.person.service.impl;

import com.lms_erp.person.entity.GenderMaster;
import com.lms_erp.person.repository.GenderMasterRepository;
import com.lms_erp.person.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenderServiceImpl implements GenderService {

    private final GenderMasterRepository genderMasterRepository;

    @Override
    public List<GenderMaster> getAllGenders() {

        return genderMasterRepository.findAll();

    }
}