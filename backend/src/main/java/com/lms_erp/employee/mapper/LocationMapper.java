package com.lms_erp.employee.mapper;

import com.lms_erp.employee.dto.LocationResponse;
import com.lms_erp.employee.entity.Location;
import org.springframework.stereotype.Component;

@Component

public class LocationMapper {

    public LocationResponse mapToResponse(Location location) {

        return LocationResponse.builder()
                .locationId(location.getLocationId())
                .locationName(location.getLocationName())
                .address(location.getAddress())
                .build();
    }
}