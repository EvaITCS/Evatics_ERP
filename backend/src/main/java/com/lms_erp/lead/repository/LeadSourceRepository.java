package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadSourceRepository
        extends JpaRepository<LeadSource, Long> {

    // =====================================================
    // FIND BY SOURCE NAME
    // =====================================================

    Optional<LeadSource> findBySourceNameIgnoreCase(
            String sourceName
    );

    // =====================================================
    // CHECK SOURCE EXISTS
    // =====================================================

    boolean existsBySourceNameIgnoreCase(
            String sourceName
    );

}