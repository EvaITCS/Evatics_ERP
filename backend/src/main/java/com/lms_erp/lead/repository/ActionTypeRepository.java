package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.ActionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActionTypeRepository
        extends JpaRepository<ActionType, Long> {

    // =====================================================
    // FIND BY ACTION NAME
    // =====================================================

    Optional<ActionType> findByActionName(
            String actionName
    );

}