package com.lms_erp.person.service;

import com.lms_erp.person.dto.PersonAddressDto;
import java.util.List;

public interface PersonAddressService {

    PersonAddressDto addAddress(Long personId,
                                PersonAddressDto dto);

    List<PersonAddressDto> getAddressesByPersonId(Long personId);

    PersonAddressDto updateAddress(Long addressId,
                                   PersonAddressDto dto);

    void deleteAddress(Long addressId);
}