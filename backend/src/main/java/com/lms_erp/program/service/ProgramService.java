package com.lms_erp.program.service;

import com.lms_erp.program.dto.*;

import java.util.List;

public interface ProgramService {

    ProgramResponse createProgram(
            ProgramCreateRequest request
    );

    List<ProgramResponse> getAllPrograms();

    ProgramResponse getProgramById(
            Long programId
    );

    ProgramResponse updateProgram(
            Long programId,
            ProgramUpdateRequest request
    );

    void deleteProgram(
            Long programId
    );

    List<ProgramResponse> getActivePrograms();

    List<ProgramResponse> getInactivePrograms();
}