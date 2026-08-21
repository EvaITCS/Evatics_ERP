package com.lms_erp.employee.repository;

import com.lms_erp.employee.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {

    Optional<Designation> findByDesignationName(String designationName);

    boolean existsByDesignationName(String designationName);
}