package com.lms_erp.person.repository;

import com.lms_erp.person.entity.PersonType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonTypeRepository extends JpaRepository<PersonType, Long> {

    Optional<PersonType> findByTypeName(String typeName);
}