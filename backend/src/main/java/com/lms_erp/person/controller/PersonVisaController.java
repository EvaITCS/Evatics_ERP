package com.lms_erp.person.controller;

import com.lms_erp.person.dto.PersonVisaDto;
import com.lms_erp.person.service.PersonVisaService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person-visas")
@RequiredArgsConstructor
public class PersonVisaController {

    private final PersonVisaService personVisaService;


    // =====================================================
    // ADD VISA
    // =====================================================

    @PostMapping("/person/{personId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personVisaService.isOwner(#personId))"
    )
    public ResponseEntity<PersonVisaDto> addVisa(
            @PathVariable Long personId,
            @RequestBody PersonVisaDto dto) {

        return ResponseEntity.ok(
                personVisaService.addVisa(
                        personId,
                        dto
                )
        );
    }


    // =====================================================
    // GET VISAS
    // =====================================================

    @GetMapping("/person/{personId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personVisaService.isOwner(#personId))"
    )
    public ResponseEntity<List<PersonVisaDto>> getVisas(
            @PathVariable Long personId) {

        return ResponseEntity.ok(
                personVisaService.getVisasByPersonId(
                        personId
                )
        );
    }


    // =====================================================
    // UPDATE VISA
    // =====================================================

    @PutMapping("/{visaId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR', 'STUDENT')"
    )
    public ResponseEntity<PersonVisaDto> updateVisa(
            @PathVariable Long visaId,
            @RequestBody PersonVisaDto dto) {

        /*
         * Role check happens here.
         *
         * Actual object ownership is checked inside
         * PersonVisaServiceImpl using the real Person
         * attached to this visaId.
         */
        return ResponseEntity.ok(
                personVisaService.updateVisa(
                        visaId,
                        dto
                )
        );
    }


    // =====================================================
    // DELETE VISA
    // =====================================================

    @DeleteMapping("/{visaId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR', 'STUDENT')"
    )
    public ResponseEntity<Void> deleteVisa(
            @PathVariable Long visaId) {

        /*
         * Final object-level ownership check happens
         * inside PersonVisaServiceImpl.
         */
        personVisaService.deleteVisa(visaId);

        return ResponseEntity.noContent().build();
    }
}