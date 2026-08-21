package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface LeadStatusHistoryRepository
        extends JpaRepository<LeadStatusHistory, Long> {

    @Query("""
        SELECT h
        FROM LeadStatusHistory h
        LEFT JOIN FETCH h.oldStatus
        LEFT JOIN FETCH h.newStatus
        LEFT JOIN FETCH h.changedByPerson
        WHERE h.lead.personId = :personId
        ORDER BY h.changedAt DESC
    """)
    List<LeadStatusHistory> findByLead_PersonIdOrderByChangedAtDesc(
            @Param("personId") Long personId
    );
}