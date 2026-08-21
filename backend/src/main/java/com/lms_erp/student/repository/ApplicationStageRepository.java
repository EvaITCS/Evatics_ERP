package com.lms_erp.student.repository;

import com.lms_erp.student.entity.ApplicationStageMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationStageRepository
        extends JpaRepository<ApplicationStageMaster, Long> {

    Optional<ApplicationStageMaster> findByApplicationStageName(
            String applicationStageName
    );
}