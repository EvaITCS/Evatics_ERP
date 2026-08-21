package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadNoteRepository
        extends JpaRepository<LeadNote, Long> {

    // =====================================================
    // NOTES BY PERSON (LEAD)
    // =====================================================

    List<LeadNote> findByLead_PersonIdOrderByCreatedAtDesc(
            Long personId
    );

}