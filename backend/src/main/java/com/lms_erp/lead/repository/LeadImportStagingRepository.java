package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadImportStaging;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadImportStagingRepository
        extends JpaRepository<LeadImportStaging, Long> {

    // =====================================================
    // IMPORT JOB RECORDS
    // =====================================================

    List<LeadImportStaging> findByImportJob_ImportJobIdOrderByStagingIdAsc(
            Long importJobId
    );

    // =====================================================
    // VALID RECORDS
    // =====================================================

    List<LeadImportStaging>
    findByImportJob_ImportJobIdAndIsDuplicateFalseAndIsInvalidFalseOrderByStagingIdAsc(
            Long importJobId
    );

    // =====================================================
    // DUPLICATE CHECK
    // =====================================================

    boolean existsByImportJob_ImportJobIdAndEmail(
            Long importJobId,
            String email
    );

    boolean existsByImportJob_ImportJobIdAndPhone(
            Long importJobId,
            String phone
    );

    // =====================================================
    // DUPLICATE RECORDS
    // =====================================================

    List<LeadImportStaging>
    findByImportJob_ImportJobIdAndIsDuplicateTrueOrderByStagingIdAsc(
            Long importJobId
    );

    // =====================================================
    // INVALID RECORDS
    // =====================================================

    List<LeadImportStaging>
    findByImportJob_ImportJobIdAndIsInvalidTrueOrderByStagingIdAsc(
            Long importJobId
    );

    // =====================================================
    // COUNTS
    // =====================================================

    long countByImportJob_ImportJobIdAndIsDuplicateFalseAndIsInvalidFalse(
            Long importJobId
    );

    long countByImportJob_ImportJobIdAndIsDuplicateTrue(
            Long importJobId
    );

    long countByImportJob_ImportJobIdAndIsInvalidTrue(
            Long importJobId
    );
}