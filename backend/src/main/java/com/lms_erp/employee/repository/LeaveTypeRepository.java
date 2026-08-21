package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    Optional<LeaveType> findByLeaveTypeName(String leaveTypeName);

    boolean existsByLeaveTypeNameIgnoreCase(String leaveTypeName);
}