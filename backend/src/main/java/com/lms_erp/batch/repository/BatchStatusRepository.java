package com.lms_erp.batch.repository;

import com.lms_erp.batch.entity.BatchStatusMaster;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchStatusRepository
        extends JpaRepository<BatchStatusMaster, Long> {
}