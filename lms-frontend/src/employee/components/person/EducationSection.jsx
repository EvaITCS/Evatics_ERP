import React from "react";
import { QUALIFICATIONS } from "../../utils/employeeConstants";

// =====================================================
// PASSING YEARS
// =====================================================

const CURRENT_YEAR = new Date().getFullYear();

// =====================================================
// PASSING YEARS
// 1950 - 2050
// =====================================================

const PASSING_YEARS = Array.from(
    { length: 2050 - 1950 + 1 },
    (_, index) => 1950 + index
);

// =====================================================
// EDUCATION SECTION
// =====================================================

function EducationSection({
                              formData,
                              handleEducationChange,
                              addEducation,
                              removeEducation,
                              starStyle,
                          }) {

    const educations =
        formData?.educations || [];

    // =================================================
    // RENDER
    // =================================================

    return (

        <>

            <h3 className="form-section-title">

                Education Information

            </h3>



            <div className="form-grid">
            {/* ================================================= */}
            {/* EDUCATION LIST */}
            {/* ================================================= */}

            {educations.map(
                (education, index) => (

                    <React.Fragment
                        key={
                            education?.educationId ||
                            `education-${index}`
                        }
                    >


                        {/* ========================================= */}
                        {/* QUALIFICATION */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Qualification{" "}

                                <span
                                    style={starStyle}
                                >
                                    *
                                </span>
                            </label>

                            <select
                                value={
                                    education?.qualification ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "qualification",
                                        e.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Select Qualification
                                </option>

                                {QUALIFICATIONS.map(
                                    (qualification) => (

                                        <option
                                            key={
                                                qualification
                                            }
                                            value={
                                                qualification
                                            }
                                        >
                                            {qualification}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ========================================= */}
                        {/* INSTITUTE NAME */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Institute Name{" "}

                                <span
                                    style={starStyle}
                                >
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                value={
                                    education?.instituteName ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "instituteName",
                                        e.target.value
                                    )
                                }
                                placeholder="Institute Name"
                                required
                            />

                        </div>


                        {/* ========================================= */}
                        {/* FIELD OF STUDY */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Field Of Study
                            </label>

                            <input
                                type="text"
                                value={
                                    education?.fieldOfStudy ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "fieldOfStudy",
                                        e.target.value
                                    )
                                }
                                placeholder="Computer Science"
                            />

                        </div>


                        {/* ========================================= */}
                        {/* PASSING YEAR */}
                        {/* ========================================= */}

                        {/* ========================================= */}
                        {/* PASSING YEAR */}
                        {/* ========================================= */}

                        <div className="form-group">

                            <label>
                                Passing Year{" "}

                                <span style={starStyle}>
            *
        </span>
                            </label>


                            <select
                                value={
                                    education?.passingYear || ""
                                }

                                onChange={(e) =>
                                    handleEducationChange(
                                        index,
                                        "passingYear",
                                        e.target.value
                                    )
                                }

                                required
                            >

                                <option value="">
                                    Select Passing Year
                                </option>


                                {PASSING_YEARS.map(
                                    (year) => (

                                        <option
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ========================================= */}
                        {/* REMOVE EDUCATION */}
                        {/* ========================================= */}

                        {educations.length > 1 && (

                            <div
                                className="form-group"
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "end",
                                }}
                            >

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() =>
                                        removeEducation(
                                            index
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        )}


                        {/* ========================================= */}
                        {/* SEPARATOR */}
                        {/* ========================================= */}

                        <hr
                            style={{
                                gridColumn:
                                    "span 3",
                                margin:
                                    "20px 0",
                            }}
                        />

                    </React.Fragment>
                )
            )}


            {/* ================================================= */}
            {/* ADD EDUCATION */}
            {/* ================================================= */}

            <div
                style={{
                    gridColumn:
                        "span 3",
                }}
            >

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addEducation}
                >
                    + Add Education
                </button>

            </div>

        </div>
</>
);
}

export default EducationSection;