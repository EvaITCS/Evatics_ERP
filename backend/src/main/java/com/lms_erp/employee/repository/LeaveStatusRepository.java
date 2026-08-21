package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.LeaveStatusMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeaveStatusRepository extends JpaRepository<LeaveStatusMaster, Long> {

    Optional<LeaveStatusMaster> findByStatusName(String statusName);

    boolean existsByStatusNameIgnoreCase(String statusName);
}