package com.lms_erp.dashboard.service;

import com.lms_erp.dashboard.dto.CounsellorDashboardResponse;
import com.lms_erp.dashboard.dto.LeadAnalyticsResponse;
import com.lms_erp.dashboard.dto.MyEmployeeDashboardResponse;

import com.lms_erp.employee.repository.DepartmentRepository;
import com.lms_erp.employee.repository.DesignationRepository;
import com.lms_erp.employee.repository.EmployeeLeaveRepository;
import com.lms_erp.employee.repository.EmployeeRepository;

import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.ReminderSchedule;

import com.lms_erp.lead.repository.LeadActivityRepository;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.lead.repository.ReminderScheduleRepository;

import com.lms_erp.security.CurrentUserService;

import com.lms_erp.user.entity.UserRole;
import com.lms_erp.user.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;

    private final ReminderScheduleRepository reminderRepository;

    private final EmployeeLeaveRepository employeeLeaveRepository;

    private final EmployeeRepository employeeRepository;

    private final DepartmentRepository departmentRepository;

    private final DesignationRepository designationRepository;

    private final LeadActivityRepository leadActivityRepository;

    private final CurrentUserService currentUserService;

    private final UserRoleRepository userRoleRepository;


    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    public Map<String, Object> adminDashboard() {

        Map<String, Object> data = new HashMap<>();

        data.put(
                "totalLeads",
                leadRepository.countByIsArchivedFalse()
        );

        data.put(
                "newLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "NEW"
                        )
        );

        data.put(
                "interestedLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "INTERESTED"
                        )
        );

        data.put(
                "insertedLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "INSERTED"
                        )
        );

        data.put(
                "convertedLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "CONVERTED"
                        )
        );

        data.put(
                "callbackLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "CALLBACK"
                        )
        );

        data.put(
                "closedLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "CLOSED"
                        )
        );

        data.put(
                "notInterestedLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "NOT_INTERESTED"
                        )
        );

        data.put(
                "reEngagementLeads",
                leadRepository
                        .countByLeadStatus_StatusNameAndIsArchivedFalse(
                                "RE_ENGAGEMENT"
                        )
        );

        data.put(
                "totalEmployees",
                employeeRepository.count()
        );

        data.put(
                "activeEmployees",
                employeeRepository
                        .countByEmployeeStatus_StatusName(
                                "ACTIVE"
                        )
        );

        data.put(
                "inactiveEmployees",
                employeeRepository
                        .countByEmployeeStatus_StatusName(
                                "INACTIVE"
                        )
        );

        data.put(
                "totalDepartments",
                departmentRepository.count()
        );

        data.put(
                "totalDesignations",
                designationRepository.count()
        );

        return data;
    }


    // =====================================================
    // COUNSELLOR DASHBOARD
    // =====================================================
    @Transactional(readOnly = true)
    public CounsellorDashboardResponse counsellorDashboard(
            Long employeePersonId
    ) {

        if (employeePersonId == null) {

            throw new IllegalArgumentException(
                    "Employee person ID is required"
            );
        }


        // =====================================================
        // WORKING LEADS
        //
        // Counsellor ne create kiya
        // OR
        // Counsellor ko currently assigned hai
        // =====================================================

        List<Lead> workingLeads =
                leadRepository.findCounsellorWorkingLeads(
                        employeePersonId
                );


        // =====================================================
        // TOTAL LEADS
        // =====================================================

        long totalLeads =
                workingLeads.size();


        // =====================================================
        // STATUS COUNTS
        // =====================================================

        long newLeads =
                countStatus(
                        workingLeads,
                        "NEW"
                );

        long interestedLeads =
                countStatus(
                        workingLeads,
                        "INTERESTED"
                );

        long insertedLeads =
                countStatus(
                        workingLeads,
                        "INSERTED"
                );

        long convertedLeads =
                countStatus(
                        workingLeads,
                        "CONVERTED"
                );

        long callbackLeads =
                countStatus(
                        workingLeads,
                        "CALLBACK"
                );

        long closedLeads =
                countStatus(
                        workingLeads,
                        "CLOSED"
                );


        // =====================================================
        // DATE / TIME
        // =====================================================

        LocalDate today =
                LocalDate.now();

        LocalDateTime now =
                LocalDateTime.now();

        LocalDateTime todayStart =
                today.atStartOfDay();

        LocalDateTime tomorrowStart =
                today
                        .plusDays(1)
                        .atStartOfDay();


        // =====================================================
        // TODAY FOLLOWUPS
        //
        // IMPORTANT:
        //
        // Multiple reminders for same person
        // count only ONCE.
        //
        // Example:
        //
        // John -> CALL 10 AM
        // John -> EMAIL 12 PM
        // John -> CALL 4 PM
        //
        // Today Followups = 1
        // =====================================================

        List<ReminderSchedule> todayReminders =
                reminderRepository
                        .findTodayRemindersForEmployee(
                                employeePersonId,
                                todayStart,
                                tomorrowStart
                        );

        long followupsToday =
                countUniqueIncompletePersons(
                        todayReminders
                );


        // =====================================================
        // FUTURE PENDING
        //
        // Tomorrow onwards.
        //
        // Same person ke multiple reminders:
        // only ONE count.
        // =====================================================

        List<ReminderSchedule> futurePendingReminders =
                reminderRepository
                        .findPendingRemindersForEmployee(
                                employeePersonId,
                                tomorrowStart
                        );

        long futurePendingCount =
                countUniqueIncompletePersons(
                        futurePendingReminders
                );


        // =====================================================
        // OVERDUE
        //
        // reminderTime < NOW
        // AND incomplete.
        //
        // Same person ke multiple overdue reminders:
        // only ONE count.
        // =====================================================

        List<ReminderSchedule> overdueReminders =
                reminderRepository
                        .findOverdueRemindersForEmployee(
                                employeePersonId,
                                now
                        );

        long overdueFollowups =
                countUniqueIncompletePersons(
                        overdueReminders
                );


        // =====================================================
        // TOTAL PENDING
        //
        // Pending =
        //
        // FUTURE + OVERDUE
        //
        // BUT:
        //
        // Same person should NOT be counted twice.
        //
        // Example:
        //
        // John -> overdue
        // John -> future
        // Sarah -> future
        //
        // Pending = 2
        //
        // NOT 3.
        // =====================================================

        List<ReminderSchedule> allPendingReminders =
                new java.util.ArrayList<>();

        if (futurePendingReminders != null) {

            allPendingReminders.addAll(
                    futurePendingReminders
            );
        }

        if (overdueReminders != null) {

            allPendingReminders.addAll(
                    overdueReminders
            );
        }


        long pendingFollowups =
                countUniqueIncompletePersons(
                        allPendingReminders
                );


        // =====================================================
        // COMMUNICATION
        // =====================================================

        long totalCalls =
                leadActivityRepository
                        .countByEmployee_PersonIdAndCommunicationType(
                                employeePersonId,
                                "CALL"
                        );

        long totalEmails =
                leadActivityRepository
                        .countByEmployee_PersonIdAndCommunicationType(
                                employeePersonId,
                                "EMAIL"
                        );

        long totalSms =
                leadActivityRepository
                        .countByEmployee_PersonIdAndCommunicationType(
                                employeePersonId,
                                "SMS"
                        );


        // =====================================================
        // EMAIL SENT
        //
        // Current system mein separate SENT tracking nahi hai.
        // Isliye total EMAIL activity count use ho raha hai.
        // =====================================================

        long emailsSent =
                totalEmails;


        // =====================================================
        // EMAIL REPLIED
        //
        // Current repository mein reply tracking available nahi.
        // =====================================================

        long emailsReplied =
                0L;


        // =====================================================
        // CONVERSION RATE
        // =====================================================

        double conversionRate =
                totalLeads == 0
                        ? 0.0
                        : (
                        convertedLeads * 100.0
                ) / totalLeads;


        // =====================================================
        // RESPONSE
        // =====================================================

        return CounsellorDashboardResponse
                .builder()

                // =============================================
                // LEADS
                // =============================================

                .totalLeads(
                        totalLeads
                )

                .newLeads(
                        newLeads
                )

                .interestedLeads(
                        interestedLeads
                )

                .insertedLeads(
                        insertedLeads
                )

                .convertedLeads(
                        convertedLeads
                )

                .callbackLeads(
                        callbackLeads
                )

                .closedLeads(
                        closedLeads
                )


                // =============================================
                // FOLLOWUPS
                // =============================================

                .followupsToday(
                        followupsToday
                )

                .pendingFollowups(
                        pendingFollowups
                )

                .overdueFollowups(
                        overdueFollowups
                )


                // =============================================
                // COMMUNICATION
                // =============================================

                .totalCalls(
                        totalCalls
                )

                .totalEmails(
                        totalEmails
                )

                .totalSms(
                        totalSms
                )


                // =============================================
                // EMAIL
                // =============================================

                .emailsSent(
                        emailsSent
                )

                .emailsReplied(
                        emailsReplied
                )


                // =============================================
                // CONVERSION
                // =============================================

                .conversionRate(
                        conversionRate
                )

                .build();
    }


    // =====================================================
    // EMPLOYEE DASHBOARD
    // =====================================================

    public MyEmployeeDashboardResponse employeeDashboard(
            Long employeeId
    ) {

        Long totalLeaves =
                employeeLeaveRepository
                        .countByEmployeePersonId(
                                employeeId
                        );

        Long approvedLeaves =
                employeeLeaveRepository
                        .countByEmployeePersonIdAndLeaveStatus_StatusName(
                                employeeId,
                                "APPROVED"
                        );

        Long pendingLeaves =
                employeeLeaveRepository
                        .countByEmployeePersonIdAndLeaveStatus_StatusName(
                                employeeId,
                                "PENDING"
                        );

        return MyEmployeeDashboardResponse
                .builder()

                .totalLeaves(
                        totalLeaves
                )

                .approvedLeaves(
                        approvedLeaves
                )

                .pendingLeaves(
                        pendingLeaves
                )

                .build();
    }


    // =====================================================
    // LEAD ANALYTICS
    // =====================================================


    public LeadAnalyticsResponse getLeadAnalytics(
            Long employeePersonId,
            LocalDateTime start,
            LocalDateTime end
    ) {

        // =====================================================
        // CURRENT USER
        // =====================================================

        Long currentUserId =
                currentUserService
                        .getCurrentUser()
                        .getUserId();

        Long currentEmployeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();


        // =====================================================
        // GET USER ROLES
        // =====================================================

        List<UserRole> userRoles =
                userRoleRepository
                        .findAllByUserUserId(
                                currentUserId
                        );

        if (userRoles.isEmpty()) {

            throw new RuntimeException(
                    "Role not found"
            );
        }


        // =====================================================
        // CHECK ADMIN
        // =====================================================

        boolean isAdmin =
                userRoles
                        .stream()
                        .anyMatch(userRole ->
                                "ADMIN".equalsIgnoreCase(
                                        userRole
                                                .getRole()
                                                .getRoleName()
                                )
                        );


        // =====================================================
        // NON ADMIN = CURRENT EMPLOYEE
        // =====================================================

        if (!isAdmin) {

            employeePersonId =
                    currentEmployeePersonId;
        }


        // =====================================================
        // DEFAULT DATE RANGE
        // =====================================================

        if (start == null) {

            start =
                    LocalDateTime
                            .now()
                            .minusYears(10);
        }


        if (end == null) {

            end =
                    LocalDateTime
                            .now()
                            .plusDays(1);
        }


        // =====================================================
        // COUNSELLOR ANALYTICS
        // =====================================================

        if (employeePersonId != null) {

            return LeadAnalyticsResponse
                    .builder()

                    // =========================================
                    // ALL
                    // DATE = ACTION PERFORMED DATE
                    // =========================================

                    .totalLeads(
                            leadRepository
                                    .countCounsellorAllActionLeadsByDate(
                                            employeePersonId,
                                            start,
                                            end
                                    )
                    )

                    // =========================================
                    // NEW
                    // DATE = CREATED DATE
                    // =========================================

                    .newLeads(
                            leadRepository
                                    .countCreatedByEmployeeAndStatusBetween(
                                            employeePersonId,
                                            "NEW",
                                            start,
                                            end
                                    )
                    )

                    // =========================================
                    // INTERESTED
                    // DATE = ACTION PERFORMED DATE
                    // =========================================

                    .interestedLeads(
                            leadRepository
                                    .countCounsellorActionByDate(
                                            employeePersonId,
                                            "INTERESTED",
                                            start,
                                            end
                                    )
                    )

                    // =========================================
                    // NOT INTERESTED
                    // DATE = ACTION PERFORMED DATE
                    // =========================================

                    .notInterestedLeads(
                            leadRepository
                                    .countCounsellorActionByDate(
                                            employeePersonId,
                                            "NOT_INTERESTED",
                                            start,
                                            end
                                    )
                    )

                    // =========================================
                    // CONVERTED
                    // DATE = ACTION PERFORMED DATE
                    // =========================================

                    .convertedLeads(
                            leadRepository
                                    .countCounsellorActionByDate(
                                            employeePersonId,
                                            "CONVERTED",
                                            start,
                                            end
                                    )
                    )

                    // =========================================
                    // CALLBACK
                    // DATE = ACTION PERFORMED DATE
                    // =========================================

                    .callbackLeads(
                            leadRepository
                                    .countCounsellorActionByDate(
                                            employeePersonId,
                                            "CALLBACK_REQUESTED",
                                            start,
                                            end
                                    )
                    )

                    // =========================================
                    // RE-ENGAGEMENT
                    // DATE = ACTION PERFORMED DATE
                    // =========================================

                    .reEngagementLeads(
                            leadRepository
                                    .countCounsellorActionByDate(
                                            employeePersonId,
                                            "RE_ENGAGEMENT",
                                            start,
                                            end
                                    )
                    )

                    .build();
        }


        // =====================================================
        // ADMIN ANALYTICS
        // =====================================================

        return LeadAnalyticsResponse
                .builder()

                // =========================================
                // ALL
                // DATE = ACTION PERFORMED DATE
                // =========================================

                .totalLeads(
                        leadRepository
                                .countAllActionLeadsByDate(
                                        start,
                                        end
                                )
                )

                // =========================================
                // NEW
                // DATE = CREATED DATE
                // =========================================

                .newLeads(
                        leadRepository
                                .countByLeadStatus_StatusNameAndCreatedAtBetweenAndIsArchivedFalse(
                                        "NEW",
                                        start,
                                        end
                                )
                )

                // =========================================
                // INTERESTED
                // DATE = ACTION PERFORMED DATE
                // =========================================

                .interestedLeads(
                        leadRepository
                                .countActionByDate(
                                        "INTERESTED",
                                        start,
                                        end
                                )
                )

                // =========================================
                // NOT INTERESTED
                // DATE = ACTION PERFORMED DATE
                // =========================================

                .notInterestedLeads(
                        leadRepository
                                .countActionByDate(
                                        "NOT_INTERESTED",
                                        start,
                                        end
                                )
                )

                // =========================================
                // CONVERTED
                // DATE = ACTION PERFORMED DATE
                // =========================================

                .convertedLeads(
                        leadRepository
                                .countActionByDate(
                                        "CONVERTED",
                                        start,
                                        end
                                )
                )

                // =========================================
                // CALLBACK
                // DATE = ACTION PERFORMED DATE
                // =========================================

                .callbackLeads(
                        leadRepository
                                .countActionByDate(
                                        "CALLBACK_REQUESTED",
                                        start,
                                        end
                                )
                )

                // =========================================
                // RE-ENGAGEMENT
                // DATE = ACTION PERFORMED DATE
                // =========================================

                .reEngagementLeads(
                        leadRepository
                                .countActionByDate(
                                        "RE_ENGAGEMENT",
                                        start,
                                        end
                                )
                )

                .build();
    }
    // =====================================================
    // COUNT LEADS BY STATUS
    // =====================================================

    private long countStatus(
            List<Lead> leads,
            String status
    ) {

        if (
                leads == null
                        || leads.isEmpty()
                        || status == null
        ) {

            return 0L;
        }


        return leads
                .stream()

                .filter(lead ->
                        lead != null
                )

                .filter(lead ->
                        lead.getLeadStatus() != null
                )

                .filter(lead ->
                        lead.getLeadStatus()
                                .getStatusName() != null
                )

                .filter(lead ->
                        status.equalsIgnoreCase(
                                lead
                                        .getLeadStatus()
                                        .getStatusName()
                        )
                )

                .count();
    }


    // =====================================================
    // COUNT INCOMPLETE REMINDERS
    // =====================================================

    private long countIncompleteReminders(
            List<ReminderSchedule> reminders
    ) {

        if (
                reminders == null
                        || reminders.isEmpty()
        ) {

            return 0L;
        }


        return reminders
                .stream()

                .filter(reminder ->
                        reminder != null
                )

                .filter(reminder ->
                        !Boolean.TRUE.equals(
                                reminder.getIsCompleted()
                        )
                )

                .count();
    }

    // =====================================================
// COUNT UNIQUE INCOMPLETE PERSONS
//
// IMPORTANT:
//
// One person = one count.
//
// Multiple reminders for the same person
// will NOT increase the count.
//
// Example:
//
// John -> 10 AM
// John -> 12 PM
// John -> 3 PM
// Sarah -> 2 PM
//
// Result:
//
// 2
// =====================================================

    private long countUniqueIncompletePersons(
            List<ReminderSchedule> reminders
    ) {

        if (
                reminders == null
                        || reminders.isEmpty()
        ) {

            return 0L;
        }


        return reminders
                .stream()

                // -----------------------------------------
                // Valid reminder
                // -----------------------------------------

                .filter(
                        reminder -> reminder != null
                )

                // -----------------------------------------
                // Only incomplete
                // -----------------------------------------

                .filter(
                        reminder ->
                                !Boolean.TRUE.equals(
                                        reminder.getIsCompleted()
                                )
                )

                // -----------------------------------------
                // Followup exists
                // -----------------------------------------

                .filter(
                        reminder ->
                                reminder.getFollowup() != null
                )

                // -----------------------------------------
                // Lead exists
                // -----------------------------------------

                .filter(
                        reminder ->
                                reminder
                                        .getFollowup()
                                        .getLead() != null
                )

                // -----------------------------------------
                // PERSON ID
                //
                // distinct() means:
                //
                // Same person = one count
                // -----------------------------------------

                .map(
                        reminder ->
                                reminder
                                        .getFollowup()
                                        .getLead()
                                        .getPersonId()
                )

                .filter(
                        personId ->
                                personId != null
                )

                .distinct()

                .count();
    }
}