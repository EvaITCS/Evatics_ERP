package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadImportAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadImportAuditLogRepository
        extends JpaRepository<LeadImportAuditLog, Long> {
}