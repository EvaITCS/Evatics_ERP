
        package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.enums.FollowupStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

        @Repository
public interface FollowupRepository
        extends JpaRepository<LeadFollowup, Long> {

    // =====================================================
    // DUPLICATE RE-ENGAGEMENT FOLLOW-UP CHECK
    // =====================================================

    boolean existsByLead_PersonIdAndFollowupStatusAndRemarks(
            Long personId,
            FollowupStatus followupStatus,
            String remarks
    );


    // =====================================================
    // EXISTING SCHEDULE CHECK
    // =====================================================

    boolean existsByLead_PersonIdAndScheduledAt(
            Long personId,
            LocalDateTime scheduledAt
    );


    // =====================================================
    // EMPLOYEE FOLLOWUPS
    // =====================================================

    @Query("""
        SELECT DISTINCT f
        FROM LeadFollowup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p
        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType
        LEFT JOIN FETCH l.leadStatus
        JOIN FETCH f.employee e
        JOIN FETCH e.person
        WHERE e.personId = :employeePersonId
        ORDER BY f.scheduledAt DESC
    """)
    List<LeadFollowup> findEmployeeFollowups(
            @Param("employeePersonId")
            Long employeePersonId
    );


    // =====================================================
    // PENDING FOLLOWUPS OF EMPLOYEE
    // =====================================================

    @Query("""
        SELECT DISTINCT f
        FROM LeadFollowup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person
        JOIN FETCH f.employee e
        WHERE e.personId = :employeePersonId
          AND f.followupStatus = :status
          AND f.scheduledAt <= :time
        ORDER BY f.scheduledAt ASC
    """)
    List<LeadFollowup> findPendingFollowups(
            @Param("employeePersonId")
            Long employeePersonId,

            @Param("status")
            FollowupStatus status,

            @Param("time")
            LocalDateTime time
    );


    // =====================================================
    // FOLLOWUP HISTORY OF A LEAD
    // =====================================================

    @Query("""
        SELECT DISTINCT f
        FROM LeadFollowup f
        LEFT JOIN FETCH f.lead l
        LEFT JOIN FETCH l.person p
        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType
        LEFT JOIN FETCH l.leadStatus
        LEFT JOIN FETCH f.employee e
        LEFT JOIN FETCH e.person
        WHERE l.personId = :personId
        ORDER BY f.scheduledAt DESC
    """)
    List<LeadFollowup> findLeadFollowups(
            @Param("personId")
            Long personId
    );



// =====================================================
// GET LATEST FOLLOW-UP OF A LEAD
// =====================================================

    Optional<LeadFollowup>
    findTopByLead_PersonIdOrderByCreatedAtDesc(
            Long personId
    );

            // =====================================================
// LAST PENDING FOLLOW-UP FOR RETRY CHAIN
// =====================================================

            Optional<LeadFollowup>
            findTopByLead_PersonIdAndFollowupStatusOrderByCreatedAtDesc(
                    Long personId,
                    FollowupStatus followupStatus
            );


            // =====================================================
// FOLLOW-UPS IGNORED FOR 48+ HOURS
//
// IMPORTANT:
// 48 hours follow-up ke scheduledAt .
//
// Lead creation date se nahi.
//
// Only:
// - PENDING follow-up
// - scheduledAt 48 hours
//
// Completed follow-ups automatically exclude ho jayenge.
// =====================================================

            @Query("""
    SELECT DISTINCT f
    FROM LeadFollowup f
    JOIN FETCH f.lead l
    JOIN FETCH l.person p
    JOIN FETCH f.employee e
    JOIN FETCH e.person ep
    LEFT JOIN FETCH l.leadStatus
    WHERE f.followupStatus = :status
      AND f.scheduledAt <= :cutoffTime
    ORDER BY f.scheduledAt ASC
""")
            List<LeadFollowup> findFollowupsIgnoredFor48Hours(
                    @Param("status")
                    FollowupStatus status,

                    @Param("cutoffTime")
                    LocalDateTime cutoffTime
            );

            @Query("""
    SELECT DISTINCT f
    FROM LeadFollowup f
    JOIN FETCH f.lead l
    JOIN FETCH f.employee e
    WHERE f.followupStatus = :status
      AND f.actionResult = 'CALLBACK_REQUESTED'
      AND f.callbackScheduledAt IS NOT NULL
      AND f.callbackScheduledAt <= :now
    ORDER BY f.callbackScheduledAt ASC
""")
            List<LeadFollowup> findPendingCallbacksDue(
                    @Param("status") FollowupStatus status,
                    @Param("now") LocalDateTime now
            );


            // =====================================================
// CALLBACKS WITHIN 5-MINUTE WINDOW
// =====================================================

            @Query("""
    SELECT DISTINCT f
    FROM LeadFollowup f
    JOIN FETCH f.lead l
    JOIN FETCH f.employee e
    WHERE f.followupStatus = :status
      AND f.actionResult = 'CALLBACK_REQUESTED'
      AND f.callbackScheduledAt IS NOT NULL
      AND f.callbackScheduledAt > :from
      AND f.callbackScheduledAt <= :to
    ORDER BY f.callbackScheduledAt ASC
""")
            List<LeadFollowup> findCallbacksBetween(
                    @Param("status") FollowupStatus status,
                    @Param("from") LocalDateTime from,
                    @Param("to") LocalDateTime to
            );
        }


