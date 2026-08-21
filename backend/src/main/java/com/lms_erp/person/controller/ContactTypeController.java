package com.lms_erp.person.controller;

import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.service.ContactTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
public class ContactTypeController {

    private final ContactTypeService contactTypeService;

    @GetMapping("/contact-types")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ContactTypeMaster>> getAllContactTypes() {

        return ResponseEntity.ok(contactTypeService.getAllContactTypes());

    }

}