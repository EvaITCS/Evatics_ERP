package com.lms_erp.person.repository;

import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.PersonContact;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.Person;

import java.util.Optional;

public interface ContactTypeMasterRepository
        extends JpaRepository<ContactTypeMaster, Long> {

    Optional<ContactTypeMaster> findByContactTypeNameIgnoreCase(
            String contactTypeName
    );



    Optional<ContactTypeMaster> findByContactTypeName(String contactTypeName);
}