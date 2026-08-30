package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;

import com.lms_erp.lead.dto.NotificationPageResponse;
import com.lms_erp.lead.dto.PendingFollowupResponse;
import com.lms_erp.lead.dto.ReminderResponse;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadFollowup;
import com.lms_erp.lead.entity.ReminderSchedule;

import com.lms_erp.lead.enums.FollowupStatus;

import com.lms_erp.lead.repository.FollowupRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;

import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;

import com.lms_erp.security.CurrentUserService;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderScheduleRepository reminderRepository;

    private final CurrentUserService currentUserService;

    private final FollowupRepository followupRepository;


    // =====================================================
    // CREATE REMINDER
    // =====================================================

    public ReminderSchedule createReminder(
            ReminderSchedule reminder
    ) {

        return reminderRepository.save(reminder);
    }


    // =====================================================
    // ADMIN TODAY
    //
    // ONLY TODAY
    //
    // 00:00 <= reminderTime < tomorrow 00:00
    //
    // IMPORTANT:
    // Agar today's reminder ka time nikal gaya hai,
    // tab bhi TODAY mein rahega.
    //
    // Frontend usko OVERDUE dikha sakta hai.
    // =====================================================

    public List<ReminderResponse> getAllTodayReminders() {

        LocalDate today =
                LocalDate.now();


        LocalDateTime start =
                today.atStartOfDay();


        LocalDateTime end =
                today
                        .plusDays(1)
                        .atStartOfDay();


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findTodayReminders(
                                start,
                                end
                        );


        return groupRemindersByPerson(
                reminders
        );
    }


    // =====================================================
    // COUNSELLOR TODAY
    //
    // ONLY CURRENT COUNSELLOR
    // ONLY TODAY
    // =====================================================

    public List<ReminderResponse> getTodayReminders() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();


        LocalDate today =
                LocalDate.now();


        LocalDateTime start =
                today.atStartOfDay();


        LocalDateTime end =
                today
                        .plusDays(1)
                        .atStartOfDay();


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findTodayRemindersForEmployee(
                                employeePersonId,
                                start,
                                end
                        );


        return groupRemindersByPerson(
                reminders
        );
    }


    // =====================================================
    // COUNSELLOR PENDING
    //
    // ONE PERSON = ONE RESPONSE
    //
    // Includes:
    // 1. Previous/overdue incomplete reminders
    // 2. Future incomplete reminders
    //
    // Today's reminders are excluded by repository query.
    // =====================================================

    public List<ReminderResponse> getPendingFollowups() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();


        LocalDate today =
                LocalDate.now();


        LocalDateTime todayStart =
                today.atStartOfDay();


        LocalDateTime tomorrowStart =
                today
                        .plusDays(1)
                        .atStartOfDay();


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findPendingRemindersForEmployee(
                                employeePersonId,
                                todayStart,
                                tomorrowStart
                        );


        return groupRemindersByPerson(
                reminders
        );
    }


    // =====================================================
    // ADMIN PENDING
    //
    // ONE PERSON = ONE RESPONSE
    //
    // Includes:
    // 1. Previous/overdue incomplete reminders
    // 2. Future incomplete reminders
    //
    // Today's reminders are excluded by repository query.
    // =====================================================

    public List<ReminderResponse> getAllPendingFollowups() {

        LocalDate today =
                LocalDate.now();


        LocalDateTime todayStart =
                today.atStartOfDay();


        LocalDateTime tomorrowStart =
                today
                        .plusDays(1)
                        .atStartOfDay();


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findPendingReminders(
                                todayStart,
                                tomorrowStart
                        );


        return groupRemindersByPerson(
                reminders
        );
    }


    // =====================================================
    // ADMIN OVERDUE
    //
    // Reminder time past
    // AND reminder incomplete
    // =====================================================

    public List<ReminderResponse> getAllOverdueReminders() {

        LocalDateTime now =
                LocalDateTime.now();


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findOverdueReminders(
                                now
                        );


        return groupRemindersByPerson(
                reminders
        );
    }


    // =====================================================
    // COUNSELLOR OVERDUE
    //
    // ONLY CURRENT COUNSELLOR
    // =====================================================

    public List<ReminderResponse> getOverdueReminders() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();


        LocalDateTime now =
                LocalDateTime.now();


        List<ReminderSchedule> reminders =
                reminderRepository
                        .findOverdueRemindersForEmployee(
                                employeePersonId,
                                now
                        );


        return groupRemindersByPerson(
                reminders
        );
    }


    // =====================================================
    // GROUP REMINDERS BY PERSON
    //
    // IMPORTANT:
    //
    // Same person ke multiple reminders:
    //
    // John
    //   1 hour
    //   2 hours
    //   4 hours
    //   8 hours
    //   1 day
    //
    // Frontend ko:
    //
    // John
    // 5 Pending Followups
    //
    // milega.
    //
    // ONE PERSON = ONE CARD
    //
    // Highest priority reminder:
    // sabse pehle reminderTime.
    //
    // Overdue mein:
    // sabse purana reminder = highest priority.
    // =====================================================

    private List<ReminderResponse> groupRemindersByPerson(
            List<ReminderSchedule> reminders
    ) {

        if (
                reminders == null
                        || reminders.isEmpty()
        ) {

            return List.of();
        }


        // =================================================
        // REMOVE INVALID / COMPLETED REMINDERS
        // =================================================

        List<ReminderSchedule> incompleteReminders =
                reminders
                        .stream()

                        .filter(reminder ->
                                reminder != null
                        )

                        .filter(reminder ->
                                Boolean.FALSE.equals(
                                        reminder.getIsCompleted()
                                )
                        )

                        .filter(reminder ->
                                reminder.getFollowup() != null
                        )

                        .filter(reminder ->
                                reminder
                                        .getFollowup()
                                        .getLead() != null
                        )

                        .toList();


        if (incompleteReminders.isEmpty()) {

            return List.of();
        }


        // =================================================
        // GROUP BY PERSON
        // =================================================

        Map<Long, List<ReminderSchedule>> grouped =
                incompleteReminders
                        .stream()
                        .collect(
                                Collectors.groupingBy(
                                        reminder ->
                                                reminder
                                                        .getFollowup()
                                                        .getLead()
                                                        .getPersonId(),

                                        LinkedHashMap::new,

                                        Collectors.toList()
                                )
                        );


        // =================================================
        // ONE RESPONSE PER PERSON
        // =================================================

        return grouped
                .values()
                .stream()

                .map(personReminders -> {

                    // =====================================
                    // SORT BY REMINDER TIME
                    //
                    // Earliest = highest priority
                    // =====================================

                    personReminders.sort(
                            Comparator.comparing(
                                    ReminderSchedule::getReminderTime,
                                    Comparator.nullsLast(
                                            Comparator.naturalOrder()
                                    )
                            )
                    );


                    // =====================================
                    // HIGHEST PRIORITY REMINDER
                    // =====================================

                    ReminderSchedule highestPriority =
                            personReminders.get(0);


                    // =====================================
                    // LEAD / PERSON
                    // =====================================

                    Lead lead =
                            highestPriority
                                    .getFollowup()
                                    .getLead();


                    Person person =
                            lead.getPerson();


                    // =====================================
                    // EMPLOYEE
                    // =====================================

                    Employee employee =
                            highestPriority
                                    .getFollowup()
                                    .getEmployee();


                    // =====================================
                    // PENDING FOLLOWUPS
                    // =====================================

                    List<PendingFollowupResponse>
                            pendingFollowups =
                            personReminders
                                    .stream()
                                    .map(
                                            reminder ->
                                                    PendingFollowupResponse
                                                            .builder()

                                                            .reminderId(
                                                                    reminder
                                                                            .getReminderId()
                                                            )

                                                            .reminderType(
                                                                    reminder
                                                                            .getReminderType()
                                                            )

                                                            .reminderTime(
                                                                    reminder
                                                                            .getReminderTime()
                                                            )

                                                            .completed(
                                                                    reminder
                                                                            .getIsCompleted()
                                                            )

                                                            .build()
                                    )
                                    .toList();


                    // =====================================
                    // CREATE RESPONSE
                    // =====================================

                    return ReminderResponse
                            .builder()

                            // =================================
                            // HIGHEST PRIORITY REMINDER
                            // =================================

                            .reminderId(
                                    highestPriority
                                            .getReminderId()
                            )

                            .reminderType(
                                    highestPriority
                                            .getReminderType()
                            )

                            .reminderTime(
                                    highestPriority
                                            .getReminderTime()
                            )

                            .completed(
                                    highestPriority
                                            .getIsCompleted()
                            )

                            .callbackScheduledAt(
                                    highestPriority
                                            .getFollowup()
                                            .getCallbackScheduledAt()
                            )
                            .actionResult(
                                    highestPriority
                                            .getFollowup()
                                            .getActionResult()
                            )

                            .nextFollowupAt(
                                    highestPriority
                                            .getFollowup()
                                            .getNextFollowupAt()
                            )
                            // =================================
                            // PERSON
                            // =================================

                            .personId(
                                    lead.getPersonId()
                            )

                            .firstName(
                                    person != null
                                            ? person.getFirstName()
                                            : null
                            )

                            .middleName(
                                    person != null
                                            ? person.getMiddleName()
                                            : null
                            )

                            .lastName(
                                    person != null
                                            ? person.getLastName()
                                            : null
                            )

                            .email(
                                    getEmail(person)
                            )

                            .phone(
                                    getPhone(person)
                            )


                            // =================================
                            // EMPLOYEE
                            // =================================

                            .employeePersonId(
                                    employee != null
                                            ? employee.getPersonId()
                                            : null
                            )

                            .employeeName(
                                    getEmployeeName(
                                            employee
                                    )
                            )


                            // =================================
                            // LEAD STATUS
                            // =================================

                            .leadStatus(
                                    lead.getLeadStatus() != null
                                            ? lead
                                            .getLeadStatus()
                                            .getStatusName()
                                            : null
                            )


                            // =================================
                            // PENDING COUNT
                            // =================================

                            .pendingCount(
                                    personReminders.size()
                            )


                            // =================================
                            // HIGHEST PRIORITY
                            // =================================

                            .highestPriorityReminderId(
                                    highestPriority
                                            .getReminderId()
                            )

                            .highestPriorityReminderTime(
                                    highestPriority
                                            .getReminderTime()
                            )

                            .highestPriorityReminderType(
                                    highestPriority
                                            .getReminderType()
                            )


                            // =================================
                            // ALL PENDING FOLLOWUPS
                            // =================================

                            .pendingFollowups(
                                    pendingFollowups
                            )

                            .build();

                })

                // =========================================
                // SORT PERSON CARDS
                //
                // Person whose highest reminder is earliest
                // appears first.
                // =========================================

                .sorted(
                        Comparator.comparing(
                                ReminderResponse
                                        ::getHighestPriorityReminderTime,
                                Comparator.nullsLast(
                                        Comparator.naturalOrder()
                                )
                        )
                )

                .toList();
    }


    // =====================================================
    // COMPLETE REMINDER
    // =====================================================

    public void markCompleted(
            Long reminderId
    ) {

        ReminderSchedule reminder =
                reminderRepository
                        .findById(reminderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reminder not found: "
                                                + reminderId
                                )
                        );


        if (
                Boolean.TRUE.equals(
                        reminder.getIsCompleted()
                )
        ) {

            return;
        }


        // =================================================
        // COMPLETE REMINDER
        // =================================================

        reminder.setIsCompleted(true);


        // =================================================
        // COMPLETE FOLLOW-UP
        // =================================================

        LeadFollowup followup =
                reminder.getFollowup();


        if (followup != null) {

            followup.setFollowupStatus(
                    FollowupStatus.COMPLETED
            );

            followup.setCompletedAt(
                    LocalDateTime.now()
            );


            followupRepository.save(
                    followup
            );
        }


        reminderRepository.save(
                reminder
        );
    }


    // =====================================================
    // LEAD REMINDERS
    //
    // Lead detail/history ke liye.
    // Yahan grouping nahi kar rahe.
    // =====================================================

    public List<ReminderResponse> getLeadReminders(
            Long personId
    ) {

        return reminderRepository
                .findLeadRemindersWithDetails(
                        personId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // NOTIFICATION PAGE
    //
    // TODAY + PENDING
    //
    // Both are already grouped:
    // ONE PERSON = ONE RESPONSE
    // =====================================================

    public NotificationPageResponse
    getNotificationPage() {

        return NotificationPageResponse
                .builder()

                .today(
                        getTodayReminders()
                )

                .pending(
                        getPendingFollowups()
                )

                .build();
    }


    // =====================================================
    // SIMPLE REMINDER MAPPER
    //
    // Used for lead reminder history.
    // Today/Pending/Overdue use grouping mapper above.
    // =====================================================

    private ReminderResponse mapToResponse(
            ReminderSchedule reminder
    ) {

        LeadFollowup followup =
                reminder.getFollowup();


        Lead lead =
                followup.getLead();


        Person person =
                lead.getPerson();


        Employee employee =
                followup.getEmployee();


        return ReminderResponse
                .builder()

                // =========================================
                // REMINDER
                // =========================================

                .reminderId(
                        reminder.getReminderId()
                )

                .reminderType(
                        reminder.getReminderType()
                )

                .reminderTime(
                        reminder.getReminderTime()
                )

                .completed(
                        reminder.getIsCompleted()
                )

                .callbackScheduledAt(
                        followup.getCallbackScheduledAt()
                )
                .actionResult(
                        followup.getActionResult()
                )

                .nextFollowupAt(
                        followup.getNextFollowupAt()
                )
                // =========================================
                // PERSON
                // =========================================

                .personId(
                        lead.getPersonId()
                )

                .firstName(
                        person != null
                                ? person.getFirstName()
                                : null
                )

                .middleName(
                        person != null
                                ? person.getMiddleName()
                                : null
                )

                .lastName(
                        person != null
                                ? person.getLastName()
                                : null
                )

                .email(
                        getEmail(person)
                )

                .phone(
                        getPhone(person)
                )


                // =========================================
                // EMPLOYEE
                // =========================================

                .employeePersonId(
                        employee != null
                                ? employee.getPersonId()
                                : null
                )

                .employeeName(
                        getEmployeeName(
                                employee
                        )
                )


                // =========================================
                // LEAD STATUS
                // =========================================

                .leadStatus(
                        lead.getLeadStatus() != null
                                ? lead
                                .getLeadStatus()
                                .getStatusName()
                                : null
                )

                .build();
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


    // =====================================================
    // PRIMARY EMAIL
    // =====================================================

    private String getEmail(
            Person person
    ) {

        if (
                person == null
                        || person.getContacts() == null
        ) {

            return "";
        }


        return person
                .getContacts()
                .stream()

                .filter(contact ->
                        contact != null
                )

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        Boolean.TRUE.equals(
                                contact.getIsPrimary()
                        )
                )

                .filter(contact ->
                        "PRIMARY_EMAIL"
                                .equalsIgnoreCase(
                                        contact
                                                .getContactType()
                                                .getContactTypeName()
                                )
                )

                .map(
                        PersonContact::getContactValue
                )

                .filter(value ->
                        value != null
                                && !value.isBlank()
                )

                .findFirst()

                .orElse("");
    }


    // =====================================================
    // PRIMARY PHONE
    // =====================================================

    private String getPhone(
            Person person
    ) {

        if (
                person == null
                        || person.getContacts() == null
        ) {

            return "";
        }


        return person
                .getContacts()
                .stream()

                .filter(contact ->
                        contact != null
                )

                .filter(contact ->
                        contact.getContactType() != null
                )

                .filter(contact ->
                        Boolean.TRUE.equals(
                                contact.getIsPrimary()
                        )
                )

                .filter(contact ->
                        "PRIMARY_PHONE"
                                .equalsIgnoreCase(
                                        contact
                                                .getContactType()
                                                .getContactTypeName()
                                )
                )

                .map(
                        PersonContact::getContactValue
                )

                .filter(value ->
                        value != null
                                && !value.isBlank()
                )

                .findFirst()

                .orElse("");
    }

}