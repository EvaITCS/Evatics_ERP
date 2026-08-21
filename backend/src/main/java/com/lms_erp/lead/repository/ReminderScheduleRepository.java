package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.ReminderSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderScheduleRepository
        extends JpaRepository<ReminderSchedule, Long> {

    // =====================================================
    // ALL INCOMPLETE REMINDERS
    // =====================================================

    List<ReminderSchedule> findByIsCompletedFalse();


    // =====================================================
    // TODAY - ADMIN
    //
    // Today only:
    // 00:00 <= reminderTime < tomorrow 00:00
    //
    // IMPORTANT:
    // Even if today's reminder time has passed,
    // it remains in TODAY.
    // Frontend will show "Overdue".
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        LEFT JOIN FETCH f.employee e
        LEFT JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE r.isCompleted = false
          AND r.reminderTime >= :start
          AND r.reminderTime < :end

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findTodayReminders(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    // =====================================================
    // TODAY - COUNSELLOR
    //
    // Only current counsellor's reminders.
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        JOIN FETCH f.employee e
        JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE e.personId = :employeePersonId
          AND r.isCompleted = false
          AND r.reminderTime >= :start
          AND r.reminderTime < :end

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findTodayRemindersForEmployee(
            @Param("employeePersonId") Long employeePersonId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );


    // =====================================================
    // PENDING - ADMIN
    //
    // ONLY TOMORROW ONWARDS
    //
    // Example:
    //
    // Today 10 Aug
    //
    // 10 Aug 10:00 -> TODAY / OVERDUE
    // 10 Aug 15:00 -> TODAY
    // 11 Aug 10:00 -> PENDING
    // 12 Aug 10:00 -> PENDING
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        LEFT JOIN FETCH f.employee e
        LEFT JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE r.isCompleted = false
          AND r.reminderTime >= :from

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findPendingReminders(
            @Param("from") LocalDateTime from
    );


    // =====================================================
    // PENDING - COUNSELLOR
    //
    // ONLY TOMORROW ONWARDS
    // AND ONLY CURRENT COUNSELLOR
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        JOIN FETCH f.employee e
        JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE e.personId = :employeePersonId
          AND r.isCompleted = false
          AND r.reminderTime >= :from

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findPendingRemindersForEmployee(
            @Param("employeePersonId") Long employeePersonId,
            @Param("from") LocalDateTime from
    );


    // =====================================================
    // OVERDUE - ADMIN
    //
    // Reminder time has passed
    // AND reminder is still incomplete.
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        LEFT JOIN FETCH f.employee e
        LEFT JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE r.isCompleted = false
          AND r.reminderTime < :now

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findOverdueReminders(
            @Param("now") LocalDateTime now
    );


    // =====================================================
    // OVERDUE - COUNSELLOR
    //
    // Only current counsellor.
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        JOIN FETCH f.employee e
        JOIN FETCH e.person

     LEFT JOIN FETCH l.leadStatus

        WHERE e.personId = :employeePersonId
          AND r.isCompleted = false
          AND r.reminderTime < :now

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findOverdueRemindersForEmployee(
            @Param("employeePersonId") Long employeePersonId,
            @Param("now") LocalDateTime now
    );


    // =====================================================
    // LEAD REMINDERS
    // =====================================================

//    @Query("""
//        SELECT DISTINCT r
//        FROM ReminderSchedule r
//
//        JOIN FETCH r.followup f
//        JOIN FETCH f.lead l
//        JOIN FETCH l.person p
//
//        LEFT JOIN FETCH p.contacts pc
//        LEFT JOIN FETCH pc.contactType
//
//        LEFT JOIN FETCH f.employee e
//        LEFT JOIN FETCH e.person
//
//        LEFT JOIN FETCH l.leadStatus
//
//        WHERE l.personId = :personId
//
//        ORDER BY r.reminderTime DESC
//    """)
//    List<ReminderSchedule> findLeadRemindersWithDetails(
//            @Param("personId") Long personId
//    );


    // =====================================================
    // ALL REMINDERS OF LEAD
    // =====================================================

    List<ReminderSchedule> findByFollowup_Lead_PersonId(
            Long personId
    );


    // =====================================================
    // EMPLOYEE REMINDERS
    // =====================================================

    List<ReminderSchedule> findByFollowup_Employee_PersonId(
            Long employeePersonId
    );


    // =====================================================
    // PENDING NOTIFICATION REMINDERS
    //
    // Scheduler:
    // reminder time reached/passed
    // notification not sent
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        LEFT JOIN FETCH f.employee e
        LEFT JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE r.isCompleted = false
          AND r.notificationSent = false
          AND r.reminderTime <= :now

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findPendingNotificationReminders(
            @Param("now") LocalDateTime now
    );


    // =====================================================
    // ALL PENDING FOR RETRY SCHEDULER
    //
    // Used by FollowupRetryScheduler.
    //
    // IMPORTANT:
    // This is NOT the Pending Followups page query.
    //
    // Scheduler needs reminders whose time has arrived.
    // =====================================================

    @Query("""
        SELECT DISTINCT r
        FROM ReminderSchedule r

        JOIN FETCH r.followup f
        JOIN FETCH f.lead l
        JOIN FETCH l.person p

        LEFT JOIN FETCH p.contacts pc
        LEFT JOIN FETCH pc.contactType

        LEFT JOIN FETCH f.employee e
        LEFT JOIN FETCH e.person

        LEFT JOIN FETCH l.leadStatus

        WHERE r.isCompleted = false
          AND r.reminderTime <= :now

        ORDER BY r.reminderTime ASC
    """)
    List<ReminderSchedule> findAllPendingReminders(
            @Param("now") LocalDateTime now
    );

    @Query("""
    SELECT DISTINCT r
    FROM ReminderSchedule r

    JOIN FETCH r.followup f
    JOIN FETCH f.lead l
    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH f.employee e
    LEFT JOIN FETCH e.person

    LEFT JOIN FETCH l.leadStatus

    WHERE l.personId = :personId
      AND r.isCompleted = false

    ORDER BY r.reminderTime DESC
""")
    List<ReminderSchedule> findLeadRemindersWithDetails(
            @Param("personId") Long personId
    );
// =====================================================
// EMPLOYEE - ALL INCOMPLETE REMINDERS
// =====================================================

    List<ReminderSchedule>
    findByFollowup_Employee_PersonIdAndIsCompletedFalse(
            Long employeePersonId
    );


    @Query("""
    SELECT DISTINCT r
    FROM ReminderSchedule r

    JOIN FETCH r.followup f
    JOIN FETCH f.lead l
    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    LEFT JOIN FETCH f.employee e
    LEFT JOIN FETCH e.person

    LEFT JOIN FETCH l.leadStatus

    WHERE r.isCompleted = false
      AND (
            r.reminderTime < :todayStart
            OR r.reminderTime >= :tomorrowStart
          )

    ORDER BY r.reminderTime ASC
""")
    List<ReminderSchedule> findPendingReminders(
            @Param("todayStart") LocalDateTime todayStart,
            @Param("tomorrowStart") LocalDateTime tomorrowStart
    );


    @Query("""
    SELECT DISTINCT r
    FROM ReminderSchedule r

    JOIN FETCH r.followup f
    JOIN FETCH f.lead l
    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    JOIN FETCH f.employee e
    JOIN FETCH e.person

    LEFT JOIN FETCH l.leadStatus

    WHERE e.personId = :employeePersonId
      AND r.isCompleted = false
      AND (
            r.reminderTime < :todayStart
            OR r.reminderTime >= :tomorrowStart
          )

    ORDER BY r.reminderTime ASC
""")
    List<ReminderSchedule> findPendingRemindersForEmployee(
            @Param("employeePersonId") Long employeePersonId,
            @Param("todayStart") LocalDateTime todayStart,
            @Param("tomorrowStart") LocalDateTime tomorrowStart
    );


    // =====================================================
// ADMIN 48-HOUR ESCALATION
//
// Reminder 48+ hours overdue
// AND incomplete
// AND admin notification not already sent
// =====================================================

    @Query("""
    SELECT DISTINCT r
    FROM ReminderSchedule r

    JOIN FETCH r.followup f
    JOIN FETCH f.lead l
    JOIN FETCH l.person p

    LEFT JOIN FETCH p.contacts pc
    LEFT JOIN FETCH pc.contactType

    JOIN FETCH f.employee e
    JOIN FETCH e.person

    LEFT JOIN FETCH l.leadStatus

    WHERE r.isCompleted = false
      AND r.adminEscalationSent = false
      AND r.reminderTime <= :cutoff

    ORDER BY r.reminderTime ASC
""")
    List<ReminderSchedule> findRemindersForAdminEscalation(
            @Param("cutoff") LocalDateTime cutoff
    );

// =====================================================
// ALL INCOMPLETE REMINDERS OF A LEAD
//
// Used by ADMIN 48-HOUR ACTIONS.
//
// One lead can have multiple reminders because of
// automatic retry.
// =====================================================
    // =====================================================
    // FIND REMINDERS OF A FOLLOW-UP
    // =====================================================

    List<ReminderSchedule> findByFollowup_FollowupId(
            Long followupId
    );


    // =====================================================
    // FIND ACTIVE / INCOMPLETE REMINDERS
    // =====================================================

    List<ReminderSchedule>
    findByFollowup_Lead_PersonIdAndIsCompletedFalse(
            Long personId
    );
    @Query("""
    SELECT DISTINCT r
    FROM ReminderSchedule r
    JOIN FETCH r.followup f
    JOIN FETCH f.lead l
    WHERE l.personId = :personId
      AND r.isCompleted = false
""")
    List<ReminderSchedule> findIncompleteRemindersByLead(
            @Param("personId") Long personId
    );
}