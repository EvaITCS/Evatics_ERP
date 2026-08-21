package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadImportMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadImportMappingRepository
        extends JpaRepository<LeadImportMapping, Long> {

    // =====================================================
    // FIND ALL MAPPINGS OF AN IMPORT JOB
    // =====================================================

    List<LeadImportMapping> findByImportJob_ImportJobId(
            Long importJobId
    );

}
