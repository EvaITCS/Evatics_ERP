package com.lms_erp.program.repository;

import com.lms_erp.program.entity.Program;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProgramRepository
        extends JpaRepository<Program, Long> {



    List<Program> findByIsActive(
            Boolean isActive
    );
}