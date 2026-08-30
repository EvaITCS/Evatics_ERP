package com.lms_erp.lead.repository;

import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<LeadNotification, Long> {

    // =====================================================
    // EMPLOYEE NOTIFICATIONS
    // =====================================================

    List<LeadNotification>
    findByEmployee_PersonIdOrderByCreatedAtDesc(
            Long employeePersonId
    );


    // =====================================================
    // UNREAD NOTIFICATIONS
    // =====================================================

    List<LeadNotification>
    findByEmployee_PersonIdAndIsReadFalseOrderByCreatedAtDesc(
            Long employeePersonId
    );

    // =====================================================
    // UNREAD NOTIFICATION COUNT
    // =====================================================

    long countByEmployee_PersonIdAndIsReadFalse(
            Long employeePersonId
    );


    // =====================================================
    // STUDENT NOTIFICATIONS
    // =====================================================

    List<LeadNotification>
    findByStudent_PersonIdOrderByCreatedAtDesc(
            Long studentPersonId
    );


    // =====================================================
    // STUDENT UNREAD
    // =====================================================

    List<LeadNotification>
    findByStudent_PersonIdAndIsReadFalseOrderByCreatedAtDesc(
            Long studentPersonId
    );


    // =====================================================
    // STUDENT UNREAD COUNT
    // =====================================================

    long countByStudent_PersonIdAndIsReadFalse(
            Long studentPersonId
    );


    // =====================================================
    // FIND UNREAD 48-HOUR ESCALATION
    // FOR SPECIFIC LEAD
    // =====================================================

    List<LeadNotification>
    findByLead_PersonIdAndNotificationTypeAndIsReadFalse(
            Long personId,
            NotificationType notificationType
    );


    // =====================================================
    // CHECK CALLBACK NOTIFICATION
    // FOR SPECIFIC FOLLOW-UP
    //
    // Prevents duplicate notification for the
    // same callback follow-up.
    // =====================================================

    boolean existsByFollowup_FollowupIdAndNotificationType(
            Long followupId,
            NotificationType notificationType
    );
}