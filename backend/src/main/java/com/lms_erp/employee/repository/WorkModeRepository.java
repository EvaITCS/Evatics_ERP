package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.WorkMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkModeRepository extends JpaRepository<WorkMode, Long> {

    Optional<WorkMode> findByModeName(String modeName);

    boolean existsByModeNameIgnoreCase(String modeName);
}