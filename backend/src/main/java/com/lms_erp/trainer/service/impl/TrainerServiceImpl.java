package com.lms_erp.trainer.service.impl;

import com.lms_erp.employee.entity.Employee;
import com.lms_erp.person.entity.PersonContact;
import com.lms_erp.security.CurrentUserService;
import com.lms_erp.trainer.dto.TrainerDashboardResponse;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.trainer.dto.TrainerResponse;
import com.lms_erp.trainer.repository.TrainerBatchRepository;
import com.lms_erp.trainer.repository.TrainerTaskRepository;
import com.lms_erp.student.repository.StudentBatchRepository;
import com.lms_erp.trainer.service.TrainerService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService {

    private final TrainerBatchRepository batchRepository;

    private final TrainerTaskRepository taskRepository;

    private final StudentBatchRepository studentBatchRepository;

    private final CurrentUserService currentUserService;

    private final EmployeeRepository employeeRepository;


    // =====================================================
    // GET ALL TRAINERS
    // =====================================================

    @Override
    public List<TrainerResponse> getAllTrainers() {

        return employeeRepository.findAllTrainers()
                .stream()
                .map(employee -> TrainerResponse.builder()
                        .trainerPersonId(employee.getPersonId())
                        .trainerName(
                                employee.getPerson().getFirstName()
                                        + " "
                                        + employee.getPerson().getLastName()
                        )
                        .email(getPrimaryEmail(employee))
                        .build()
                )
                .toList();
    }


    // =====================================================
    // GET TRAINER DASHBOARD
    // =====================================================

    @Transactional(readOnly = true)
    @Override
    public TrainerDashboardResponse getDashboard() {

        Long userId = currentUserService.getCurrentUserId();

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found")
                );


        Long totalBatches =
                batchRepository.countBatches(
                        employee.getPersonId()
                );

        Long totalStudents =
                studentBatchRepository.countStudentsByTrainer(
                        employee.getPersonId()
                );


        return TrainerDashboardResponse
                .builder()

                .trainerName(
                        employee.getPerson().getFirstName()
                                + " "
                                + employee.getPerson().getLastName()
                )

                .totalBatchCount(
                        totalBatches != null
                                ? totalBatches
                                : 0L
                )

                .totalStudentCount(
                        totalStudents != null
                                ? totalStudents
                                : 0L
                )

                .build();
    }


    // =====================================================
    // GET PRIMARY EMAIL
    // =====================================================

    private String getPrimaryEmail(Employee employee) {

        return employee.getPerson()
                .getContacts()
                .stream()
                .filter(contact ->
                        Boolean.TRUE.equals(contact.getIsPrimary())
                                && "PRIMARY_EMAIL".equalsIgnoreCase(
                                contact.getContactType()
                                        .getContactTypeName()
                        )
                )
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse(null);
    }
}