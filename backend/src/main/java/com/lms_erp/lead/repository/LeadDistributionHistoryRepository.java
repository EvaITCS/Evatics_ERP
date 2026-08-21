package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadDistributionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadDistributionHistoryRepository
        extends JpaRepository<LeadDistributionHistory, Long> {
}