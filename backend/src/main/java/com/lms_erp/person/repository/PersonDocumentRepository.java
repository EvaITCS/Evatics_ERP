package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonDocumentRepository
        extends JpaRepository<PersonDocument, Long> {

    List<PersonDocument> findByPersonPersonId(Long personId);

    void deleteByPersonPersonId(Long personId);

    void deleteByPersonPersonIdAndDocumentType(
            Long personId,
            String documentType
    );

    Optional<PersonDocument> findByFileName(String fileName);

}