package com.lms_erp.person.controller;

import com.lms_erp.person.dto.DocumentFileResponse;
import com.lms_erp.person.dto.PersonDocumentDto;
import com.lms_erp.person.service.PersonDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/person-documents")
@RequiredArgsConstructor
public class PersonDocumentController {

    private final PersonDocumentService personDocumentService;

    // =====================================================
    // ADD DOCUMENT
    // =====================================================

    @PostMapping(
            value = "/person/{personId}",
            consumes = "multipart/form-data"
    )

    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and " +
            "@personDocumentService.isOwner(#personId))")

    public ResponseEntity<PersonDocumentDto> addDocument(

            @PathVariable Long personId,

            @RequestParam("documentType")
            String documentType,

            @RequestParam(
                    value = "documentNumber",
                    required = false
            )
            String documentNumber,

            @RequestParam("file")
            MultipartFile file
    ) {

        PersonDocumentDto dto =
                new PersonDocumentDto();

        dto.setDocumentType(documentType);
        dto.setDocumentNumber(documentNumber);

        return ResponseEntity.ok(
                personDocumentService.addDocument(
                        personId,
                        dto,
                        file
                )
        );
    }

    // =====================================================
    // GET DOCUMENTS
    // =====================================================

    @GetMapping("/person/{personId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') or hasRole('LEAD')) and " +
            "@personDocumentService.isOwner(#personId))")
    public ResponseEntity<List<PersonDocumentDto>> getDocuments(
            @PathVariable Long personId
    ) {

        return ResponseEntity.ok(
                personDocumentService
                        .getDocumentsByPersonId(personId)
        );
    }

    // =====================================================
    // UPDATE DOCUMENT
    // =====================================================
    @PutMapping(
            value = "/{documentId}",
            consumes = "multipart/form-data"
    )

    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and " +
            "@personDocumentService.isDocumentOwner(#documentId))")
    public ResponseEntity<PersonDocumentDto> updateDocument(

            @PathVariable Long documentId,

            @RequestParam("documentType")
            String documentType,

            @RequestParam(
                    value = "documentNumber",
                    required = false
            )
            String documentNumber,

            @RequestParam(
                    value = "file",
                    required = false
            )
            MultipartFile file
    ) {

        PersonDocumentDto dto =
                new PersonDocumentDto();

        dto.setDocumentType(documentType);
        dto.setDocumentNumber(documentNumber);

        return ResponseEntity.ok(
                personDocumentService.updateDocument(
                        documentId,
                        dto,
                        file
                )
        );
    }

    // =====================================================
    // DELETE DOCUMENT
    // =====================================================
    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "(hasRole('STUDENT') and " +
            "@personDocumentService.isDocumentOwner(#documentId))")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long documentId
    ) {

        personDocumentService.deleteDocument(
                documentId
        );

        return ResponseEntity.noContent().build();
    }

    // =====================================================
    // VIEW DOCUMENT FROM DATABASE
    // =====================================================
    @PreAuthorize("hasAnyRole('ADMIN', 'COUNSELLOR') or " +
            "((hasRole('STUDENT') or hasRole('LEAD')) and " +
            "@personDocumentService.isDocumentOwner(#documentId))")
    @GetMapping("/{documentId}/file")
    public ResponseEntity<Resource> getDocumentFile(
            @PathVariable Long documentId
    ) {

        DocumentFileResponse fileResponse =
                personDocumentService.getDocumentFile(
                        documentId
                );

        MediaType mediaType;

        try {

            mediaType = MediaType.parseMediaType(
                    fileResponse.getContentType()
            );

        } catch (Exception e) {

            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(
                        fileResponse.getFileSize()
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                fileResponse.getFileName() +
                                "\""
                )
                .body(
                        fileResponse.getResource()
                );
    }
}