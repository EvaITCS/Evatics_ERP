package com.lms_erp.person.service;

import com.lms_erp.person.dto.DocumentFileResponse;
import com.lms_erp.person.dto.PersonDocumentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PersonDocumentService {

    // =====================================================
    // ADD DOCUMENT
    // =====================================================

    PersonDocumentDto addDocument(
            Long personId,
            PersonDocumentDto dto,
            MultipartFile file
    );

    // =====================================================
    // GET DOCUMENT METADATA
    // =====================================================

    List<PersonDocumentDto> getDocumentsByPersonId(
            Long personId
    );

    // =====================================================
    // UPDATE DOCUMENT
    // =====================================================

    PersonDocumentDto updateDocument(
            Long documentId,
            PersonDocumentDto dto,
            MultipartFile file
    );

    // =====================================================
    // DELETE DOCUMENT
    // =====================================================

    void deleteDocument(
            Long documentId
    );

    // =====================================================
    // GET ACTUAL FILE FROM DATABASE
    // =====================================================

    DocumentFileResponse getDocumentFile(
            Long documentId
    );

    boolean isOwner(Long personId);

    boolean isDocumentOwner(Long documentId);
}