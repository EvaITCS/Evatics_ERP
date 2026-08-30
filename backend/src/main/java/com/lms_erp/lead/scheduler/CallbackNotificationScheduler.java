package com.lms_erp.lead.scheduler;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.enums.NotificationType;
import com.lms_erp.lead.repository.FollowupRepository;
import com.lms_erp.lead.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CallbackNotificationScheduler {

    private final FollowupRepository followupRepository;

    private final NotificationRepository notificationRepository;


    // =====================================================
    // RUN EVERY 1 MINUTE
    // =====================================================

    @Scheduled(fixedRate = 1800000)
    @Transactional
    public void processCallbackNotifications() {

        LocalDateTime now =
                LocalDateTime.now();

        System.out.println(
                "===== CALLBACK NOTIFICATION SCHEDULER ====="
        );

        System.out.println(
                "Current time : " + now
        );


        // =================================================
        // 1. FIVE MINUTE REMINDERS
        // =================================================

        processFiveMinuteReminders(now);


        // =================================================
        // 2. CALLBACK DUE
        // =================================================

        processCallbackDue(now);
    }


    // =====================================================
    // FIVE MINUTE CALLBACK REMINDER
    // =====================================================

    private void processFiveMinuteReminders(
            LocalDateTime now
    ) {

        /*
         * We check callbacks whose scheduled time is
         * between 4 and 5 minutes from now.
         *
         * Example:
         *
         * Callback = 5:30
         *
         * Scheduler:
         * 5:25 -> notification
         *
         * Small window prevents missing notification
         * because scheduler runs every minute.
         */

        LocalDateTime from =
                now.plusMinutes(4);

        LocalDateTime to =
                now.plusMinutes(5);


        List<LeadFollowup> callbacks =
                followupRepository
                        .findCallbacksBetween(
                                FollowupStatus.PENDING,
                                from,
                                to
                        );


        System.out.println(
                "Callbacks within 5 minutes : "
                        + callbacks.size()
        );


        for (LeadFollowup followup : callbacks) {

            try {

                createCallbackReminder(
                        followup
                );

            } catch (Exception e) {

                System.err.println(
                        "Error creating 5-minute callback notification. "
                                + "Followup ID = "
                                + followup.getFollowupId()
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // CALLBACK DUE
    // =====================================================

    private void processCallbackDue(
            LocalDateTime now
    ) {

        List<LeadFollowup> callbacks =
                followupRepository
                        .findPendingCallbacksDue(
                                FollowupStatus.PENDING,
                                now
                        );


        System.out.println(
                "Callbacks due : "
                        + callbacks.size()
        );


        for (LeadFollowup followup : callbacks) {

            try {

                createCallbackDueNotification(
                        followup
                );

            } catch (Exception e) {

                System.err.println(
                        "Error creating callback due notification. "
                                + "Followup ID = "
                                + followup.getFollowupId()
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // CREATE 5-MINUTE REMINDER
    // =====================================================

    private void createCallbackReminder(
            LeadFollowup followup
    ) {

        if (followup == null) {
            return;
        }


        if (followup.getFollowupStatus()
                != FollowupStatus.PENDING) {

            return;
        }


        if (followup.getCallbackScheduledAt() == null) {
            return;
        }


        Employee employee =
                followup.getEmployee();


        Lead lead =
                followup.getLead();


        if (employee == null || lead == null) {
            return;
        }


        // =================================================
        // DUPLICATE PROTECTION
        // =================================================

        boolean alreadyExists =
                notificationRepository
                        .existsByFollowup_FollowupIdAndNotificationType(
                                followup.getFollowupId(),
                                NotificationType.CALLBACK_REMINDER
                        );


        if (alreadyExists) {

            System.out.println(
                    "5-minute callback notification already exists "
                            + "| Followup = "
                            + followup.getFollowupId()
            );

            return;
        }


        // =================================================
        // CREATE NOTIFICATION
        // =================================================

        LeadNotification notification =
                LeadNotification.builder()

                        .employee(
                                employee
                        )

                        .lead(
                                lead
                        )

                        .followup(
                                followup
                        )

                        .title(
                                "Callback Reminder"
                        )

                        .message(
                                "Callback scheduled in 5 minutes for Lead."
                        )

                        .notificationType(
                                NotificationType.CALLBACK_REMINDER
                        )

                        .isRead(
                                false
                        )

                        .build();


        notificationRepository.save(
                notification
        );


        System.out.println(
                "CALLBACK REMINDER CREATED | "
                        + "Followup = "
                        + followup.getFollowupId()
                        + " | Lead = "
                        + lead.getPersonId()
        );
    }


    // =====================================================
    // CREATE CALLBACK DUE NOTIFICATION
    // =====================================================

    private void createCallbackDueNotification(
            LeadFollowup followup
    ) {

        if (followup == null) {
            return;
        }


        if (followup.getFollowupStatus()
                != FollowupStatus.PENDING) {

            return;
        }


        if (followup.getCallbackScheduledAt() == null) {
            return;
        }


        Employee employee =
                followup.getEmployee();


        Lead lead =
                followup.getLead();


        if (employee == null || lead == null) {
            return;
        }


        // =================================================
        // DUPLICATE PROTECTION
        // =================================================

        boolean alreadyExists =
                notificationRepository
                        .existsByFollowup_FollowupIdAndNotificationType(
                                followup.getFollowupId(),
                                NotificationType.CALLBACK_DUE
                        );


        if (alreadyExists) {

            System.out.println(
                    "Callback due notification already exists "
                            + "| Followup = "
                            + followup.getFollowupId()
            );

            return;
        }


        // =================================================
        // CREATE NOTIFICATION
        // =================================================

        LeadNotification notification =
                LeadNotification.builder()

                        .employee(
                                employee
                        )

                        .lead(
                                lead
                        )

                        .followup(
                                followup
                        )

                        .title(
                                "Callback Due"
                        )

                        .message(
                                "Callback is due now. Please contact the lead."
                        )

                        .notificationType(
                                NotificationType.CALLBACK_DUE
                        )

                        .isRead(
                                false
                        )

                        .build();


        notificationRepository.save(
                notification
        );


        System.out.println(
                "CALLBACK DUE NOTIFICATION CREATED | "
                        + "Followup = "
                        + followup.getFollowupId()
                        + " | Lead = "
                        + lead.getPersonId()
        );
    }
}