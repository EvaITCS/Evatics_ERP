package com.lms_erp.person.service.impl;

import com.lms_erp.person.dto.PersonAddressDto;
import com.lms_erp.person.entity.Person;
import com.lms_erp.person.entity.PersonAddress;
import com.lms_erp.person.repository.AddressTypeMasterRepository;
import com.lms_erp.person.repository.PersonAddressRepository;
import com.lms_erp.person.repository.PersonRepository;
import com.lms_erp.person.service.PersonAddressService;

import com.lms_erp.user.entity.User;
import com.lms_erp.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PersonAddressServiceImpl
        implements PersonAddressService {


    private final PersonRepository personRepository;

    private final PersonAddressRepository personAddressRepository;

    private final AddressTypeMasterRepository addressTypeRepository;

    private final UserRepository userRepository;


    // =========================================================
    // ADD ADDRESS
    // =========================================================

    @Override
    public PersonAddressDto addAddress(
            Long personId,
            PersonAddressDto dto
    ) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Person not found"
                        )
                );

        // Object-level authorization
        checkOwnership(personId);


        PersonAddress address = new PersonAddress();

        address.setPerson(person);


        if (dto.getAddressTypeId() != null) {

            address.setAddressType(
                    addressTypeRepository
                            .findById(dto.getAddressTypeId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Invalid Address Type"
                                    )
                            )
            );
        }


        address.setAddressLine1(
                dto.getAddressLine1()
        );

        address.setAddressLine2(
                dto.getAddressLine2()
        );

        address.setCity(
                dto.getCity()
        );

        address.setState(
                dto.getState()
        );

        address.setCountry(
                dto.getCountry()
        );

        address.setZipcode(
                dto.getZipCode()
        );


        PersonAddress saved =
                personAddressRepository.save(address);

        return mapToDto(saved);
    }


    // =========================================================
    // GET ADDRESSES
    // =========================================================

    @Override
    public List<PersonAddressDto> getAddressesByPersonId(
            Long personId
    ) {

        // Object-level authorization
        checkOwnership(personId);


        return personAddressRepository
                .findByPersonPersonId(personId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    // =========================================================
    // UPDATE ADDRESS
    // =========================================================

    @Override
    public PersonAddressDto updateAddress(
            Long addressId,
            PersonAddressDto dto
    ) {

        PersonAddress address =
                personAddressRepository.findById(addressId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Address not found"
                                )
                        );


        /*
         * IMPORTANT:
         *
         * addressId se address milne ke baad
         * us address ke parent Person ko identify kar rahe hain.
         *
         * Phir us Person ki ownership check hogi.
         */
        checkOwnership(
                address.getPerson().getPersonId()
        );


        if (dto.getAddressTypeId() != null) {

            address.setAddressType(
                    addressTypeRepository
                            .findById(dto.getAddressTypeId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Invalid Address Type"
                                    )
                            )
            );

        } else {

            address.setAddressType(null);
        }


        address.setAddressLine1(
                dto.getAddressLine1()
        );

        address.setAddressLine2(
                dto.getAddressLine2()
        );

        address.setCity(
                dto.getCity()
        );

        address.setState(
                dto.getState()
        );

        address.setCountry(
                dto.getCountry()
        );

        address.setZipcode(
                dto.getZipCode()
        );


        PersonAddress updated =
                personAddressRepository.save(address);

        return mapToDto(updated);
    }


    // =========================================================
    // DELETE ADDRESS
    // =========================================================

    @Override
    public void deleteAddress(Long addressId) {

        PersonAddress address =
                personAddressRepository.findById(addressId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Address not found"
                                )
                        );


        /*
         * IMPORTANT:
         *
         * Directly addressId ke basis par delete nahi hoga.
         *
         * Pehle address ke parent person ki ownership
         * verify hogi.
         */
        checkOwnership(
                address.getPerson().getPersonId()
        );


        personAddressRepository.delete(address);
    }


    // =========================================================
    // OWNERSHIP CHECK FOR @PreAuthorize
    // =========================================================

    public boolean isOwner(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return false;
        }


        /*
         * ADMIN / COUNSELLOR ko ownership ki
         * zaroorat nahi hai.
         *
         * Lekin controller ke @PreAuthorize mein
         * in roles ka separate condition already hai.
         */
        boolean privilegedUser =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                                        ||
                                        authority.getAuthority()
                                                .equals("ROLE_COUNSELLOR")
                        );


        if (privilegedUser) {
            return true;
        }


        String username =
                authentication.getName();


        return userRepository
                .findByUsername(username)
                .map(user ->
                        user.getPerson() != null
                                &&
                                user.getPerson()
                                        .getPersonId()
                                        .equals(personId)
                )
                .orElse(false);
    }


    // =========================================================
    // SERVICE-LEVEL OBJECT OWNERSHIP CHECK
    // =========================================================

    private void checkOwnership(Long personId) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Unauthorized"
            );
        }


        /*
         * ADMIN / COUNSELLOR
         *
         * Can access any person's address.
         */
        boolean privilegedUser =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN")
                                        ||
                                        authority.getAuthority()
                                                .equals("ROLE_COUNSELLOR")
                        );


        if (privilegedUser) {
            return;
        }


        /*
         * STUDENT
         *
         * Can access only their own person's data.
         */
        String username =
                authentication.getName();


        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        if (user.getPerson() == null ||
                !user.getPerson()
                        .getPersonId()
                        .equals(personId)) {

            throw new RuntimeException(
                    "You are not authorized to access this person's data"
            );
        }
    }


    // =========================================================
    // DTO MAPPING
    // =========================================================

    private PersonAddressDto mapToDto(
            PersonAddress address
    ) {

        PersonAddressDto dto =
                new PersonAddressDto();


        dto.setAddressId(
                address.getAddressId()
        );

        dto.setAddressLine1(
                address.getAddressLine1()
        );

        dto.setAddressLine2(
                address.getAddressLine2()
        );

        dto.setCity(
                address.getCity()
        );

        dto.setState(
                address.getState()
        );

        dto.setCountry(
                address.getCountry()
        );

        dto.setZipCode(
                address.getZipcode()
        );


        if (address.getAddressType() != null) {

            dto.setAddressTypeId(
                    address.getAddressType()
                            .getAddressTypeId()
            );

            dto.setAddressTypeName(
                    address.getAddressType()
                            .getAddressTypeName()
            );
        }


        return dto;
    }
}