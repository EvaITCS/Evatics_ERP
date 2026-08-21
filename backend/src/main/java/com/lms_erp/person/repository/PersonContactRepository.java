package com.lms_erp.person.repository;

import com.lms_erp.person.entity.ContactTypeMaster;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonContactRepository
        extends JpaRepository<PersonContact, Long> {

    List<PersonContact> findByPersonPersonId(Long personId);

    List<PersonContact> findByPerson(Person person);

    Optional<PersonContact> findByContactValue(String contactValue);

    Optional<PersonContact> findByContactValueAndContactType(
            String contactValue,
            ContactTypeMaster contactType
    );
    boolean existsByContactValue(String contactValue);
    Optional<PersonContact> findByPersonAndContactType(
            Person person,
            ContactTypeMaster contactType
    );

    boolean existsByContactType_ContactTypeNameIgnoreCaseAndContactValue(
            String contactTypeName,
            String contactValue
    );

    // =====================================================
    // CHECK EMAIL FOR ANOTHER PERSON
    // =====================================================

    @Query("""
        SELECT CASE WHEN COUNT(pc) > 0 THEN true ELSE false END
        FROM PersonContact pc
        WHERE LOWER(TRIM(pc.contactValue)) = LOWER(TRIM(:email))
          AND LOWER(pc.contactType.contactTypeName) IN
              ('primary_email', 'alternate_email')
          AND (:personId IS NULL OR pc.person.personId <> :personId)
        """)
    boolean existsEmailForAnotherPerson(
            @Param("email") String email,
            @Param("personId") Long personId
    );
}