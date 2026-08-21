import { useEffect, useState } from "react";
import studentService from "../services/studentService";
import StudentLayout from "../layouts/StudentLayout";
import api from "../../api/axios";

import {
    UserRound,
    ShieldCheck,
    GraduationCap,
    BriefcaseBusiness,
    FileText,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from "lucide-react";


function StudentApplicationPage() {

    const [app, setApp] = useState({});
    const [student, setStudent] = useState({});

    // Only one section can stay open at a time
    const [openSection, setOpenSection] = useState(null);


    // =========================================================
    // FETCH APPLICATION + STUDENT
    // =========================================================

    useEffect(() => {

        const email = localStorage.getItem("email");

        studentService
            .getDashboard(email)
            .then(res => {
                setStudent(res.data);
            })
            .catch(err => {
                console.log("Dashboard Error:", err);
            });


        studentService
            .getApplication(email)
            .then(res => {
                console.log("Application Response:", res.data);
                setApp(res.data);
            })
            .catch(err => {
                console.log("Application Error:", err);
            });

    }, []);


    // =========================================================
    // ACCORDION
    // =========================================================

    const toggleSection = (section) => {

        setOpenSection(prev =>
            prev === section ? null : section
        );

    };


    // =========================================================
    // PHONE FORMAT
    // =========================================================

    const formatPhoneNumber = (value) => {

        if (!value) return "N/A";

        const numeric = String(value).replace(/\D/g, "");

        if (numeric.length !== 10) {
            return value;
        }

        return `${numeric.slice(0, 3)}-${numeric.slice(3, 6)}-${numeric.slice(6, 10)}`;
    };


    // =========================================================
    // DOCUMENT VIEW
    // =========================================================

    const handleViewDocument = async (documentPath) => {

        if (!documentPath) {
            alert("Document not available.");
            return;
        }

        try {

            const response = await api.get(documentPath, {
                responseType: "blob",
            });

            const blob = new Blob(
                [response.data],
                {
                    type: response.headers["content-type"],
                }
            );

            const blobUrl = window.URL.createObjectURL(blob);

            window.open(
                blobUrl,
                "_blank",
                "noopener,noreferrer"
            );

            setTimeout(() => {
                window.URL.revokeObjectURL(blobUrl);
            }, 10000);

        } catch (error) {

            console.error(
                "Document View Error:",
                error
            );

            alert("Unable to open document.");

        }
    };


    // =========================================================
    // BASIC VALUES FOR SUMMARY
    // =========================================================

    const fullName =
        `${app.firstName || ""} ${app.middleName || ""} ${app.lastName || ""}`
            .trim() || "N/A";


    const visaName =
        app.visaTypeName ||
        app.visaType ||
        "N/A";


    // EAD TYPE
    // Supports both possible backend field names
    const eadType =
        app.eadTypeName ||
        app.eadType ||
        "N/A";


    const educationCount =
        app.educations?.length || 0;


    const experienceCount =
        app.experiences?.length || 0;


    const documentCount =
        [
            app.resume,
            app.idProof,
            app.transcript
        ].filter(Boolean).length;


    // =========================================================
    // APPLICATION STATUS FORMAT
    // =========================================================

    const formattedStatus = app.applicationStage
        ? String(app.applicationStage)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase())
        : null;


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <StudentLayout student={student}>

             <div className="application-main-container" style={{marginTop:"10 px"}}>

            <div className="student-application-page">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="application-page-header">

                    <div className="application-header-left">

                        <div className="application-eyebrow">
                            APPLICATION
                        </div>

                        <h1>
                            My Application
                        </h1>

                        <p>
                            Overview of your application details
                        </p>

                    </div>


                    {formattedStatus && (

                        <div className="application-status">

                            <span>
                                Application Status
                            </span>

                            <strong>
                                {formattedStatus}
                            </strong>

                        </div>

                    )}

                </div>


                {/* =================================================
                    MAIN APPLICATION CONTAINER
                ================================================= */}

               


                    {/* =================================================
                        1. PERSONAL INFORMATION
                    ================================================= */}

                    <div
                        className={`application-section ${
                            openSection === "personal"
                                ? "section-open"
                                : ""
                        }`}
                    >

                        <button
                            type="button"
                            className="application-section-header"
                            onClick={() =>
                                toggleSection("personal")
                            }
                        >

                            <div className="section-header-left">

                                <div className="section-icon">
                                    <UserRound size={21} strokeWidth={2} />
                                </div>


                                <div className="section-heading">

                                    <h2>
                                        Personal Information
                                    </h2>

                                    <p>

                                        <span className="summary-primary">
                                            {fullName}
                                        </span>

                                        <span className="summary-dot">
                                            •
                                        </span>

                                        <span>
                                            {app.email || "Email not available"}
                                        </span>

                                        <span className="summary-dot">
                                            •
                                        </span>

                                        <span>
                                            {app.phone
                                                ? (
                                                    app.phoneCountryCode
                                                        ? `${app.phoneCountryCode} ${formatPhoneNumber(app.phone)}`
                                                        : formatPhoneNumber(app.phone)
                                                )
                                                : "Phone not available"
                                            }
                                        </span>

                                    </p>

                                </div>

                            </div>


                            <span className="accordion-arrow">

                                {openSection === "personal"
                                    ? <ChevronUp size={20} />
                                    : <ChevronDown size={20} />
                                }

                            </span>

                        </button>


                        {openSection === "personal" && (

                            <div className="application-section-content">

                                <div className="details-grid personal-grid">


                                    <div className="detail-item">

                                        <label>
                                            Full Name
                                        </label>

                                        <p>
                                            {fullName}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            Email Address
                                        </label>

                                        <p className="break-email">
                                            {app.email || "N/A"}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            Primary Phone
                                        </label>

                                        <p>
                                            {app.phone
                                                ? (
                                                    app.phoneCountryCode
                                                        ? `${app.phoneCountryCode} ${formatPhoneNumber(app.phone)}`
                                                        : formatPhoneNumber(app.phone)
                                                )
                                                : "N/A"
                                            }
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            Alternate Phone
                                        </label>

                                        <p>
                                            {app.alternatePhone
                                                ? (
                                                    app.alternateCountryCode
                                                        ? `${app.alternateCountryCode} ${formatPhoneNumber(app.alternatePhone)}`
                                                        : formatPhoneNumber(app.alternatePhone)
                                                )
                                                : "N/A"
                                            }
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            Address Line
                                        </label>

                                        <p>
                                            {app.addressLine || "N/A"}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            City
                                        </label>

                                        <p>
                                            {app.city || "N/A"}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            State / Country
                                        </label>

                                        <p>
                                            {`${app.state || ""}, ${app.country || ""}`
                                                .trim()
                                                .replace(/^,|,$/, "")
                                                || "N/A"}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            Zipcode
                                        </label>

                                        <p>
                                            {app.zipcode || "N/A"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        2. VISA & IMMIGRATION
                    ================================================= */}

                    <div
                        className={`application-section ${
                            openSection === "visa"
                                ? "section-open"
                                : ""
                        }`}
                    >

                        <button
                            type="button"
                            className="application-section-header"
                            onClick={() =>
                                toggleSection("visa")
                            }
                        >

                            <div className="section-header-left">

                                <div className="section-icon">
                                    <ShieldCheck
                                        size={21}
                                        strokeWidth={2}
                                    />
                                </div>


                                <div className="section-heading">

                                    <h2>
                                        Visa & Immigration
                                    </h2>

                                    <p>

                                        <span className="summary-primary">
                                            {visaName}
                                        </span>

                                        <span className="summary-dot">
                                            •
                                        </span>

                                        <span>
                                            {app.visaExpiryDate
                                                ? `Expires on ${app.visaExpiryDate}`
                                                : "Expiry date not available"
                                            }
                                        </span>

                                    </p>

                                </div>

                            </div>


                            <span className="accordion-arrow">

                                {openSection === "visa"
                                    ? <ChevronUp size={20} />
                                    : <ChevronDown size={20} />
                                }

                            </span>

                        </button>


                        {openSection === "visa" && (

                            <div className="application-section-content">

                                <div className="details-grid visa-grid">


                                    <div className="detail-item">

                                        <label>
                                            Visa Type
                                        </label>

                                        <p>
                                            {visaName}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            EAD Type
                                        </label>

                                        <p>
                                            {eadType}
                                        </p>

                                    </div>


                                    <div className="detail-item">

                                        <label>
                                            Visa Expiry Date
                                        </label>

                                        <p>
                                            {app.visaExpiryDate || "N/A"}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        3. EDUCATION DETAILS
                    ================================================= */}

                    <div
                        className={`application-section ${
                            openSection === "education"
                                ? "section-open"
                                : ""
                        }`}
                    >

                        <button
                            type="button"
                            className="application-section-header"
                            onClick={() =>
                                toggleSection("education")
                            }
                        >

                            <div className="section-header-left">

                                <div className="section-icon">
                                    <GraduationCap
                                        size={22}
                                        strokeWidth={2}
                                    />
                                </div>


                                <div className="section-heading">

                                    <h2>
                                        Education Details
                                    </h2>

                                    <p>
                                        {educationCount === 0
                                            ? "No Education Records Added"
                                            : `${educationCount} Education Record${educationCount > 1 ? "s" : ""} Added`
                                        }
                                    </p>

                                </div>

                            </div>


                            <span className="accordion-arrow">

                                {openSection === "education"
                                    ? <ChevronUp size={20} />
                                    : <ChevronDown size={20} />
                                }

                            </span>

                        </button>


                        {openSection === "education" && (

                            <div className="application-section-content">

                                {app.educations?.length > 0 ? (

                                    <div className="education-records">

                                        {app.educations.map(
                                            (edu, index) => (

                                                <div
                                                    key={index}
                                                    className="record-card"
                                                >

                                             


                                                    <div className="details-grid education-grid">


                                                        <div className="detail-item">

                                                            <label>
                                                                Institute Name
                                                            </label>

                                                            <p>
                                                                {edu.instituteName || "N/A"}
                                                            </p>

                                                        </div>


                                                        <div className="detail-item">

                                                            <label>
                                                                Field Of Study
                                                            </label>

                                                            <p>
                                                                {edu.fieldOfStudy || "N/A"}
                                                            </p>

                                                        </div>


                                                        <div className="detail-item">

                                                            <label>
                                                                Passing Year
                                                            </label>

                                                            <p>
                                                                {edu.passingYear || "N/A"}
                                                            </p>

                                                        </div>


                                                        <div className="detail-item">

                                                            <label>
                                                                Degree
                                                            </label>

                                                            <p>
                                                                {edu.qualification || "N/A"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <div className="empty-state">
                                        No Education Found
                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        4. PROFESSIONAL EXPERIENCE
                    ================================================= */}

                    <div
                        className={`application-section ${
                            openSection === "experience"
                                ? "section-open"
                                : ""
                        }`}
                    >

                        <button
                            type="button"
                            className="application-section-header"
                            onClick={() =>
                                toggleSection("experience")
                            }
                        >

                            <div className="section-header-left">

                                <div className="section-icon">
                                    <BriefcaseBusiness
                                        size={21}
                                        strokeWidth={2}
                                    />
                                </div>


                                <div className="section-heading">

                                    <h2>
                                        Professional Experience
                                    </h2>

                                    <p>
                                        {experienceCount === 0
                                            ? "No Experience Records Added"
                                            : `${experienceCount} Experience Record${experienceCount > 1 ? "s" : ""} Added`
                                        }
                                    </p>

                                </div>

                            </div>


                            <span className="accordion-arrow">

                                {openSection === "experience"
                                    ? <ChevronUp size={20} />
                                    : <ChevronDown size={20} />
                                }

                            </span>

                        </button>


                        {openSection === "experience" && (

                            <div className="application-section-content">

                                {app.experiences?.length > 0 ? (

                                    <div className="experience-records">

                                        {app.experiences.map(
                                            (exp, index) => (

                                                <div
                                                    key={index}
                                                    className="record-card"
                                                >

                                               


                                                    <div className="details-grid experience-grid">


                                                        <div className="detail-item">

                                                            <label>
                                                                Company
                                                            </label>

                                                            <p>
                                                                {exp.companyName || "N/A"}
                                                            </p>

                                                        </div>


                                                        <div className="detail-item">

                                                            <label>
                                                                Job Title
                                                            </label>

                                                            <p>
                                                                {exp.designation || "N/A"}
                                                            </p>

                                                        </div>


                                                        <div className="detail-item">

                                                            <label>
                                                                Start Date
                                                            </label>

                                                            <p>
                                                                {exp.startDate || "N/A"}
                                                            </p>

                                                        </div>


                                                        <div className="detail-item">

                                                            <label>
                                                                End Date
                                                            </label>

                                                            <p>
                                                                {exp.endDate || "Present"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <div className="empty-state">
                                        No Experience Found
                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        5. UPLOADED DOCUMENTS
                    ================================================= */}

                    <div
                        className={`application-section ${
                            openSection === "documents"
                                ? "section-open"
                                : ""
                        }`}
                    >

                        <button
                            type="button"
                            className="application-section-header"
                            onClick={() =>
                                toggleSection("documents")
                            }
                        >

                            <div className="section-header-left">

                                <div className="section-icon">
                                    <FileText
                                        size={21}
                                        strokeWidth={2}
                                    />
                                </div>


                                <div className="section-heading">

                                    <h2>
                                        Uploaded Documents
                                    </h2>

                                    <p>
                                        {documentCount === 0
                                            ? "No Documents Uploaded"
                                            : `${documentCount} Document${documentCount > 1 ? "s" : ""} Uploaded`
                                        }
                                    </p>

                                </div>

                            </div>


                            <span className="accordion-arrow">

                                {openSection === "documents"
                                    ? <ChevronUp size={20} />
                                    : <ChevronDown size={20} />
                                }

                            </span>

                        </button>


                        {openSection === "documents" && (

                            <div className="application-section-content">

                                <div className="documents-list">


                                    {/* RESUME */}

                                    <div className="document-row">

                                        <div className="document-info">

                                            <span className="document-icon">
                                                <FileText size={18} />
                                            </span>

                                            <div>

                                                <strong>
                                                    Resume
                                                </strong>

                                                <span>
                                                    {app.resume
                                                        ? "Document uploaded"
                                                        : "Not provided"}
                                                </span>

                                            </div>

                                        </div>


                                        {app.resume ? (

                                            <button
                                                type="button"
                                                className="document-open-btn"
                                                onClick={() =>
                                                    handleViewDocument(
                                                        app.resume
                                                    )
                                                }
                                            >

                                                Open Resume

                                                <ExternalLink
                                                    size={14}
                                                />

                                            </button>

                                        ) : (

                                            <span className="document-missing">
                                                Not Provided
                                            </span>

                                        )}

                                    </div>


                                    {/* ID PROOF */}

                                    <div className="document-row">

                                        <div className="document-info">

                                            <span className="document-icon">
                                                <FileText size={18} />
                                            </span>

                                            <div>

                                                <strong>
                                                    ID Proof
                                                </strong>

                                                <span>
                                                    {app.idProof
                                                        ? "Document uploaded"
                                                        : "Not provided"}
                                                </span>

                                            </div>

                                        </div>


                                        {app.idProof ? (

                                            <button
                                                type="button"
                                                className="document-open-btn"
                                                onClick={() =>
                                                    handleViewDocument(
                                                        app.idProof
                                                    )
                                                }
                                            >

                                                Open ID Proof

                                                <ExternalLink
                                                    size={14}
                                                />

                                            </button>

                                        ) : (

                                            <span className="document-missing">
                                                Not Provided
                                            </span>

                                        )}

                                    </div>


                                    {/* TRANSCRIPT */}

                                    <div className="document-row">

                                        <div className="document-info">

                                            <span className="document-icon">
                                                <FileText size={18} />
                                            </span>

                                            <div>

                                                <strong>
                                                    Educational Transcript
                                                </strong>

                                                <span>
                                                    {app.transcript
                                                        ? "Document uploaded"
                                                        : "Not provided"}
                                                </span>

                                            </div>

                                        </div>


                                        {app.transcript ? (

                                            <button
                                                type="button"
                                                className="document-open-btn"
                                                onClick={() =>
                                                    handleViewDocument(
                                                        app.transcript
                                                    )
                                                }
                                            >

                                                Open Transcript

                                                <ExternalLink
                                                    size={14}
                                                />

                                            </button>

                                        ) : (

                                            <span className="document-missing">
                                                Not Provided
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* =========================================================
                PAGE STYLES
            ========================================================= */}

            <style>{APPLICATION_STYLES}</style>

        </StudentLayout>
    );
}


export default StudentApplicationPage;


// =============================================================
// APPLICATION PAGE STYLES
// =============================================================

const APPLICATION_STYLES = `

/* =============================================================
   MAIN PAGE
============================================================= */

.student-application-page {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 25px 24px 55px;
    box-sizing: border-box;

    font-family: Cambria, Georgia, serif;
    color: #0B1E3D;
}


/* =============================================================
   PAGE HEADER
============================================================= */

.application-page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    gap: 25px;
    margin-bottom: 24px;
}

.application-header-left {
    min-width: 0;
}

.application-eyebrow {
    color: #2563EB;

    font-size: 12px;
    font-weight: 700;

    letter-spacing: 1.1px;
    text-transform: uppercase;

    margin-bottom: 5px;
}


.application-page-header h1 {
    margin: 0;

    font-family: Cambria, Georgia, serif;

   
    font-size: 25px;

    line-height: 1.2;
    font-weight: 700;

    color: #0B1E3D;

    letter-spacing: -0.2px;
}


.application-page-header p {
    margin: 7px 0 0;

    color: #64748B;

    font-family: Cambria, Georgia, serif;

    font-size: 15px;

    line-height: 1.5;
}


/* =============================================================
   APPLICATION STATUS
============================================================= */

.application-status {
    display: flex;
    align-items: center;

    gap: 10px;

    font-family: Cambria, Georgia, serif;

    flex-shrink: 0;
}


.application-status span {
    color: #64748B;

    font-size: 14px;
    font-weight: 600;
}


.application-status strong {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 8px 13px;

    border-radius: 8px;

    background: #FFF7ED;

    border: 1px solid #FED7AA;

    color: #B45309;

    font-size: 12px;

    font-weight: 700;

    text-transform: uppercase;

    letter-spacing: 0.4px;
}


/* =============================================================
   MAIN WHITE CONTAINER
============================================================= */

.application-main-container {

    width: 100%;

    background: #FFFFFF;

    border: 1px solid #DDE6F0;

    border-radius: 16px;

    padding: 14px;

    box-sizing: border-box;

    box-shadow:
        0 3px 12px rgba(15, 35, 65, 0.045);
}


/* =============================================================
   ACCORDION SECTIONS
============================================================= */

.application-section {

    width: 100%;

    background: #FFFFFF;

    border: 1px solid #E0E7EF;

    border-radius: 11px;

    overflow: hidden;

    box-sizing: border-box;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;

}


/*
   Space between sections
*/

.application-section + .application-section {
    margin-top: 12px;
}


.application-section:hover {

    border-color: #C9D6E5;

}


.application-section.section-open {

    border-color: #7EA7DE;

    box-shadow:
        0 5px 18px rgba(37, 99, 235, 0.075);

}


/* =============================================================
   SECTION HEADER
============================================================= */

.application-section-header {

    width: 100%;

    min-height: 82px;

    padding: 16px 20px;

    background: #FFFFFF;

    border: none;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 20px;

    cursor: pointer;

    text-align: left;

    font-family: Cambria, Georgia, serif;

    box-sizing: border-box;

}


.application-section-header:hover {

    background: #FBFCFE;

}


/* =============================================================
   LEFT SIDE
============================================================= */

.section-header-left {

    min-width: 0;

    display: flex;
    align-items: center;

    gap: 16px;

}


.section-icon {

    flex: 0 0 44px;

    width: 44px;
    height: 44px;

    border-radius: 10px;

    background: #EEF5FF;

    color: #2563EB;

    display: flex;

    align-items: center;
    justify-content: center;

}


.section-heading {

    min-width: 0;

}


.section-heading h2 {

    margin: 0;

    color: #0B1E3D;

    font-family: Cambria, Georgia, serif;

    /* pehle se thoda bada */
    font-size: 18px;

    line-height: 1.25;

    font-weight: 700;

}


.section-heading p {

    margin: 6px 0 0;

    color: #66758A;

    font-family: Cambria, Georgia, serif;

    /* summary text bada */
    font-size: 14px;

    line-height: 1.45;

    font-weight: 500;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

}


.summary-primary {

    color: #53657C;

    font-weight: 600;

}


.summary-dot {

    margin: 0 8px;

    color: #A4B0BE;

}


/* =============================================================
   ARROW
============================================================= */

.accordion-arrow {

    flex: 0 0 auto;

    width: 34px;
    height: 34px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #243B5A;

    background: #F4F7FA;

    transition:
        background 0.2s ease,
        color 0.2s ease;

}


.application-section-header:hover .accordion-arrow {

    background: #EAF2FD;

    color: #2563EB;

}


/* =============================================================
   EXPANDED CONTENT
============================================================= */

.application-section-content {

    padding: 20px 20px 22px;

    border-top: 1px solid #E8EDF3;

    background: #FCFDFE;

    animation: applicationExpand 0.2s ease-out;

}


@keyframes applicationExpand {

    from {

        opacity: 0;

        transform: translateY(-4px);

    }

    to {

        opacity: 1;

        transform: translateY(0);

    }

}


/* =============================================================
   DETAILS GRID
============================================================= */

.details-grid {

    display: grid;

    gap: 0;

    border: 1px solid #DCE4ED;

    border-radius: 10px;

    overflow: hidden;

    background: #FFFFFF;

}


.personal-grid {

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

}


.visa-grid {

    grid-template-columns:
        repeat(3, minmax(0, 1fr));

}


.education-grid {

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

}


.experience-grid {

    grid-template-columns:
        repeat(4, minmax(0, 1fr));

}


/* =============================================================
   DETAIL ITEM
============================================================= */

.detail-item {

    min-width: 0;

    padding: 18px 17px;

    border-right: 1px solid #E4EAF1;

    border-bottom: 1px solid #E4EAF1;

    box-sizing: border-box;

}


/*
   Last column
*/

.personal-grid .detail-item:nth-child(4n),
.education-grid .detail-item:nth-child(4n),
.experience-grid .detail-item:nth-child(4n),
.visa-grid .detail-item:nth-child(3n) {

    border-right: none;

}


/*
   Last row
*/

.personal-grid .detail-item:nth-last-child(-n + 4),
.education-grid .detail-item:nth-last-child(-n + 4),
.experience-grid .detail-item:nth-last-child(-n + 4),
.visa-grid .detail-item:nth-last-child(-n + 3) {

    border-bottom: none;

}


/* =============================================================
   DETAIL LABELS
============================================================= */

.detail-item label {

    display: block;

    margin-bottom: 7px;

    /*
       Label ab clearly visible hoga
    */

    color: #242527;

    font-family: Cambria, Georgia, serif;

    font-size: 14.5px;

    line-height: 1.35;

    font-weight: 700;

    letter-spacing: 0.1px;

}


/* =============================================================
   DETAIL VALUES
============================================================= */

.detail-item p {

    margin: 0;

    color: #1F2937;

    font-family: Cambria, Georgia, serif;

    font-size: 15px;

    line-height: 1.5;

    font-weight: 500;

    word-break: break-word;

}


.break-email {

    word-break: break-all;

}


/* =============================================================
   RECORD CARDS
============================================================= */

.education-records,
.experience-records {

    display: flex;

    flex-direction: column;

    gap: 14px;

}


.record-card {

    border: 1px solid #DCE4ED;

    border-radius: 10px;

    overflow: hidden;

    background: #FFFFFF;

}


.record-number {

    padding: 11px 16px;

    background: #F4F7FB;

    border-bottom: 1px solid #E2E8F0;

    color: #2563EB;

    font-family: Cambria, Georgia, serif;

    font-size: 13px;

    font-weight: 700;

    text-transform: uppercase;

    letter-spacing: 0.5px;

}


/* =============================================================
   EMPTY STATE
============================================================= */

.empty-state {

    padding: 26px;

    border-radius: 10px;

    background: #FFFFFF;

    border: 1px dashed #CBD5E1;

    text-align: center;

    color: #68778A;

    font-family: Cambria, Georgia, serif;

    font-size: 14px;

    font-weight: 600;

}


/* =============================================================
   DOCUMENTS
============================================================= */

.documents-list {

    display: flex;

    flex-direction: column;

    gap: 12px;

}


.document-row {

    min-height: 70px;

    padding: 13px 15px;

    border: 1px solid #DCE4ED;

    border-radius: 9px;

    background: #FFFFFF;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 18px;

    box-sizing: border-box;

}


.document-info {

    min-width: 0;

    display: flex;

    align-items: center;

    gap: 12px;

}


.document-icon {

    width: 38px;
    height: 38px;

    flex: 0 0 38px;

    border-radius: 8px;

    background: #EEF5FF;

    color: #2563EB;

    display: flex;

    align-items: center;
    justify-content: center;

}


.document-info > div {

    min-width: 0;

    display: flex;

    flex-direction: column;

    gap: 4px;

}


.document-info strong {

    color: #1E293B;

    font-family: Cambria, Georgia, serif;

    font-size: 15px;

    font-weight: 700;

}


.document-info span {

    color: #68778A;

    font-family: Cambria, Georgia, serif;

    font-size: 13px;

}


.document-open-btn {

    flex: 0 0 auto;

    display: inline-flex;

    align-items: center;

    gap: 7px;

    border: 1px solid #BFD4F4;

    background: #F4F8FF;

    color: #2563EB;

    padding: 8px 13px;

    border-radius: 7px;

    font-family: Cambria, Georgia, serif;

    font-size: 13px;

    font-weight: 700;

    cursor: pointer;

    transition:
        background 0.2s ease,
        border-color 0.2s ease;

}


.document-open-btn:hover {

    background: #E8F1FF;

    border-color: #8FB5EC;

}


.document-missing {

    flex: 0 0 auto;

    color: #94A3B8;

    font-family: Cambria, Georgia, serif;

    font-size: 13px;

    font-weight: 600;

}


/* =============================================================
   TABLET
============================================================= */

@media (max-width: 900px) {

    .student-application-page {

        padding: 20px 18px 45px;

    }


    .personal-grid,
    .education-grid,
    .experience-grid {

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

    }


    .visa-grid {

        grid-template-columns:
            repeat(2, minmax(0, 1fr));

    }


    .personal-grid .detail-item:nth-child(4n),
    .education-grid .detail-item:nth-child(4n),
    .experience-grid .detail-item:nth-child(4n),
    .visa-grid .detail-item:nth-child(3n) {

        border-right: 1px solid #E4EAF1;

    }


    .personal-grid .detail-item:nth-child(2n),
    .education-grid .detail-item:nth-child(2n),
    .experience-grid .detail-item:nth-child(2n),
    .visa-grid .detail-item:nth-child(2n) {

        border-right: none;

    }


    .personal-grid .detail-item:nth-last-child(-n + 4),
    .education-grid .detail-item:nth-last-child(-n + 4),
    .experience-grid .detail-item:nth-last-child(-n + 4),
    .visa-grid .detail-item:nth-last-child(-n + 3) {

        border-bottom: 1px solid #E4EAF1;

    }


    .personal-grid .detail-item:nth-last-child(-n + 2),
    .education-grid .detail-item:nth-last-child(-n + 2),
    .experience-grid .detail-item:nth-last-child(-n + 2),
    .visa-grid .detail-item:nth-last-child(-n + 2) {

        border-bottom: none;

    }

}


/* =============================================================
   MOBILE
============================================================= */

@media (max-width: 640px) {

    .student-application-page {

        padding: 16px 12px 35px;

    }


    .application-page-header {

        align-items: flex-start;

        flex-direction: column;

        gap: 13px;

        margin-bottom: 18px;

    }


    .application-page-header h1 {

        font-size: 23px;

    }


    .application-page-header p {

        font-size: 13px;

    }


    .application-status {

        align-self: flex-start;

    }


    .application-main-container {

        padding: 9px;

        border-radius: 12px;

    }


    .application-section + .application-section {

        margin-top: 9px;

    }


    .application-section-header {

        min-height: 70px;

        padding: 12px 13px;

        gap: 10px;

    }


    .section-header-left {

        gap: 11px;

    }


    .section-icon {

        width: 37px;
        height: 37px;

        flex-basis: 37px;

    }


    .section-heading h2 {

        font-size: 16px;

    }


    .section-heading p {

        font-size: 12.5px;

        max-width: 235px;

    }


    .summary-dot {

        margin: 0 5px;

    }


    .accordion-arrow {

        width: 30px;
        height: 30px;

    }


    .application-section-content {

        padding: 15px 12px 17px;

    }


    .personal-grid,
    .visa-grid,
    .education-grid,
    .experience-grid {

        grid-template-columns: 1fr;

    }


    .detail-item,
    .personal-grid .detail-item,
    .visa-grid .detail-item,
    .education-grid .detail-item,
    .experience-grid .detail-item {

        border-right: none;

        border-bottom: 1px solid #E4EAF1;

    }


    .detail-item:last-child {

        border-bottom: none;

    }


    .detail-item label {

        font-size: 13px;

    }


    .detail-item p {

        font-size: 14px;

    }


    .document-row {

        align-items: flex-start;

        flex-direction: column;

        gap: 12px;

    }


    .document-open-btn,
    .document-missing {

        align-self: flex-start;

    }

}

`;