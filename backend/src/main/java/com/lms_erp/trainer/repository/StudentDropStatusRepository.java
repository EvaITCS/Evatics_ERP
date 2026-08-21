package com.lms_erp.trainer.repository;

import com.lms_erp.trainer.entity.StudentDropStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentDropStatusRepository extends JpaRepository<StudentDropStatus, Long> {

    Optional<StudentDropStatus> findByStatusName(String statusName);

}