package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.LocationRequest;
import com.lms_erp.employee.dto.LocationResponse;
import com.lms_erp.employee.entity.Location;
import com.lms_erp.employee.mapper.LocationMapper;
import com.lms_erp.employee.repository.LocationRepository;
import com.lms_erp.employee.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    @Override
    @Transactional
    public LocationResponse createLocation(
            LocationRequest request) {

        String locationName = request.getLocationName().trim();

        if (locationRepository.existsByLocationNameIgnoreCase(locationName)) {
            throw new RuntimeException("Location already exists");
        }

        Location location = Location.builder()
                .locationName(locationName)
                .address(request.getAddress().trim())
                .build();

        return locationMapper.mapToResponse(
                locationRepository.save(location)
        );
    }
    @Override
    @Transactional
    public LocationResponse updateLocation(
            Long locationId,
            LocationRequest request) {

        Location location =
                locationRepository.findById(locationId)
                        .orElseThrow(() ->
                                new RuntimeException("Location not found"));

        String locationName = request.getLocationName().trim();

        if (!location.getLocationName().equalsIgnoreCase(locationName)
                && locationRepository.existsByLocationNameIgnoreCase(locationName)) {

            throw new RuntimeException("Location already exists");
        }

        location.setLocationName(locationName);
        location.setAddress(request.getAddress().trim());

        return locationMapper.mapToResponse(
                locationRepository.save(location)
        );
    }
    @Override
    @Transactional(readOnly = true)
    public LocationResponse getLocationById(
            Long locationId) {

        Location location =
                locationRepository.findById(locationId)
                        .orElseThrow(() ->
                                new RuntimeException("Location not found"));

        return locationMapper.mapToResponse(location);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LocationResponse> getAllLocations() {

        List<LocationResponse> responses =
                new ArrayList<>();

        List<Location> locations =
                locationRepository.findAll();

        for (Location location : locations) {

            responses.add(
                    locationMapper.mapToResponse(location)
            );
        }

        return responses;
    }

    @Override
    @Transactional
    public void deleteLocation(
            Long locationId) {

        Location location =
                locationRepository.findById(locationId)
                        .orElseThrow(() ->
                                new RuntimeException("Location not found"));

        locationRepository.delete(location);
    }
}