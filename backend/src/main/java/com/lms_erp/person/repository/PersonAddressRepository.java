package com.lms_erp.person.repository;

import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonAddressRepository
        extends JpaRepository<PersonAddress, Long> {

    List<PersonAddress> findByPersonPersonId(Long personId);
    List<PersonAddress> findByPerson(Person person);
    void deleteByPersonPersonId(Long personId);
}