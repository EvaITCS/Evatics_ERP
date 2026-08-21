package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadAssignmentRepository
        extends JpaRepository<LeadAssignment, Long> {


    @Query("""
    SELECT la
    FROM LeadAssignment la
    JOIN FETCH la.employee e
    JOIN FETCH e.person
    WHERE la.lead.personId = :personId
      AND la.isActive = true
""")
    Optional<LeadAssignment> findByLead_PersonIdAndIsActiveTrue(
            @Param("personId") Long personId
    );


    @Query("""
SELECT la
FROM LeadAssignment la
JOIN FETCH la.employee e
JOIN FETCH e.person
WHERE la.lead.personId=:personId
ORDER BY la.assignedAt DESC
""")
    List<LeadAssignment> findByLead_PersonIdOrderByAssignedAtDesc(
            @Param("personId") Long personId
    );
}