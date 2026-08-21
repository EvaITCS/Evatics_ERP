package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonTypeMap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonTypeMapRepository
        extends JpaRepository<PersonTypeMap, Long> {
}