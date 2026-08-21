package com.lms_erp.person.controller;

import com.lms_erp.person.dto.PersonAddressDto;
import com.lms_erp.person.service.PersonAddressService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person-addresses")
@RequiredArgsConstructor
public class PersonAddressController {

    private final PersonAddressService personAddressService;


    // =========================================================
    // ADD ADDRESS
    // =========================================================

    @PostMapping("/person/{personId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and @personAddressService.isOwner(#personId))"
    )
    public ResponseEntity<PersonAddressDto> addAddress(
            @PathVariable Long personId,
            @RequestBody PersonAddressDto dto) {

        return ResponseEntity.ok(
                personAddressService.addAddress(personId, dto)
        );
    }


    // =========================================================
    // GET ADDRESSES BY PERSON
    // =========================================================

    @GetMapping("/person/{personId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "(hasRole('STUDENT') and @personAddressService.isOwner(#personId))"
    )
    public ResponseEntity<List<PersonAddressDto>> getAddresses(
            @PathVariable Long personId) {

        return ResponseEntity.ok(
                personAddressService.getAddressesByPersonId(personId)
        );
    }


    // =========================================================
    // UPDATE ADDRESS
    // =========================================================

    @PutMapping("/{addressId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR', 'STUDENT')"
    )
    public ResponseEntity<PersonAddressDto> updateAddress(
            @PathVariable Long addressId,
            @RequestBody PersonAddressDto dto) {

        return ResponseEntity.ok(
                personAddressService.updateAddress(addressId, dto)
        );
    }


    // =========================================================
    // DELETE ADDRESS
    // =========================================================

    @DeleteMapping("/{addressId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR', 'STUDENT')"
    )
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId) {

        personAddressService.deleteAddress(addressId);

        return ResponseEntity.noContent().build();
    }
}