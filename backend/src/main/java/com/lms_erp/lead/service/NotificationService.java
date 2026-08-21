package com.lms_erp.lead.service;

import com.lms_erp.lead.dto.NotificationPageResponse;
import com.lms_erp.lead.dto.NotificationResponse;
import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.repository.NotificationRepository;
import com.lms_erp.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;
    private final ReminderService reminderService;


    // =====================================================
    // GET MY NOTIFICATIONS
    // =====================================================

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications() {

        Long personId =
                currentUserService.getCurrentPersonId();


        // STUDENT
        if (currentUserService.hasRole("STUDENT")) {

            return notificationRepository
                    .findByStudent_PersonIdOrderByCreatedAtDesc(
                            personId
                    )
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }


        // EMPLOYEE / ADMIN / COUNSELLOR
        return notificationRepository
                .findByEmployee_PersonIdOrderByCreatedAtDesc(
                        personId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // UNREAD
    // =====================================================

    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications() {

        Long personId =
                currentUserService.getCurrentPersonId();


        // STUDENT
        if (currentUserService.hasRole("STUDENT")) {

            return notificationRepository
                    .findByStudent_PersonIdAndIsReadFalseOrderByCreatedAtDesc(
                            personId
                    )
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }


        // EMPLOYEE
        return notificationRepository
                .findByEmployee_PersonIdAndIsReadFalseOrderByCreatedAtDesc(
                        personId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // NOTIFICATION PAGE
    // =====================================================

    @Transactional(readOnly = true)
    public NotificationPageResponse getNotificationPage() {

        // Student ke liye reminders applicable nahi hain
        if (currentUserService.hasRole("STUDENT")) {

            return NotificationPageResponse.builder()
                    .today(Collections.emptyList())
                    .pending(Collections.emptyList())
                    .notifications(getUserNotifications())
                    .build();
        }


        // Existing employee/admin reminder functionality
        NotificationPageResponse page =
                reminderService.getNotificationPage();

        page.setNotifications(
                getUserNotifications()
        );

        return page;
    }


    // =====================================================
    // MARK AS READ
    // =====================================================

    public void markAsRead(Long notificationId) {

        LeadNotification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );


        Long currentPersonId =
                currentUserService.getCurrentPersonId();


        boolean isStudent =
                currentUserService.hasRole("STUDENT");


        // -----------------------------------------------
        // STUDENT
        // -----------------------------------------------

        if (isStudent) {

            if (notification.getStudent() == null ||
                    !notification
                            .getStudent()
                            .getPersonId()
                            .equals(currentPersonId)) {

                throw new RuntimeException(
                        "You are not authorized to update this notification."
                );
            }

        }

        // -----------------------------------------------
        // EMPLOYEE
        // -----------------------------------------------

        else {

            if (notification.getEmployee() == null ||
                    !notification
                            .getEmployee()
                            .getPersonId()
                            .equals(currentPersonId)) {

                throw new RuntimeException(
                        "You are not authorized to update this notification."
                );
            }
        }


        notification.setIsRead(true);

        notificationRepository.save(notification);
    }


    // =====================================================
    // UNREAD COUNT
    // =====================================================

    @Transactional(readOnly = true)
    public Long getUnreadCount() {

        Long personId =
                currentUserService.getCurrentPersonId();


        if (currentUserService.hasRole("STUDENT")) {

            return notificationRepository
                    .countByStudent_PersonIdAndIsReadFalse(
                            personId
                    );
        }


        return notificationRepository
                .countByEmployee_PersonIdAndIsReadFalse(
                        personId
                );
    }


    // =====================================================
    // MAP DTO
    // =====================================================

    private NotificationResponse mapToResponse(
            LeadNotification notification
    ) {

        return NotificationResponse
                .builder()

                .notificationId(
                        notification.getNotificationId()
                )

                .title(
                        notification.getTitle()
                )

                .message(
                        notification.getMessage()
                )

                .notificationType(
                        notification.getNotificationType()
                )

                .isRead(
                        notification.getIsRead()
                )

                .createdAt(
                        notification.getCreatedAt()
                )

                .leadPersonId(
                        notification.getLead() != null
                                ? notification
                                .getLead()
                                .getPersonId()
                                : null
                )

                .studentPersonId(
                        notification.getStudent() != null
                                ? notification
                                .getStudent()
                                .getPersonId()
                                : null
                )

                .build();
    }
}