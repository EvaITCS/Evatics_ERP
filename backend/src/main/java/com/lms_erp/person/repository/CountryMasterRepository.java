package com.lms_erp.person.repository;

import com.lms_erp.person.entity.CountryMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CountryMasterRepository extends JpaRepository<CountryMaster, Long> {
    Optional<CountryMaster> findByCountryNameIgnoreCase(String countryName);
}