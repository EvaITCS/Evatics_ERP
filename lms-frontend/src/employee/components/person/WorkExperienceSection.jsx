import React from "react";

function WorkExperienceSection({
                                   formData,
                                   handleExperienceChange,
                                   addExperience,
                                   removeExperience,
                               }) {
    const workExperiences =
        formData?.workExperiences || [];

    return (

        <>

            <h3 className="form-section-title">

                Work Experience

            </h3>



            <div className="form-grid">

            {/* ===================================================== */}
            {/* WORK EXPERIENCE LIST */}
            {/* ===================================================== */}

            {workExperiences.map(
                (experience, index) => {

                    const currentlyWorking =
                        experience?.currentlyWorking === true;

                    return (
                        <React.Fragment
                            key={
                                experience?.experienceId ??
                                `experience-${index}`
                            }
                        >

                            {/* ================================================= */}



                            {/* ================================================= */}
                            {/* COMPANY NAME */}
                            {/* ================================================= */}

                            <div className="form-group">

                                <label>
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        experience?.companyName || ""
                                    }
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "companyName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Company Name"
                                />

                            </div>


                            {/* ================================================= */}
                            {/* DESIGNATION */}
                            {/* ================================================= */}

                            <div className="form-group">

                                <label>
                                    Designation
                                </label>

                                <input
                                    type="text"
                                    value={
                                        experience?.designation || ""
                                    }
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "designation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Designation"
                                />

                            </div>


                            {/* ================================================= */}
                            {/* START DATE */}
                            {/* ================================================= */}

                            <div className="form-group">

                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        experience?.startDate || ""
                                    }
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "startDate",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* ================================================= */}
                            {/* END DATE */}
                            {/* ================================================= */}

                            <div className="form-group">

                                <label>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        experience?.endDate || ""
                                    }
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "endDate",
                                            e.target.value
                                        )
                                    }
                                    disabled={currentlyWorking}
                                />

                                {currentlyWorking && (
                                    <small>
                                        End date is disabled because
                                        the employee is currently working.
                                    </small>
                                )}

                            </div>


                            {/* ================================================= */}
                            {/* CURRENTLY WORKING */}
                            {/* ================================================= */}

                            <div className="form-group">

                                <label>
                                    Currently Working
                                </label>

                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginTop: "10px",
                                        cursor: "pointer",
                                    }}
                                >

                                    <input
                                        type="checkbox"
                                        checked={
                                            currentlyWorking
                                        }
                                        onChange={(e) => {

                                            const checked =
                                                e.target.checked;

                                            // Update currently working
                                            handleExperienceChange(
                                                index,
                                                "currentlyWorking",
                                                checked
                                            );

                                            // Clear end date when
                                            // currently working
                                            if (checked) {
                                                handleExperienceChange(
                                                    index,
                                                    "endDate",
                                                    ""
                                                );
                                            }

                                        }}
                                    />

                                    Currently Working

                                </label>

                            </div>


                            {/* ================================================= */}
                            {/* SKILLS USED */}
                            {/* ================================================= */}

                            <div className="form-group">

                                <label>
                                    Skills Used
                                </label>

                                <input
                                    type="text"
                                    value={
                                        experience?.skillsUsed || ""
                                    }
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "skillsUsed",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Java, Spring Boot, React"
                                />

                            </div>


                            {/* ================================================= */}
                            {/* JOB DESCRIPTION */}
                            {/* ================================================= */}

                            <div
                                className="form-group"
                                style={{
                                    gridColumn: "span 3",
                                }}
                            >

                                <label>
                                    Job Description
                                </label>

                                <textarea
                                    rows={4}
                                    value={
                                        experience?.jobDescription || ""
                                    }
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "jobDescription",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe your responsibilities..."
                                />

                            </div>


                            {/* ================================================= */}
                            {/* REMOVE EXPERIENCE */}
                            {/* ================================================= */}

                            {workExperiences.length > 1 && (
                                <div
                                    style={{
                                        gridColumn: "span 3",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => removeExperience(index)}
                                        style={{
                                            width: "2cm",
                                            height: "0.8cm",
                                            padding: "0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            {/* ================================================= */}
                            {/* SEPARATOR */}
                            {/* ================================================= */}

                            <hr
                                style={{
                                    gridColumn: "span 3",
                                }}
                            />

                        </React.Fragment>
                    );
                }
            )}


            {/* ===================================================== */}
            {/* ADD EXPERIENCE */}
            {/* ===================================================== */}

                <div
                    style={{
                        gridColumn: "span 3",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginTop: "10px",
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addExperience}
                        style={{
                            width: "2cm",
                            height: "0.8cm",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                       + Add
                    </button>
                </div>

        </div>
</>
);
}

export default WorkExperienceSection;