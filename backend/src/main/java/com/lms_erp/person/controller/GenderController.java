package com.lms_erp.person.controller;

import com.lms_erp.person.entity.GenderMaster;
import com.lms_erp.person.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
public class GenderController {

    private final GenderService genderService;

    @GetMapping("/genders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<GenderMaster>> getAllGenders() {

        return ResponseEntity.ok(genderService.getAllGenders());

    }

}