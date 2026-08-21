package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.EmployeeStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeStatusHistoryRepository
        extends JpaRepository<EmployeeStatusHistory, Long> {

    List<EmployeeStatusHistory> findByEmployeePersonId(Long personId);

}