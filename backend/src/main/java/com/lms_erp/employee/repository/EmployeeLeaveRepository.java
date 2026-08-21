package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.EmployeeLeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeLeaveRepository
        extends JpaRepository<EmployeeLeaveRequest, Long> {

    // =====================================
    // EMPLOYEE LEAVE HISTORY
    // =====================================

    List<EmployeeLeaveRequest> findByEmployeePersonId(Long personId);

    // =====================================
    // FETCH PERSON WITH EMPLOYEE
    // =====================================

    @Query("""
       SELECT lr
       FROM EmployeeLeaveRequest lr
       LEFT JOIN FETCH lr.employee e
       LEFT JOIN FETCH e.person
       LEFT JOIN FETCH lr.leaveType
       LEFT JOIN FETCH lr.leaveStatus
       LEFT JOIN FETCH lr.approvedBy ap
       LEFT JOIN FETCH ap.person
       ORDER BY lr.appliedAt DESC
       """)
    List<EmployeeLeaveRequest> findAllWithPerson();

    // =====================================
    // DASHBOARD COUNTS
    // =====================================

    long countByLeaveStatus_StatusName(String statusName);

    long countByEmployeePersonId(Long personId);

    long countByEmployeePersonIdAndLeaveStatus_StatusName(
            Long personId,
            String statusName
    );

    @Query("""
       SELECT lr
       FROM EmployeeLeaveRequest lr
       LEFT JOIN FETCH lr.employee e
       LEFT JOIN FETCH e.person
       LEFT JOIN FETCH lr.leaveType
       LEFT JOIN FETCH lr.leaveStatus
       LEFT JOIN FETCH lr.approvedBy ap
       LEFT JOIN FETCH ap.person
       WHERE e.personId = :personId
       ORDER BY lr.appliedAt DESC
       """)
    List<EmployeeLeaveRequest> findByEmployeePersonIdWithPerson(
            @Param("personId") Long personId
    );


}
