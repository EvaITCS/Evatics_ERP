package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;

import com.lms_erp.lead.dto.AdminReassignCounsellorRequest;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadAssignment;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.LeadNotification;
import com.lms_erp.lead.entity.ReminderSchedule;

import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.enums.FollowupType;
import com.lms_erp.lead.enums.NotificationType;

import com.lms_erp.lead.repository.FollowupRepository;
import com.lms_erp.lead.repository.LeadAssignmentRepository;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.NotificationRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;

import com.lms_erp.security.CurrentUserService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFollowupEscalationService {


    private final LeadRepository leadRepository;

    private final EmployeeRepository employeeRepository;

    private final LeadAssignmentRepository leadAssignmentRepository;

    private final FollowupRepository followupRepository;

    private final ReminderScheduleRepository reminderRepository;

    private final NotificationRepository notificationRepository;

    private final CurrentUserService currentUserService;


    // =====================================================
    // RESET FOLLOW-UP CYCLE
    // SAME COUNSELLOR
    // =====================================================

    @Transactional
    public void resetFollowupCycle(Long personId) {

        // =================================================
        // ADMIN CHECK
        // =================================================

        if (!currentUserService.hasRole("ADMIN")) {

            throw new RuntimeException(
                    "Only ADMIN can reset follow-up cycle."
            );
        }


        // =================================================
        // LOAD LEAD
        // =================================================

        Lead lead =
                leadRepository.findById(personId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lead not found: " + personId
                                )
                        );


        // =================================================
        // GET ACTIVE COUNSELLOR
        // =================================================

        LeadAssignment assignment =
                leadAssignmentRepository
                        .findByLead_PersonIdAndIsActiveTrue(
                                personId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No active counsellor assigned to this lead."
                                )
                        );


        Employee employee =
                assignment.getEmployee();


        if (employee == null) {

            throw new RuntimeException(
                    "Active assignment has no counsellor."
            );
        }


        // =================================================
        // RESOLVE ADMIN 48-HOUR ESCALATION
        //
        // IMPORTANT:
        // DO NOT DELETE NOTIFICATION.
        //
        // Mark it as READ.
        // =================================================

        resolveAdminEscalations(
                personId
        );


        // =================================================
        // CLOSE OLD FOLLOW-UP CYCLE
        // =================================================

        closeExistingFollowupCycle(
                personId
        );


        // =================================================
        // CREATE NEW FOLLOW-UP + REMINDER
        // =================================================

        createFreshFollowup(
                lead,
                employee,
                "Follow-up cycle reset by Admin"
        );


        // =================================================
        // NOTIFY SAME COUNSELLOR
        // =================================================

        LeadNotification counsellorNotification =
                LeadNotification.builder()
                        .employee(employee)
                        .lead(lead)
                        .title("Follow-up Cycle Reset")
                        .message(
                                "The follow-up cycle for lead "
                                        + getLeadName(lead)
                                        + " has been reset by Admin. "
                                        + "A new follow-up has been scheduled."
                        )
                        .notificationType(
                                NotificationType.LEAD_REASSIGNED
                        )
                        .isRead(false)
                        .build();


        notificationRepository.save(
                counsellorNotification
        );


        // =================================================
        // SAVE LEAD
        // =================================================

        leadRepository.save(lead);
    }


    // =====================================================
    // REASSIGN COUNSELLOR
    // =====================================================

    @Transactional
    public void reassignCounsellor(
            Long notificationId,
            AdminReassignCounsellorRequest request
    ) {

        // =================================================
        // VALIDATE ADMIN ESCALATION
        // =================================================

        LeadNotification escalationNotification =
                getEscalationNotification(
                        notificationId
                );


        // =================================================
        // GET LEAD
        // =================================================

        Lead lead =
                escalationNotification.getLead();


        if (lead == null) {

            throw new RuntimeException(
                    "Lead not found for escalation notification."
            );
        }


        // =================================================
        // LOAD NEW COUNSELLOR
        // =================================================

        Employee newEmployee =
                employeeRepository
                        .findById(
                                request.getEmployeePersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Counsellor not found."
                                )
                        );


        // =================================================
        // VERIFY COUNSELLOR ROLE
        // =================================================

        if (
                newEmployee.getDesignation() == null
                        ||
                        newEmployee.getDesignation().getRole() == null
                        ||
                        !"COUNSELLOR".equalsIgnoreCase(
                                newEmployee
                                        .getDesignation()
                                        .getRole()
                                        .getRoleName()
                        )
        ) {

            throw new RuntimeException(
                    "Selected employee is not a counsellor."
            );
        }


        // =================================================
        // GET CURRENT ACTIVE ASSIGNMENT
        // =================================================

        LeadAssignment oldAssignment =
                leadAssignmentRepository
                        .findByLead_PersonIdAndIsActiveTrue(
                                lead.getPersonId()
                        )
                        .orElse(null);


        // =================================================
        // SAME COUNSELLOR CHECK
        // =================================================

        if (
                oldAssignment != null
                        &&
                        oldAssignment.getEmployee() != null
                        &&
                        oldAssignment
                                .getEmployee()
                                .getPersonId()
                                .equals(
                                        newEmployee.getPersonId()
                                )
        ) {

            throw new RuntimeException(
                    "Lead is already assigned to this counsellor. "
                            + "Use Reset Follow-up instead."
            );
        }


        // =================================================
        // CLOSE OLD FOLLOW-UP CYCLE
        // =================================================

        closeExistingFollowupCycle(
                lead.getPersonId()
        );


        // =================================================
        // DEACTIVATE OLD ASSIGNMENT
        // =================================================

        if (oldAssignment != null) {

            oldAssignment.setIsActive(false);

            leadAssignmentRepository.save(
                    oldAssignment
            );
        }


        // =================================================
        // CURRENT ADMIN
        // =================================================

        Employee admin =
                currentUserService.getCurrentEmployee();


        // =================================================
        // OLD COUNSELLOR NAME
        // =================================================

        String oldCounsellorName =
                getEmployeeName(
                        oldAssignment != null
                                ? oldAssignment.getEmployee()
                                : null
                );


        // =================================================
        // NEW COUNSELLOR NAME
        // =================================================

        String newCounsellorName =
                getEmployeeName(
                        newEmployee
                );


        // =================================================
        // CREATE NEW ASSIGNMENT
        // =================================================

        LeadAssignment newAssignment =
                LeadAssignment.builder()
                        .lead(lead)
                        .employee(newEmployee)
                        .assignedBy(admin)
                        .remarks(
                                "Reassigned after 48-hour follow-up escalation. "
                                        + "From "
                                        + oldCounsellorName
                                        + " to "
                                        + newCounsellorName
                        )
                        .isActive(true)
                        .build();


        leadAssignmentRepository.save(
                newAssignment
        );


        // =================================================
        // CREATE NEW FOLLOW-UP CYCLE
        // =================================================

        createFreshFollowup(
                lead,
                newEmployee,
                "ADMIN REASSIGN - FOLLOW-UP CYCLE"
        );


        // =================================================
        // NOTIFY NEW COUNSELLOR
        // =================================================

        LeadNotification counsellorNotification =
                LeadNotification.builder()
                        .employee(newEmployee)
                        .lead(lead)
                        .title("Lead Reassigned")
                        .message(
                                "Lead "
                                        + getLeadName(lead)
                                        + " has been reassigned to you "
                                        + "by Admin. A new follow-up cycle "
                                        + "has been created."
                        )
                        .notificationType(
                                NotificationType.LEAD_REASSIGNED
                        )
                        .isRead(false)
                        .build();


        notificationRepository.save(
                counsellorNotification
        );


        // =================================================
        // RESOLVE ADMIN ESCALATION
        //
        // DO NOT DELETE.
        // Just mark it READ.
        // =================================================

        escalationNotification.setIsRead(true);

        notificationRepository.save(
                escalationNotification
        );
    }


    // =====================================================
    // RESOLVE ADMIN ESCALATIONS
    // =====================================================

    private void resolveAdminEscalations(
            Long personId
    ) {

        List<LeadNotification> escalations =
                notificationRepository
                        .findByLead_PersonIdAndNotificationTypeAndIsReadFalse(
                                personId,
                                NotificationType.FOLLOWUP_ESCALATED
                        );


        if (escalations.isEmpty()) {
            return;
        }


        for (LeadNotification notification : escalations) {

            notification.setIsRead(true);
        }


        notificationRepository.saveAll(
                escalations
        );
    }


    // =====================================================
    // CLOSE EXISTING FOLLOW-UP CYCLE
    // =====================================================

    private void closeExistingFollowupCycle(
            Long personId
    ) {

        List<ReminderSchedule> reminders =
                reminderRepository
                        .findIncompleteRemindersByLead(
                                personId
                        );


        LocalDateTime now =
                LocalDateTime.now();


        for (ReminderSchedule reminder : reminders) {

            // =============================================
            // CLOSE REMINDER
            // =============================================

            reminder.setIsCompleted(true);

            reminder.setReminderStatus(
                    "ADMIN_RESOLVED"
            );


            if (reminder.getSentAt() == null) {

                reminder.setSentAt(now);
            }


            // =============================================
            // PREVENT OLD ESCALATION
            // =============================================

            reminder.setAdminEscalationSent(true);


            reminderRepository.save(
                    reminder
            );


            // =============================================
            // CLOSE FOLLOW-UP
            // =============================================

            LeadFollowup followup =
                    reminder.getFollowup();


            if (
                    followup != null
                            &&
                            followup.getFollowupStatus()
                                    == FollowupStatus.PENDING
            ) {

                followup.setFollowupStatus(
                        FollowupStatus.CANCELLED
                );


                followup.setCompletedAt(
                        now
                );


                followupRepository.save(
                        followup
                );
            }
        }
    }


    // =====================================================
    // CREATE FRESH FOLLOW-UP
    // =====================================================

    private void createFreshFollowup(
            Lead lead,
            Employee employee,
            String remarks
    ) {

        // =================================================
        // RESET RETRY
        // =================================================

        int retryCount = 0;


        // =================================================
        // CURRENT TIME
        // =================================================

        LocalDateTime now =
                LocalDateTime.now();


        // =================================================
        // NEW REMINDER
        // ONE HOUR FROM NOW
        // =================================================

        LocalDateTime reminderTime =
                now.plusHours(1);


        // =================================================
        // CREATE FOLLOW-UP
        // =================================================

        LeadFollowup followup =
                LeadFollowup.builder()
                        .lead(lead)
                        .employee(employee)
                        .followupType(
                                FollowupType.CALL
                        )
                        .followupStatus(
                                FollowupStatus.PENDING
                        )
                        .remarks(remarks)
                        .scheduledAt(now)
                        .nextFollowupAt(
                                reminderTime
                        )
                        .retryCount(
                                retryCount
                        )
                        .build();


        followup =
                followupRepository.save(
                        followup
                );


        // =================================================
        // CREATE REMINDER
        // =================================================

        ReminderSchedule reminder =
                ReminderSchedule.builder()
                        .followup(followup)
                        .reminderTime(
                                reminderTime
                        )
                        .reminderType(
                                FollowupType.CALL.name()
                        )
                        .reminderStatus(
                                "PENDING"
                        )
                        .isCompleted(false)
                        .notificationSent(false)
                        .adminEscalationSent(false)
                        .build();


        reminderRepository.save(
                reminder
        );


        // =================================================
        // UPDATE LEAD NEXT FOLLOW-UP
        // =================================================

        lead.setNextFollowupDate(
                reminderTime
        );


        leadRepository.save(
                lead
        );
    }


    // =====================================================
    // GET VALID ADMIN ESCALATION
    // =====================================================

    private LeadNotification getEscalationNotification(
            Long notificationId
    ) {

        LeadNotification notification =
                notificationRepository
                        .findById(
                                notificationId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found."
                                )
                        );


        // =================================================
        // CHECK TYPE
        // =================================================

        if (
                notification.getNotificationType()
                        != NotificationType.FOLLOWUP_ESCALATED
        ) {

            throw new RuntimeException(
                    "This notification is not a 48-hour escalation."
            );
        }


        // =================================================
        // CURRENT ADMIN
        // =================================================

        Employee currentEmployee =
                currentUserService
                        .getCurrentEmployee();


        // =================================================
        // OWNERSHIP CHECK
        // =================================================

        if (
                notification.getEmployee() == null
                        ||
                        !notification
                                .getEmployee()
                                .getPersonId()
                                .equals(
                                        currentEmployee.getPersonId()
                                )
        ) {

            throw new RuntimeException(
                    "You are not authorized to perform this action."
            );
        }


        // =================================================
        // ALREADY RESOLVED CHECK
        // =================================================

        if (
                Boolean.TRUE.equals(
                        notification.getIsRead()
                )
        ) {

            throw new RuntimeException(
                    "This escalation has already been resolved."
            );
        }


        return notification;
    }


    // =====================================================
    // GET EMPLOYEE NAME
    // =====================================================

    private String getEmployeeName(
            Employee employee
    ) {

        if (
                employee == null
                        ||
                        employee.getPerson() == null
        ) {

            return "Unassigned";
        }


        String firstName =
                employee
                        .getPerson()
                        .getFirstName() != null

                        ? employee
                        .getPerson()
                        .getFirstName()

                        : "";


        String lastName =
                employee
                        .getPerson()
                        .getLastName() != null

                        ? employee
                        .getPerson()
                        .getLastName()

                        : "";


        String fullName =
                (
                        firstName
                                + " "
                                + lastName
                ).trim();


        return fullName.isEmpty()
                ? "Unassigned"
                : fullName;
    }


    // =====================================================
    // GET LEAD NAME
    // =====================================================

    private String getLeadName(
            Lead lead
    ) {

        if (
                lead == null
                        ||
                        lead.getPerson() == null
        ) {

            return "Lead";
        }


        String firstName =
                lead
                        .getPerson()
                        .getFirstName() != null

                        ? lead
                        .getPerson()
                        .getFirstName()

                        : "";


        String lastName =
                lead
                        .getPerson()
                        .getLastName() != null

                        ? lead
                        .getPerson()
                        .getLastName()

                        : "";


        String fullName =
                (
                        firstName
                                + " "
                                + lastName
                ).trim();


        return fullName.isEmpty()
                ? "Lead"
                : fullName;
    }
}