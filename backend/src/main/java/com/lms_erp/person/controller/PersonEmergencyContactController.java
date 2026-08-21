package com.lms_erp.person.controller;

import com.lms_erp.person.dto.PersonEmergencyContactRequest;
import com.lms_erp.person.dto.PersonEmergencyContactResponse;
import com.lms_erp.person.service.PersonEmergencyContactService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons/{personId}/emergency-contacts")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','COUNSELLOR')")
public class PersonEmergencyContactController {

    private final PersonEmergencyContactService emergencyContactService;

    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public ResponseEntity<PersonEmergencyContactResponse> create(
            @PathVariable Long personId,

            @Valid
            @RequestBody PersonEmergencyContactRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        emergencyContactService.create(
                                personId,
                                request
                        )
                );
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<PersonEmergencyContactResponse>> getAll(
            @PathVariable Long personId
    ) {

        return ResponseEntity.ok(
                emergencyContactService.getByPersonId(
                        personId
                )
        );
    }

    // =====================================================
    // GET ONE
    // =====================================================

    @GetMapping("/{emergencyContactId}")
    public ResponseEntity<PersonEmergencyContactResponse> getById(
            @PathVariable Long personId,

            @PathVariable Long emergencyContactId
    ) {

        return ResponseEntity.ok(
                emergencyContactService.getById(
                        personId,
                        emergencyContactId
                )
        );
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{emergencyContactId}")
    public ResponseEntity<PersonEmergencyContactResponse> update(
            @PathVariable Long personId,

            @PathVariable Long emergencyContactId,

            @Valid
            @RequestBody PersonEmergencyContactRequest request
    ) {

        return ResponseEntity.ok(
                emergencyContactService.update(
                        personId,
                        emergencyContactId,
                        request
                )
        );
    }

    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{emergencyContactId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long personId,

            @PathVariable Long emergencyContactId
    ) {

        emergencyContactService.delete(
                personId,
                emergencyContactId
        );

        return ResponseEntity.noContent().build();
    }
}