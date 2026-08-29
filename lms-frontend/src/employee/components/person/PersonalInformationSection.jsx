import React from "react";
import "../../styles/employeefrom.css";



function PersonalInformationSection({
                                        formData,
                                        handleChange,
                                        setFormData,
                                        genders,
                                        nationalities,
                                        starStyle,
                                        isUpdate = false,
                                    }) {
    const currentYear =
        new Date().getFullYear();

    // =====================================================
    // SAFE VALUES
    // =====================================================

    const genderId =
        formData?.genderId ?? "";

    const nationalityId =
        formData?.nationalityId ?? "";

    const birthYear =
        formData?.birthYear ?? "";

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <h3 className="form-section-title">
                Personal Information
            </h3>

            <div className="form-grid">

            {/* ===================================================== */}
            {/* FIRST NAME */}
            {/* ===================================================== */}

            <div className="form-group  ">

                <label >
                    First Name{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <input
                    type="text"
                    name="firstName"
                    value={
                        formData?.firstName ?? ""
                    }
                    onChange={handleChange}
                    placeholder="First Name"
                    autoComplete="given-name"
                    required
                    disabled={isUpdate}
                />

                {isUpdate && (
                    <small>
                        First name cannot be changed.
                    </small>
                )}

            </div>

            {/* ===================================================== */}
            {/* MIDDLE NAME */}
            {/* ===================================================== */}

            <div className="form-group">

                <label>
                    Middle Name
                </label>

                <input
                    type="text"
                    name="middleName"
                    value={
                        formData?.middleName ?? ""
                    }
                    onChange={handleChange}
                    placeholder="Middle Name"
                    autoComplete="additional-name"
                    disabled={isUpdate}
                />

                {isUpdate && (
                    <small>
                        Middle name cannot be changed.
                    </small>
                )}

            </div>

            {/* ===================================================== */}
            {/* LAST NAME */}
            {/* ===================================================== */}

            <div className="form-group">

                <label style={{ fontSize: "20px" }}>

                Last Name
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <input
                    type="text"
                    name="lastName"
                    value={
                        formData?.lastName ?? ""
                    }
                    onChange={handleChange}
                    placeholder="Last Name"
                    autoComplete="family-name"
                    disabled={isUpdate}
                />

                {isUpdate && (
                    <small>
                        Last name cannot be changed.
                    </small>
                )}

            </div>

            {/* ===================================================== */}
            {/* GENDER */}
            {/* ===================================================== */}
                <div className="form-group">

                    <label>
                        Gender{" "}
                        <span style={starStyle}>
            *
        </span>
                    </label>

                    <select
                        name="genderId"
                        value={
                            genderId === null || genderId === undefined
                                ? ""
                                : String(genderId)
                        }
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Gender
                        </option>

                        {genders?.map(
                            (gender) => (

                                <option
                                    key={gender.genderId}
                                    value={String(gender.genderId)}
                                >
                                    {gender.genderName}
                                </option>

                            )
                        )}

                    </select>

                </div>

            {/* ===================================================== */}
            {/* BIRTH YEAR */}
            {/* ===================================================== */}

            <div className="form-group">

                <label>
                    Birth Year
                </label>

                <input
                    type="number"
                    name="birthYear"
                    value={
                        birthYear === null
                            ? ""
                            : birthYear
                    }
                    onChange={handleChange}
                    min="1950"
                    max={currentYear}
                    placeholder="e.g. 2002"
                />

            </div>

            {/* ===================================================== */}
            {/* NATIONALITY */}
            {/* ===================================================== */}

            <div className="form-group">

                <label>
                    Nationality{" "}
                    <span style={starStyle}>
                        *
                    </span>
                </label>

                <select
                    name="nationalityId"
                    value={
                        nationalityId === null
                            ? ""
                            : String(
                                nationalityId
                            )
                    }
                    onChange={handleChange}
                    required
                >

                    <option value="">
                        Select Nationality
                    </option>

                    {nationalities?.map(
                        (nationality) => (

                            <option
                                key={
                                    nationality.nationalityId
                                }
                                value={
                                    String(
                                        nationality.nationalityId
                                    )
                                }
                            >
                                {
                                    nationality.nationalityName
                                }
                            </option>

                        )
                    )}

                </select>

            </div>

            {/* ===================================================== */}
            {/* MARRIED */}
            {/* ===================================================== */}

            <div className="form-group">

                <label>
                    Married
                </label>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "10px",
                    }}
                >

                    <input
                        type="checkbox"
                        name="isMarried"
                        checked={
                            formData?.isMarried === true
                        }
                        onChange={(e) =>
                            setFormData(
                                (prev) => ({
                                    ...prev,
                                    isMarried:
                                    e.target.checked,
                                })
                            )
                        }
                    />

                    <span>
                        Married
                    </span>

                </div>

            </div>

            </div>
        </>
    );
}

export default PersonalInformationSection;