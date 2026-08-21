package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.dto.AdminFollowupActionRequest;
import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadAssignment;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.ReminderSchedule;
import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.enums.FollowupType;
import com.lms_erp.lead.repository.FollowupRepository;
import com.lms_erp.lead.repository.LeadAssignmentRepository;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;
import com.lms_erp.security.CurrentUserService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminFollowupActionService {

    private final LeadRepository leadRepository;

    private final FollowupRepository followupRepository;

    private final ReminderScheduleRepository reminderRepository;

    private final LeadAssignmentRepository leadAssignmentRepository;

    private final EmployeeRepository employeeRepository;

    private final LeadAssignmentService leadAssignmentService;

    private final CurrentUserService currentUserService;


    // =====================================================
    // RESET FOLLOW-UP CYCLE
    // =====================================================

    @Transactional
    public void resetFollowupCycle(
            Long personId
    ) {

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
                                        "Lead not found: "
                                                + personId
                                )
                        );


        // =================================================
        // GET ACTIVE ASSIGNMENT
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


        // =================================================
        // CLOSE OLD PENDING CYCLE
        // =================================================

        closeOldFollowupCycle(
                personId
        );


        // =================================================
        // CREATE NEW FOLLOW-UP
        // =================================================

        createFreshFollowup(
                lead,
                employee,
                "Follow-up cycle reset by Admin"
        );


        // =================================================
        // SAVE LEAD
        // =================================================

        leadRepository.save(lead);
    }


    // =====================================================
    // REASSIGN COUNSELLOR + RESET FOLLOW-UP
    // =====================================================

    @Transactional
    public void reassignCounsellor(
            AdminFollowupActionRequest request
    ) {

        // =================================================
        // ADMIN CHECK
        // =================================================

        if (!currentUserService.hasRole("ADMIN")) {

            throw new RuntimeException(
                    "Only ADMIN can reassign counsellor."
            );
        }


        // =================================================
        // VALIDATE COUNSELLOR
        // =================================================

        if (request.getEmployeePersonId() == null) {

            throw new RuntimeException(
                    "Employee person ID is required."
            );
        }


        // =================================================
        // LOAD LEAD
        // =================================================

        Lead lead =
                leadRepository.findById(
                                request.getPersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lead not found: "
                                                + request.getPersonId()
                                )
                        );


        // =================================================
        // LOAD NEW COUNSELLOR
        // =================================================

        Employee employee =
                employeeRepository
                        .findById(
                                request.getEmployeePersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found: "
                                                + request.getEmployeePersonId()
                                )
                        );


        // =================================================
        // CLOSE OLD FOLLOW-UP CYCLE
        // =================================================

        closeOldFollowupCycle(
                request.getPersonId()
        );


        // =================================================
        // CHANGE ASSIGNMENT
        //
        // LeadAssignmentService already contains:
        //
        // - old assignment deactivation
        // - new assignment creation
        // - assignment history
        // =================================================

        leadAssignmentService.assignLead(
                lead,
                employee.getPersonId()
        );


        // =================================================
        // CREATE NEW FOLLOW-UP CYCLE
        // =================================================

        createFreshFollowup(
                lead,
                employee,
                "Follow-up reassigned by Admin"
        );


        // =================================================
        // SAVE
        // =================================================

        leadRepository.save(lead);
    }


    // =====================================================
    // CLOSE OLD FOLLOW-UP CYCLE
    // =====================================================

    private void closeOldFollowupCycle(
            Long personId
    ) {

        List<LeadFollowup> followups =
                followupRepository
                        .findLeadFollowups(personId);


        LocalDateTime now =
                LocalDateTime.now();


        for (LeadFollowup followup : followups) {

            // =============================================
            // ONLY PENDING FOLLOW-UPS
            // =============================================

            if (followup.getFollowupStatus()
                    != FollowupStatus.PENDING) {

                continue;
            }


            // =============================================
            // COMPLETE OLD FOLLOW-UP
            // =============================================

            followup.setFollowupStatus(
                    FollowupStatus.COMPLETED
            );


            followup.setCompletedAt(
                    now
            );


            followupRepository.save(
                    followup
            );


            // =============================================
            // COMPLETE OLD REMINDERS
            // =============================================

            List<ReminderSchedule> reminders =
                    reminderRepository
                            .findByFollowup_FollowupId(
                                    followup.getFollowupId()
                            );


            for (ReminderSchedule reminder : reminders) {

                reminder.setIsCompleted(
                        true
                );


                reminder.setReminderStatus(
                        "COMPLETED"
                );


                reminderRepository.save(
                        reminder
                );
            }
        }
    }


    // =====================================================
    // CREATE NEW FOLLOW-UP CYCLE
    // =====================================================

    private void createFreshFollowup(
            Lead lead,
            Employee employee,
            String remarks
    ) {

        // =================================================
        // NEW CYCLE STARTS NOW
        // =================================================

        LocalDateTime now =
                LocalDateTime.now();


        // =================================================
        // FIRST REMINDER
        //
        // Reset means fresh cycle.
        //
        // First reminder = 1 hour later.
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

                        .remarks(
                                remarks
                        )

                        .scheduledAt(
                                now
                        )

                        .nextFollowupAt(
                                reminderTime
                        )

                        .retryCount(
                                0
                        )

                        .build();


        followup =
                followupRepository.save(
                        followup
                );


        // =================================================
        // CREATE NEW REMINDER
        // =================================================

        ReminderSchedule reminder =
                ReminderSchedule.builder()

                        .followup(
                                followup
                        )

                        .reminderTime(
                                reminderTime
                        )

                        .reminderType(
                                FollowupType.CALL.name()
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
                reminder
        );


        // =================================================
        // UPDATE LEAD
        // =================================================

        lead.setNextFollowupDate(
                reminderTime
        );
    }
}