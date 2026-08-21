package com.lms_erp.location.service;

import com.lms_erp.location.dto.MasterLocationResponse;

import java.util.List;

public interface MasterLocationService {

    List<MasterLocationResponse> searchLocations(String text,
                                                 String countryCode);

}