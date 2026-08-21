package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.ActionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActionStatusRepository
        extends JpaRepository<ActionStatus, Long> {

    // =====================================================
    // FIND BY STATUS NAME
    // =====================================================

    Optional<ActionStatus> findByStatusName(
            String statusName
    );

}