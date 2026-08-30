package com.lms_erp.lead.scheduler;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.lead.entity.*;
import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.enums.NotificationType;
import com.lms_erp.lead.repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Component
@RequiredArgsConstructor
public class FollowupRetryScheduler {

    private final ReminderScheduleRepository reminderRepository;
    private final FollowupRepository followupRepository;
    private final LeadRepository leadRepository;
    private final LeadStatusMasterRepository leadStatusMasterRepository;
    private final NotificationRepository notificationRepository;

    // =====================================================
    // RUN EVERY 10 MINUTES
    // =====================================================
//
//    @Scheduled(fixedRate = 600000)

    @Scheduled(fixedRate = 1800000)
    public void processMissedFollowups() {

        System.out.println(
                "===== FOLLOWUP RETRY SCHEDULER RUNNING ====="
        );

        LocalDateTime now =
                LocalDateTime.now();


        // =================================================
        // 1. PROCESS CALLBACKS
        // =================================================

        processMissedCallbacks(now);


        // =================================================
        // 2. PROCESS NORMAL RETRIES
        // =================================================

        processNormalRetries(now);
    }


    // =====================================================
    // PROCESS MISSED CALLBACKS
    // =====================================================

    private void processMissedCallbacks(
            LocalDateTime now
    ) {

        List<LeadFollowup> callbacks =
                followupRepository
                        .findPendingCallbacksDue(
                                FollowupStatus.PENDING,
                                now
                        );


        System.out.println(
                "Due callbacks found : "
                        + callbacks.size()
        );


        for (LeadFollowup callback : callbacks) {

            try {

                processMissedCallback(
                        callback,
                        now
                );

            } catch (Exception e) {

                System.err.println(
                        "Error processing callback : "
                                + callback.getFollowupId()
                );

                e.printStackTrace();
            }
        }
    }

    // =====================================================
// PROCESS SINGLE MISSED CALLBACK
// =====================================================
    private void processMissedCallback(
            LeadFollowup callback,
            LocalDateTime now
    ) {

        if (callback == null) {
            return;
        }

        // =====================================================
        // SAFETY CHECK
        // =====================================================

        if (callback.getFollowupStatus()
                != FollowupStatus.PENDING) {
            return;
        }

        if (callback.getCallbackScheduledAt() == null) {
            return;
        }

        if (callback.getCallbackScheduledAt().isAfter(now)) {
            return;
        }


        // =====================================================
        // GET LEAD
        // =====================================================

        Lead lead = callback.getLead();

        if (lead == null) {
            System.out.println(
                    "Callback skipped: Lead is null | Followup = "
                            + callback.getFollowupId()
            );
            return;
        }


        // =====================================================
        // GET EMPLOYEE
        // =====================================================

        Employee employee = callback.getEmployee();

        if (employee == null) {
            System.out.println(
                    "Callback skipped: Employee is null | Followup = "
                            + callback.getFollowupId()
            );
            return;
        }


        System.out.println(
                "===== MISSED CALLBACK PROCESSING ====="
        );

        System.out.println(
                "Followup ID : "
                        + callback.getFollowupId()
        );

        System.out.println(
                "Lead ID : "
                        + lead.getPersonId()
        );

        System.out.println(
                "Callback Time : "
                        + callback.getCallbackScheduledAt()
        );

        System.out.println(
                "Current Time : "
                        + now
        );

        System.out.println(
                "Current Retry : "
                        + callback.getRetryCount()
        );


        // =====================================================
        // 1. CALLBACK DUE NOTIFICATION
        // =====================================================

        boolean dueNotificationExists =
                notificationRepository
                        .existsByFollowup_FollowupIdAndNotificationType(
                                callback.getFollowupId(),
                                NotificationType.CALLBACK_DUE
                        );


        if (!dueNotificationExists) {

            LeadNotification notification =
                    LeadNotification.builder()

                            .employee(employee)

                            .lead(lead)

                            .followup(callback)

                            .title(
                                    "Callback Due"
                            )

                            .message(
                                    "Callback is due now. Please contact the lead."
                            )

                            .notificationType(
                                    NotificationType.CALLBACK_DUE
                            )

                            .isRead(false)

                            .build();

            notificationRepository.save(notification);

            System.out.println(
                    "CALLBACK DUE NOTIFICATION CREATED | Followup = "
                            + callback.getFollowupId()
            );
        }


        // =====================================================
        // 2. CREATE AUTOMATIC RETRY FIRST
        //
        // IMPORTANT:
        // Retry creation is done BEFORE changing old callback.
        // =====================================================

        System.out.println(
                "Creating automatic retry..."
        );

        createAutomaticRetry(
                callback,
                lead
        );


        // =====================================================
        // 3. MARK OLD CALLBACK AS MISSED
        // =====================================================

        callback.setFollowupStatus(
                FollowupStatus.COMPLETED
        );

        callback.setActionResult(
                "NO_RESPONSE"
        );

        callback.setActionPerformedAt(
                now
        );

        callback.setCompletedAt(
                now
        );

        callback.setNextFollowupAt(
                null
        );

        followupRepository.save(callback);


        // =====================================================
        // 4. COMPLETE OLD CALLBACK REMINDERS
        // =====================================================

        List<ReminderSchedule> callbackReminders =
                reminderRepository
                        .findByFollowup_FollowupId(
                                callback.getFollowupId()
                        );


        for (ReminderSchedule reminder :
                callbackReminders) {

            reminder.setIsCompleted(true);

            reminder.setReminderStatus(
                    "COMPLETED"
            );

            reminder.setSentAt(now);

            reminderRepository.save(reminder);
        }


        // =====================================================
        // 5. UPDATE LEAD STATUS
        //
        // IMPORTANT:
        // NO_RESPONSE missing ho to retry rollback nahi hoga.
        // =====================================================

        if (lead.getLeadStatus() != null) {

            leadStatusMasterRepository
                    .findByStatusName("NO_RESPONSE")
                    .ifPresentOrElse(

                            lead::setLeadStatus,

                            () -> System.out.println(
                                    "WARNING: NO_RESPONSE status not found. "
                                            + "Retry already created. "
                                            + "Lead = "
                                            + lead.getPersonId()
                            )
                    );
        }


        // =====================================================
        // 6. SAVE LEAD
        // =====================================================

        leadRepository.save(lead);


        System.out.println(
                "================================================="
        );

        System.out.println(
                "CALLBACK MISSED -> AUTO RETRY CREATED"
        );

        System.out.println(
                "Lead       : "
                        + lead.getPersonId()
        );

        System.out.println(
                "Old Retry  : "
                        + callback.getRetryCount()
        );

        System.out.println(
                "================================================="
        );
    }

    // =====================================================
    // NORMAL RETRY PROCESSING
    // =====================================================

    private void processNormalRetries(
            LocalDateTime now
    ) {

        List<ReminderSchedule> reminders =
                reminderRepository
                        .findAllPendingReminders(
                                FollowupStatus.PENDING,
                                now
                        );
        System.out.println(
                "Normal missed reminders found : "
                        + reminders.size()
        );


        for (ReminderSchedule reminder :
                reminders) {

            try {

                processRetry(
                        reminder
                );

            } catch (Exception e) {

                System.err.println(
                        "Error processing reminder : "
                                + reminder.getReminderId()
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // PROCESS NORMAL MISSED FOLLOW-UP
    // =====================================================

    private void processRetry(
            ReminderSchedule reminder
    ) {

        LeadFollowup currentFollowup =
                reminder.getFollowup();


        if (currentFollowup == null) {
            return;
        }


        // =================================================
        // CALLBACK REMINDERS ARE HANDLED SEPARATELY
        // =================================================

        if ("CALLBACK_REQUESTED"
                .equalsIgnoreCase(
                        currentFollowup.getActionResult()
                )) {

            return;
        }


        Lead lead =
                currentFollowup.getLead();


        if (lead == null) {
            return;
        }


        // =================================================
        // ONLY PENDING FOLLOW-UPS
        // =================================================

        if (currentFollowup.getFollowupStatus()
                != FollowupStatus.PENDING) {

            return;
        }


        // =================================================
        // CHECK LEAD STATUS
        // =================================================

        String status =
                lead.getLeadStatus() != null
                        ? lead.getLeadStatus()
                        .getStatusName()
                        : "";


        // =================================================
        // STOP RETRY FOR CLOSED LEADS
        // =================================================

        if (
                "INTERESTED".equalsIgnoreCase(status)
                        || "CONVERTED".equalsIgnoreCase(status)
                        || "NOT_INTERESTED".equalsIgnoreCase(status)
                        || "CLOSED".equalsIgnoreCase(status)
        ) {

            System.out.println(
                    "Retry stopped for Lead "
                            + lead.getPersonId()
                            + " | Status = "
                            + status
            );

            return;
        }


        // =================================================
        // CREATE AUTOMATIC RETRY
        // =================================================

        createAutomaticRetry(
                currentFollowup,
                lead
        );
    }


    // =====================================================
    // CREATE AUTOMATIC RETRY
    // =====================================================

    private void createAutomaticRetry(
            LeadFollowup currentFollowup,
            Lead lead
    ) {

        int retryCount =
                currentFollowup.getRetryCount() == null
                        ? 0
                        : currentFollowup.getRetryCount();


        // =================================================
        // NEXT RETRY TIME
        // =================================================

        LocalDateTime nextReminder =
                calculateNextReminder(
                        retryCount
                );


        // =================================================
        // MAX RETRY REACHED
        // =================================================

        if (nextReminder == null) {

            lead.setIsArchived(true);

            lead.setNextFollowupDate(null);

            leadRepository.save(
                    lead
            );


            System.out.println(
                    "Maximum retries reached. "
                            + "Lead archived : "
                            + lead.getPersonId()
            );

            return;
        }


        // =================================================
        // DUPLICATE PROTECTION
        // =================================================

        boolean alreadyExists =
                followupRepository
                        .existsByLead_PersonIdAndScheduledAt(
                                lead.getPersonId(),
                                nextReminder
                        );


        if (alreadyExists) {

            System.out.println(
                    "Retry already exists for Lead : "
                            + lead.getPersonId()
            );

            return;
        }


        // =================================================
        // CREATE RETRY FOLLOW-UP
        // =================================================

        LeadFollowup retryFollowup =
                LeadFollowup.builder()

                        .lead(
                                lead
                        )

                        .employee(
                                currentFollowup.getEmployee()
                        )

                        .followupType(
                                currentFollowup
                                        .getFollowupType()
                        )

                        .followupStatus(
                                FollowupStatus.PENDING
                        )

                        .actionResult(
                                "NO_RESPONSE"
                        )

                        .remarks(
                                "AUTO RETRY"
                        )

                        .scheduledAt(
                                nextReminder
                        )

                        .actionPerformedAt(
                                null
                        )

                        .completedAt(
                                null
                        )

                        .callbackScheduledAt(
                                null
                        )

                        .nextFollowupAt(
                                nextReminder
                        )

                        .retryCount(
                                retryCount + 1
                        )

                        .build();


        LeadFollowup savedRetry =
                followupRepository.save(
                        retryFollowup
                );


        // =================================================
        // CREATE REMINDER
        // =================================================

        ReminderSchedule newReminder =
                ReminderSchedule.builder()

                        .followup(
                                savedRetry
                        )

                        .reminderTime(
                                nextReminder
                        )

                        .reminderType(
                                "AUTO_RETRY"
                        )

                        .reminderStatus(
                                "PENDING"
                        )

                        .isCompleted(
                                false
                        )

                        .notificationSent(
                                false
                        )

                        .adminEscalationSent(
                                false
                        )

                        .build();


        reminderRepository.save(
                newReminder
        );


        // =================================================
        // UPDATE LEAD
        // =================================================

        lead.setNextFollowupDate(
                nextReminder
        );


        leadRepository.save(
                lead
        );


        System.out.println(
                "AUTO RETRY CREATED | Lead = "
                        + lead.getPersonId()
                        + " | Retry = "
                        + (retryCount + 1)
                        + " | Next = "
                        + nextReminder
        );
    }


    // =====================================================
    // RETRY PATTERN
    // =====================================================

    private LocalDateTime calculateNextReminder(
            int retryCount
    ) {

        LocalDateTime now =
                LocalDateTime.now();


        return switch (retryCount) {

            // =============================================
            // FIRST RETRY
            // =============================================

            case 0 ->
                    now.plusHours(1);


            // =============================================
            // SECOND RETRY
            // =============================================

            case 1 ->
                    now.plusHours(4);


            // =============================================
            // THIRD RETRY
            // =============================================

            case 2 ->
                    now.plusHours(8);


            // =============================================
            // FOURTH RETRY
            // =============================================

            case 3 ->
                    now.plusHours(16);


            // =============================================
            // FIFTH RETRY
            // =============================================

            case 4 ->
                    now.plusHours(24);


            // =============================================
            // SIXTH RETRY
            // =============================================

            case 5 ->
                    now.plusHours(36);


            // =============================================
            // SEVENTH RETRY
            // =============================================

            case 6 ->
                    now.plusHours(48);


            // =============================================
            // EIGHTH RETRY
            // =============================================

            case 7 ->
                    now.plusHours(56);


            // =============================================
            // NINTH RETRY
            // =============================================

            case 8 ->
                    now.plusWeeks(1);


            // =============================================
            // TENTH RETRY
            // =============================================

            case 9 ->
                    now.plusWeeks(2);


            // =============================================
            // RETRY CHAIN FINISHED
            // =============================================

            default ->
                    null;
        };
    }
}