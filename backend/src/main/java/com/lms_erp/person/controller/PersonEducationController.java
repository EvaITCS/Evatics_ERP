package com.lms_erp.person.controller;

import com.lms_erp.person.dto.PersonEducationDto;
import com.lms_erp.person.service.PersonEducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person-educations")
@RequiredArgsConstructor
public class PersonEducationController {

    private final PersonEducationService personEducationService;

    @PostMapping("/person/{personId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and @personEducationService.isOwner(#personId))")
    public ResponseEntity<PersonEducationDto> addEducation(
            @PathVariable Long personId,
            @RequestBody PersonEducationDto dto) {

        return ResponseEntity.ok(
                personEducationService.addEducation(personId, dto)
        );
    }

    @GetMapping("/person/{personId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and @personEducationService.isOwner(#personId))")
    public ResponseEntity<List<PersonEducationDto>> getEducations(
            @PathVariable Long personId) {

        return ResponseEntity.ok(
                personEducationService.getEducationsByPersonId(personId)
        );
    }

    @PutMapping("/{educationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and " +
            "@personEducationService.isEducationOwner(#educationId))")
    public ResponseEntity<PersonEducationDto> updateEducation(
            @PathVariable Long educationId,
            @RequestBody PersonEducationDto dto) {

        return ResponseEntity.ok(
                personEducationService.updateEducation(educationId, dto)
        );
    }

    @DeleteMapping("/{educationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and " +
            "@personEducationService.isEducationOwner(#educationId))")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable Long educationId) {

        personEducationService.deleteEducation(educationId);

        return ResponseEntity.noContent().build();
    }
}