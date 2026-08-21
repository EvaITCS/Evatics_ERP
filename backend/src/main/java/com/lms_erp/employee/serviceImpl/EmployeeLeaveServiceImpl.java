package com.lms_erp.employee.serviceImpl;

import com.lms_erp.employee.dto.EmployeeLeaveRequestDto;
import com.lms_erp.employee.dto.EmployeeLeaveResponseDto;
import com.lms_erp.employee.entity.Employee;
import com.lms_erp.employee.entity.EmployeeLeaveRequest;
import com.lms_erp.employee.entity.LeaveStatusMaster;
import com.lms_erp.employee.entity.LeaveType;
import com.lms_erp.employee.exception.EmployeeNotFoundException;
import com.lms_erp.employee.repository.EmployeeLeaveRepository;
import com.lms_erp.employee.repository.EmployeeRepository;
import com.lms_erp.employee.repository.LeaveStatusRepository;
import com.lms_erp.employee.repository.LeaveTypeRepository;
import com.lms_erp.employee.service.EmployeeLeaveService;
import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeLeaveServiceImpl
        implements EmployeeLeaveService {

    private final EmployeeRepository employeeRepository;

    private final LeaveTypeRepository leaveTypeRepository;

    private final LeaveStatusRepository leaveStatusRepository;

    private final EmployeeLeaveRepository employeeLeaveRepository;

    private final UserRepository userRepository;


    // =====================================================
    // APPLY LEAVE
    // =====================================================

    @Override
    @Transactional
    public EmployeeLeaveResponseDto applyLeave(
            EmployeeLeaveRequestDto request) {

        // =================================================
        // VALIDATE DATES
        // =================================================

        if (request.getStartDate() == null) {

            throw new IllegalArgumentException(
                    "Start date is required."
            );
        }

        if (request.getEndDate() == null) {

            throw new IllegalArgumentException(
                    "End date is required."
            );
        }

        if (request.getEndDate()
                .isBefore(request.getStartDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }


        // =================================================
        // FIND EMPLOYEE BY PERSON ID
        // =================================================

        Employee employee =
                employeeRepository
                        .findByIdWithDetails(
                                request.getPersonId()
                        )
                        .orElseThrow(
                                () -> new EmployeeNotFoundException(
                                        "Employee not found for person ID: "
                                                + request.getPersonId()
                                )
                        );


        // =================================================
        // FIND LEAVE TYPE
        // =================================================

        LeaveType leaveType =
                leaveTypeRepository
                        .findById(
                                request.getLeaveTypeId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Leave type not found: "
                                                + request.getLeaveTypeId()
                                )
                        );


        // =================================================
        // FIND PENDING STATUS
        // =================================================

        LeaveStatusMaster pendingStatus =
                leaveStatusRepository
                        .findByStatusName("PENDING")
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "PENDING leave status not found."
                                )
                        );


        // =================================================
        // CREATE LEAVE REQUEST
        // =================================================

        EmployeeLeaveRequest leaveRequest =
                EmployeeLeaveRequest.builder()

                        .employee(employee)

                        .leaveType(leaveType)

                        .leaveStatus(pendingStatus)

                        .startDate(
                                request.getStartDate()
                        )

                        .endDate(
                                request.getEndDate()
                        )

                        .reason(
                                request.getReason()
                        )

                        .build();


        // =================================================
        // SAVE
        // =================================================

        EmployeeLeaveRequest savedLeave =
                employeeLeaveRepository.save(
                        leaveRequest
                );


        // =================================================
        // RESPONSE
        // =================================================

        return buildResponse(savedLeave);
    }


    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    @Override
    @Transactional
    public EmployeeLeaveResponseDto approveLeave(
            Long leaveRequestId,
            String username) {

        // =================================================
        // FIND LEAVE REQUEST
        // =================================================

        EmployeeLeaveRequest leaveRequest =
                employeeLeaveRepository
                        .findById(
                                leaveRequestId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Leave request not found: "
                                                + leaveRequestId
                                )
                        );


        // =================================================
        // PREVENT DOUBLE APPROVAL
        // =================================================

        if (leaveRequest.getLeaveStatus() != null
                && "APPROVED".equalsIgnoreCase(
                leaveRequest
                        .getLeaveStatus()
                        .getStatusName()
        )) {

            throw new IllegalStateException(
                    "Leave request is already approved."
            );
        }


        // =================================================
        // FIND AUTHENTICATED USER
        // =================================================

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Authenticated user not found."
                                )
                        );


        // =================================================
        // FIND APPROVER EMPLOYEE
        // USER → PERSON → EMPLOYEE
        // =================================================

        if (user.getPerson() == null) {

            throw new RuntimeException(
                    "Authenticated user is not linked to a person."
            );
        }


        Employee approver =
                employeeRepository
                        .findByPersonPersonId(
                                user.getPerson()
                                        .getPersonId()
                        )
                        .orElseThrow(
                                () -> new EmployeeNotFoundException(
                                        "Approver employee not found."
                                )
                        );


        // =================================================
        // FIND APPROVED STATUS
        // =================================================

        LeaveStatusMaster approvedStatus =
                leaveStatusRepository
                        .findByStatusName("APPROVED")
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "APPROVED leave status not found."
                                )
                        );


        // =================================================
        // UPDATE
        // =================================================

        leaveRequest.setLeaveStatus(
                approvedStatus
        );

        leaveRequest.setApprovedBy(
                approver
        );

        leaveRequest.setApprovedAt(
                LocalDateTime.now()
        );


        // =================================================
        // SAVE
        // =================================================

        EmployeeLeaveRequest updatedLeave =
                employeeLeaveRepository.save(
                        leaveRequest
                );


        // =================================================
        // RESPONSE
        // =================================================

        return buildResponse(updatedLeave);
    }


    // =====================================================
    // REJECT LEAVE
    // =====================================================

    @Override
    @Transactional
    public EmployeeLeaveResponseDto rejectLeave(
            Long leaveRequestId,
            String username) {

        // =================================================
        // FIND LEAVE REQUEST
        // =================================================

        EmployeeLeaveRequest leaveRequest =
                employeeLeaveRepository
                        .findById(
                                leaveRequestId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Leave request not found: "
                                                + leaveRequestId
                                )
                        );


        // =================================================
        // PREVENT DOUBLE REJECTION
        // =================================================

        if (leaveRequest.getLeaveStatus() != null
                && "REJECTED".equalsIgnoreCase(
                leaveRequest
                        .getLeaveStatus()
                        .getStatusName()
        )) {

            throw new IllegalStateException(
                    "Leave request is already rejected."
            );
        }


        // =================================================
        // FIND AUTHENTICATED USER
        // =================================================

        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Authenticated user not found."
                                )
                        );


        // =================================================
        // VALIDATE PERSON
        // =================================================

        if (user.getPerson() == null) {

            throw new RuntimeException(
                    "Authenticated user is not linked to a person."
            );
        }


        // =================================================
        // FIND APPROVER EMPLOYEE
        // =================================================

        Employee approver =
                employeeRepository
                        .findByPersonPersonId(
                                user.getPerson()
                                        .getPersonId()
                        )
                        .orElseThrow(
                                () -> new EmployeeNotFoundException(
                                        "Approver employee not found."
                                )
                        );


        // =================================================
        // FIND REJECTED STATUS
        // =================================================

        LeaveStatusMaster rejectedStatus =
                leaveStatusRepository
                        .findByStatusName("REJECTED")
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "REJECTED leave status not found."
                                )
                        );


        // =================================================
        // UPDATE
        // =================================================

        leaveRequest.setLeaveStatus(
                rejectedStatus
        );

        leaveRequest.setApprovedBy(
                approver
        );

        leaveRequest.setApprovedAt(
                LocalDateTime.now()
        );


        // =================================================
        // SAVE
        // =================================================

        EmployeeLeaveRequest updatedLeave =
                employeeLeaveRepository.save(
                        leaveRequest
                );


        // =================================================
        // RESPONSE
        // =================================================

        return buildResponse(updatedLeave);
    }


    // =====================================================
    // GET LEAVES BY EMPLOYEE
    // PERSON ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeLeaveResponseDto>
    getLeavesByEmployee(
            Long personId) {

        List<EmployeeLeaveRequest> leaveRequests =
                employeeLeaveRepository
                        .findByEmployeePersonIdWithPerson(
                                personId
                        );


        List<EmployeeLeaveResponseDto>
                responseList =
                new ArrayList<>();


        for (
                EmployeeLeaveRequest leave
                : leaveRequests
        ) {

            responseList.add(
                    buildResponse(leave)
            );
        }


        return responseList;
    }


    // =====================================================
    // GET ALL LEAVE REQUESTS
    // ADMIN
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeLeaveResponseDto>
    getAllLeaveRequests() {

        List<EmployeeLeaveRequest>
                leaveRequests =
                employeeLeaveRepository
                        .findAllWithPerson();


        List<EmployeeLeaveResponseDto>
                responseList =
                new ArrayList<>();


        for (
                EmployeeLeaveRequest leave
                : leaveRequests
        ) {

            responseList.add(
                    buildResponse(leave)
            );
        }


        return responseList;
    }


    // =====================================================
    // BUILD RESPONSE
    // SINGLE SOURCE OF TRUTH
    // =====================================================

    private EmployeeLeaveResponseDto
    buildResponse(
            EmployeeLeaveRequest leave) {

        if (leave == null) {

            return null;
        }


        // =================================================
        // EMPLOYEE
        // =================================================

        Employee employee =
                leave.getEmployee();


        Long personId = null;

        String employeeName = null;


        if (employee != null) {

            personId =
                    employee.getPersonId();

            employeeName =
                    getEmployeeName(
                            employee
                    );
        }


        // =================================================
        // LEAVE TYPE
        // =================================================

        String leaveType = null;

        if (leave.getLeaveType() != null) {

            leaveType =
                    leave.getLeaveType()
                            .getLeaveTypeName();
        }


        // =================================================
        // STATUS
        // =================================================

        String leaveStatus = null;

        if (leave.getLeaveStatus() != null) {

            leaveStatus =
                    leave.getLeaveStatus()
                            .getStatusName();
        }


        // =================================================
        // APPROVER
        // =================================================

        Long approvedByPersonId = null;

        String approvedBy = null;


        if (leave.getApprovedBy() != null) {

            approvedByPersonId =
                    leave.getApprovedBy()
                            .getPersonId();

            approvedBy =
                    getEmployeeName(
                            leave.getApprovedBy()
                    );
        }


        // =================================================
        // TOTAL DAYS
        // INCLUSIVE
        //
        // 14 → 14 = 1 day
        // 14 → 15 = 2 days
        // =================================================

        Integer totalDays = null;


        LocalDate startDate =
                leave.getStartDate();

        LocalDate endDate =
                leave.getEndDate();


        if (startDate != null
                && endDate != null) {

            totalDays =
                    Math.toIntExact(
                            ChronoUnit.DAYS.between(
                                    startDate,
                                    endDate
                            ) + 1
                    );
        }


        // =================================================
        // RESPONSE
        // =================================================

        return EmployeeLeaveResponseDto
                .builder()

                .leaveRequestId(
                        leave.getLeaveRequestId()
                )

                .personId(
                        personId
                )

                .employeeName(
                        employeeName
                )

                .leaveType(
                        leaveType
                )

                .leaveStatus(
                        leaveStatus
                )

                .startDate(
                        startDate
                )

                .endDate(
                        endDate
                )

                .totalDays(
                        totalDays
                )

                .reason(
                        leave.getReason()
                )

                .approvedByPersonId(
                        approvedByPersonId
                )

                .approvedBy(
                        approvedBy
                )

                .approvedAt(
                        leave.getApprovedAt()
                )

                .appliedAt(
                        leave.getAppliedAt()
                )

                .build();
    }


    // =====================================================
    // EMPLOYEE NAME
    // =====================================================

    private String getEmployeeName(
            Employee employee) {

        if (employee == null
                || employee.getPerson() == null) {

            return null;
        }


        String firstName =
                employee.getPerson()
                        .getFirstName();


        String middleName =
                employee.getPerson()
                        .getMiddleName();


        String lastName =
                employee.getPerson()
                        .getLastName();


        return (

                (firstName != null
                        ? firstName
                        : "")

                        + " "

                        + (middleName != null
                        && !middleName.isBlank()
                        ? middleName + " "
                        : "")

                        + (lastName != null
                        ? lastName
                        : "")

        ).trim();
    }
}