package com.lms_erp.program.controller;

import com.lms_erp.program.dto.*;
import com.lms_erp.program.service.ProgramService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor

public class ProgramController {

    private final ProgramService programService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createProgram(
            @RequestBody ProgramCreateRequest request
    ) {

        return ResponseEntity.ok(
                programService.createProgram(request)
        );
    }
    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping
    public ResponseEntity<?> getAllPrograms() {

        return ResponseEntity.ok(
                programService.getAllPrograms()
        );
    }
    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/{programId}")
    public ResponseEntity<?> getProgramById(
            @PathVariable Long programId
    ) {

        return ResponseEntity.ok(
                programService.getProgramById(programId)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{programId}")
    public ResponseEntity<?> updateProgram(
            @PathVariable Long programId,
            @RequestBody ProgramUpdateRequest request
    ) {

        return ResponseEntity.ok(
                programService.updateProgram(
                        programId,
                        request
                )
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{programId}")
    public ResponseEntity<?> deleteProgram(
            @PathVariable Long programId
    ) {

        programService.deleteProgram(programId);

        return ResponseEntity.ok(
                "Program deleted successfully"
        );
    }
    @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
    @GetMapping("/active")
    public ResponseEntity<?> getActivePrograms() {

        return ResponseEntity.ok(
                programService.getActivePrograms()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/inactive")
    public ResponseEntity<?> getInactivePrograms() {

        return ResponseEntity.ok(
                programService.getInactivePrograms()
        );
    }

}