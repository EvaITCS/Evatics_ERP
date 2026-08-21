package com.lms_erp.person.controller;

import com.lms_erp.person.entity.NationalityMaster;
import com.lms_erp.person.service.NationalityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
public class NationalityController {

    private final NationalityService nationalityService;

    @GetMapping("/nationalities")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NationalityMaster>> getAllNationalities() {

        return ResponseEntity.ok(nationalityService.getAllNationalities());

    }

}