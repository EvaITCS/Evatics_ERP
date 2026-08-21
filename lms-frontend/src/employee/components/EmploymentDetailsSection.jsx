import React from "react";
import { EMPLOYMENT_TYPES } from "../utils/employeeConstants";

function EmploymentDetailsSection({
                                      formData,
                                      handleChange,
                                      departments,
                                      designations,
                                      employeeStatuses,
                                      workModes,
                                      shifts,
                                      locations,
                                      starStyle
                                  }) {

    return (

        <div className="form-grid">

            <h3 style={{ gridColumn: "span 3" }}>
                Employment Details
            </h3>

            {/* ================================================= */}
            {/* EMPLOYEE CODE — OPTIONAL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Employee Code
                </label>

                <input
                    type="text"
                    name="employeeCode"
                    value={
                        formData.employeeCode || ""
                    }
                    onChange={handleChange}
                    placeholder="Employee Code"
                />

            </div>


            {/* ================================================= */}
            {/* JOINING DATE — REQUIRED */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Joining Date{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <input
                    type="date"
                    name="joiningDate"
                    value={
                        formData.joiningDate || ""
                    }
                    onChange={handleChange}
                    required
                />

            </div>


            {/* ================================================= */}
            {/* DEPARTMENT — REQUIRED */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Department{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <select
                    name="departmentId"
                    value={
                        formData.departmentId || ""
                    }
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Department
                    </option>

                    {departments?.map(
                        (department) => (

                            <option
                                key={
                                    department.departmentId
                                }
                                value={
                                    department.departmentId
                                }
                            >
                                {
                                    department.departmentName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* DESIGNATION — REQUIRED */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Designation{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <select
                    name="designationId"
                    value={
                        formData.designationId || ""
                    }
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Designation
                    </option>

                    {designations?.map(
                        (designation) => (

                            <option
                                key={
                                    designation.designationId
                                }
                                value={
                                    designation.designationId
                                }
                            >
                                {
                                    designation.designationName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* EMPLOYMENT TYPE — REQUIRED */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Employment Type{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <select
                    name="employmentType"
                    value={
                        formData.employmentType || ""
                    }
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Employment Type
                    </option>

                    {EMPLOYMENT_TYPES.map(
                        (type) => (

                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* EMPLOYEE STATUS — REQUIRED */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Employee Status{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <select
                    name="employeeStatusId"
                    value={
                        formData.employeeStatusId || ""
                    }
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Status
                    </option>

                    {employeeStatuses?.map(
                        (status) => (

                            <option
                                key={
                                    status.employeeStatusId
                                }
                                value={
                                    status.employeeStatusId
                                }
                            >
                                {
                                    status.statusName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* WORK MODE — OPTIONAL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Work Mode
                </label>

                <select
                    name="workModeId"
                    value={
                        formData.workModeId || ""
                    }
                    onChange={handleChange}
                >

                    <option value="">
                        Select Work Mode
                    </option>

                    {workModes?.map(
                        (mode) => (

                            <option
                                key={
                                    mode.modeId
                                }
                                value={
                                    mode.modeId
                                }
                            >
                                {
                                    mode.modeName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* SHIFT — OPTIONAL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Shift
                </label>

                <select
                    name="shiftId"
                    value={
                        formData.shiftId || ""
                    }
                    onChange={handleChange}
                >

                    <option value="">
                        Select Shift
                    </option>

                    {shifts?.map(
                        (shift) => (

                            <option
                                key={
                                    shift.shiftId
                                }
                                value={
                                    shift.shiftId
                                }
                            >
                                {
                                    shift.shiftName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* LOCATION — OPTIONAL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Location
                </label>

                <select
                    name="locationId"
                    value={
                        formData.locationId || ""
                    }
                    onChange={handleChange}
                >

                    <option value="">
                        Select Location
                    </option>

                    {locations?.map(
                        (location) => (

                            <option
                                key={
                                    location.locationId
                                }
                                value={
                                    location.locationId
                                }
                            >
                                {
                                    location.locationName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ================================================= */}
            {/* PROBATION END DATE — OPTIONAL */}
            {/* ================================================= */}

            <div className="form-group">

                <label>
                    Probation End Date
                </label>

                <input
                    type="date"
                    name="probationEndDate"
                    value={
                        formData.probationEndDate || ""
                    }
                    onChange={handleChange}
                />

            </div>

        </div>
    );
}

export default EmploymentDetailsSection;