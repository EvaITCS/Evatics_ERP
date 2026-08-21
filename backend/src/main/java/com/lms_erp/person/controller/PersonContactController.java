package com.lms_erp.person.controller;

import com.lms_erp.person.dto.PersonContactDto;
import com.lms_erp.person.service.PersonContactService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons/{personId}/contacts")
@RequiredArgsConstructor
public class PersonContactController {

    private final PersonContactService personContactService;


    // =====================================================
    // ADD CONTACT
    // =====================================================

    @PostMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personContactService.isOwner(#personId))"
    )
    public ResponseEntity<PersonContactDto> addContact(
            @PathVariable Long personId,
            @RequestBody PersonContactDto dto) {

        return new ResponseEntity<>(
                personContactService.addContact(
                        personId,
                        dto
                ),
                HttpStatus.CREATED
        );
    }


    // =====================================================
    // GET CONTACTS
    // =====================================================

    @GetMapping
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personContactService.isOwner(#personId))"
    )
    public ResponseEntity<List<PersonContactDto>> getContacts(
            @PathVariable Long personId) {

        return ResponseEntity.ok(
                personContactService
                        .getContactsByPersonId(personId)
        );
    }


    // =====================================================
    // UPDATE CONTACT
    // =====================================================

    @PutMapping("/{contactId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personContactService.isOwner(#personId))"
    )
    public ResponseEntity<PersonContactDto> updateContact(
            @PathVariable Long personId,
            @PathVariable Long contactId,
            @RequestBody PersonContactDto dto) {

        /*
         * personId is checked by @PreAuthorize.
         *
         * The service additionally checks the actual
         * person attached to contactId.
         */
        return ResponseEntity.ok(
                personContactService.updateContact(
                        contactId,
                        dto
                )
        );
    }


    // =====================================================
    // DELETE CONTACT
    // =====================================================

    @DeleteMapping("/{contactId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personContactService.isOwner(#personId))"
    )
    public ResponseEntity<Void> deleteContact(
            @PathVariable Long personId,
            @PathVariable Long contactId) {

        /*
         * Service performs the final object-level
         * ownership check using contactId.
         */
        personContactService.deleteContact(contactId);

        return ResponseEntity.noContent().build();
    }
}