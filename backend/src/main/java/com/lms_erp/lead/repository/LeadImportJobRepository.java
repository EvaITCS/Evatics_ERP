package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadImportJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadImportJobRepository
        extends JpaRepository<LeadImportJob, Long> {

    Optional<LeadImportJob> findFirstByStatusOrderByImportJobIdDesc(
            String status
    );

    Optional<LeadImportJob> findFirstByStatusOrderByUploadDateDesc(
            String status
    );

    Optional<LeadImportJob> findFirstByStatusInOrderByImportJobIdDesc(
            List<String> statuses
    );

}