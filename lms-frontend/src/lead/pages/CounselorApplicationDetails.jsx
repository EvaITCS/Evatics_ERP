import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../shared/components/ToastContext";
import "../styles/CounselorApplicationDetails.css";

export default function CounselorApplicationDetails() {

    const { id } = useParams();

    const [app, setApp] = useState(null);
    const [sendingInvitation, setSendingInvitation] = useState(false);

    // =========================================================
    // GLOBAL TOAST
    // =========================================================

    const { showToast } = useToast();

    useEffect(() => {

        api.get(`/api/counselor/application/${id}`)
            .then(res => {

                console.log("Counselor App Data:", res.data);

                setApp(res.data);

            })
            .catch(err => {

                console.error("Counselor Application Error:", err);

            });

    }, [id]);


    // =========================================================
    // PHONE FORMAT
    // =========================================================

    const formatPhoneNumber = (phoneStr) => {

        if (!phoneStr) return "";

        const cleaned = String(phoneStr).replace(/\D/g, "");

        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }

        return phoneStr;
    };


    // =========================================================
    // APPLICATION / ENROLLMENT NUMBER
    // =========================================================

    const formatApplicationNumber = (personId) => {

        if (!personId) return "N/A";

        return `APP${personId}`;
    };


    const formatEnrollmentNumber = (personId) => {

        if (!personId) return "N/A";

        return `ENR${personId}`;
    };


    // =========================================================
    // CHECK ENROLLED
    // =========================================================

    const isEnrolled =
        app?.applicationStage?.toUpperCase() === "ENROLLED";


    // =========================================================
    // DISPLAY NUMBER
    // =========================================================

    const displayNumber = isEnrolled
        ? formatEnrollmentNumber(app?.personId)
        : formatApplicationNumber(app?.personId);


    const displayNumberLabel = isEnrolled
        ? "Enrollment Number"
        : "Application Number";


    // =========================================================
    // STATUS BADGE
    // =========================================================

    const getStatusClass = (status) => {

        if (!status) return "pending";

        switch (status.toUpperCase()) {

            case "ENROLLED":
                return "enrolled";

            case "RECHECK_REQUIRED":
                return "recheck";

            case "MEETING_PENDING":
                return "meeting-pending";

            case "SUBMITTED":
                return "submitted";

            default:
                return "pending";
        }
    };


    // =========================================================
    // SEND INVITATION
    // =========================================================

    const handleSendInvitation = async () => {

        try {

            setSendingInvitation(true);

            // =====================================================
            // STEP 1: Fetch student credentials
            // =====================================================

            const credentialsResponse = await api.get(
                "/api/counselor/student-credentials"
            );

            console.log(
                "Student Credentials:",
                credentialsResponse.data
            );


            // =====================================================
            // STEP 2: Find credentials for current student
            // =====================================================

            const credentialsList = credentialsResponse.data;

            const studentCredentials = credentialsList.find(
                (student) =>
                    Number(student.personId) === Number(app.personId)
            );

            console.log(
                "Current Student Credentials:",
                studentCredentials
            );


            // =====================================================
            // STEP 3: Make sure username/password are available
            // =====================================================

            if (!studentCredentials) {

                throw new Error(
                    "Student credentials not found."
                );

            }


            if (
                !studentCredentials.username ||
                !studentCredentials.temporaryPassword
            ) {

                throw new Error(
                    "Username or temporary password is missing."
                );

            }


            // =====================================================
            // STEP 4: Send invitation email
            // =====================================================

            await api.post(
                "/student/send-invitation-email",
                {

                    personId: app.personId,

                    username: studentCredentials.username,

                    temporaryPassword:
                        studentCredentials.temporaryPassword

                }
            );


            // =====================================================
            // STEP 5: Update invitation status
            // =====================================================

            setApp(prev => ({
                ...prev,
                invitationSent: true
            }));


            // =====================================================
            // STEP 6: SUCCESS TOAST
            // =====================================================

            showToast(
                "Invitation email sent successfully.",
                "success",
                "Invitation Sent"
            );


        } catch (error) {

            console.error(
                "Invitation Error:",
                error
            );


            // =====================================================
            // ERROR TOAST
            // =====================================================

            showToast(
                error?.message ||
                "Failed to send invitation email.",
                "error",
                "Invitation Error"
            );


        } finally {

            setSendingInvitation(false);

        }

    };


    // =========================================================
    // VIEW DOCUMENT
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
                    type: response.headers["content-type"]
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

            console.error("Document View Error:", error);

            alert("Unable to open document.");

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (!app) {

        return (

            <div className="loading-container">

                Loading Application...

            </div>

        );

    }


    // =========================================================
    // DOCUMENT COUNT
    // =========================================================

    const docFields = [

        app.resume,
        app.transcript,
        app.idProof

    ];


    const uploadedCount = docFields.filter(Boolean).length;


    // =========================================================
    // PHONE STYLES
    // =========================================================

    const phoneContainerStyle = {

        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginTop: "4px"

    };


    const countryBadgeStyle = {

        background: "#f1f5f9",
        color: "#475569",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "0.8rem",
        fontWeight: "600",
        border: "1px solid #cbd5e1",
        display: "inline-block"

    };


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div className="admin-list-container">


            {/* =====================================================
                BACK BUTTON
            ====================================================== */}

            <div className="back-btn-wrapper">

                <button
                    className="back-link-btn"
                    onClick={() => window.history.back()}
                >

                    &larr; Back To My Students

                </button>

            </div>


            <div className="admin-details-container">


                {/* =================================================
                    PAGE HEADER
                ================================================== */}

                <div
                    className="page-header"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px"
                    }}
                >

                    <h2
                        className="admin-details-title"
                        style={{ margin: 0 }}
                    >

                        Student Application Details

                    </h2>


                    {/* =============================================
                        INVITATION SECTION
                    ============================================== */}

                    <div
                        className="invitation-section"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "10px 16px"

                        }}
                    >

                        {!app.invitationSent &&
                        app.applicationStage === "REGISTERED" ? (

                            <>

                                <button
                                    className="send-invitation-btn"
                                    onClick={handleSendInvitation}
                                    disabled={sendingInvitation}
                                    style={{
                                        padding: "8px 18px",
                                        borderRadius: "6px",
                                        fontWeight: "600",
                                        fontSize: "0.9rem",
                                        boxShadow:
                                            "0 1px 2px rgba(0,0,0,0.08)"
                                    }}
                                >

                                    {sendingInvitation
                                        ? "Sending..."
                                        : "Send Invitation"}

                                </button>


                                <span
                                    className="invitation-status pending"
                                    style={{
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        color: "#b45309",
                                        background: "#fef3c7",
                                        border: "1px solid #fde68a",
                                        padding: "4px 10px",
                                        borderRadius: "6px"
                                    }}
                                >

                                    Invitation Status: Not Sent

                                </span>

                            </>

                        ) : app.invitationSent ? (

                            <span
                                className="invitation-status sent"
                                style={{
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    color: "#15803d",
                                    background: "#dcfce7",
                                    border: "1px solid #bbf7d0",
                                    padding: "4px 10px",
                                    borderRadius: "6px"
                                }}
                            >

                                ✓ Invitation Sent

                            </span>

                        ) : null}

                    </div>

                </div>


                {/* =================================================
                    RECHECK ALERT
                ================================================== */}

                {app.status === "RECHECK_REQUIRED" &&
                app.recheckReason && (

                    <div className="recheck-alert-box">

                        <h3 className="recheck-alert-title">

                            Action Required

                        </h3>

                        <p className="recheck-alert-text">

                            This application has been returned
                            by Admin for correction.

                        </p>

                        <div className="recheck-reason-container">

                            <strong className="recheck-reason-label">

                                Reason:

                            </strong>

                            <pre className="recheck-reason-content">

                                {app.recheckReason}

                            </pre>

                        </div>

                        <p className="recheck-alert-footer">

                            Please coordinate with the student and
                            ensure corrections are submitted before
                            resubmission.

                        </p>

                    </div>

                )}


                {/* =================================================
                    APPLICATION SUMMARY
                ================================================== */}

                <div className="details-section">

                    <div className="summary-grid">


                        {/* STUDENT NAME */}

                        <div className="summary-card">

                            <strong className="summary-label">

                                Student Name

                            </strong>

                            <p
                                className="summary-value-primary"
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "550",
                                    color: "#2e59d9",
                                    letterSpacing: "-0.01em"
                                }}
                            >

                                {`${app.firstName || ""} ${
                                    app.middleName &&
                                    app.middleName !== "-"
                                        ? app.middleName + " "
                                        : ""
                                }${app.lastName || ""}`.trim() || "N/A"}

                            </p>

                        </div>


                        {/* APPLICATION / ENROLLMENT NUMBER */}

                        <div className="summary-card">

                            <strong className="summary-label">

                                {displayNumberLabel}

                            </strong>

                            <p
                                className="summary-value-secondary"
                                style={{ fontSize: "1rem" }}
                            >

                                {displayNumber}

                            </p>

                        </div>


                        {/* APPLICATION STAGE */}

                        <div className="summary-card">

                            <strong className="summary-label">

                                Application Stage

                            </strong>

                            <p
                                className="summary-value-stage"
                                style={{ fontSize: "0.9rem" }}
                            >

                                {app.applicationStage || "N/A"}

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <div className="details-section">

                    <h3>Personal Information</h3>

                    <div className="details-grid">

                        <div className="detail-card">

                            <strong>First Name</strong>

                            <p>{app.firstName || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>Middle Name</strong>

                            <p>{app.middleName || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>Last Name</strong>

                            <p>{app.lastName || "N/A"}</p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTACT INFORMATION
                ================================================== */}

                <div className="details-section">

                    <h3>Contact Information</h3>

                    <div className="details-grid">

                        <div className="detail-card">

                            <strong>Phone</strong>

                            {app.phone ? (

                                <div style={phoneContainerStyle}>

                                    {app.phoneCountryCode && (

                                        <span style={countryBadgeStyle}>

                                            {app.phoneCountryCode}

                                        </span>

                                    )}

                                    <span>

                                        {formatPhoneNumber(app.phone)}

                                    </span>

                                </div>

                            ) : (

                                <p style={{ marginTop: "4px" }}>

                                    N/A

                                </p>

                            )}

                        </div>


                        <div className="detail-card">

                            <strong>Alternate Phone</strong>

                            {app.alternatePhone ? (

                                <div style={phoneContainerStyle}>

                                    {app.alternateCountryCode && (

                                        <span style={countryBadgeStyle}>

                                            {app.alternateCountryCode}

                                        </span>

                                    )}

                                    <span>

                                        {formatPhoneNumber(
                                            app.alternatePhone
                                        )}

                                    </span>

                                </div>

                            ) : (

                                <p style={{ marginTop: "4px" }}>

                                    N/A

                                </p>

                            )}

                        </div>


                        <div className="detail-card">

                            <strong>Email</strong>

                            <p>{app.email || "N/A"}</p>

                        </div>


                        <div className="detail-card">

                            <strong>Alternate Email</strong>

                            <p style={{ marginTop: "4px" }}>

                                {app.alternateEmail || "N/A"}

                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    VISA INFORMATION
                ================================================== */}

                <div className="details-section">

                    <h3>Visa Information</h3>

                    <div className="details-grid">

                        <div className="detail-card">

                            <strong>Visa Type</strong>

                            <p>{app.visaType || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>EAD Type</strong>

                            <p>{app.eadType || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>Visa Expiry Date</strong>

                            <p>{app.visaExpiryDate || "N/A"}</p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ADDRESS INFORMATION
                ================================================== */}

                <div className="details-section">

                    <h3>Address Information</h3>

                    <div className="details-grid">

                        <div className="detail-card">

                            <strong>Address Line</strong>

                            <p>{app.addressLine || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>City</strong>

                            <p>{app.city || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>State</strong>

                            <p>{app.state || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>Country</strong>

                            <p>{app.country || "N/A"}</p>

                        </div>

                        <div className="detail-card">

                            <strong>Zip Code</strong>

                            <p>{app.zipcode || "N/A"}</p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    EDUCATION DETAILS
                ================================================== */}

                <div className="details-section">

                    <h3>Education Details</h3>

                    {app.educations &&
                    app.educations.length > 0 ? (

                        app.educations.map((edu, index) => {

                            const displayDegree =
                                edu.degreeName &&
                                edu.degreeName !== "N/A"

                                    ? edu.degreeName

                                    : (
                                        edu.degreeId &&
                                        edu.degreeId !== "N/A"
                                    )

                                        ? edu.degreeId

                                        : (
                                            edu.qualification ||
                                            "N/A"
                                        );

                            return (

                                <div
                                    className="details-grid"
                                    key={index}
                                    style={{
                                        marginBottom: "15px"
                                    }}
                                >

                                    <div className="detail-card">

                                        <strong>Degree</strong>

                                        <p>

                                            {displayDegree}

                                        </p>

                                    </div>

                                    <div className="detail-card">

                                        <strong>Institute Name</strong>

                                        <p>

                                            {edu.instituteName || "N/A"}

                                        </p>

                                    </div>

                                    <div className="detail-card">

                                        <strong>Field Of Study</strong>

                                        <p>

                                            {edu.fieldOfStudy || "N/A"}

                                        </p>

                                    </div>

                                    <div className="detail-card">

                                        <strong>Passing Year</strong>

                                        <p>

                                            {edu.passingYear || "N/A"}

                                        </p>

                                    </div>

                                </div>

                            );

                        })

                    ) : (

                        <div className="no-records-box">

                            No Education Records Found

                        </div>

                    )}

                </div>


                {/* =================================================
                    WORK EXPERIENCE
                ================================================== */}

                <div className="details-section">

                    <h3>Work Experience</h3>

                    {app.experiences &&
                    app.experiences.length > 0 ? (

                        app.experiences.map((exp, index) => (

                            <div
                                className="details-grid"
                                key={index}
                                style={{
                                    marginBottom: "15px"
                                }}
                            >

                                <div className="detail-card">

                                    <strong>Company Name</strong>

                                    <p>

                                        {exp.companyName || "N/A"}

                                    </p>

                                </div>

                                <div className="detail-card">

                                    <strong>Job Title</strong>

                                    <p>

                                        {exp.designation || "N/A"}

                                    </p>

                                </div>

                                <div className="detail-card">

                                    <strong>Start Date</strong>

                                    <p>

                                        {exp.startDate || "N/A"}

                                    </p>

                                </div>

                                <div className="detail-card">

                                    <strong>End Date</strong>

                                    <p>

                                        {exp.endDate || "Present"}

                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="no-records-box">

                            No Work Experience Records Found

                        </div>

                    )}

                </div>


                {/* =================================================
                    DOCUMENT SUMMARY
                ================================================== */}

                <div className="doc-summary-strip">

                    <div className="doc-summary-flex">

                        <h4 className="doc-summary-title">

                            Document Summary

                        </h4>

                        <span className="doc-summary-badge">

                            Documents Uploaded: {uploadedCount} / 3

                        </span>

                    </div>

                </div>


                {/* =================================================
                    UPLOADED DOCUMENTS
                ================================================== */}

                <div className="details-section docs-section-spacing">

                    <h3>Uploaded Documents</h3>

                    <div className="details-grid">


                        {/* RESUME */}

                        <div className="detail-card">

                            <strong>Resume</strong>

                            <p style={{ marginTop: "8px" }}>

                                {app.resume ? (

                                    <button
                                        type="button"
                                        className="doc-link"
                                        onClick={() =>
                                            handleViewDocument(
                                                app.resume
                                            )
                                        }
                                    >

                                        Open Resume

                                    </button>

                                ) : (

                                    <span className="doc-not-uploaded">

                                        Not Uploaded

                                    </span>

                                )}

                            </p>

                        </div>


                        {/* ID PROOF */}

                        <div className="detail-card">

                            <strong>ID Proof</strong>

                            <p style={{ marginTop: "8px" }}>

                                {app.idProof ? (

                                    <button
                                        type="button"
                                        className="doc-link"
                                        onClick={() =>
                                            handleViewDocument(
                                                app.idProof
                                            )
                                        }
                                    >

                                        Open ID Proof

                                    </button>

                                ) : (

                                    <span className="doc-not-uploaded">

                                        Not Uploaded

                                    </span>

                                )}

                            </p>

                        </div>


                        {/* TRANSCRIPT */}

                        <div className="detail-card">

                            <strong>Transcript</strong>

                            <p style={{ marginTop: "8px" }}>

                                {app.transcript ? (

                                    <button
                                        type="button"
                                        className="doc-link"
                                        onClick={() =>
                                            handleViewDocument(
                                                app.transcript
                                            )
                                        }
                                    >

                                        Open Transcript

                                    </button>

                                ) : (

                                    <span className="doc-not-uploaded">

                                        Not Uploaded

                                    </span>

                                )}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}