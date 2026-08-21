package com.lms_erp.person.repository;

import com.lms_erp.person.entity.AddressTypeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressTypeMasterRepository extends JpaRepository<AddressTypeMaster, Long> {
}