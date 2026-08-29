
        package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.dto.FollowupRequest;
import com.lms_erp.lead.dto.FollowupResponse;
import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadActivity;
import com.lms_erp.lead.entity.LeadAssignment;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.LeadStatusHistory;
import com.lms_erp.lead.entity.LeadStatusMaster;
import com.lms_erp.lead.entity.ReminderSchedule;
import com.lms_erp.lead.enums.FollowupStatus;
import com.lms_erp.lead.enums.FollowupType;
import com.lms_erp.lead.repository.FollowupRepository;
import com.lms_erp.lead.repository.LeadActivityRepository;
import com.lms_erp.lead.repository.LeadAssignmentRepository;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.LeadStatusHistoryRepository;
import com.lms_erp.lead.repository.LeadStatusMasterRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;
import com.lms_erp.lead.enums.LeadPriority;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.security.CurrentUserService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FollowupService {

    private final FollowupRepository followupRepository;
    private final LeadRepository leadRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadAssignmentRepository leadAssignmentRepository;
    private final LeadAssignmentService leadAssignmentService;
    private final LeadStatusHistoryRepository leadStatusHistoryRepository;
    private final LeadStatusMasterRepository leadStatusMasterRepository;
    private final LeadActivityRepository leadActivityRepository;
    private final ReminderScheduleRepository reminderRepository;
    private final LeadScoreService leadScoreService;
    private final CurrentUserService currentUserService;


    // =====================================================
    // ADD FOLLOW-UP
    // =====================================================

    @Transactional
    public void addFollowup(FollowupRequest request) {

        // =====================================================
        // LOAD LEAD
        // =====================================================

        Lead lead = leadRepository.findById(request.getPersonId())
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));


        // =====================================================
        // LOAD EMPLOYEE
        // =====================================================

        Employee employee = employeeRepository
                .findById(request.getEmployeePersonId())
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));


        int retryCount = followupRepository
                .findTopByLead_PersonIdAndFollowupStatusOrderByCreatedAtDesc(
                        lead.getPersonId(),
                        FollowupStatus.PENDING
                )
                .map(previousFollowup ->
                        previousFollowup.getRetryCount() + 1
                )
                .orElse(0);
        // =====================================================
        // CREATE FOLLOW-UP
        // =====================================================

        FollowupStatus followupStatus =
                getFollowupStatus(request.getActionResult());

        LocalDateTime actionPerformedAt = LocalDateTime.now();

        LeadFollowup.LeadFollowupBuilder followupBuilder =
                LeadFollowup.builder()
                        .lead(lead)
                        .employee(employee)
                        .followupType(request.getFollowupType())
                        .followupStatus(followupStatus)
                        .actionResult(request.getActionResult())
                        .remarks(request.getRemarks())
                        .scheduledAt(LocalDateTime.now())
                        .actionPerformedAt(actionPerformedAt)
                        .retryCount(retryCount);

        if (followupStatus == FollowupStatus.COMPLETED) {
            followupBuilder.completedAt(actionPerformedAt);
        }

        LeadFollowup followup = followupBuilder.build();

        followup = followupRepository.save(followup);


        // =====================================================
        // CREATE REMINDER FOR PENDING FOLLOW-UP
        // =====================================================

        if (followup.getFollowupStatus() == FollowupStatus.PENDING) {

            LocalDateTime reminderTime =
                    calculateNextReminder(retryCount);

            if (reminderTime != null) {

                followup.setNextFollowupAt(reminderTime);

                followupRepository.save(followup);


                ReminderSchedule reminder =
                        ReminderSchedule.builder()
                                .followup(followup)
                                .reminderTime(reminderTime)
                                .reminderType(
                                        request.getFollowupType().name()
                                )
                                .isCompleted(false)
                                .notificationSent(false)
                                .build();

                reminderRepository.save(reminder);

                lead.setNextFollowupDate(reminderTime);
            }
        }


        // =====================================================
        // CREATE LEAD ACTIVITY
        // =====================================================

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .employee(employee)
                .communicationType(
                        request.getFollowupType().name()
                )
                .communicationStatus(
                        request.getActionResult()
                )
                .remarks(request.getRemarks())
                .build();

        leadActivityRepository.save(activity);


        // =====================================================
        // OLD STATUS
        // =====================================================

        LeadStatusMaster oldStatus =
                lead.getLeadStatus();


        // =====================================================
        // NEW STATUS
        // =====================================================

        LeadStatusMaster newStatus =
                switch (request.getActionResult()) {

                    case "INTERESTED" ->
                            getLeadStatus("INTERESTED");

                    case "CONNECTED",
                         "EMAIL_SENT",
                         "SMS_SENT",
                         "SMS_REPLIED" ->
                            getLeadStatus("CONTACTED");

                    case "NOT_INTERESTED" ->
                            getLeadStatus("NOT_INTERESTED");

                    case "CALLBACK_REQUESTED" ->
                            getLeadStatus("CALLBACK");

                    case "NO_RESPONSE" ->
                            getLeadStatus("NO_RESPONSE");

                    default ->
                            oldStatus;
                };


        // =====================================================
        // UPDATE STATUS HISTORY
        // =====================================================

        if (oldStatus != null
                && newStatus != null
                && !oldStatus.getLeadStatusId()
                .equals(newStatus.getLeadStatusId())) {

            lead.setLeadStatus(newStatus);

            saveStatusHistory(
                    lead,
                    oldStatus,
                    newStatus,
                    employee
            );
        }


        // =====================================================
// NOT INTERESTED
// =====================================================

        if ("NOT_INTERESTED".equalsIgnoreCase(
                request.getActionResult())) {

            LocalDateTime reEngagementDate =
                    actionPerformedAt.plusMonths(6);

            handleNotInterestedLead(
                    lead,
                    reEngagementDate
            );
        }


        // =====================================================
        // SAVE LEAD
        // =====================================================

        leadRepository.save(lead);


        // =====================================================
        // UPDATE SCORE
        // =====================================================

        leadScoreService.updateScore(
                lead.getPersonId(),
                0,
                0,
                10,
                0,
                0
        );
    }


    // =====================================================
    // HANDLE NOT INTERESTED
    // =====================================================
// =====================================================
// HANDLE NOT INTERESTED
// =====================================================

    private void handleNotInterestedLead(
            Lead lead,
            LocalDateTime reEngagementDate
    ) {

        // -------------------------------------------------
        // DO NOT ARCHIVE
        // -------------------------------------------------

        lead.setIsArchived(false);

        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        LeadStatusMaster notInterestedStatus =
                getLeadStatus("NOT_INTERESTED");

        lead.setLeadStatus(notInterestedStatus);

        // -------------------------------------------------
        // RE-ENGAGEMENT DATE
        // -------------------------------------------------

        lead.setReEngagementDate(
                reEngagementDate
        );

        // -------------------------------------------------
        // CLEAR NORMAL FOLLOW-UP
        // -------------------------------------------------

        lead.setNextFollowupDate(null);
    }
// =====================================================
// FOLLOW-UP STATUS
// =====================================================

    private FollowupStatus getFollowupStatus(
            String actionResult) {

        return switch (actionResult) {

            // =============================================
            // AUTOMATIC RETRY
            // =============================================

            case "CALLBACK_REQUESTED",
                 "NO_RESPONSE" ->

                    FollowupStatus.PENDING;


            // =============================================
            // COMPLETED / CONTACTED
            // =============================================

            case "CONNECTED",
                 "EMAIL_SENT",
                 "SMS_SENT",
                 "SMS_REPLIED",
                 "INTERESTED",
                 "NOT_INTERESTED" ->

                    FollowupStatus.COMPLETED;


            default ->
                    FollowupStatus.COMPLETED;
        };
    }

    // =====================================================
    // GET LEAD FOLLOW-UPS
    // =====================================================

    public List<FollowupResponse> getLeadFollowups(
            Long personId) {

        return followupRepository
                .findLeadFollowups(personId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET EMPLOYEE FOLLOW-UPS
    // =====================================================

    public List<FollowupResponse> getEmployeeFollowups(
            Long employeePersonId) {

        return followupRepository
                .findEmployeeFollowups(
                        employeePersonId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET MY FOLLOW-UPS
    // =====================================================

    public List<LeadFollowup> getMyFollowups() {

        Employee employee =
                currentUserService.getCurrentEmployee();

        return followupRepository
                .findEmployeeFollowups(
                        employee.getPersonId()
                );
    }


    // =====================================================
    // GET PENDING FOLLOW-UPS
    // =====================================================

    public List<LeadFollowup> getPendingFollowups() {

        Employee employee =
                currentUserService.getCurrentEmployee();

        return followupRepository.findPendingFollowups(
                employee.getPersonId(),
                FollowupStatus.PENDING,
                LocalDateTime.now()
        );
    }


    // =====================================================
    // SAVE STATUS HISTORY
    // =====================================================

    private void saveStatusHistory(
            Lead lead,
            LeadStatusMaster oldStatus,
            LeadStatusMaster newStatus,
            Employee employee) {

        LeadStatusHistory history =
                LeadStatusHistory.builder()
                        .lead(lead)
                        .oldStatus(oldStatus)
                        .newStatus(newStatus)
                        .changedByPerson(
                                employee.getPerson()
                        )
                        .remarks(
                                "Status updated through follow-up"
                        )
                        .build();

        leadStatusHistoryRepository.save(history);
    }

// =====================================================
// CALCULATE NEXT REMINDER
// =====================================================

    private LocalDateTime calculateNextReminder(
            int retryCount) {

        LocalDateTime now = LocalDateTime.now();

        return switch (retryCount) {

            // First retry
            case 0 ->
                    now.plusHours(1);

            // Second retry
            case 1 ->
                    now.plusHours(2);

            // Third retry
            case 2 ->
                    now.plusHours(4);

            // Fourth retry
            case 3 ->
                    now.plusHours(8);

            // Fifth retry
            case 4 ->
                    now.plusHours(16);

            // Sixth retry
            case 5 ->
                    now.plusHours(24);

            // Seventh retry
            case 6 ->
                    now.plusHours(36);
            case 7 ->
                    now.plusHours(48);

            // Eighth retry
            case 8 ->
                    now.plusWeeks(1);

            // Ninth retry
            case 9 ->
                    now.plusWeeks(2);

            // Retry chain finished
            default ->
                    null;
        };
    }

    // =====================================================
    // GET STATUS
    // =====================================================

    private LeadStatusMaster getLeadStatus(
            String statusName) {

        return leadStatusMasterRepository
                .findByStatusName(statusName)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lead Status not found : "
                                        + statusName
                        ));
    }


    // =====================================================
    // MAP RESPONSE
    // =====================================================

    private FollowupResponse mapToResponse(
            LeadFollowup followup) {

        Person person =
                followup.getLead().getPerson();

        Employee employee =
                followup.getEmployee();

        return FollowupResponse.builder()

                .followupId(
                        followup.getFollowupId()
                )

                .personId(
                        person.getPersonId()
                )

                .firstName(
                        person.getFirstName()
                )

                .middleName(
                        person.getMiddleName()
                )

                .lastName(
                        person.getLastName()
                )

                .email(
                        getPrimaryEmail(person)
                )

                .phone(
                        getPrimaryPhone(person)
                )

                .leadStatus(
                        followup.getLead().getLeadStatus() != null
                                ? followup.getLead()
                                .getLeadStatus()
                                .getStatusName()
                                : null
                )

                .followupType(
                        followup.getFollowupType() != null
                                ? followup.getFollowupType().name()
                                : null
                )

                .followupStatus(
                        followup.getFollowupStatus() != null
                                ? followup.getFollowupStatus().name()
                                : null
                )

                .actionResult(
                        followup.getActionResult()
                )

                .remarks(
                        followup.getRemarks()
                )

                .scheduledAt(
                        followup.getScheduledAt()
                )
                .actionPerformedAt(
                        followup.getActionPerformedAt()
                )

                .completedAt(
                        followup.getCompletedAt()
                )

                .nextFollowupAt(
                        followup.getNextFollowupAt()
                )

                .retryCount(
                        followup.getRetryCount()
                )

                .employeePersonId(
                        employee != null
                                ? employee.getPersonId()
                                : null
                )

                .employeeName(
                        employee != null
                                && employee.getPerson() != null
                                ? employee.getPerson()
                                .getFirstName()
                                  + " "
                                  + employee.getPerson()
                                .getLastName()
                                : "Unassigned"
                )

                .createdAt(
                        followup.getCreatedAt()
                )

                .build();
    }


    // =====================================================
    // PRIMARY EMAIL
    // =====================================================

    private String getPrimaryEmail(
            Person person) {

        if (person == null
                || person.getContacts() == null) {

            return "";
        }

        return person.getContacts()
                .stream()
                .filter(contact ->
                        Boolean.TRUE.equals(
                                contact.getIsPrimary()
                        ))
                .filter(contact ->
                        contact.getContactType() != null
                                && "PRIMARY_EMAIL"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                ))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }


    // =====================================================
    // PRIMARY PHONE
    // =====================================================

    private String getPrimaryPhone(
            Person person) {

        if (person == null
                || person.getContacts() == null) {

            return "";
        }

        return person.getContacts()
                .stream()
                .filter(contact ->
                        Boolean.TRUE.equals(
                                contact.getIsPrimary()
                        ))
                .filter(contact ->
                        contact.getContactType() != null
                                && "PRIMARY_PHONE"
                                .equalsIgnoreCase(
                                        contact.getContactType()
                                                .getContactTypeName()
                                ))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }

// =====================================================
// CREATE AUTOMATIC RE-ENGAGEMENT FOLLOW-UP
// =====================================================

    @Transactional
    public void createReEngagementFollowup(Lead lead) {

        // =====================================================
        // DUPLICATE PROTECTION
        // =====================================================

        String remarks =
                "Automatic Re-Engagement Follow-up";

        boolean exists =
                followupRepository
                        .existsByLead_PersonIdAndFollowupStatusAndRemarks(
                                lead.getPersonId(),
                                FollowupStatus.PENDING,
                                remarks
                        );

        if (exists) {
            return;
        }


        // =====================================================
        // FIND ACTIVE ASSIGNMENT
        // =====================================================

        LeadAssignment assignment =
                leadAssignmentRepository
                        .findByLead_PersonIdAndIsActiveTrue(
                                lead.getPersonId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No active assignment found for re-engagement lead."
                                )
                        );


        // =====================================================
        // ASSIGNED EMPLOYEE
        // =====================================================

        Employee employee =
                assignment.getEmployee();


        // =====================================================
        // RE-ENGAGEMENT ACTION TIME
        // =====================================================

        LocalDateTime actionPerformedAt =
                LocalDateTime.now();

        LocalDateTime followupTime =
                actionPerformedAt.plusDays(2);


        // =====================================================
        // CREATE FOLLOW-UP
        // =====================================================
        LeadFollowup followup =
                LeadFollowup.builder()
                        .lead(lead)
                        .employee(employee)
                        .followupType(FollowupType.CALL)
                        .followupStatus(FollowupStatus.PENDING)

                        // Automatic re-engagement follow-up
                        .actionResult("RE_ENGAGEMENT")

                        .remarks(remarks)

                        // Follow-up created/scheduled now
                        .scheduledAt(LocalDateTime.now())

                        // Actual action has NOT been performed yet
                        .actionPerformedAt(null)

                        .nextFollowupAt(followupTime)

                        .retryCount(0)

                        .build();

        // =====================================================
        // CREATE REMINDER
        // =====================================================

        ReminderSchedule reminder =
                ReminderSchedule.builder()

                        .followup(
                                followup
                        )

                        .reminderTime(
                                followupTime
                        )

                        .reminderType(
                                FollowupType.CALL.name()
                        )

                        .isCompleted(false)

                        .notificationSent(false)

                        .build();


        reminderRepository.save(
                reminder
        );


        // =====================================================
        // UPDATE NEXT FOLLOW-UP
        // =====================================================

        lead.setNextFollowupDate(
                followupTime
        );

        leadRepository.save(
                lead
        );
    }


}

