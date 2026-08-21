package com.lms_erp.lead.mapper;

import com.lms_erp.lead.dto.CreateLeadRequest;
import com.lms_erp.lead.dto.LeadResponse;
import com.lms_erp.lead.entity.Lead;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonContact;
import org.springframework.stereotype.Component;

@Component
public class LeadMapper {

    /**
     * REQUEST DTO -> ENTITY
     *
     * PersonContact (email/phone),
     * LeadSource,
     * LeadStatus,
     * Assignment etc.
     * are set inside the service layer.
     */
    public Lead mapToEntity(CreateLeadRequest request) {

        Person person = Person.builder()
                .firstName(request.getFirstName())
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .build();

        return Lead.builder()
                .person(person)
                .computerExperience(request.getComputerExperience())
                .leadPriority(request.getLeadPriority())
                .build();
    }

    /**
     * ENTITY -> RESPONSE DTO
     */
    public LeadResponse mapToResponse(Lead lead) {

        if (lead == null) {
            return null;
        }

        Person person = lead.getPerson();

        return LeadResponse.builder()

                // =====================================
                // PERSON
                // =====================================

                .personId(person != null ? person.getPersonId() : null)
                .firstName(person != null ? person.getFirstName() : "")
                .middleName(person != null ? person.getMiddleName() : "")
                .lastName(person != null ? person.getLastName() : "")
                .email(getEmail(person))
                .phone(getPhone(person))

                // =====================================
                // CANDIDATE
                // =====================================

                .computerExperience(lead.getComputerExperience())

                // =====================================
                // STATUS
                // =====================================

                .leadStatusId(
                        lead.getLeadStatus() != null
                                ? lead.getLeadStatus().getLeadStatusId()
                                : null
                )

                .leadStatus(
                        lead.getLeadStatus() != null
                                ? lead.getLeadStatus().getStatusName()
                                : null
                )

                // =====================================
                // PRIORITY
                // =====================================

                .leadPriority(lead.getLeadPriority())

                // =====================================
                // SOURCE
                // =====================================

                .leadSourceId(
                        lead.getLeadSource() != null
                                ? lead.getLeadSource().getSourceId()
                                : null
                )

                .leadSourceName(
                        lead.getLeadSource() != null
                                ? lead.getLeadSource().getSourceName()
                                : null
                )

                // =====================================
                // FOLLOW-UP
                // =====================================

                .nextFollowupAt(lead.getNextFollowupDate())

                // =====================================
                // AUDIT
                // =====================================

                .createdAt(lead.getCreatedAt())

                .build();
    }

    /**
     * Returns primary email if available,
     * otherwise returns the first email.
     */
    private String getEmail(Person person) {

        if (person == null || person.getContacts() == null) {
            return "";
        }

        return person.getContacts().stream()
                .filter(contact ->
                        contact.getContactType() != null
                                && "PRIMARY_EMAIL".equalsIgnoreCase(
                                contact.getContactType().getContactTypeName()))
                .sorted((a, b) ->
                        Boolean.compare(
                                Boolean.TRUE.equals(b.getIsPrimary()),
                                Boolean.TRUE.equals(a.getIsPrimary())))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }

    /**
     * Returns primary phone if available,
     * otherwise returns the first phone.
     */
    private String getPhone(Person person) {

        if (person == null || person.getContacts() == null) {
            return "";
        }

        return person.getContacts().stream()
                .filter(contact ->
                        contact.getContactType() != null
                                && "PHONE".equalsIgnoreCase(
                                contact.getContactType().getContactTypeName()))
                .sorted((a, b) ->
                        Boolean.compare(
                                Boolean.TRUE.equals(b.getIsPrimary()),
                                Boolean.TRUE.equals(a.getIsPrimary())))
                .map(PersonContact::getContactValue)
                .findFirst()
                .orElse("");
    }
}