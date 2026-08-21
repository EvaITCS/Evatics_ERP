package com.lms_erp.person.repository;

import com.lms_erp.person.entity.NationalityMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NationalityMasterRepository extends JpaRepository<NationalityMaster, Long> {

    Optional<NationalityMaster> findByNationalityNameIgnoreCase(String nationalityName);
}