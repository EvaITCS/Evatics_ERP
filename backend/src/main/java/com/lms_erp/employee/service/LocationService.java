package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.LocationRequest;
import com.lms_erp.employee.dto.LocationResponse;

import java.util.List;

public interface LocationService {

    LocationResponse createLocation(LocationRequest request);

    LocationResponse updateLocation(Long locationId,
                                    LocationRequest request);

    LocationResponse getLocationById(Long locationId);

    List<LocationResponse> getAllLocations();

    void deleteLocation(Long locationId);
}