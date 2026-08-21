package com.lms_erp.lead.scheduler;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.entity.ReminderSchedule;
import com.lms_erp.lead.enums.NotificationType;
import com.lms_erp.lead.repository.LeadActivityRepository;
import com.lms_erp.lead.repository.NotificationRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Transactional
@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final ReminderScheduleRepository reminderRepository;

    private final NotificationRepository notificationRepository;

    private final LeadActivityRepository leadActivityRepository;

    private final EmployeeRepository employeeRepository;


    // =====================================================
    // NORMAL FOLLOW-UP NOTIFICATION
    //
    // Runs every 10 seconds.
    //
    // When reminder time arrives:
    //
    // 1. Reminder must not be completed
    // 2. Notification must not already be sent
    //
    // Then counsellor receives notification.
    // =====================================================

    @Scheduled(fixedRate = 1800000)
    public void processPendingReminders() {

        System.out.println(
                "===== REMINDER SCHEDULER RUNNING ====="
        );

        List<ReminderSchedule> reminders =
                reminderRepository
                        .findPendingNotificationReminders(
                                LocalDateTime.now()
                        );

        System.out.println(
                "Pending reminders found : "
                        + reminders.size()
        );

        for (ReminderSchedule reminder : reminders) {

            try {

                if (reminder == null) {
                    continue;
                }


                // =========================================
                // COMPLETED REMINDER
                // =========================================

                if (Boolean.TRUE.equals(
                        reminder.getIsCompleted()
                )) {

                    continue;
                }


                // =========================================
                // ALREADY NOTIFIED
                // =========================================

                if (Boolean.TRUE.equals(
                        reminder.getNotificationSent()
                )) {

                    continue;
                }


                // =========================================
                // FOLLOW-UP VALIDATION
                // =========================================

                if (reminder.getFollowup() == null) {
                    continue;
                }


                if (reminder
                        .getFollowup()
                        .getLead() == null) {

                    continue;
                }


                System.out.println(
                        "Creating notification for Reminder : "
                                + reminder.getReminderId()
                );


                // =========================================
                // CREATE COUNSELLOR NOTIFICATION
                // =========================================

                LeadNotification notification =
                        new LeadNotification();


                notification.setEmployee(
                        reminder
                                .getFollowup()
                                .getEmployee()
                );


                notification.setLead(
                        reminder
                                .getFollowup()
                                .getLead()
                );


                notification.setTitle(
                        "Follow-Up Reminder"
                );


                notification.setMessage(
                        "Follow-up pending for lead: "
                                + reminder
                                .getFollowup()
                                .getLead()
                                .getPerson()
                                .getFirstName()
                );


                notification.setNotificationType(
                        NotificationType.FOLLOWUP
                );


                notification.setIsRead(false);


                notificationRepository.save(
                        notification
                );


                // =========================================
                // MARK NORMAL NOTIFICATION AS SENT
                // =========================================

                reminder.setNotificationSent(true);


                reminder.setSentAt(
                        LocalDateTime.now()
                );


                reminderRepository.save(
                        reminder
                );


                System.out.println(
                        "Reminder notification saved : "
                                + reminder.getReminderId()
                );


            } catch (Exception e) {

                System.err.println(
                        "Error processing reminder : "
                                + (
                                reminder != null
                                        ? reminder.getReminderId()
                                        : null
                        )
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // 48-HOUR ADMIN ESCALATION
    //
    // IMPORTANT:
    //
    // 48 hours are calculated from reminderTime.
    //
    // NOT from:
    // - lead creation
    // - follow-up creation
    // - assignment date
    //
    // Flow:
    //
    // Reminder created
    //        ↓
    // Reminder time
    //        ↓
    // 48 hours
    //        ↓
    // Check counsellor action
    //        ↓
    // Action exists → STOP
    //        ↓
    // No action → ADMIN notification
    //
    // adminEscalationSent belongs to THIS reminder.
    //
    // Therefore:
    //
    // Reminder #101
    //      ↓
    // escalation
    //
    // Admin resets/reassigns
    //      ↓
    // Reminder #102
    //      ↓
    // adminEscalationSent = false
    //      ↓
    // new 48-hour cycle
    //
    // =====================================================

    @Scheduled(fixedRate = 60000)
    public void processAdminEscalations() {

        System.out.println(
                "===== ADMIN ESCALATION CHECK ====="
        );


        LocalDateTime now =
                LocalDateTime.now();


        // =================================================
        // 48 HOURS CUTOFF
        // =================================================

        LocalDateTime cutoff =
                now.minusHours(48);


        // =================================================
        // FIND REMINDERS WHICH:
        //
        // 1. Are incomplete
        // 2. Reminder time is at least 48 hours old
        // 3. Admin escalation has not been sent
        // =================================================

        List<ReminderSchedule> reminders =
                reminderRepository
                        .findRemindersForAdminEscalation(
                                cutoff
                        );


        System.out.println(
                "48-hour escalation candidates : "
                        + reminders.size()
        );


        if (reminders.isEmpty()) {
            return;
        }


        // =================================================
        // GET ALL ADMINS
        // =================================================

        List<Employee> admins =
                employeeRepository.findAllAdmins();


        if (admins.isEmpty()) {

            System.out.println(
                    "No ADMIN employee found for escalation."
            );

            return;
        }


        // =================================================
        // PROCESS EACH REMINDER
        // =================================================

        for (ReminderSchedule reminder : reminders) {

            try {

                if (reminder == null) {
                    continue;
                }


                // =========================================
                // COMPLETED REMINDER
                // =========================================

                if (Boolean.TRUE.equals(
                        reminder.getIsCompleted()
                )) {

                    continue;
                }


                // =========================================
                // ALREADY ESCALATED
                //
                // IMPORTANT:
                //
                // This is the duplicate protection.
                //
                // It belongs to the reminder itself.
                // =========================================

                if (Boolean.TRUE.equals(
                        reminder.getAdminEscalationSent()
                )) {

                    continue;
                }


                // =========================================
                // FOLLOW-UP VALIDATION
                // =========================================

                if (reminder.getFollowup() == null) {
                    continue;
                }


                if (reminder
                        .getFollowup()
                        .getLead() == null) {

                    continue;
                }


                // =========================================
                // GET FOLLOW-UP
                // =========================================

                var followup =
                        reminder.getFollowup();


                var lead =
                        followup.getLead();


                var employee =
                        followup.getEmployee();


                if (employee == null) {
                    continue;
                }


                Long employeePersonId =
                        employee.getPersonId();


                Long personId =
                        lead.getPersonId();


                // =========================================
                // CHECK COUNSELLOR ACTION
                //
                // Only action AFTER reminderTime counts.
                //
                // If counsellor performed ANY activity
                // after reminder time:
                //
                // NO ADMIN ESCALATION.
                // =========================================

                boolean employeeTookAction =
                        leadActivityRepository
                                .existsEmployeeActionAfterReminder(
                                        personId,
                                        employeePersonId,
                                        reminder.getReminderTime()
                                );


                if (employeeTookAction) {

                    System.out.println(
                            "Counsellor already acted. "
                                    + "Skipping escalation. Lead = "
                                    + personId
                                    + " | Reminder = "
                                    + reminder.getReminderId()
                    );

                    continue;
                }


                // =========================================
                // LEAD NAME
                // =========================================

                String leadName =
                        lead.getPerson() != null
                                ? (
                                (
                                        lead.getPerson()
                                                .getFirstName() != null
                                        ? lead.getPerson()
                                                .getFirstName()
                                        : ""
                                )
                                + " "
                                +
                                (
                                        lead.getPerson()
                                                .getLastName() != null
                                        ? lead.getPerson()
                                                .getLastName()
                                        : ""
                                )
                        ).trim()
                                : "Lead";


                // =========================================
                // COUNSELLOR NAME
                // =========================================

                String counsellorName =
                        employee.getPerson() != null
                                ? (
                                (
                                        employee.getPerson()
                                                .getFirstName() != null
                                        ? employee.getPerson()
                                                .getFirstName()
                                        : ""
                                )
                                + " "
                                +
                                (
                                        employee.getPerson()
                                                .getLastName() != null
                                        ? employee.getPerson()
                                                .getLastName()
                                        : ""
                                )
                        ).trim()
                                : "Counsellor";


                // =========================================
                // CREATE ADMIN NOTIFICATION
                //
                // IMPORTANT:
                //
                // We DO NOT check:
                //
                // ADMIN + LEAD + FOLLOWUP_ESCALATED
                //
                // because the same lead may have another
                // reminder cycle later.
                //
                // adminEscalationSent on THIS reminder
                // already prevents duplicates.
                // =========================================

                for (Employee admin : admins) {

                    LeadNotification notification =
                            new LeadNotification();


                    notification.setEmployee(
                            admin
                    );


                    notification.setLead(
                            lead
                    );


                    notification.setTitle(
                            "Follow-Up Escalation"
                    );


                    notification.setMessage(
                            "Lead "
                                    + leadName
                                    + " has been pending with "
                                    + counsellorName
                                    + " for more than 48 hours "
                                    + "without any counsellor action."
                    );


                    notification.setNotificationType(
                            NotificationType.FOLLOWUP_ESCALATED
                    );


                    notification.setIsRead(false);


                    notificationRepository.save(
                            notification
                    );
                }


                // =========================================
                // MARK ESCALATION SENT
                //
                // This reminder can now NEVER be escalated
                // again.
                //
                // A new follow-up/new reminder will start
                // with adminEscalationSent = false.
                // =========================================

                reminder.setAdminEscalationSent(
                        true
                );


                reminderRepository.save(
                        reminder
                );


                System.out.println(
                        "ADMIN ESCALATION SENT | Lead = "
                                + personId
                                + " | Reminder = "
                                + reminder.getReminderId()
                );


            } catch (Exception e) {

                System.err.println(
                        "Error processing admin escalation | Reminder = "
                                + (
                                reminder != null
                                        ? reminder.getReminderId()
                                        : null
                        )
                );

                e.printStackTrace();
            }
        }
    }
}