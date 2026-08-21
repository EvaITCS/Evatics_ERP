package com.lms_erp.lead.service;
import com.lms_erp.common.util.NameFormatterUtil;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.exception.HttpException;
import com.lms_erp.lead.dto.*;
import com.lms_erp.lead.entity.*;
import com.lms_erp.lead.enums.LeadPriority;
import com.lms_erp.lead.enums.NotificationType;
import com.lms_erp.lead.repository.*;
import com.lms_erp.employee.entity.Employee;


import com.lms_erp.person.entity.*;
import com.lms_erp.person.repository.ContactTypeMasterRepository;
import com.lms_erp.person.repository.PersonContactRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.repository.PersonVisaRepository;

import com.lms_erp.security.CurrentUserService;


import com.lms_erp.user.repository.UserRepository;
import com.lms_erp.user.repository.UserRoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import com.lms_erp.lead.enums.FollowupStatus;
@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final PersonRepository personRepository;
    private final LeadSourceRepository leadSourceRepository;

    private final PersonContactRepository personContactRepository;
    private final ContactTypeMasterRepository contactTypeRepository;

    private final PersonVisaRepository personVisaRepository;
    private final AutoAssignmentService autoAssignmentService;

// =====================================
// EMPLOYEE
// =====================================

    private final EmployeeRepository employeeRepository;

// =====================================
// USER (KEEP FOR AUTH & NOTIFICATION)
// =====================================

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    private final LeadStatusMasterRepository leadStatusMasterRepository;
    private final LeadStatusHistoryRepository leadStatusHistoryRepository;
    private final LeadAssignmentService leadAssignmentService;
    private final LeadAssignmentRepository leadAssignmentRepository;
    private final LeadActivityRepository leadActivityRepository;
    private final FollowupRepository followupRepository;
    private final NotificationRepository notificationRepository;

    private final LeadScoreService leadScoreService;


    private final CurrentUserService currentUserService;


    @Transactional
    public void markApplicationStarted(Long personId) {

        Lead lead = leadRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        lead.setLeadStatus(
                getLeadStatus("APPLICATION_STARTED")
        );

        leadRepository.save(lead);

        LeadAssignment assignment = leadAssignmentRepository
                .findByLead_PersonIdAndIsActiveTrue(personId)
                .orElseThrow(() ->
                        new RuntimeException("No active assignment found"));

        saveLeadActivity(
                lead,
                assignment.getEmployee(),
                "APPLICATION_STARTED",
                "SUCCESS",
                "Application Started"
        );
    }

    // ===============================
    // ==========
    // CREATE LEAD
    // =========================================
    @Transactional
    public LeadResponse createLead(CreateLeadRequest request) {

        // =====================================================
        // DUPLICATE EMAIL CHECK
        // =====================================================

        if (request.getEmail() != null
                && !request.getEmail().isBlank()
                && personContactRepository
                .existsByContactValue(request.getEmail().trim())) {

            throw HttpException.badRequest(
                    "This email address is already registered in the system."
            );
        }


        // =====================================================
        // PERSON
        // =====================================================

        Person person = Person.builder()

                .firstName(
                        NameFormatterUtil.toTitleCase(
                                request.getFirstName()
                        )
                )

                .middleName(
                        NameFormatterUtil.toTitleCase(
                                request.getMiddleName()
                        )
                )

                .lastName(
                        NameFormatterUtil.toTitleCase(
                                request.getLastName()
                        )
                )

                .build();


        person = personRepository.save(person);


        // =====================================================
        // CONTACT TYPES
        // =====================================================

        ContactTypeMaster emailType =
                contactTypeRepository
                        .findByContactTypeNameIgnoreCase(
                                "PRIMARY_EMAIL"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PRIMARY_EMAIL contact type missing"
                                )
                        );


        ContactTypeMaster phoneType =
                contactTypeRepository
                        .findByContactTypeNameIgnoreCase(
                                "PRIMARY_PHONE"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "PRIMARY_PHONE contact type missing"
                                )
                        );


        // =====================================================
        // EMAIL
        // =====================================================

        if (request.getEmail() != null
                && !request.getEmail().isBlank()) {

            PersonContact email = new PersonContact();

            email.setPerson(person);

            email.setContactType(emailType);

            email.setContactValue(
                    request.getEmail().trim()
            );

            email.setIsPrimary(true);

            personContactRepository.save(email);
        }


        // =====================================================
        // PHONE
        // =====================================================

        if (request.getPhone() != null
                && !request.getPhone().isBlank()) {

            PersonContact phone = new PersonContact();

            phone.setPerson(person);

            phone.setContactType(phoneType);

            phone.setContactValue(
                    request.getPhone().trim()
            );

            phone.setIsPrimary(true);

            personContactRepository.save(phone);
        }


        // =====================================================
        // CURRENT LOGGED-IN EMPLOYEE
        // =====================================================

        Employee currentEmployee =
                currentUserService.getCurrentEmployee();


        Employee employee;


        // =====================================================
        // COUNSELLOR CREATES LEAD
        //
        // Counsellor can only assign the lead
        // to himself/herself.
        //
        // employeePersonId from frontend is ignored.
        // =====================================================

        if (currentUserService.hasRole("COUNSELLOR")) {

            employee = currentEmployee;
        }


        // =====================================================
        // ADMIN CREATES LEAD
        //
        // ADMIN MUST SELECT A COUNSELLOR.
        //
        // employeePersonId comes from:
        //
        // CreateLeadRequest.employeePersonId
        //
        // =====================================================

        else if (currentUserService.hasRole("ADMIN")) {

            if (request.getEmployeePersonId() == null) {

                throw HttpException.badRequest(
                        "Please select a counsellor before creating the lead."
                );
            }


            employee =
                    employeeRepository
                            .findById(
                                    request.getEmployeePersonId()
                            )
                            .orElseThrow(() ->
                                    HttpException.badRequest(
                                            "Selected counsellor not found."
                                    )
                            );
        }


        // =====================================================
        // OTHER ROLES
        // =====================================================

        else {

            throw HttpException.badRequest(
                    "You are not authorized to create leads."
            );
        }


        // =====================================================
        // LEAD SOURCE
        // =====================================================

        LeadSource leadSource = null;

        String customLeadSource = null;


        if (request.getLeadSourceId() != null) {

            leadSource =
                    leadSourceRepository.findById(
                                    request.getLeadSourceId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Lead Source not found"
                                    )
                            );


            // =============================================
            // OTHER LEAD SOURCE
            // =============================================

            if ("Other".equalsIgnoreCase(
                    leadSource.getSourceName()
            )) {

                customLeadSource =
                        request.getCustomLeadSource();


                if (customLeadSource == null
                        || customLeadSource.isBlank()) {

                    throw HttpException.badRequest(
                            "Please enter Lead Source."
                    );
                }


                customLeadSource =
                        customLeadSource.trim();
            }
        }


        // =====================================================
        // LEAD STATUS
        // =====================================================

        LeadStatusMaster leadStatus;


        if (request.getLeadStatusId() != null) {

            leadStatus =
                    leadStatusMasterRepository
                            .findById(
                                    request.getLeadStatusId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Lead Status not found"
                                    )
                            );

        } else {

            leadStatus =
                    getLeadStatus("NEW");
        }


        // =====================================================
        // LEAD
        // =====================================================

        Lead lead =
                Lead.builder()

                        .person(person)

                        .leadSource(leadSource)

                        .customLeadSource(
                                customLeadSource
                        )

                        .leadStatus(leadStatus)

                        .leadPriority(
                                request.getLeadPriority() != null
                                        ? request.getLeadPriority()
                                        : LeadPriority.WARM
                        )

                        .computerExperience(
                                request.getComputerExperience() != null
                                        ? request.getComputerExperience()
                                        : false
                        )

                        .createdBy(
                                currentEmployee
                        )

                        .isArchived(false)

                        .build();


        Lead savedLead =
                leadRepository.save(lead);


        // =====================================================
        // LEAD ACTIVITY
        // =====================================================

        saveLeadActivity(
                savedLead,
                employee,
                "LEAD_CREATED",
                "SUCCESS",
                "Lead created and assigned to "
                        + employee.getPerson().getFirstName()
                        + " "
                        + employee.getPerson().getLastName()
        );


        // =====================================================
        // INITIAL SCORE
        // =====================================================

        leadScoreService.createInitialScore(
                savedLead.getPersonId()
        );


        // =====================================================
        // ASSIGNMENT HISTORY
        // =====================================================

        saveAssignmentHistory(
                savedLead,
                employee,
                currentEmployee,
                "Initial Assignment"
        );


        // =====================================================
        // NOTIFICATION
        // =====================================================

        createNotification(
                employee,

                "New Lead Assigned",

                "Lead "
                        + savedLead
                        .getPerson()
                        .getFirstName()
                        + " has been assigned to you.",

                NotificationType.LEAD_ASSIGNED
        );


        // =====================================================
        // VISA
        // =====================================================

        if (request.getVisaType() != null
                && !request.getVisaType().isBlank()) {

            PersonVisa personVisa =
                    PersonVisa.builder()

                            .person(person)

                            .visaType(
                                    request.getVisaType().trim()
                            )

                            .build();


            personVisaRepository.save(
                    personVisa
            );
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        return mapToResponse(
                savedLead
        );
    }

//     =========================================
    // GET ALL ACTIVE LEADS
    // =========================================
//
//    public List<LeadResponse> getAllLeads() {
//
//        return leadRepository
//                .findAllWithLeadSource()
//                .stream()
//                .map(this::mapToResponse)
//                .collect(Collectors.toList());
//    }

    // =========================================
    // GET LEAD BY ID
    // =========================================
    @Transactional(readOnly = true)
    public LeadResponse getLeadById(
            Long leadId
    ) {

        Lead lead = leadRepository
                .findByPersonIdWithDetails(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));


        return mapToResponse(lead);
    }

    // =========================================
    // GET CONSULTANT ACTIVE LEADS
    // =========================================


    // =========================================
    // GET RE-ENGAGEMENT LEADS
    // =========================================

    //
//    public List<LeadResponse> getMyReEngagementLeads() {
//
//        Long employeePersonId =
//                currentUserService.getCurrentEmployee().getPersonId();
//
//        System.out.println("Employee = " + employeePersonId);
//
//        List<Lead> leads =
//                leadRepository.findReEngagementLeadsByEmployee(employeePersonId);
//
//        System.out.println("ReEngagement Leads Count = " + leads.size());
//
//        leads.forEach(l ->
//                System.out.println(
//                        l.getPersonId() + " -> " +
//                                l.getLeadStatus().getStatusName()
//                ));
//
//        return leads.stream()
//                .map(this::mapToResponse)
//                .toList();
//    }
//    public List<LeadResponse> getLeadsByStatus(
//            String status
//    ) {
//
//        LeadStatusMaster leadStatus =
//                getLeadStatus(status);
//
//        return leadRepository
//                .findByLeadStatus(leadStatus)
//                .stream()
//                .map(this::mapToResponse)
//                .collect(Collectors.toList());
//    }

    // =========================================
// UPDATE STATUS
// =========================================
    @Transactional
    public void updateLeadStatus(
            Long personId,
            UpdateLeadStatusRequest request
    ) {

        // =====================================
        // FIND LEAD
        // =====================================

        Lead lead = leadRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        // =====================================
        // OLD STATUS
        // =====================================

        LeadStatusMaster oldStatus = lead.getLeadStatus();

        // =====================================
        // NEW STATUS
        // =====================================

        LeadStatusMaster newStatus =
                leadStatusMasterRepository.findById(request.getLeadStatusId())
                        .orElseThrow(() ->
                                new RuntimeException("Lead status not found"));

        // =====================================
        // CURRENT EMPLOYEE
        // =====================================

        Employee currentEmployee =
                currentUserService.getCurrentEmployee();

        // =====================================
        // UPDATE STATUS
        // =====================================

        lead.setLeadStatus(newStatus);

        leadRepository.save(lead);

        // =====================================
        // ACTIVITY
        // =====================================

        saveLeadActivity(
                lead,
                currentEmployee,
                "STATUS_CHANGE",
                newStatus.getStatusName(),
                request.getRemarks()
        );

        // =====================================
        // STATUS HISTORY
        // =====================================

        saveStatusHistory(
                lead,
                oldStatus,
                newStatus,
                currentEmployee.getPersonId(),
                request.getRemarks()
        );

        // =====================================
        // FIND CURRENT ASSIGNED EMPLOYEE
        // =====================================

        leadAssignmentRepository
                .findByLead_PersonIdAndIsActiveTrue(personId)
                .ifPresent(assignment ->

                        createNotification(

                                assignment.getEmployee(),

                                "Lead Status Updated",

                                "Lead "
                                        + lead.getPerson().getFirstName()
                                        + " status changed from "
                                        + (oldStatus != null
                                        ? oldStatus.getStatusName()
                                        : "-")
                                        + " to "
                                        + newStatus.getStatusName(),

                                NotificationType.STATUS_CHANGED
                        )
                );
    }
// =========================================
// GET LEADS BY STATUS
// =========================================

    @Transactional(readOnly = true)
    public List<LeadResponse> getLeadsByStatus(
            String status
    ) {

        LeadStatusMaster leadStatus =
                getLeadStatus(status);

        return leadRepository
                .findByLeadStatus(leadStatus)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    // =========================================
    // ARCHIVE LEAD
    // =========================================
    @Transactional
    public void archiveLead(Long personId) {

        Lead lead = leadRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        lead.setIsArchived(true);

        leadRepository.save(lead);

        LeadAssignment activeAssignment = leadAssignmentRepository
                .findByLead_PersonIdAndIsActiveTrue(personId)
                .orElse(null);

        if (activeAssignment != null) {

            saveLeadActivity(
                    lead,
                    activeAssignment.getEmployee(),
                    "LEAD_ARCHIVED",
                    "SUCCESS",
                    "Lead Archived"
            );

            createNotification(
                    activeAssignment.getEmployee(),
                    "Lead Archived",
                    "Lead " + lead.getPerson().getFirstName()
                            + " has been archived.",
                    NotificationType.LEAD_ARCHIVED
            );
        }
    }
    // =========================================
    // SEARCH LEADS
    // =========================================

    public List<LeadResponse> searchLeads(String keyword) {

        String searchKeyword = keyword.toLowerCase();

        return leadRepository.findAllWithLeadSource()
                .stream()
                .filter(lead -> {

                    Person person = lead.getPerson();

                    if (person == null) {
                        return false;
                    }

                    String email = getPrimaryEmail(person);
                    String phone = getPrimaryPhone(person);

                    return

                            (person.getFirstName() != null
                                    && person.getFirstName()
                                    .toLowerCase()
                                    .contains(searchKeyword))

                                    ||

                                    (person.getLastName() != null
                                            && person.getLastName()
                                            .toLowerCase()
                                            .contains(searchKeyword))

                                    ||

                                    (email != null
                                            && !email.isBlank()
                                            && email.toLowerCase()
                                            .contains(searchKeyword))

                                    ||

                                    (phone != null
                                            && !phone.isBlank()
                                            && phone.contains(keyword));
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // =========================================
// ASSIGN / REASSIGN LEAD
// =========================================
    private void saveAssignmentHistory(

            Lead lead,

            Employee employee,

            Employee assignedBy,

            String remarks
    ) {

        LeadAssignment assignment = new LeadAssignment();

        assignment.setLead(lead);

        assignment.setEmployee(employee);

        assignment.setAssignedBy(assignedBy);

        assignment.setIsActive(true);

        assignment.setRemarks(remarks);

        leadAssignmentRepository.save(assignment);
    }

    @Transactional
    public void assignLead(Long personId, Long employeePersonId) {

        Lead lead = leadRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        Employee employee = employeeRepository.findById(employeePersonId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        // =====================================
        // CURRENT ACTIVE ASSIGNMENT
        // =====================================

        LeadAssignment oldAssignment = leadAssignmentRepository
                .findByLead_PersonIdAndIsActiveTrue(personId)
                .orElse(null);

        Employee oldEmployee = null;

        if (oldAssignment != null) {

            oldEmployee = oldAssignment.getEmployee();

            oldAssignment.setIsActive(false);

            leadAssignmentRepository.save(oldAssignment);
        }

        // =====================================
        // NEW ASSIGNMENT
        // =====================================

        LeadAssignment assignment = new LeadAssignment();

        assignment.setLead(lead);

        assignment.setEmployee(employee);

        assignment.setAssignedBy(currentUserService.getCurrentEmployee());

        assignment.setIsActive(true);

        String remarks;

        if (oldEmployee != null) {

            remarks =
                    "Reassigned from "
                            + oldEmployee.getPerson().getFirstName()
                            + " "
                            + oldEmployee.getPerson().getLastName()
                            + " to "
                            + employee.getPerson().getFirstName()
                            + " "
                            + employee.getPerson().getLastName();

        } else {

            remarks = "Initial Assignment";
        }

        assignment.setRemarks(remarks);

        leadAssignmentRepository.save(assignment);

        // =====================================
        // ACTIVITY
        // =====================================

        saveLeadActivity(
                lead,
                employee,
                "LEAD_ASSIGNED",
                "SUCCESS",
                remarks
        );

        // =====================================
        // NOTIFICATION
        // =====================================

        createNotification(
                employee,
                "Lead Assigned",
                "Lead "
                        + lead.getPerson().getFirstName()
                        + " has been assigned to you.",
                NotificationType.LEAD_ASSIGNED
        );
    }

    private void createNotification(

            Employee employee,

            String title,

            String message,

            NotificationType type
    ) {

        if (employee == null) {
            return;
        }

        LeadNotification notification =
                new LeadNotification();

        notification.setEmployee(employee);

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setNotificationType(type);

        notification.setIsRead(false);

        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    private void saveStatusHistory(

            Lead lead,

            LeadStatusMaster oldStatus,

            LeadStatusMaster newStatus,

            Long changedByPersonId,

            String remarks
    ) {

        Person changedByPerson = null;

        if (changedByPersonId != null) {

            changedByPerson = personRepository
                    .findById(changedByPersonId)
                    .orElse(null);
        }

        LeadStatusHistory history =
                new LeadStatusHistory();

        history.setLead(lead);

        history.setOldStatus(oldStatus);

        history.setNewStatus(newStatus);

        history.setChangedByPerson(changedByPerson);

        history.setRemarks(remarks);

        leadStatusHistoryRepository.save(history);
    }
    // =========================================
    // MAP RESPONSE
    // =========================================

//    private LeadResponse mapToResponse(Lead lead) {
//
//        // =====================================
//        // ACTIVE ASSIGNMENT
//        // =====================================
//
//        LeadAssignment assignment = leadAssignmentRepository
//                .findByLead_PersonIdAndIsActiveTrue(lead.getPersonId())
//                .orElse(null);
//
//        // =====================================
//        // ASSIGNED EMPLOYEE NAME
//        // =====================================
//
//        String assignedEmployeeName = "Unassigned";
//
//        if (assignment != null
//                && assignment.getEmployee() != null
//                && assignment.getEmployee().getPerson() != null) {
//
//            assignedEmployeeName =
//                    assignment.getEmployee().getPerson().getFirstName()
//                            + " "
//                            + assignment.getEmployee().getPerson().getLastName();
//        }
//
//        // =====================================
//        // CREATED BY (TEMPORARILY DISABLED)
//        // =====================================
//
////        Employee createdBy = null;
////
////        String createdByName = null;
//        Employee createdBy = lead.getCreatedBy();
//
//        String createdByName = null;
//
//        if (createdBy != null
//                && createdBy.getPerson() != null) {
//
//            createdByName =
//                    createdBy.getPerson().getFirstName()
//                            + " "
//                            + createdBy.getPerson().getLastName();
//        }
//        // =====================================
//        // RESPONSE
//        // =====================================
//
//        return LeadResponse.builder()
//
//                // =====================================
//                // PERSON
//                // =====================================
//
//                .personId(lead.getPersonId())
//
//                .firstName(lead.getPerson().getFirstName())
//                .middleName(lead.getPerson().getMiddleName())
//                .lastName(lead.getPerson().getLastName())
//
//                .email(getPrimaryEmail(lead.getPerson()))
//                .phone(getPrimaryPhone(lead.getPerson()))
//
//                // =====================================
//                // STATUS
//                // =====================================
//
//                .leadStatusId(
//                        lead.getLeadStatus() != null
//                                ? lead.getLeadStatus().getLeadStatusId()
//                                : null
//                )
//
//                .leadStatus(
//                        lead.getLeadStatus() != null
//                                ? lead.getLeadStatus().getStatusName()
//                                : null
//                )
//
//                // =====================================
//                // ASSIGNED EMPLOYEE
//                // =====================================
//
//                .employeePersonId(
//                        assignment != null
//                                && assignment.getEmployee() != null
//                                ? assignment.getEmployee().getPersonId()
//                                : null
//                )
//
//                .assignedEmployeeName(
//                        assignedEmployeeName
//                )
//
//                // =====================================
//                // CREATED BY (TEMPORARILY DISABLED)
//                // =====================================
////
////                .createdByPersonId(null)
////
////                .createdByName(null)
//
//                .createdByPersonId(
//                        createdBy != null
//                                ? createdBy.getPersonId()
//                                : null
//                )
//
//                .createdByName(createdByName)
//
//                // =====================================
//                // SOURCE
//                // =====================================
//
//                .leadSourceId(
//                        lead.getLeadSource() != null
//                                ? lead.getLeadSource().getSourceId()
//                                : null
//                )
//
//                .leadSourceName(
//                        lead.getLeadSource() != null
//                                ? lead.getLeadSource().getSourceName()
//                                : "-"
//                )
//                .customLeadSource(
//                        lead.getCustomLeadSource()
//                )
//                // =====================================
//                // OTHER DETAILS
//                // =====================================
//
//                .leadPriority(lead.getLeadPriority())
//
//                .computerExperience(
//                        lead.getComputerExperience()
//                )
//
//                .createdAt(
//                        lead.getCreatedAt()
//                )
//
//                .timeline(List.of())
////          .timeline(buildTimeline(lead.getPersonId()))
//
//                .build();
//    }

    public List<LeadStatusHistoryResponse> getLeadStatusHistory(Long personId) {

        return leadStatusHistoryRepository
                .findByLead_PersonIdOrderByChangedAtDesc(personId)
                .stream()
                .map(history -> LeadStatusHistoryResponse.builder()

                        .historyId(history.getHistoryId())

                        .oldStatusName(
                                history.getOldStatus() != null
                                        ? history.getOldStatus().getStatusName()
                                        : "-"
                        )

                        .newStatusName(
                                history.getNewStatus() != null
                                        ? history.getNewStatus().getStatusName()
                                        : "-"
                        )

                        .changedBy(
                                history.getChangedByPerson() != null
                                        ? history.getChangedByPerson().getFirstName()
                                          + " "
                                          + history.getChangedByPerson().getLastName()
                                        : "-"
                        )

                        .remarks(history.getRemarks())

                        .changedAt(history.getChangedAt())

                        .build())
                .toList();
    }

    public List<LeadAssignmentResponse> getLeadAssignmentHistory(Long personId) {

        return leadAssignmentRepository
                .findByLead_PersonIdOrderByAssignedAtDesc(personId)
                .stream()
                .map(assignment -> LeadAssignmentResponse.builder()

                        .assignmentId(
                                assignment.getAssignmentId()
                        )

                        .employeePersonId(
                                assignment.getEmployee().getPersonId()
                        )

                        .employeeName(
                                assignment.getEmployee()
                                        .getPerson()
                                        .getFirstName()
                                        + " "
                                        + assignment.getEmployee()
                                        .getPerson()
                                        .getLastName()
                        )

                        .remarks(
                                assignment.getRemarks()
                        )

                        .isActive(
                                assignment.getIsActive()
                        )

                        .assignedAt(
                                assignment.getAssignedAt()
                        )

                        .build())
                .toList();
    }

    public List<LeadActivityResponse> getLeadActivities(Long personId) {

        return leadActivityRepository.findByLead_PersonId(personId)
                .stream()
                .map(activity -> LeadActivityResponse.builder()
                        .logId(activity.getLogId())
                        .communicationType(activity.getCommunicationType())
                        .communicationStatus(activity.getCommunicationStatus())
                        .remarks(activity.getRemarks())
                        .communicationTime(activity.getCommunicationTime())

                        .employeePersonId(activity.getEmployee().getPersonId())

                        .employeeName(
                                activity.getEmployee()
                                        .getPerson()
                                        .getFirstName()
                                        + " "
                                        + activity.getEmployee()
                                        .getPerson()
                                        .getLastName()
                        )
                        .build())
                .toList();
    }

    private List<TimelineEventResponse> buildTimeline(Long personId) {

        List<TimelineEventResponse> timeline = new ArrayList<>();

        // =====================================
        // ACTIVITIES
        // =====================================

        leadActivityRepository
                .findByLead_PersonId(personId)
                .forEach(activity ->

                        timeline.add(

                                TimelineEventResponse.builder()

                                        .eventType("ACTIVITY")

                                        .title(activity.getCommunicationType())

                                        .message(activity.getRemarks())

                                        .status(activity.getCommunicationStatus())

                                        .employeePersonId(
                                                activity.getEmployee() != null
                                                        ? activity.getEmployee().getPersonId()
                                                        : null
                                        )

                                        .employeeName(
                                                activity.getEmployee() != null
                                                        && activity.getEmployee().getPerson() != null
                                                        ? activity.getEmployee().getPerson().getFirstName()
                                                          + " "
                                                          + activity.getEmployee().getPerson().getLastName()
                                                        : null
                                        )

                                        .date(activity.getCommunicationTime())

                                        .build()
                        )
                );

        // =====================================
        // STATUS HISTORY
        // =====================================

        leadStatusHistoryRepository
                .findByLead_PersonIdOrderByChangedAtDesc(personId)
                .forEach(history ->

                        timeline.add(

                                TimelineEventResponse.builder()

                                        .eventType("STATUS")

                                        .title("Status Changed")

                                        .message(history.getRemarks())

                                        .status(
                                                history.getNewStatus() != null
                                                        ? history.getNewStatus().getStatusName()
                                                        : null
                                        )

                                        .employeePersonId(
                                                history.getChangedByPerson() != null
                                                        ? history.getChangedByPerson().getPersonId()
                                                        : null
                                        )

                                        .employeeName(
                                                history.getChangedByPerson() != null
                                                        ? history.getChangedByPerson().getFirstName()
                                                          + " "
                                                          + history.getChangedByPerson().getLastName()
                                                        : null
                                        )

                                        .date(history.getChangedAt())

                                        .build()
                        )
                );

        // =====================================
        // ASSIGNMENTS
        // =====================================

        leadAssignmentRepository
                .findByLead_PersonIdOrderByAssignedAtDesc(personId)
                .forEach(assign ->

                        timeline.add(

                                TimelineEventResponse.builder()

                                        .eventType("ASSIGNMENT")

                                        .title("Lead Assigned")

                                        .message(assign.getRemarks())

                                        .employeePersonId(
                                                assign.getEmployee() != null
                                                        ? assign.getEmployee().getPersonId()
                                                        : null
                                        )

                                        .employeeName(
                                                assign.getEmployee() != null
                                                        && assign.getEmployee().getPerson() != null
                                                        ? assign.getEmployee().getPerson().getFirstName()
                                                          + " "
                                                          + assign.getEmployee().getPerson().getLastName()
                                                        : null
                                        )

                                        .date(assign.getAssignedAt())

                                        .build()
                        )
                );

        // =====================================
        // FOLLOWUPS
        // =====================================

        followupRepository
                .findLeadFollowups(personId)
                .forEach(followup ->

                        timeline.add(

                                TimelineEventResponse.builder()

                                        .eventType("FOLLOWUP")

                                        .title("Follow-up")

                                        .message(followup.getRemarks())

                                        .status(
                                                followup.getFollowupStatus() != null
                                                        ? followup.getFollowupStatus().name()
                                                        : null
                                        )

                                        .employeePersonId(
                                                followup.getEmployee() != null
                                                        ? followup.getEmployee().getPersonId()
                                                        : null
                                        )

                                        .employeeName(
                                                followup.getEmployee() != null
                                                        && followup.getEmployee().getPerson() != null
                                                        ? followup.getEmployee().getPerson().getFirstName()
                                                          + " "
                                                          + followup.getEmployee().getPerson().getLastName()
                                                        : null
                                        )

                                        .date(
                                                followup.getCompletedAt() != null
                                                        ? followup.getCompletedAt()
                                                        : followup.getScheduledAt()
                                        )

                                        .build()
                        )
                );

        timeline.removeIf(event -> event.getDate() == null);

        timeline.sort((a, b) -> b.getDate().compareTo(a.getDate()));

        return timeline;
    }

    public List<LeadResponse> getMyLeadsByStatus(String status) {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();

        return leadRepository
                .findAssignedLeadsByEmployeeAndStatus(
                        employeePersonId,
                        status
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Transactional(readOnly = true)
    public List<LeadResponse> getMyLeads() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();

        return leadRepository
                .findAssignedLeadsByEmployee(employeePersonId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String getPrimaryEmail(Person person) {
        if (person.getContacts() == null) {
            return "";
        }

        return person.getContacts().stream()
                .filter(c -> c.getContactType() != null
                        && "PRIMARY_EMAIL".equalsIgnoreCase(
                        c.getContactType().getContactTypeName()))
                .map(c -> c.getContactValue())
                .findFirst()
                .orElse("");
    }

    private String getPrimaryPhone(Person person) {
        if (person.getContacts() == null) {
            return "";
        }

        return person.getContacts().stream()
                .filter(c -> c.getContactType() != null
                        && "PRIMARY_PHONE".equalsIgnoreCase(
                        c.getContactType().getContactTypeName()))
                .map(c -> c.getContactValue())
                .findFirst()
                .orElse("");
    }

    private LeadStatusMaster getLeadStatus(String statusName) {

        return leadStatusMasterRepository
                .findByStatusName(statusName)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lead Status not found : " + statusName
                        )
                );
    }

    private void saveLeadActivity(
            Lead lead,
            Employee employee,
            String type,
            String status,
            String remarks
    ) {

        LeadActivity activity = new LeadActivity();

        activity.setLead(lead);
        activity.setEmployee(employee);
        activity.setCommunicationType(type);
        activity.setCommunicationStatus(status);
        activity.setRemarks(remarks);

        leadActivityRepository.save(activity);
    }

//    public List<LeadResponse> getMyReEngagementLeads() {
//
//        Long employeePersonId =
//                currentUserService.getCurrentEmployee().getPersonId();
//
//        System.out.println("Logged Employee = " + employeePersonId);
//
//        List<Lead> leads =
//                leadRepository.findReEngagementLeadsByEmployee(
//                        employeePersonId
//                );
//
//        System.out.println("Count = " + leads.size());
//
//        for (Lead l : leads) {
//            System.out.println(
//                    l.getPersonId()
//                            + " Archived=" + l.getIsArchived()
//                            + " StatusId=" + (l.getLeadStatus() != null
//                            ? l.getLeadStatus().getLeadStatusId()
//                            : null)
//            );
//        }
//
//        return leads.stream()
//                .map(this::mapToResponse)
//                .toList();
//    }


    public List<LeadResponse> getInterestedLeads() {

        return leadRepository
                .findAllInterestedLeads()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    public List<LeadResponse> getMyInterestedLeads() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();

        return leadRepository
                .findMyInterestedLeads(employeePersonId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }






// =========================================
// GET MY RE-ENGAGEMENT LEADS
// =========================================

    @Transactional(readOnly = true)
    public List<LeadResponse> getMyReEngagementLeads() {

        Long employeePersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();

        return leadRepository
                .findReEngagementLeadsByEmployee(employeePersonId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
// =========================================
// GET ALL ACTIVE LEADS
// =========================================

    @Transactional(readOnly = true)
    public List<LeadResponse> getAllLeads() {

        return leadRepository
                .findAllWithLeadSource()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================
// FILTER LEADS
// =========================================

    @Transactional(readOnly = true)
    public List<LeadResponse> filterLeads(
            Long counsellorPersonId,
            String keyword,
            String status,
            String priority,
            LocalDateTime start,
            LocalDateTime end
    ) {

        LeadPriority leadPriority = null;

        if (priority != null
                && !priority.isBlank()) {

            leadPriority =
                    LeadPriority.valueOf(
                            priority.toUpperCase()
                    );
        }

        return leadRepository
                .filterLeads(
                        counsellorPersonId,
                        keyword,
                        status,
                        leadPriority,
                        start,
                        end
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Transactional(readOnly = true)
    public List<LeadResponse> getReEngagementLeads() {

        Long adminPersonId =
                currentUserService
                        .getCurrentEmployee()
                        .getPersonId();

        return leadRepository
                .findAdminReEngagementLeads(adminPersonId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    // =====================================================
// MAP RESPONSE
// =====================================================

    private LeadResponse mapToResponse(Lead lead) {

        // =====================================
        // ACTIVE ASSIGNMENT
        // =====================================

        LeadAssignment assignment =
                leadAssignmentRepository
                        .findByLead_PersonIdAndIsActiveTrue(
                                lead.getPersonId()
                        )
                        .orElse(null);


        // =====================================
        // ASSIGNED EMPLOYEE NAME
        // =====================================

        String assignedEmployeeName = "Unassigned";

        if (assignment != null
                && assignment.getEmployee() != null
                && assignment.getEmployee().getPerson() != null) {

            assignedEmployeeName =
                    assignment.getEmployee()
                            .getPerson()
                            .getFirstName()
                            + " "
                            + assignment.getEmployee()
                            .getPerson()
                            .getLastName();
        }


        // =====================================
        // CREATED BY
        // =====================================

        Employee createdBy =
                lead.getCreatedBy();

        String createdByName = null;

        if (createdBy != null
                && createdBy.getPerson() != null) {

            createdByName =
                    createdBy.getPerson()
                            .getFirstName()
                            + " "
                            + createdBy.getPerson()
                            .getLastName();
        }


        // =====================================
        // NEXT FOLLOWUP
        //
        // Find the earliest incomplete followup
        // of this lead.
        //
        // IMPORTANT:
        // We do NOT check only future dates.
        //
        // If today's followup time has passed,
        // it is still the current pending followup
        // until counsellor completes it.
        // =====================================

        LocalDateTime nextFollowupAt = null;

        List<LeadFollowup> leadFollowups =
                followupRepository
                        .findLeadFollowups(
                                lead.getPersonId()
                        );

        nextFollowupAt =
                leadFollowups
                        .stream()

                        // Ignore completed followups
                        .filter(followup ->
                                followup.getFollowupStatus()
                                        != FollowupStatus.COMPLETED
                        )

                        // Scheduled time must exist
                        .filter(followup ->
                                followup.getScheduledAt() != null
                        )

                        // Get scheduled time
                        .map(
                                LeadFollowup::getScheduledAt
                        )

                        // Earliest pending followup
                        .min(
                                LocalDateTime::compareTo
                        )

                        .orElse(null);


        // =====================================
        // RESPONSE
        // =====================================

        return LeadResponse.builder()

                // =====================================
                // PERSON
                // =====================================

                .personId(
                        lead.getPersonId()
                )

                .firstName(
                        lead.getPerson() != null
                                ? lead.getPerson().getFirstName()
                                : null
                )

                .middleName(
                        lead.getPerson() != null
                                ? lead.getPerson().getMiddleName()
                                : null
                )

                .lastName(
                        lead.getPerson() != null
                                ? lead.getPerson().getLastName()
                                : null
                )

                .email(
                        lead.getPerson() != null
                                ? getPrimaryEmail(
                                lead.getPerson()
                        )
                                : ""
                )

                .phone(
                        lead.getPerson() != null
                                ? getPrimaryPhone(
                                lead.getPerson()
                        )
                                : ""
                )


                // =====================================
                // STATUS
                // =====================================

                .leadStatusId(
                        lead.getLeadStatus() != null
                                ? lead.getLeadStatus()
                                .getLeadStatusId()
                                : null
                )

                .leadStatus(
                        lead.getLeadStatus() != null
                                ? lead.getLeadStatus()
                                .getStatusName()
                                : null
                )


                // =====================================
                // ASSIGNED EMPLOYEE
                // =====================================

                .employeePersonId(
                        assignment != null
                                && assignment.getEmployee() != null
                                ? assignment.getEmployee()
                                .getPersonId()
                                : null
                )

                .assignedEmployeeName(
                        assignedEmployeeName
                )


                // =====================================
                // CREATED BY
                // =====================================

                .createdByPersonId(
                        createdBy != null
                                ? createdBy.getPersonId()
                                : null
                )

                .createdByName(
                        createdByName
                )


                // =====================================
                // SOURCE
                // =====================================

                .leadSourceId(
                        lead.getLeadSource() != null
                                ? lead.getLeadSource()
                                .getSourceId()
                                : null
                )

                .leadSourceName(
                        lead.getLeadSource() != null
                                ? lead.getLeadSource()
                                .getSourceName()
                                : "-"
                )

                .customLeadSource(
                        lead.getCustomLeadSource()
                )


                // =====================================
                // NEXT FOLLOWUP
                // =====================================

                .nextFollowupAt(
                        nextFollowupAt
                )


                // =====================================
                // PRIORITY
                // =====================================

                .leadPriority(
                        lead.getLeadPriority()
                )


                // =====================================
                // COMPUTER EXPERIENCE
                // =====================================

                .computerExperience(
                        lead.getComputerExperience()
                )


                // =====================================
                // CREATED AT
                // =====================================

                .createdAt(
                        lead.getCreatedAt()
                )


                // =====================================
                // TIMELINE
                // =====================================

                .timeline(
                        List.of()
                )

                .build();
    }
}
