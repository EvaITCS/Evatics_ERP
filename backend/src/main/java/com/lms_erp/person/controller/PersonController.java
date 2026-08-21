package com.lms_erp.person.controller;

import com.lms_erp.person.dto.PersonRequest;
import com.lms_erp.person.dto.PersonResponse;
import com.lms_erp.person.service.PersonService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;


    // =========================================================
    // CREATE PERSON
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR')")
    public ResponseEntity<PersonResponse> createPerson(
            @RequestBody PersonRequest request
    ) {

        return ResponseEntity.ok(
                personService.createPerson(request)
        );
    }


    // =========================================================
    // GET PERSON BY ID
    // =========================================================
    //
    // ADMIN       -> any person
    // COUNSELLOR  -> any person
    // STUDENT     -> own person only
    //
    // =========================================================

    @GetMapping("/{personId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personService.isOwner(#personId))"
    )
    public ResponseEntity<PersonResponse> getPersonById(
            @PathVariable Long personId
    ) {

        return ResponseEntity.ok(
                personService.getPersonById(personId)
        );
    }


    // =========================================================
    // GET ALL PERSONS
    // =========================================================
    //
    // Student should NOT be able to retrieve complete
    // person list.
    //
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR')")
    public ResponseEntity<List<PersonResponse>> getAllPersons() {

        return ResponseEntity.ok(
                personService.getAllPersons()
        );
    }


    // =========================================================
    // UPDATE PERSON
    // =========================================================
    //
    // IMPORTANT:
    // @PutMapping was missing in your current code.
    //
    // ADMIN       -> any person
    // COUNSELLOR  -> any person
    // STUDENT     -> own person only
    //
    // =========================================================

    @PutMapping("/{personId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and " +
                    "@personService.isOwner(#personId))"
    )
    public ResponseEntity<PersonResponse> updatePerson(
            @PathVariable Long personId,
            @RequestBody PersonRequest request
    ) {

        return ResponseEntity.ok(
                personService.updatePerson(
                        personId,
                        request
                )
        );
    }


    // =========================================================
    // DELETE PERSON
    // =========================================================
    //
    // Person deletion is privileged operation.
    // Student should NEVER delete person records.
    //
    // =========================================================

    @DeleteMapping("/{personId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR')")
    public ResponseEntity<Void> deletePerson(
            @PathVariable Long personId
    ) {

        personService.deletePerson(personId);

        return ResponseEntity.noContent().build();
    }
}