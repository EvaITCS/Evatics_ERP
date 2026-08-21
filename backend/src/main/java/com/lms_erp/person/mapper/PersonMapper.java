package com.lms_erp.person.mapper;

import com.lms_erp.auth.dto.RegisterRequest;
import com.lms_erp.person.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(
        componentModel = SPRING,
        injectionStrategy = CONSTRUCTOR,
        unmappedTargetPolicy = IGNORE
)
public interface PersonMapper {

    @Mapping(target = "personId", ignore = true)
    @Mapping(target = "gender", ignore = true)
    @Mapping(target = "nationality", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    @Mapping(target = "contacts", ignore = true)
    @Mapping(target = "educations", ignore = true)
    @Mapping(target = "visas", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "workExperiences", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Person toEntity(RegisterRequest request);
}