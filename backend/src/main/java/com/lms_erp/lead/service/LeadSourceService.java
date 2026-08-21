package com.lms_erp.lead.service;

import com.lms_erp.lead.dto.LeadSourceRequest;
import com.lms_erp.lead.dto.LeadSourceResponse;

import java.util.List;

public interface LeadSourceService {

    LeadSourceResponse save(LeadSourceRequest request);

    List<LeadSourceResponse> getAll();

}