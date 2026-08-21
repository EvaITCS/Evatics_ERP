package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadScoreRepository
        extends JpaRepository<LeadScore, Long> {

    // =====================================================
    // FIND SCORE BY PERSON (LEAD)
    // =====================================================

    Optional<LeadScore> findByLead_PersonId(
            Long personId
    );

}