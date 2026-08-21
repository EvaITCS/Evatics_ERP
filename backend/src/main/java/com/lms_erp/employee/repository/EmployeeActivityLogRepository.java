package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.EmployeeActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeActivityLogRepository
        extends JpaRepository<EmployeeActivityLog, Long> {

    List<EmployeeActivityLog> findByEmployeePersonIdOrderByCreatedAtDesc(Long personId);

}