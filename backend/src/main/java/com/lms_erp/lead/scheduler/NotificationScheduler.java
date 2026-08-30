package com.lms_erp.lead.scheduler;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;

import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.entity.ReminderSchedule;

import com.lms_erp.lead.enums.NotificationType;

import com.lms_erp.lead.repository.NotificationRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final ReminderScheduleRepository reminderRepository;

    private final NotificationRepository notificationRepository;

    private final EmployeeRepository employeeRepository;


    // =====================================================
    // RUN EVERY 1 MINUTE
    // =====================================================

    @Scheduled(fixedRate = 1800000)
    @Transactional
    public void processNotifications() {

        System.out.println(
                "===== NOTIFICATION SCHEDULER RUNNING ====="
        );

        LocalDateTime now =
                LocalDateTime.now();


        // =================================================
        // 1. NORMAL REMINDER NOTIFICATIONS
        // =================================================

        processReminderNotifications(
                now
        );


        // =================================================
        // 2. ADMIN 48-HOUR ESCALATIONS
        // =================================================

        processAdminEscalations(
                now
        );
    }


    // =====================================================
    // PROCESS DUE REMINDER NOTIFICATIONS
    // =====================================================

    private void processReminderNotifications(
            LocalDateTime now
    ) {

        List<ReminderSchedule> reminders =
                reminderRepository
                        .findPendingNotificationReminders(
                                now
                        );


        System.out.println(
                "Due notifications found : "
                        + reminders.size()
        );


        for (ReminderSchedule reminder :
                reminders) {

            try {

                createReminderNotification(
                        reminder
                );

            } catch (Exception e) {

                System.err.println(
                        "Error creating notification for reminder : "
                                + reminder.getReminderId()
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // CREATE REMINDER NOTIFICATION
    // =====================================================

    private void createReminderNotification(
            ReminderSchedule reminder
    ) {

        // =================================================
        // SAFETY
        // =================================================

        if (reminder == null) {
            return;
        }


        // =================================================
        // ALREADY NOTIFIED
        // =================================================

        if (Boolean.TRUE.equals(
                reminder.getNotificationSent()
        )) {

            return;
        }


        LeadFollowup followup =
                reminder.getFollowup();


        if (followup == null) {
            return;
        }


        // =================================================
        // EMPLOYEE
        // =================================================

        Employee employee =
                followup.getEmployee();


        if (employee == null) {

            System.out.println(
                    "No employee assigned for reminder : "
                            + reminder.getReminderId()
            );

            return;
        }


        // =================================================
        // LEAD
        // =================================================

        if (followup.getLead() == null) {
            return;
        }


        Long personId =
                followup
                        .getLead()
                        .getPersonId();


        // =================================================
        // NOTIFICATION TYPE
        // =================================================

        NotificationType notificationType;


        if (
                "CALLBACK_REQUESTED"
                        .equalsIgnoreCase(
                                followup.getActionResult()
                        )
        ) {

            notificationType =
                    NotificationType.CALLBACK_DUE;

        } else {

            notificationType =
                    NotificationType.FOLLOWUP_PENDING;
        }


        // =================================================
        // TITLE
        // =================================================

        String title;


        if (
                notificationType
                        == NotificationType.CALLBACK_DUE
        ) {

            title =
                    "Callback Due";

        } else {

            title =
                    "Follow-up Pending";
        }


        // =================================================
        // EMPLOYEE NAME
        // =================================================

        String employeeName =
                getEmployeeName(
                        employee
                );


        // =================================================
        // LEAD NAME
        // =================================================

        String leadName =
                getLeadName(
                        followup
                );


        // =================================================
        // MESSAGE
        // =================================================

        String message;


        if (
                notificationType
                        == NotificationType.CALLBACK_DUE
        ) {

            message =
                    "Callback is due for lead "
                            + leadName
                            + ".";

        } else {

            message =
                    "Follow-up is pending for lead "
                            + leadName
                            + ".";
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
                                followup.getLead()
                        )

                        .title(
                                title
                        )

                        .message(
                                message
                        )

                        .notificationType(
                                notificationType
                        )

                        .isRead(
                                false
                        )

                        .build();


        notificationRepository.save(
                notification
        );


        // =================================================
        // MARK REMINDER NOTIFICATION SENT
        // =================================================

        reminder.setNotificationSent(
                true
        );


        reminder.setSentAt(
                LocalDateTime.now()
        );


        reminderRepository.save(
                reminder
        );


        System.out.println(
                "Notification created | "
                        + "Reminder = "
                        + reminder.getReminderId()
                        + " | Employee = "
                        + employee.getPersonId()
                        + " | Lead = "
                        + personId
        );
    }


    // =====================================================
    // ADMIN 48-HOUR ESCALATION
    // =====================================================

    private void processAdminEscalations(
            LocalDateTime now
    ) {

        // =================================================
        // 48 HOURS AGO
        // =================================================

        LocalDateTime cutoff =
                now.minusHours(48);


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findRemindersForAdminEscalation(
                                cutoff
                        );


        System.out.println(
                "48-hour escalation reminders found : "
                        + reminders.size()
        );


        if (reminders.isEmpty()) {
            return;
        }


        // =================================================
        // FIND ADMINS
        // =================================================

        List<Employee> admins =
                employeeRepository
                        .findAllAdmins();


        if (admins.isEmpty()) {

            System.out.println(
                    "No ADMIN employees found for escalation."
            );

            return;
        }


        // =================================================
        // PROCESS EACH REMINDER
        // =================================================

        for (ReminderSchedule reminder :
                reminders) {

            try {

                createAdminEscalation(
                        reminder,
                        admins
                );

            } catch (Exception e) {

                System.err.println(
                        "Error creating admin escalation for reminder : "
                                + reminder.getReminderId()
                );

                e.printStackTrace();
            }
        }
    }


    // =====================================================
    // CREATE ADMIN ESCALATION
    // =====================================================

    private void createAdminEscalation(
            ReminderSchedule reminder,
            List<Employee> admins
    ) {

        // =================================================
        // SAFETY
        // =================================================

        if (reminder == null) {
            return;
        }


        // =================================================
        // ALREADY ESCALATED
        // =================================================

        if (Boolean.TRUE.equals(
                reminder.getAdminEscalationSent()
        )) {

            return;
        }


        LeadFollowup followup =
                reminder.getFollowup();


        if (followup == null) {
            return;
        }


        if (followup.getLead() == null) {
            return;
        }


        String leadName =
                getLeadName(
                        followup
                );


        Long leadPersonId =
                followup
                        .getLead()
                        .getPersonId();


        Employee assignedEmployee =
                followup.getEmployee();


        String counsellorName =
                getEmployeeName(
                        assignedEmployee
                );


        // =================================================
        // CREATE NOTIFICATION FOR EVERY ADMIN
        // =================================================

        for (Employee admin :
                admins) {

            if (admin == null) {
                continue;
            }


            LeadNotification notification =
                    LeadNotification.builder()

                            .employee(
                                    admin
                            )

                            .lead(
                                    followup.getLead()
                            )

                            .title(
                                    "Follow-up Escalated"
                            )

                            .message(
                                    "Lead "
                                            + leadName
                                            + " has an incomplete "
                                            + "follow-up for more than "
                                            + "48 hours. Assigned counsellor: "
                                            + counsellorName
                                            + "."
                            )

                            .notificationType(
                                    NotificationType
                                            .FOLLOWUP_ESCALATED
                            )

                            .isRead(
                                    false
                            )

                            .build();


            notificationRepository.save(
                    notification
            );


            System.out.println(
                    "Admin escalation notification created | "
                            + "Admin = "
                            + admin.getPersonId()
                            + " | Lead = "
                            + leadPersonId
            );
        }


        // =================================================
        // MARK ESCALATION AS SENT
        // =================================================

        reminder.setAdminEscalationSent(
                true
        );


        reminderRepository.save(
                reminder
        );
    }


    // =====================================================
    // LEAD NAME
    // =====================================================

    private String getLeadName(
            LeadFollowup followup
    ) {

        if (
                followup == null
                        || followup.getLead() == null
                        || followup.getLead().getPerson() == null
        ) {

            return "Unknown Lead";
        }


        var person =
                followup
                        .getLead()
                        .getPerson();


        String firstName =
                person.getFirstName();


        String middleName =
                person.getMiddleName();


        String lastName =
                person.getLastName();


        String fullName =
                (
                        (firstName != null
                                ? firstName
                                : "")
                                + " "
                                +
                                (middleName != null
                                        ? middleName
                                        : "")
                                + " "
                                +
                                (lastName != null
                                        ? lastName
                                        : "")
                ).trim();


        return fullName.isBlank()
                ? "Unknown Lead"
                : fullName;
    }


    // =====================================================
    // EMPLOYEE NAME
    // =====================================================

    private String getEmployeeName(
            Employee employee
    ) {

        if (
                employee == null
                        || employee.getPerson() == null
        ) {

            return "Unassigned";
        }


        String firstName =
                employee
                        .getPerson()
                        .getFirstName();


        String lastName =
                employee
                        .getPerson()
                        .getLastName();


        String fullName =
                (
                        (firstName != null
                                ? firstName
                                : "")
                                + " "
                                +
                                (lastName != null
                                        ? lastName
                                        : "")
                ).trim();


        return fullName.isBlank()
                ? "Unassigned"
                : fullName;
    }
}