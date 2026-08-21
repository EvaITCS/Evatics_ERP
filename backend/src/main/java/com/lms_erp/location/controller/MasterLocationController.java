package com.lms_erp.location.controller;

import com.lms_erp.location.dto.MasterLocationResponse;
import com.lms_erp.location.service.MasterLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class MasterLocationController {

    private final MasterLocationService locationService;

    @GetMapping("/search")
    public ResponseEntity<List<MasterLocationResponse>> searchLocations(
            @RequestParam String text,
            @RequestParam(required = false) String countryCode
    ) {

        return ResponseEntity.ok(
                locationService.searchLocations(text, countryCode)
        );
    }
}