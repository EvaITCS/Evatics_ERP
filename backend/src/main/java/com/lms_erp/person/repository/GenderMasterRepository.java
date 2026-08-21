package com.lms_erp.person.repository;

import com.lms_erp.person.entity.GenderMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenderMasterRepository extends JpaRepository<GenderMaster, Long> {

    Optional<GenderMaster> findByGenderNameIgnoreCase(String genderName);
}