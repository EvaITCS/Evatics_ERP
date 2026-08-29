package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadStatusMaster;
import com.lms_erp.lead.enums.LeadPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {


    // =====================================================
    // DASHBOARD COUNTS
    // =====================================================

    long countByIsArchivedFalse();

    long countByLeadStatus_StatusNameAndIsArchivedFalse(
            String statusName
    );

    long countByCreatedAtBetweenAndIsArchivedFalse(
            LocalDateTime start,
            LocalDateTime end
    );

    long countByLeadStatus_StatusNameAndCreatedAtBetweenAndIsArchivedFalse(
            String statusName,
            LocalDateTime start,
            LocalDateTime end
    );



    // =====================================================
    // UNASSIGNED LEADS
    // =====================================================

    @Query("""
        SELECT DISTINCT l
        FROM Lead l
        JOIN FETCH l.person p
        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType
        LEFT JOIN FETCH l.leadSource
        LEFT JOIN FETCH l.leadStatus
        WHERE NOT EXISTS (
            SELECT 1
            FROM LeadAssignment la
            WHERE la.lead = l
              AND la.isActive = true
        )
          AND l.isArchived = false
        ORDER BY l.createdAt ASC
    """)
    List<Lead> findUnassignedLeads();



    // =====================================================
    // LEAD DETAILS
    // =====================================================

    @Query("""
        SELECT DISTINCT l
        FROM Lead l
        JOIN FETCH l.person p
        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType
        LEFT JOIN FETCH l.leadSource
        LEFT JOIN FETCH l.leadStatus
        WHERE l.personId = :personId
    """)
    Optional<Lead> findByPersonIdWithDetails(

            @Param("personId")
            Long personId
    );


    // =====================================================
    // EMPLOYEE LEAD COUNTS
    // =====================================================

    @Query("""
        SELECT
            la.employee.personId,
            COUNT(l)
        FROM LeadAssignment la
        JOIN la.lead l
        WHERE la.isActive = true
          AND l.isArchived = false
        GROUP BY la.employee.personId
        ORDER BY COUNT(l) ASC
    """)
    List<Object[]> getEmployeeLeadCounts();

    @Query("""
SELECT l
FROM LeadAssignment la
JOIN la.lead l
WHERE la.employee.personId = :employeePersonId
""")
    List<Lead> testReEngagement(
            @Param("employeePersonId") Long employeePersonId
    );




    @Query("""
SELECT DISTINCT l
FROM Lead l
JOIN FETCH l.person p
LEFT JOIN FETCH p.contacts pc
LEFT JOIN FETCH pc.contactType
LEFT JOIN FETCH l.leadSource
LEFT JOIN FETCH l.leadStatus
LEFT JOIN FETCH l.createdBy cb
LEFT JOIN FETCH cb.person
WHERE l.createdBy.personId = :employeePersonId
  AND l.isArchived = false
  AND l.leadStatus.statusName = :status
ORDER BY l.createdAt DESC
""")
    List<Lead> findCreatedByEmployeeAndStatus(

            @Param("employeePersonId")
            Long employeePersonId,

            @Param("status")
            String status
    );

    @Query("""
SELECT DISTINCT l
FROM Lead l
JOIN FETCH l.person p
LEFT JOIN FETCH p.contacts pc
LEFT JOIN FETCH pc.contactType
LEFT JOIN FETCH l.leadSource
LEFT JOIN FETCH l.leadStatus
LEFT JOIN FETCH l.createdBy cb
LEFT JOIN FETCH cb.person
WHERE l.isArchived = false
AND l.leadStatus.statusName = 'INTERESTED'
ORDER BY l.createdAt DESC
""")
    List<Lead> findAllInterestedLeads();



    @Query("""
SELECT DISTINCT l
FROM Lead l
JOIN FETCH l.person p
LEFT JOIN FETCH p.contacts pc
LEFT JOIN FETCH pc.contactType
LEFT JOIN FETCH l.leadSource
LEFT JOIN FETCH l.leadStatus
LEFT JOIN FETCH l.createdBy cb
LEFT JOIN FETCH cb.person
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
ORDER BY l.createdAt DESC
""")
    List<Lead> findCreatedByEmployee(
            @Param("employeePersonId")
            Long employeePersonId
    );



    @Query("""
SELECT COUNT(l)
FROM Lead l
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
""")
    long countCreatedByEmployee(
            @Param("employeePersonId") Long employeePersonId
    );

    @Query("""
SELECT COUNT(l)
FROM Lead l
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
AND l.leadStatus.statusName = :status
""")
    long countCreatedByEmployeeAndStatus(
            @Param("employeePersonId") Long employeePersonId,
            @Param("status") String status
    );

    @Query("""
SELECT COUNT(l)
FROM Lead l
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
AND l.createdAt BETWEEN :start AND :end
""")
    long countCreatedTodayByEmployee(
            @Param("employeePersonId") Long employeePersonId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
SELECT COUNT(l)
FROM Lead l
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
AND l.leadStatus.statusName = :status
AND l.createdAt BETWEEN :start AND :end
""")
    long countCreatedTodayByEmployeeAndStatus(
            @Param("employeePersonId") Long employeePersonId,
            @Param("status") String status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
SELECT COUNT(l)
FROM Lead l
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
AND l.createdAt BETWEEN :start AND :end
""")
    long countCreatedByEmployeeBetween(
            @Param("employeePersonId") Long employeePersonId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    @Query("""
SELECT COUNT(l)
FROM Lead l
WHERE l.createdBy.personId = :employeePersonId
AND l.isArchived = false
AND l.leadStatus.statusName = :status
AND l.createdAt BETWEEN :start AND :end
""")
    long countCreatedByEmployeeAndStatusBetween(
            @Param("employeePersonId") Long employeePersonId,
            @Param("status") String status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


// =====================================================
// MY ASSIGNED LEADS BY STATUS
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la
    JOIN la.lead l
    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE la.employee.personId = :employeePersonId
      AND la.isActive = true
      AND l.isArchived = false
      AND l.leadStatus.statusName = :status

    ORDER BY l.createdAt DESC
""")
    List<Lead> findAssignedLeadsByEmployeeAndStatus(

            @Param("employeePersonId")
            Long employeePersonId,

            @Param("status")
            String status
    );

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la
    JOIN la.lead l

    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus

    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE la.employee.personId = :employeePersonId
      AND la.isActive = true
      AND l.isArchived = false
      AND l.leadStatus.statusName = 'INTERESTED'

    ORDER BY l.createdAt DESC
""")
    List<Lead> findMyInterestedLeads(

            @Param("employeePersonId")
            Long employeePersonId
    );

    @Query("""
SELECT DISTINCT l
FROM Lead l
JOIN FETCH l.person p
LEFT JOIN FETCH p.contacts pc
LEFT JOIN FETCH pc.contactType
LEFT JOIN FETCH l.leadSource
LEFT JOIN FETCH l.leadStatus
LEFT JOIN FETCH l.createdBy cb
LEFT JOIN FETCH cb.person

WHERE l.isArchived = false

AND (
      :employeePersonId IS NULL
      OR EXISTS (
          SELECT 1
          FROM LeadAssignment la
          WHERE la.lead = l
            AND la.employee.personId = :employeePersonId
            AND la.isActive = true
      )
)

AND (
      :status IS NULL
      OR l.leadStatus.statusName = :status
)

AND (
      :priority IS NULL
      OR l.leadPriority = :priority
)

AND (
      :start IS NULL
      OR l.createdAt >= :start
)

AND (
      :end IS NULL
      OR l.createdAt < :end
)

AND (
      :keyword IS NULL
      OR :keyword = ''
      OR LOWER(
            CONCAT(
                COALESCE(p.firstName,''),
                ' ',
                COALESCE(p.middleName,''),
                ' ',
                COALESCE(p.lastName,'')
            )
      ) LIKE LOWER(CONCAT('%', :keyword, '%'))

      OR LOWER(COALESCE(pc.contactValue,''))
         LIKE LOWER(CONCAT('%', :keyword, '%'))
)

ORDER BY l.createdAt DESC
""")
    List<Lead> filterLeads(

            @Param("employeePersonId")
            Long employeePersonId,

            @Param("keyword")
            String keyword,

            @Param("status")
            String status,

            @Param("priority")
            LeadPriority priority,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );
    @Query("""
SELECT DISTINCT l
FROM LeadAssignment la
JOIN la.lead l

JOIN FETCH l.person p
LEFT JOIN FETCH p.contacts pc
LEFT JOIN FETCH pc.contactType
LEFT JOIN FETCH l.leadSource
LEFT JOIN FETCH l.leadStatus
LEFT JOIN FETCH l.createdBy cb
LEFT JOIN FETCH cb.person

WHERE la.employee.personId = :employeePersonId
  AND la.isActive = true
  AND l.isArchived = false

ORDER BY l.createdAt DESC
""")
    List<Lead> findAssignedLeadsByEmployee(
            @Param("employeePersonId")
            Long employeePersonId
    );

    @Query("""
SELECT DISTINCT l
FROM Lead l
JOIN FETCH l.person p
LEFT JOIN FETCH p.contacts pc
LEFT JOIN FETCH pc.contactType
LEFT JOIN FETCH l.leadSource
LEFT JOIN FETCH l.leadStatus
LEFT JOIN FETCH l.createdBy cb
LEFT JOIN FETCH cb.person

WHERE l.isArchived = false

ORDER BY l.createdAt DESC
""")
    List<Lead> findAllWithLeadSource();

    // =====================================================
// ACTIVE LEADS BY EMPLOYEE
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la
    JOIN la.lead l

    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE la.employee.personId = :employeePersonId
      AND la.isActive = true
      AND l.isArchived = false

    ORDER BY l.createdAt DESC
""")
    List<Lead> findActiveLeadsByEmployee(
            @Param("employeePersonId")
            Long employeePersonId
    );

    // =====================================================
// MY LEADS BY STATUS
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la
    JOIN la.lead l

    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE la.employee.personId = :employeePersonId
      AND la.isActive = true
      AND l.isArchived = false
      AND l.leadStatus.statusName = :status

    ORDER BY l.createdAt DESC
""")
    List<Lead> findByEmployeeAndStatus(
            @Param("employeePersonId")
            Long employeePersonId,

            @Param("status")
            String status
    );

    // =====================================================
// ALL RE-ENGAGEMENT LEADS - ADMIN
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM Lead l

    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE l.isArchived = false
      AND (
            (
                l.leadStatus.statusName = 'NOT_INTERESTED'
                AND l.reEngagementDate IS NOT NULL
            )
            OR
            l.leadStatus.statusName = 'RE_ENGAGEMENT'
      )

    ORDER BY
        CASE
            WHEN l.reEngagementDate IS NULL THEN 1
            ELSE 0
        END,
        l.reEngagementDate ASC
""")
    List<Lead> findAllReEngagementLeads();

    // =====================================================
// MY RE-ENGAGEMENT LEADS - CURRENT EMPLOYEE
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la
    JOIN la.lead l

    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE la.employee.personId = :employeePersonId
      AND la.isActive = true
      AND l.isArchived = false
      AND (
            (
                l.leadStatus.statusName = 'NOT_INTERESTED'
                AND l.reEngagementDate IS NOT NULL
            )
            OR
            l.leadStatus.statusName = 'RE_ENGAGEMENT'
      )

    ORDER BY
        CASE
            WHEN l.reEngagementDate IS NULL THEN 1
            ELSE 0
        END,
        l.reEngagementDate ASC
""")
    List<Lead> findReEngagementLeadsByEmployee(
            @Param("employeePersonId")
            Long employeePersonId
    );

    @Query("""
    SELECT l
    FROM Lead l
    WHERE l.isArchived = false
      AND l.reEngagementDate IS NOT NULL
      AND l.reEngagementDate <= :date
      AND l.leadStatus.statusName = 'NOT_INTERESTED'
    ORDER BY l.reEngagementDate ASC
""")
    List<Lead> findArchivedLeadsForReEngagement(
            @Param("date") LocalDateTime date
    );

    @Query("""
    SELECT DISTINCT l
    FROM Lead l
    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE l.isArchived = false
      AND l.createdBy.personId = :adminPersonId
      AND (
            l.leadStatus.statusName = 'RE_ENGAGEMENT'
            OR (
                l.leadStatus.statusName = 'NOT_INTERESTED'
                AND l.reEngagementDate IS NOT NULL
            )
      )

    ORDER BY l.createdAt DESC
""")
    List<Lead> findAdminReEngagementLeads(
            @Param("adminPersonId")
            Long adminPersonId
    );


    // =====================================================
// COUNSELLOR WORKING LEADS
//
// Lead belongs to counsellor when:
//
// 1. Counsellor created the lead
// OR
// 2. Lead is currently actively assigned to counsellor
//
// DISTINCT is important because:
// same lead can satisfy both conditions.
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM Lead l

    LEFT JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus

    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE l.isArchived = false

    AND (
        l.createdBy.personId = :employeePersonId

        OR EXISTS (
            SELECT 1
            FROM LeadAssignment la
            WHERE la.lead = l
              AND la.employee.personId = :employeePersonId
              AND la.isActive = true
        )
    )

    ORDER BY l.createdAt DESC
""")
    List<Lead> findCounsellorWorkingLeads(
            @Param("employeePersonId")
            Long employeePersonId
    );


    // =====================================================
// COUNSELLOR WORKING LEADS BY STATUS
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM Lead l

    LEFT JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus

    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE l.isArchived = false

    AND l.leadStatus.statusName = :status

    AND (
        l.createdBy.personId = :employeePersonId

        OR EXISTS (
            SELECT 1
            FROM LeadAssignment la
            WHERE la.lead = l
              AND la.employee.personId = :employeePersonId
              AND la.isActive = true
        )
    )

    ORDER BY l.createdAt DESC
""")
    List<Lead> findCounsellorWorkingLeadsByStatus(
            @Param("employeePersonId")
            Long employeePersonId,

            @Param("status")
            String status
    );


    // =====================================================
// LEAD STATUS
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM Lead l

    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.leadSource

    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    WHERE l.leadStatus = :leadStatus
      AND l.isArchived = false

    ORDER BY l.createdAt DESC
""")
    List<Lead> findByLeadStatus(
            @Param("leadStatus")
            LeadStatusMaster leadStatus
    );


    // =====================================================
// FILTER INTERESTED LEADS - ADMIN
// DATE = ACTION PERFORMED DATE
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM Lead l

    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE l.isArchived = false

      AND l.leadStatus.statusName = 'INTERESTED'

      AND f.actionResult = 'INTERESTED'

      AND f.actionPerformedAt IS NOT NULL

      AND (
            :start IS NULL
            OR f.actionPerformedAt >= :start
      )

      AND (
            :end IS NULL
            OR f.actionPerformedAt < :end
      )

      AND (
            :keyword IS NULL
            OR :keyword = ''

            OR LOWER(
                CONCAT(
                    COALESCE(p.firstName, ''),
                    ' ',
                    COALESCE(p.middleName, ''),
                    ' ',
                    COALESCE(p.lastName, '')
                )
            ) LIKE LOWER(CONCAT('%', :keyword, '%'))

            OR LOWER(COALESCE(pc.contactValue, ''))
               LIKE LOWER(CONCAT('%', :keyword, '%'))
      )

    ORDER BY l.createdAt DESC
""")
    List<Lead> filterInterestedLeads(
            @Param("keyword") String keyword,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    // =====================================================
// FILTER MY INTERESTED LEADS - COUNSELLOR
// DATE = ACTION PERFORMED DATE
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la

    JOIN la.lead l

    JOIN FETCH l.person p
    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType
    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus
    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE la.employee.personId = :employeePersonId
      AND la.isActive = true
      AND l.isArchived = false
      AND l.leadStatus.statusName = 'INTERESTED'
      AND f.actionResult = 'INTERESTED'
      AND f.actionPerformedAt IS NOT NULL

      AND (
            :start IS NULL
            OR f.actionPerformedAt >= :start
      )

      AND (
            :end IS NULL
            OR f.actionPerformedAt < :end
      )

      AND (
            :keyword IS NULL
            OR :keyword = ''

            OR LOWER(
                CONCAT(
                    COALESCE(p.firstName, ''),
                    ' ',
                    COALESCE(p.middleName, ''),
                    ' ',
                    COALESCE(p.lastName, '')
                )
            ) LIKE LOWER(CONCAT('%', :keyword, '%'))

            OR LOWER(COALESCE(pc.contactValue, ''))
               LIKE LOWER(CONCAT('%', :keyword, '%'))
      )

    ORDER BY l.createdAt DESC
""")
    List<Lead> filterMyInterestedLeads(
            @Param("employeePersonId")
            Long employeePersonId,

            @Param("keyword")
            String keyword,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );

    // =====================================================
// FILTER RE-ENGAGEMENT LEADS - ADMIN
//
// DATE FILTER = FOLLOW-UP ACTION PERFORMED DATE
//
// Includes:
// 1. NOT_INTERESTED leads having re-engagement date
// 2. RE_ENGAGEMENT actions already performed
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM Lead l

    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus

    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE l.isArchived = false

      AND (
            (
                l.leadStatus.statusName = 'NOT_INTERESTED'
                AND l.reEngagementDate IS NOT NULL
                AND f.actionResult = 'NOT_INTERESTED'
            )

            OR

            (
                l.leadStatus.statusName = 'RE_ENGAGEMENT'
                AND f.actionResult = 'RE_ENGAGEMENT'
            )
      )

      AND f.actionPerformedAt IS NOT NULL

      AND (
            :start IS NULL
            OR f.actionPerformedAt >= :start
      )

      AND (
            :end IS NULL
            OR f.actionPerformedAt < :end
      )

      AND (
            :counsellorPersonId IS NULL

            OR EXISTS (
                SELECT 1
                FROM LeadAssignment la
                WHERE la.lead = l
                  AND la.employee.personId = :counsellorPersonId
                  AND la.isActive = true
            )
      )

      AND (
            :keyword IS NULL
            OR :keyword = ''

            OR LOWER(
                CONCAT(
                    COALESCE(p.firstName, ''),
                    ' ',
                    COALESCE(p.middleName, ''),
                    ' ',
                    COALESCE(p.lastName, '')
                )
            ) LIKE LOWER(
                CONCAT('%', :keyword, '%')
            )

            OR LOWER(
                COALESCE(pc.contactValue, '')
            ) LIKE LOWER(
                CONCAT('%', :keyword, '%')
            )
      )

    ORDER BY l.reEngagementDate ASC
""")
    List<Lead> filterReEngagementLeads(

            @Param("counsellorPersonId")
            Long counsellorPersonId,

            @Param("keyword")
            String keyword,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );

    // =====================================================
// FILTER MY RE-ENGAGEMENT LEADS - COUNSELLOR
//
// DATE FILTER = FOLLOW-UP ACTION PERFORMED DATE
// =====================================================

    @Query("""
    SELECT DISTINCT l
    FROM LeadAssignment la

    JOIN la.lead l

    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH l.leadSource
    LEFT JOIN FETCH l.leadStatus

    LEFT JOIN FETCH l.createdBy cb
    LEFT JOIN FETCH cb.person

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE la.employee.personId = :employeePersonId

      AND la.isActive = true

      AND l.isArchived = false

      AND (
            (
                l.leadStatus.statusName = 'NOT_INTERESTED'
                AND l.reEngagementDate IS NOT NULL
                AND f.actionResult = 'NOT_INTERESTED'
            )

            OR

            (
                l.leadStatus.statusName = 'RE_ENGAGEMENT'
                AND f.actionResult = 'RE_ENGAGEMENT'
            )
      )

      AND f.actionPerformedAt IS NOT NULL

      AND (
            :start IS NULL
            OR f.actionPerformedAt >= :start
      )

      AND (
            :end IS NULL
            OR f.actionPerformedAt < :end
      )

      AND (
            :keyword IS NULL
            OR :keyword = ''

            OR LOWER(
                CONCAT(
                    COALESCE(p.firstName, ''),
                    ' ',
                    COALESCE(p.middleName, ''),
                    ' ',
                    COALESCE(p.lastName, '')
                )
            ) LIKE LOWER(
                CONCAT('%', :keyword, '%')
            )

            OR LOWER(
                COALESCE(pc.contactValue, '')
            ) LIKE LOWER(
                CONCAT('%', :keyword, '%')
            )
      )

    ORDER BY l.reEngagementDate ASC
""")
    List<Lead> filterMyReEngagementLeads(

            @Param("employeePersonId")
            Long employeePersonId,

            @Param("keyword")
            String keyword,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );

    // =====================================================
// ANALYTICS - ACTION PERFORMED DATE
// =====================================================
//
// Status count is based on the follow-up action date,
// NOT the lead creation date.
//
// Example:
// Lead created       = 20 Aug
// NOT_INTERESTED     = 27 Aug
//
// Analytics 27 Aug  = NOT_INTERESTED count = 1
// =====================================================


// =====================================================
// COUNSELLOR - STATUS COUNT BY ACTION DATE
// =====================================================

    @Query("""
    SELECT COUNT(DISTINCT l.personId)
    FROM Lead l

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE l.isArchived = false

      AND f.actionResult = :actionResult

      AND f.actionPerformedAt IS NOT NULL

      AND f.actionPerformedAt >= :start
      AND f.actionPerformedAt < :end

      AND (
            l.createdBy.personId = :employeePersonId

            OR EXISTS (
                SELECT 1
                FROM LeadAssignment la
                WHERE la.lead = l
                  AND la.employee.personId = :employeePersonId
                  AND la.isActive = true
            )
      )
""")
    long countCounsellorActionByDate(
            @Param("employeePersonId")
            Long employeePersonId,

            @Param("actionResult")
            String actionResult,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );


// =====================================================
// ADMIN - STATUS COUNT BY ACTION DATE
// =====================================================

    @Query("""
    SELECT COUNT(DISTINCT l.personId)
    FROM Lead l

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE l.isArchived = false

      AND f.actionResult = :actionResult

      AND f.actionPerformedAt IS NOT NULL

      AND f.actionPerformedAt >= :start
      AND f.actionPerformedAt < :end
""")
    long countActionByDate(
            @Param("actionResult")
            String actionResult,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );

    // =====================================================
// ADMIN - ALL ACTION LEADS COUNT BY ACTION DATE
// =====================================================

    @Query("""
    SELECT COUNT(DISTINCT l.personId)
    FROM Lead l

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE l.isArchived = false

      AND f.actionPerformedAt IS NOT NULL

      AND f.actionPerformedAt >= :start
      AND f.actionPerformedAt < :end
""")
    long countAllActionLeadsByDate(
            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );

    // =====================================================
// COUNSELLOR - ALL ACTION LEADS COUNT BY ACTION DATE
// =====================================================

    @Query("""
    SELECT COUNT(DISTINCT l.personId)
    FROM Lead l

    JOIN LeadFollowup f
      ON f.lead = l

    WHERE l.isArchived = false

      AND f.actionPerformedAt IS NOT NULL

      AND f.actionPerformedAt >= :start
      AND f.actionPerformedAt < :end

      AND (
            l.createdBy.personId = :employeePersonId

            OR EXISTS (
                SELECT 1
                FROM LeadAssignment la
                WHERE la.lead = l
                  AND la.employee.personId = :employeePersonId
                  AND la.isActive = true
            )
      )
""")
    long countCounsellorAllActionLeadsByDate(
            @Param("employeePersonId")
            Long employeePersonId,

            @Param("start")
            LocalDateTime start,

            @Param("end")
            LocalDateTime end
    );
}