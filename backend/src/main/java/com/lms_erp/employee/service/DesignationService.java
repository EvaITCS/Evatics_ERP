package com.lms_erp.employee.service;

import com.lms_erp.employee.dto.DesignationRequest;
import com.lms_erp.employee.dto.DesignationResponse;

import java.util.List;

public interface DesignationService {

    DesignationResponse createDesignation(DesignationRequest request);

    DesignationResponse updateDesignation(Long designationId,
                                          DesignationRequest request);

    DesignationResponse getDesignationById(Long designationId);

    List<DesignationResponse> getAllDesignations();

    void deleteDesignation(Long designationId);
}