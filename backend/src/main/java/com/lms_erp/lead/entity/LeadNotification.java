package com.lms_erp.lead.entity;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.lead.enums.NotificationType;
import com.lms_erp.student.entity.StudentApplication;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadNotification {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;


    // =====================================================
    // EMPLOYEE / USER WHO RECEIVES NOTIFICATION
    // =====================================================


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "employee_person_id"
    )
    private Employee employee;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_person_id"
    )
    private StudentApplication student;



    // =====================================================
    // LEAD RELATED TO NOTIFICATION
    //
    // Lead ka PK = person_id
    // Isliye lead_person_id -> leads.person_id
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "lead_person_id"
    )
    private Lead lead;


    // =====================================================
    // TITLE
    // =====================================================

    @Column(
            name = "title",
            nullable = false,
            length = 255
    )
    private String title;


    // =====================================================
    // MESSAGE
    // =====================================================

    @Column(
            name = "message",
            columnDefinition = "TEXT"
    )
    private String message;


    // =====================================================
    // NOTIFICATION TYPE
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
            name = "notification_type",
            length = 50
    )
    private NotificationType notificationType;


    // =====================================================
    // READ STATUS
    // =====================================================

    @Builder.Default
    @Column(
            name = "is_read",
            nullable = false
    )
    private Boolean isRead = false;


    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(
            name = "created_at",
            insertable = false,
            updatable = false
    )
    private LocalDateTime createdAt;
}