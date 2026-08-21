package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadStatusMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadStatusMasterRepository
        extends JpaRepository<LeadStatusMaster, Long> {

    // =====================================================
    // FIND BY STATUS NAME
    // =====================================================

    Optional<LeadStatusMaster> findByStatusName(
            String statusName
    );

}