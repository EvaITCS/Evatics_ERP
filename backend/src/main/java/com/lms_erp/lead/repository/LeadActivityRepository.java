package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadActivityRepository extends JpaRepository<LeadActivity, Long> {

// =====================================================
// COMMUNICATION STATUS COUNT
// =====================================================

    long countByEmployee_PersonIdAndCommunicationTypeAndCommunicationStatus(
            Long employeePersonId,
            String communicationType,
            String communicationStatus
    );
// =====================================================
// CHECK WHETHER EMPLOYEE TOOK ANY ACTION AFTER REMINDER
//
// Used for 48-hour admin escalation.
//
// If counsellor performed ANY activity after the
// reminder time, then the lead should NOT be escalated.
// =====================================================

    @Query("""
    SELECT COUNT(a) > 0
    FROM LeadActivity a
    WHERE a.lead.personId = :personId
      AND a.employee.personId = :employeePersonId
      AND a.communicationTime > :reminderTime
""")
    boolean existsEmployeeActionAfterReminder(
            @Param("personId") Long personId,

            @Param("employeePersonId") Long employeePersonId,

            @Param("reminderTime") LocalDateTime reminderTime
    );

    @Query("""
SELECT a
FROM LeadActivity a
JOIN FETCH a.employee e
JOIN FETCH e.person
WHERE a.lead.personId=:personId
ORDER BY a.communicationTime DESC
""")
    List<LeadActivity> findByLead_PersonId(
            @Param("personId") Long personId
    );
    // =====================================================
    // EMPLOYEE COMMUNICATION COUNT
    // =====================================================

    long countByEmployee_PersonIdAndCommunicationType(
            Long employeePersonId,
            String communicationType
    );

}