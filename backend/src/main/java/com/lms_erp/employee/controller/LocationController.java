package com.lms_erp.employee.controller;

import com.lms_erp.employee.dto.LocationRequest;
import com.lms_erp.employee.dto.LocationResponse;
import com.lms_erp.employee.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public LocationResponse createLocation(
            @RequestBody LocationRequest request) {

        return locationService.createLocation(request);
    }

    @PutMapping("/{locationId}")
    public LocationResponse updateLocation(
            @PathVariable Long locationId,
            @RequestBody LocationRequest request) {

        return locationService.updateLocation(locationId, request);
    }

    @GetMapping("/{locationId}")
    public LocationResponse getLocationById(
            @PathVariable Long locationId) {

        return locationService.getLocationById(locationId);
    }

    @GetMapping
    public List<LocationResponse> getAllLocations() {

        return locationService.getAllLocations();
    }

    @DeleteMapping("/{locationId}")
    public String deleteLocation(
            @PathVariable Long locationId) {

        locationService.deleteLocation(locationId);

        return "Location deleted successfully";
    }
}