import React from "react";
import "../styles/employeefrom.css";

function EmployeeReviewSection({
                                   formData,

                                   // =====================================================
                                   // EMPLOYEE MASTERS
                                   // =====================================================

                                   departments = [],
                                   designations = [],
                                   employeeStatuses = [],
                                   workModes = [],
                                   shifts = [],
                                   locations = [],

                                   // =====================================================
                                   // PERSON MASTERS
                                   // =====================================================

                                   genders = [],
                                   nationalities = [],
                               }) {

    // =====================================================
    // SAFE DATA
    // =====================================================

    const data = formData || {};

    const contacts = data.contacts || [];
    const addresses = data.addresses || [];
    const educations = data.educations || [];
    const workExperiences = data.workExperiences || [];
    const visas = data.visas || [];
    const documents = data.documents || [];
    const emergencyContacts =
        data.emergencyContacts || [];


    // =====================================================
    // MASTER NAME HELPER
    // =====================================================

    const getMasterName = (
        list,
        id,
        idField,
        ...nameFields
    ) => {

        // No ID selected
        if (
            id === null ||
            id === undefined ||
            id === ""
        ) {
            return "N/A";
        }

        // Find master record
        const item = list.find(
            (entry) =>
                String(entry?.[idField]) ===
                String(id)
        );

        // ID exists but master record not found
        if (!item) {
            return "N/A";
        }

        // Find name field
        for (const field of nameFields) {

            if (
                item?.[field] !== null &&
                item?.[field] !== undefined &&
                String(item[field]).trim() !== ""
            ) {
                return item[field];
            }
        }

        return "N/A";
    };


    // =====================================================
    // GENDER
    // =====================================================

    const genderName =
        getMasterName(
            genders,
            data.genderId,
            "genderId",
            "genderName",
            "name"
        );


    // =====================================================
    // NATIONALITY
    // =====================================================

    const nationalityName =
        getMasterName(
            nationalities,
            data.nationalityId,
            "nationalityId",
            "nationalityName",
            "name"
        );


    // =====================================================
    // EMPLOYEE MASTER NAMES
    // =====================================================

    const departmentName =
        getMasterName(
            departments,
            data.departmentId,
            "departmentId",
            "departmentName",
            "name"
        );


    const designationName =
        getMasterName(
            designations,
            data.designationId,
            "designationId",
            "designationName",
            "name"
        );


    const employeeStatusName =
        getMasterName(
            employeeStatuses,
            data.employeeStatusId,
            "employeeStatusId",
            "statusName",
            "employeeStatus",
            "employeeStatusName",
            "name"
        );


    const workModeName =
        getMasterName(
            workModes,
            data.workModeId,
            "modeId",
            "modeName",
            "name"
        );


    const shiftName =
        getMasterName(
            shifts,
            data.shiftId,
            "shiftId",
            "shiftName",
            "name"
        );


    const locationName =
        getMasterName(
            locations,
            data.locationId,
            "locationId",
            "locationName",
            "name"
        );


    // =====================================================
    // CONTACTS
    // =====================================================

    const primaryEmail =
        contacts?.[0]?.contactValue || "N/A";

    const primaryPhone =
        contacts?.[1]?.contactValue || "N/A";

    const alternateEmail =
        contacts?.[2]?.contactValue || "N/A";

    const alternatePhone =
        contacts?.[3]?.contactValue || "N/A";


    // =====================================================
    // ADDRESSES
    // =====================================================

    const permanentAddress =
        addresses?.[0] || null;

    const currentAddress =
        addresses?.[1] || null;


    // =====================================================
    // ADDRESS DISPLAY
    // =====================================================

    const formatAddress = (address) => {

        if (!address) {
            return "N/A";
        }

        const parts = [
            address.addressLine1,
            address.addressLine2,
            address.city,
            address.state,
            address.country,
            address.zipCode,
        ].filter(
            (value) =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
        );

        return parts.length > 0
            ? parts.join(", ")
            : "N/A";
    };


    // =====================================================
    // BACKEND API URL
    // =====================================================

    const BACKEND_API_URL =
        process.env.REACT_APP_API_URL ||
        "http://localhost:8080";


    // =====================================================
    // DOCUMENT URL
    // =====================================================

    const getDocumentUrl = (fileUrl) => {

        if (!fileUrl) {
            return "";
        }

        if (
            fileUrl.startsWith("http://") ||
            fileUrl.startsWith("https://")
        ) {
            return fileUrl;
        }

        return `${BACKEND_API_URL}${
            fileUrl.startsWith("/") ? "" : "/"
        }${fileUrl}`;
    };


    // =====================================================
    // EMPTY VALUE
    // =====================================================

    const displayValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        ) {
            return "N/A";
        }

        return value;
    };


    // =====================================================
    // BOOLEAN DISPLAY
    // =====================================================

    const displayBoolean = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "N/A";
        }

        return value === true
            ? "Yes"
            : "No";
    };


    // =====================================================
    // SECTION STYLE
    // =====================================================

    const sectionStyle = {
        marginBottom: "25px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
    };


    const sectionTitleStyle = {
        marginTop: 0,
        marginBottom: "18px",
        paddingBottom: "10px",
        borderBottom: "1px solid #ddd",
    };


    const gridStyle = {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "16px",
    };


    const itemStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    };


    const labelStyle = {
        fontWeight: "600",
        fontSize: "13px",
        color: "#555",
    };


    const valueStyle = {
        fontSize: "14px",
        color: "#222",
        wordBreak: "break-word",
    };


    const fullWidthStyle = {
        gridColumn: "1 / -1",
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="employee-review">

            {/* ================================================= */}
            {/* REVIEW TITLE */}
            {/* ================================================= */}

            <div style={sectionStyle}>

                <h2
                    style={{
                        marginTop: 0,
                        marginBottom: "8px",
                    }}
                >
                    Review Employee Information
                </h2>

                <p
                    style={{
                        margin: 0,
                        color: "#666",
                    }}
                >
                    Please review all the information
                    before saving the employee.
                </p>

            </div>


            {/* ================================================= */}
            {/* PERSONAL INFORMATION */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Personal Information
                </h3>

                <div style={gridStyle}>

                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            First Name
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.firstName
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Middle Name
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.middleName
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Last Name
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.lastName
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Gender
                        </span>

                        <span style={valueStyle}>
                            {genderName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Birth Year
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.birthYear
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Nationality
                        </span>

                        <span style={valueStyle}>
                            {nationalityName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Married
                        </span>

                        <span style={valueStyle}>
                            {displayBoolean(
                                data.isMarried
                            )}
                        </span>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* CONTACT INFORMATION */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Contact Information
                </h3>

                <div style={gridStyle}>

                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Primary Email
                        </span>

                        <span style={valueStyle}>
                            {primaryEmail}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Primary Phone
                        </span>

                        <span style={valueStyle}>
                            {primaryPhone}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Alternate Email
                        </span>

                        <span style={valueStyle}>
                            {alternateEmail}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Alternate Phone
                        </span>

                        <span style={valueStyle}>
                            {alternatePhone}
                        </span>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* ADDRESS INFORMATION */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Address Information
                </h3>

                <div style={gridStyle}>

                    <div
                        style={{
                            ...itemStyle,
                            ...fullWidthStyle,
                        }}
                    >

                        <span style={labelStyle}>
                            Permanent Address
                        </span>

                        <span style={valueStyle}>
                            {formatAddress(
                                permanentAddress
                            )}
                        </span>

                    </div>


                    <div
                        style={{
                            ...itemStyle,
                            ...fullWidthStyle,
                        }}
                    >

                        <span style={labelStyle}>
                            Current Address
                        </span>

                        <span style={valueStyle}>
                            {formatAddress(
                                currentAddress
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Same as Permanent
                        </span>

                        <span style={valueStyle}>
                            {displayBoolean(
                                data.sameAsPermanent
                            )}
                        </span>

                    </div>

                </div>

            </section>


            {/* ================================================= */}
            {/* EDUCATION */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Education
                </h3>

                {educations.length > 0 ? (

                    educations.map(
                        (education, index) => (

                            <div
                                key={
                                    education.educationId ||
                                    index
                                }
                                style={{
                                    ...gridStyle,
                                    marginBottom:
                                        "20px",
                                    paddingBottom:
                                        "20px",
                                    borderBottom:
                                        index <
                                        educations.length - 1
                                            ? "1px solid #eee"
                                            : "none",
                                }}
                            >

                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Qualification
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            education.qualification
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Institute
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            education.instituteName
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Field of Study
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            education.fieldOfStudy
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Passing Year
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            education.passingYear
                                        )}
                                    </span>

                                </div>

                            </div>

                        )
                    )

                ) : (

                    <p>N/A</p>

                )}

            </section>


            {/* ================================================= */}
            {/* WORK EXPERIENCE */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Work Experience
                </h3>

                {workExperiences.length > 0 ? (

                    workExperiences.map(
                        (experience, index) => (

                            <div
                                key={
                                    experience.experienceId ||
                                    index
                                }
                                style={{
                                    ...gridStyle,
                                    marginBottom:
                                        "20px",
                                    paddingBottom:
                                        "20px",
                                    borderBottom:
                                        index <
                                        workExperiences.length - 1
                                            ? "1px solid #eee"
                                            : "none",
                                }}
                            >

                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Company
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            experience.companyName
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Designation
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            experience.designation
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Start Date
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            experience.startDate
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        End Date
                                    </span>

                                    <span style={valueStyle}>
                                        {experience.currentlyWorking === true
                                            ? "Currently Working"
                                            : displayValue(
                                                experience.endDate
                                            )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Currently Working
                                    </span>

                                    <span style={valueStyle}>
                                        {displayBoolean(
                                            experience.currentlyWorking
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Skills Used
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            experience.skillsUsed
                                        )}
                                    </span>

                                </div>


                                <div
                                    style={{
                                        ...itemStyle,
                                        ...fullWidthStyle,
                                    }}
                                >

                                    <span style={labelStyle}>
                                        Job Description
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            experience.jobDescription
                                        )}
                                    </span>

                                </div>

                            </div>

                        )
                    )

                ) : (

                    <p>N/A</p>

                )}

            </section>


            {/* ================================================= */}
            {/* VISA */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Visa Information
                </h3>

                {visas.length > 0 ? (

                    visas.map(
                        (visa, index) => (

                            <div
                                key={
                                    visa.visaId ||
                                    index
                                }
                                style={{
                                    ...gridStyle,
                                    marginBottom:
                                        "20px",
                                    paddingBottom:
                                        "20px",
                                    borderBottom:
                                        index <
                                        visas.length - 1
                                            ? "1px solid #eee"
                                            : "none",
                                }}
                            >

                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Visa Type
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            visa.visaType
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        EAD Type
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            visa.eadType
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Other EAD Type
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            visa.otherEadType
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Visa Expiry Date
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            visa.visaExpiryDate
                                        )}
                                    </span>

                                </div>

                            </div>

                        )
                    )

                ) : (

                    <p>N/A</p>

                )}

            </section>


            {/* ================================================= */}
            {/* DOCUMENTS */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Documents
                </h3>

                {documents.length > 0 ? (

                    documents.map(
                        (document, index) => (

                            <div
                                key={
                                    document.documentId ||
                                    index
                                }
                                style={{
                                    ...gridStyle,
                                    marginBottom:
                                        "20px",
                                    paddingBottom:
                                        "20px",
                                    borderBottom:
                                        index <
                                        documents.length - 1
                                            ? "1px solid #eee"
                                            : "none",
                                }}
                            >

                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Document Type
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            document.documentType
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Document Number
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            document.documentNumber
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        File Name
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            document.fileName
                                        )}
                                    </span>

                                </div>


                                <div
                                    style={{
                                        ...itemStyle,
                                        ...fullWidthStyle,
                                    }}
                                >

                                    <span style={labelStyle}>
                                        File
                                    </span>

                                    {document.fileUrl ? (

                                        <a
                                            href={getDocumentUrl(
                                                document.fileUrl
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "#2563eb",
                                                textDecoration:
                                                    "none",
                                            }}
                                        >
                                            View Uploaded Document
                                        </a>

                                    ) : (

                                        <span
                                            style={
                                                valueStyle
                                            }
                                        >
                                            N/A
                                        </span>

                                    )}

                                </div>

                            </div>

                        )
                    )

                ) : (

                    <p>N/A</p>

                )}

            </section>


            {/* ================================================= */}
            {/* EMERGENCY CONTACTS */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Emergency Contacts
                </h3>

                {emergencyContacts.length > 0 ? (

                    emergencyContacts.map(
                        (contact, index) => (

                            <div
                                key={
                                    contact.emergencyContactId ||
                                    index
                                }
                                style={{
                                    ...gridStyle,
                                    marginBottom:
                                        "20px",
                                    paddingBottom:
                                        "20px",
                                    borderBottom:
                                        index <
                                        emergencyContacts.length - 1
                                            ? "1px solid #eee"
                                            : "none",
                                }}
                            >

                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Contact Name
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            contact.contactName
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Relationship
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            contact.relationship
                                        )}
                                    </span>

                                </div>


                                <div style={itemStyle}>

                                    <span style={labelStyle}>
                                        Phone Number
                                    </span>

                                    <span style={valueStyle}>
                                        {displayValue(
                                            contact.phoneNumber
                                        )}
                                    </span>

                                </div>


                                <div
                                    style={{
                                        ...itemStyle,
                                        ...fullWidthStyle,
                                    }}
                                >

                                    <span style={labelStyle}>
                                        Address
                                    </span>

                                    <span style={valueStyle}>

                                        {[
                                                contact.addressLine1,
                                                contact.addressLine2,
                                                contact.city,
                                                contact.state,
                                                contact.country,
                                                contact.zipcode,
                                            ]
                                                .filter(
                                                    (value) =>
                                                        value !==
                                                        null &&
                                                        value !==
                                                        undefined &&
                                                        String(
                                                            value
                                                        ).trim() !==
                                                        ""
                                                )
                                                .join(", ") ||
                                            "N/A"}

                                    </span>

                                </div>

                            </div>

                        )
                    )

                ) : (

                    <p>N/A</p>

                )}

            </section>


            {/* ================================================= */}
            {/* EMPLOYMENT DETAILS */}
            {/* ================================================= */}

            <section style={sectionStyle}>

                <h3 style={sectionTitleStyle}>
                    Employment Details
                </h3>

                <div style={gridStyle}>

                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Employee Code
                        </span>

                        <span style={valueStyle}>
    {data.employeeCode || ""}
</span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Joining Date
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.joiningDate
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Department
                        </span>

                        <span style={valueStyle}>
                            {departmentName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Designation
                        </span>

                        <span style={valueStyle}>
                            {designationName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Employment Type
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.employmentType
                            )}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Employee Status
                        </span>

                        <span style={valueStyle}>
                            {employeeStatusName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Work Mode
                        </span>

                        <span style={valueStyle}>
                            {workModeName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Shift
                        </span>

                        <span style={valueStyle}>
                            {shiftName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Location
                        </span>

                        <span style={valueStyle}>
                            {locationName}
                        </span>

                    </div>


                    <div style={itemStyle}>

                        <span style={labelStyle}>
                            Probation End Date
                        </span>

                        <span style={valueStyle}>
                            {displayValue(
                                data.probationEndDate
                            )}
                        </span>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default EmployeeReviewSection;