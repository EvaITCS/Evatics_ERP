package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.EmployeeStatusMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeStatusRepository
        extends JpaRepository<EmployeeStatusMaster, Long> {

    Optional<EmployeeStatusMaster> findByStatusName(String statusName);
    boolean existsByStatusNameIgnoreCase(String statusName);
    boolean existsByStatusName(String statusName);
}