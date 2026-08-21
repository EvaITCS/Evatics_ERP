package com.lms_erp.lead.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminder_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReminderSchedule {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminder_id")
    private Long reminderId;


    // =====================================================
    // FOLLOW-UP
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "followup_id",
            nullable = false
    )
    private LeadFollowup followup;


    // =====================================================
    // REMINDER DETAILS
    // =====================================================

    @Column(
            name = "reminder_time",
            nullable = false
    )
    private LocalDateTime reminderTime;


    @Column(
            name = "reminder_type",
            nullable = false
    )
    private String reminderType;


    @Builder.Default
    @Column(
            name = "reminder_status",
            nullable = false
    )
    private String reminderStatus = "PENDING";


    @Column(name = "sent_at")
    private LocalDateTime sentAt;


    @Builder.Default
    @Column(
            name = "is_completed",
            nullable = false
    )
    private Boolean isCompleted = false;


    // =====================================================
    // NOTIFICATION
    // =====================================================

    @Builder.Default
    @Column(
            name = "notification_sent",
            nullable = false
    )
    private Boolean notificationSent = false;


    // =====================================================
    // AUDIT
    // =====================================================

    @Column(
            name = "created_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    // =====================================================
    // ADMIN 48-HOUR ESCALATION
    // =====================================================

    @Builder.Default
    @Column(
            name = "admin_escalation_sent",
            nullable = false
    )
    private Boolean adminEscalationSent = false;
}