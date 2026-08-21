package com.lms_erp.person.dto;

import lombok.Data;

@Data
public class PersonDocumentDto {

    private Long personDocumentId;

    private String documentType;

    private String documentNumber;

    private String fileName;

    private String contentType;

    private Long fileSize;

}