package com.lms_erp.person.service.impl;

import com.lms_erp.person.dto.DocumentFileResponse;
import com.lms_erp.person.dto.PersonDocumentDto;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonDocument;
import com.lms_erp.person.repository.PersonDocumentRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.service.PersonDocumentService;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service("personDocumentService")
@RequiredArgsConstructor
public class PersonDocumentServiceImpl
        implements PersonDocumentService {

    private final PersonRepository personRepository;
    private final PersonDocumentRepository personDocumentRepository;
    private final UserRepository userRepository;
    // =====================================================
    // ADD DOCUMENT
    // =====================================================

    @Override
    public PersonDocumentDto addDocument(
            Long personId,
            PersonDocumentDto dto,
            MultipartFile file) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Person not found"));

        // =================================================
        // VALIDATE FILE
        // =================================================

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Document file is required"
            );
        }

        try {

            PersonDocument document =
                    new PersonDocument();

            document.setPerson(person);

            document.setDocumentType(
                    dto.getDocumentType()
            );

            document.setDocumentNumber(
                    dto.getDocumentNumber()
            );

            // =================================================
            // FILE INFORMATION
            // =================================================

            document.setFileName(
                    file.getOriginalFilename()
            );

            document.setFileData(
                    file.getBytes()
            );

            document.setContentType(
                    file.getContentType()
            );

            document.setFileSize(
                    file.getSize()
            );

            // =================================================
            // SAVE
            // =================================================

            PersonDocument savedDocument =
                    personDocumentRepository.save(
                            document
                    );

            return mapToDto(savedDocument);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read uploaded document",
                    e
            );
        }
    }

    // =====================================================
    // GET DOCUMENTS
    // =====================================================

    @Override
    public List<PersonDocumentDto> getDocumentsByPersonId(
            Long personId) {

        return personDocumentRepository
                .findByPersonPersonId(personId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // =====================================================
    // UPDATE DOCUMENT
    // =====================================================

    @Override
    public PersonDocumentDto updateDocument(
            Long documentId,
            PersonDocumentDto dto,
            MultipartFile file) {

        PersonDocument document =
                personDocumentRepository.findById(
                        documentId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Document not found"
                        ));

        // =================================================
        // DOCUMENT INFORMATION
        // =================================================

        if (dto.getDocumentType() != null &&
                !dto.getDocumentType().isBlank()) {

            document.setDocumentType(
                    dto.getDocumentType().trim()
            );
        }

        document.setDocumentNumber(
                dto.getDocumentNumber()
        );

        // =================================================
        // REPLACE FILE ONLY IF NEW FILE PROVIDED
        // =================================================

        if (file != null && !file.isEmpty()) {

            try {

                document.setFileName(
                        file.getOriginalFilename()
                );

                document.setFileData(
                        file.getBytes()
                );

                document.setContentType(
                        file.getContentType()
                );

                document.setFileSize(
                        file.getSize()
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to read uploaded document",
                        e
                );
            }
        }

        // =================================================
        // SAVE
        // =================================================

        PersonDocument updatedDocument =
                personDocumentRepository.save(
                        document
                );

        return mapToDto(updatedDocument);
    }

    // =====================================================
    // DELETE DOCUMENT
    // =====================================================

    @Override
    public void deleteDocument(Long documentId) {

        PersonDocument document =
                personDocumentRepository.findById(
                        documentId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Document not found"
                        ));

        personDocumentRepository.delete(
                document
        );
    }

    // =====================================================
    // MAP TO DTO
    // =====================================================
    private PersonDocumentDto mapToDto(
            PersonDocument document) {

        PersonDocumentDto dto =
                new PersonDocumentDto();

        dto.setPersonDocumentId(
                document.getPersonDocumentId()
        );

        dto.setDocumentType(
                document.getDocumentType()
        );

        dto.setDocumentNumber(
                document.getDocumentNumber()
        );

        dto.setFileName(
                document.getFileName()
        );

        dto.setContentType(
                document.getContentType()
        );

        dto.setFileSize(
                document.getFileSize()
        );

        return dto;
    }

    // =====================================================
// GET ACTUAL FILE FROM DATABASE
// =====================================================

    @Override
    public DocumentFileResponse getDocumentFile(
            Long documentId) {

        PersonDocument document =
                personDocumentRepository.findById(
                        documentId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Document not found"
                        )
                );

        if (document.getFileData() == null ||
                document.getFileData().length == 0) {

            throw new RuntimeException(
                    "Document file data not found"
            );
        }

        ByteArrayResource resource =
                new ByteArrayResource(
                        document.getFileData()
                );

        return new DocumentFileResponse(
                resource,
                document.getFileName(),
                document.getContentType(),
                document.getFileSize()
        );
    }

    // =====================================================
// CHECK PERSON OWNER
// =====================================================

    @Override
    public boolean isOwner(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }

        String username =
                authentication.getName();

        User user =
                userRepository
                        .findByUsername(username)
                        .orElse(null);

        if (user == null ||
                user.getPerson() == null) {

            return false;
        }

        return user.getPerson()
                .getPersonId()
                .equals(personId);
    }


// =====================================================
// CHECK DOCUMENT OWNER
// =====================================================

    @Override
    public boolean isDocumentOwner(Long documentId) {

        PersonDocument document =
                personDocumentRepository
                        .findById(documentId)
                        .orElse(null);

        if (document == null ||
                document.getPerson() == null) {

            return false;
        }

        return isOwner(
                document.getPerson()
                        .getPersonId()
        );
    }
}