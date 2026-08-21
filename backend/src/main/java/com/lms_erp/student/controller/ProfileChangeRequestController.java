package com.lms_erp.student.controller;

import com.lms_erp.student.dto.ProfileChangeRequestDto;
import com.lms_erp.student.dto.ProfileChangeReviewDto;
import com.lms_erp.student.entity.ProfileChangeRequest;
import com.lms_erp.student.service.ProfileChangeRequestService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/profile-change-requests")
@RequiredArgsConstructor
public class ProfileChangeRequestController {

    private final ProfileChangeRequestService service;


    // =========================================================
    // GET CANDIDATE PENDING REQUESTS
    // =========================================================

    @GetMapping("/candidate/{candidatePersonId}")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR') or " +
                    "((hasRole('LEAD') or hasRole('STUDENT')) " +
                    "and @profileChangeRequestService.isOwner(#candidatePersonId))"
    )
    public ResponseEntity<List<ProfileChangeRequestDto>>
    getCandidateRequests(
            @PathVariable Long candidatePersonId
    ) {

        return ResponseEntity.ok(
                service.getCandidateRequests(
                        candidatePersonId
                )
        );
    }


    // =========================================================
    // GET ALL PENDING REQUESTS
    // ADMIN / COUNSELLOR
    // =========================================================

    @GetMapping("/pending")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR')"
    )
    public ResponseEntity<List<ProfileChangeRequestDto>>
    getPendingRequests() {

        return ResponseEntity.ok(
                service.getPendingRequests()
        );
    }


    // =========================================================
    // REVIEW REQUEST
    // =========================================================

    @PutMapping("/{requestId}/review")
    @PreAuthorize(
            "hasAnyRole('ADMIN', 'COUNSELLOR')"
    )
    public ResponseEntity<ProfileChangeRequestDto>
    reviewRequest(
            @PathVariable Long requestId,
            @RequestBody ProfileChangeReviewDto dto
    ) {

        ProfileChangeRequest result =
                service.reviewRequest(
                        requestId,
                        dto
                );

        return ResponseEntity.ok(
                service.toDto(result)
        );
    }

    @GetMapping("/{requestId}/document")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR')")
    public ResponseEntity<Resource> getPendingRequestDocument(
            @PathVariable Long requestId
    ) {

        ProfileChangeRequestService.PendingDocumentResponse response =
                service.getPendingRequestDocument(requestId);

        MediaType mediaType;

        try {
            mediaType =
                    MediaType.parseMediaType(
                            response.contentType()
                    );
        } catch (Exception e) {
            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(response.fileData().length)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                response.fileName() +
                                "\""
                )
                .body(
                        new ByteArrayResource(
                                response.fileData()
                        )
                );
    }
}