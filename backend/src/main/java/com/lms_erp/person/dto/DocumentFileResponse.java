package com.lms_erp.person.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.io.Resource;

@Getter
@AllArgsConstructor
public class DocumentFileResponse {

    private Resource resource;

    private String fileName;

    private String contentType;

    private Long fileSize;
}