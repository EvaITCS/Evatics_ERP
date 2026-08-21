package com.lms_erp.person.controller;

import com.lms_erp.person.entity.AddressTypeMaster;
import com.lms_erp.person.service.AddressTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
@RequiredArgsConstructor
public class AddressTypeController {

    private final AddressTypeService addressTypeService;

    @GetMapping("/address-types")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressTypeMaster>> getAllAddressTypes() {

        return ResponseEntity.ok(addressTypeService.getAllAddressTypes());

    }

}