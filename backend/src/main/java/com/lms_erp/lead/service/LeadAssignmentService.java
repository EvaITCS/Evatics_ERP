
        package com.lms_erp.lead.service;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.lead.entity.Lead;
import com.lms_erp.lead.entity.LeadAssignment;
import com.lms_erp.lead.repository.LeadAssignmentRepository;
import com.lms_erp.lead.repository.LeadRepository;
import com.lms_erp.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadAssignmentService {

    private final LeadRepository leadRepository;
    private final LeadAssignmentRepository leadAssignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;


    // =========================================
    // GET UNASSIGNED LEADS
    // =========================================

    public List<Lead> getUnassignedLeads() {

        return leadRepository.findUnassignedLeads();
    }


    // =========================================
    // GET LEAST LOADED EMPLOYEE
    // =========================================

    public Long getNextEmployeePersonId() {

        List<Object[]> result =
                leadRepository.getEmployeeLeadCounts();

        if (result.isEmpty()) {
            return null;
        }

        return (Long) result.get(0)[0];
    }


    // =========================================
    // AUTO ASSIGN
    // =========================================
    // Kept for existing functionality.
    // DO NOT use this from createLead().
    // =========================================

    public void autoAssignLead(Lead lead) {

        Long employeePersonId =
                getNextEmployeePersonId();

        if (employeePersonId == null) {
            return;
        }

        assignLead(
                lead,
                employeePersonId
        );
    }


    // =========================================
    // MANUAL ASSIGNMENT
    // =========================================

    public void assignLead(
            Lead lead,
            Long employeePersonId
    ) {

        Employee employee =
                employeeRepository
                        .findById(employeePersonId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee not found"
                                )
                        );

        // =====================================
        // CURRENT LOGGED-IN EMPLOYEE
        // =====================================

        Employee assignedBy =
                currentUserService.getCurrentEmployee();


        // =====================================
        // COUNSELLOR RESTRICTION
        // =====================================
        // Counsellor cannot assign a lead to
        // another employee.
        // =====================================

        if (currentUserService.hasRole("COUNSELLOR")
                && !assignedBy.getPersonId()
                .equals(employee.getPersonId())) {

            throw new RuntimeException(
                    "Counsellor can only assign leads to themselves."
            );
        }


        // =====================================
        // DEACTIVATE PREVIOUS ASSIGNMENT
        // =====================================

        leadAssignmentRepository
                .findByLead_PersonIdOrderByAssignedAtDesc(
                        lead.getPersonId()
                )
                .stream()
                .filter(assignment ->
                        Boolean.TRUE.equals(
                                assignment.getIsActive()
                        )
                )
                .forEach(assignment -> {

                    assignment.setIsActive(false);

                    leadAssignmentRepository.save(
                            assignment
                    );
                });


        // =====================================
        // CREATE NEW ASSIGNMENT
        // =====================================

        LeadAssignment assignment =
                LeadAssignment.builder()
                        .lead(lead)
                        .employee(employee)
                        .assignedBy(assignedBy)
                        .remarks("Lead Assignment")
                        .isActive(true)
                        .build();


        leadAssignmentRepository.save(
                assignment
        );
    }

    // =========================================
// RE-ASSIGN TO PREVIOUS COUNSELLOR
// =========================================

    public void reAssignToPreviousCounsellor(Lead lead) {

        // =====================================
        // FIND PREVIOUS ACTIVE ASSIGNMENT
        // =====================================

        LeadAssignment previousAssignment =
                leadAssignmentRepository
                        .findByLead_PersonIdOrderByAssignedAtDesc(
                                lead.getPersonId()
                        )
                        .stream()
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Previous counsellor assignment not found for lead: "
                                                + lead.getPersonId()
                                )
                        );

        // =====================================
        // PREVIOUS COUNSELLOR
        // =====================================

        Employee previousEmployee =
                previousAssignment.getEmployee();

        if (previousEmployee == null) {

            throw new RuntimeException(
                    "Previous counsellor not found for lead: "
                            + lead.getPersonId()
            );
        }

        // =====================================
        // DEACTIVATE CURRENT ACTIVE ASSIGNMENT
        // =====================================

        leadAssignmentRepository
                .findByLead_PersonIdOrderByAssignedAtDesc(
                        lead.getPersonId()
                )
                .stream()
                .filter(assignment ->
                        Boolean.TRUE.equals(
                                assignment.getIsActive()
                        )
                )
                .forEach(assignment -> {

                    assignment.setIsActive(false);

                    leadAssignmentRepository.save(
                            assignment
                    );
                });

        // =====================================
        // CREATE NEW ASSIGNMENT
        // =====================================

        LeadAssignment newAssignment =
                LeadAssignment.builder()
                        .lead(lead)
                        .employee(previousEmployee)
                        .assignedBy(previousEmployee)
                        .remarks(
                                "Re-engaged after 6 months"
                        )
                        .isActive(true)
                        .build();

        leadAssignmentRepository.save(
                newAssignment
        );
    }


}

