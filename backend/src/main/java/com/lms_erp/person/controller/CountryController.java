package com.lms_erp.person.controller;

import com.lms_erp.person.entity.CountryMaster;
import com.lms_erp.person.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping("/countries")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CountryMaster>> getAllCountries() {

        return ResponseEntity.ok(countryService.getAllCountries());

    }

}