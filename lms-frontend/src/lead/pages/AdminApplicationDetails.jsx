import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { BACKEND_API_URL } from "../../shared/constants/env";
import "../styles/AdminApplication.css";

export default function AdminApplicationDetails() {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);

    // --- STEP 1: State declarations ---
    const [showRecheckModal, setShowRecheckModal] = useState(false);
    const [recheckReason, setRecheckReason] = useState("");
    const [selectedReasons, setSelectedReasons] = useState([]);

    useEffect(() => {
        api.get(`/admin/application/${id}`)
            .then(res => setApp(res.data))
            .catch(err => console.error(err));

        api.get("/api/batches")
            .then(res => setBatches(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // Helper to find selected batch object
    const selectedBatchData = batches.find(
        batch => String(batch.batchId) === String(selectedBatch)
    );

    const formatPhoneNumber = (phoneStr) => {
        if (!phoneStr) return "N/A";

        const cleaned = ('' + phoneStr).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phoneStr;
    };

    // Date formatter for custom dropdown (e.g. 11 Aug 2026)
    const formatBatchDate = (date) => {
        if (!date) return "";

        const [year, month, day] = date.split("-");

        const dateObj = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        return dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const enroll = async () => {
        if (window.confirm("Are you sure you want to enroll this student?")) {
            if (!selectedBatch) {
                alert("Please select batch first");
                return;
            }

            try {
                await api.put(`/admin/application/enroll/${id}`, {
                    batchId: selectedBatch
                });
                alert("Student Enrolled Successfully");
                navigate("/admin/my-students");
            } catch (error) {
                alert(error.response?.data || error.message);
            }
        }
    };

    const handleReasonChange = (reason) => {
        if (selectedReasons.includes(reason)) {
            setSelectedReasons(
                selectedReasons.filter(r => r !== reason)
            );
        } else {
            setSelectedReasons([
                ...selectedReasons,
                reason
            ]);
        }
    };

    const submitRecheck = async () => {
        if (
            selectedReasons.length === 0 &&
            !recheckReason.trim()
        ) {
            alert("Please select at least one reason");
            return;
        }

        let finalReasons = [...selectedReasons];

        if (
            selectedReasons.includes("Other") &&
            recheckReason.trim()
        ) {
            finalReasons = finalReasons.filter(
                r => r !== "Other"
            );

            finalReasons.push(
                recheckReason.trim()
            );
        }

        const finalReason = finalReasons.join(", ");

        try {
            await api.put(
                `/admin/application/reject/${id}`,
                {
                    recheckReason: finalReason
                }
            );

            alert("Application sent for recheck");
            window.location.reload();

        } catch (error) {
            alert(
                error.response?.data || error.message
            );
        }
    };

    const getStatusClass = (status) => {
        if (!status) return "pending";

        switch (status.toUpperCase()) {
            case "ENROLLED":
                return "enrolled";

            case "RECHECK_REQUIRED":
                return "recheck";

            case "REGISTERED":
            case "APPLICATION_STARTED":
            case "DRAFT":
            case "SUBMITTED":
            case "UNDER_REVIEW":
                return "pending";

            default:
                return "pending";
        }
    };

    const handleViewDocument = async (documentPath) => {
        if (!documentPath) {
            alert("Document not available.");
            return;
        }

        try {
            const response = await api.get(documentPath, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: response.headers["content-type"],
            });

            const blobUrl = window.URL.createObjectURL(blob);

            window.open(blobUrl, "_blank", "noopener,noreferrer");

            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 10000);

        } catch (error) {
            console.error("Document View Error:", error);
            alert("Unable to open document.");
        }
    };

    if (!app) {
        return (
            <div className="loading-container">
                Loading Application...
            </div>
        );
    }

    return (
        <div className="admin-list-container">
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <button className="back-link-btn" onClick={() => window.history.back()}>
                    ← Back to Applications List
                </button>
            </div>

            <div className="admin-details-container">
                <h2 className="admin-details-title">Full Student Application</h2>

                {/* Section 1: Basic Information */}
                <div className="details-section">
                    <h3>Basic Information</h3>
                    <div className="details-grid">
                        <div className="detail-card">
                            <strong>Application Number</strong>
                           <p>{app.personId ? `APP${app.personId}` : "N/A"}</p>
                        </div>
                        <div className="detail-card"><strong>First Name</strong><p>{app.firstName || "N/A"}</p></div>
                        <div className="detail-card"><strong>Middle Name</strong><p>{app.middleName || "N/A"}</p></div>
                        <div className="detail-card"><strong>Last Name</strong><p>{app.lastName || "N/A"}</p></div>
                        <div className="detail-card"><strong>Email Address</strong><p className="app-email">{app.email || "N/A"}</p></div>
                        <div className="detail-card"><strong>Primary Phone</strong><p>{app.phoneCountryCode} {formatPhoneNumber(app.phone)}</p></div>
                        <div className="detail-card"><strong>Alternate Phone</strong><p>{app.alternateCountryCode} {app.alternatePhone ? formatPhoneNumber(app.alternatePhone) : "N/A"}</p></div>
                    </div>
                </div>

                {/* Section 5: Visa Details */}
                <div className="details-section">
                    <h3>Visa & Immigration</h3>
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

                {/* Section 4: Address Details */}
                <div className="details-section">
                    <h3>Address Details</h3>
                    <div className="details-grid">
                        <div className="detail-card"><strong>Street Address</strong><p>{app.addressLine || "N/A"}</p></div>
                        <div className="detail-card"><strong>City</strong><p>{app.city || "N/A"}</p></div>
                        <div className="detail-card"><strong>State</strong><p>{app.state || "N/A"}</p></div>
                        <div className="detail-card"><strong>Country</strong><p>{app.country || "N/A"}</p></div>
                        <div className="detail-card"><strong>Zipcode</strong><p>{app.zipcode || "N/A"}</p></div>
                    </div>
                </div>

                {/* Section 3: Education Details */}
                <div className="details-section">
                    <h3>Education Details</h3>
                    {app.educations?.length > 0 ? (
                        app.educations.map((edu, index) => (
                            <div
                                key={index}
                                className="details-grid"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="detail-card">
                                    <strong>Degree</strong>
                                    <p>{edu.qualification || "N/A"}</p>
                                </div>
                                <div className="detail-card">
                                    <strong>Institute Name</strong>
                                    <p>{edu.instituteName || "N/A"}</p>
                                </div>
                                <div className="detail-card">
                                    <strong>Field Of Study</strong>
                                    <p>{edu.fieldOfStudy || "N/A"}</p>
                                </div>
                                <div className="detail-card">
                                    <strong>Passing Year</strong>
                                    <p>{edu.passingYear || "N/A"}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Education Records Found</p>
                    )}
                </div>

                {/* Section 2: Professional Experience */}
                <div className="details-section">
                    <h3>Professional Experience</h3>
                    {app.experiences?.length > 0 ? (
                        app.experiences.map((exp, index) => (
                            <div
                                key={index}
                                className="details-grid"
                                style={{ marginBottom: "20px" }}
                            >
                                <div className="detail-card">
                                    <strong>Company Name</strong>
                                    <p>{exp.companyName || "N/A"}</p>
                                </div>
                                <div className="detail-card">
                                    <strong>Job Title</strong>
                                    <p>{exp.designation || "N/A"}</p>
                                </div>
                                <div className="detail-card">
                                    <strong>Start Date</strong>
                                    <p>{exp.startDate || "N/A"}</p>
                                </div>
                                <div className="detail-card">
                                    <strong>End Date</strong>
                                    <p>{exp.endDate || "Present"}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Experience Found</p>
                    )}
                </div>

                {/* Section 6: Uploaded Documents */}
                <div className="details-section">
                    <h3>Uploaded Documents</h3>
                    <div className="details-grid">
                        <div className="detail-card document-box">
                            <strong>Resume File</strong>
                            <p>
                                {app.resume ? (
                                    <button
                                        type="button"
                                        className="doc-link"
                                        onClick={() => handleViewDocument(app.resume)}
                                    >
                                        Open Resume
                                    </button>
                                ) : (
                                    <span className="no-doc">Not Provided</span>
                                )}
                            </p>
                        </div>

                        <div className="detail-card document-box">
                            <strong>ID Proof</strong>
                            <p>
                                {app.idProof ? (
                                    <button
                                        type="button"
                                        className="doc-link"
                                        onClick={() => handleViewDocument(app.idProof)}
                                    >
                                        Open ID Proof
                                    </button>
                                ) : (
                                    <span className="no-doc">Not Provided</span>
                                )}
                            </p>
                        </div>
                        <div className="detail-card document-box">
                            <strong>Academic Transcript</strong>
                            <p>
                                {app.transcript ? (
                                    <button
                                        type="button"
                                        className="doc-link"
                                        onClick={() => handleViewDocument(app.transcript)}
                                    >
                                        Open Transcript
                                    </button>
                                ) : (
                                    <span className="no-doc">Not Provided</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Process Status Bar */}
                <div className="status-box">
                    <span>Application Processing State:</span>
                    <span className={`status-badge ${getStatusClass(app.applicationStage)}`} style={{ marginLeft: "5px", fontSize: "16px", color: "#4a6be2" }}>
                        {app.applicationStage || "PENDING"}
                    </span>
                </div>

                {/* CUSTOM BATCH DROPDOWN ENROLLMENT PANEL */}
                <div className="enrollment-panel">
                    <h3>Student Enrollment</h3>
                    <label className="batch-label">Assign Batch</label>
                    
                    <div className="custom-batch-dropdown">
                        <button
                            type="button"
                            className="batch-dropdown-selected"
                            onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                        >
                            {selectedBatchData ? (
                                <div className="batch-selected-content">
                                    <span className="batch-selected-name">
                                        {selectedBatchData.batchName} ({selectedBatchData.trainerName || "N/A"})
                                    </span>
                                    <span className="batch-selected-date">
                                        {formatBatchDate(selectedBatchData.startDate)} → {formatBatchDate(selectedBatchData.endDate)}
                                    </span>
                                </div>
                            ) : (
                                <span className="batch-placeholder" style={{fontSize:"15px"}}>Select Batch</span>
                            )}
                            <span className="batch-dropdown-arrow">
                                {isBatchDropdownOpen ? "▲" : "▼"}
                            </span>
                        </button>

                        {/* DROPDOWN OPTIONS */}
                        {isBatchDropdownOpen && (
                            <div className="batch-dropdown-menu">
                                {batches.length === 0 ? (
                                    <div className="no-batches">
                                        No batches available
                                    </div>
                                ) : (
                                    batches.map(batch => (
                                        <button
                                            type="button"
                                            key={batch.batchId}
                                            className={`batch-dropdown-option ${
                                                String(selectedBatch) === String(batch.batchId)
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setSelectedBatch(String(batch.batchId));
                                                setIsBatchDropdownOpen(false);
                                            }}
                                        >
                                            <div className="batch-option-left">
                                                <span className="batch-option-name">
                                                    {batch.batchName}
                                                </span>
                                                <span className="batch-option-trainer">
                                                    Trainer: {batch.trainerName || "N/A"}
                                                </span>
                                            </div>

                                            <div className="batch-option-date">
                                                <span className="batch-date-label">
                                                    {formatBatchDate(batch.startDate)}
                                                </span>
                                                <span className="batch-date-arrow">
                                                    →
                                                </span>
                                                <span className="batch-date-label">
                                                    {formatBatchDate(batch.endDate)}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* DYNAMIC CONDITIONAL RENDERING CONTROL BLOCK */}
                {app.applicationStage === "ENROLLED" ? (
                    <div className="enrolled-success-box">
                        <h3> Student Successfully Enrolled</h3>
                        <p>This application has been verified, approved, and credentials have been granted to the student.</p>
                    </div>
                ) : app.applicationStage === "RECHECK_REQUIRED" ? (
                    <div className="recheck-alert-box">
                        <h3> Sent Back for Audit / Recheck</h3>
                        <p>This profile is currently locked and awaiting correction guidelines from the applicant student.</p>
                    </div>
                ) : (
                    <div
                        className="action-buttons"
                        style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center",
                            marginTop: "24px",
                            width: "100%"
                        }}
                    >
                        <button
                            className="reject-btn1"
                            onClick={() => setShowRecheckModal(true)}
                            style={{
                                flex: 1,
                                height: "46px",
                                background: "linear-gradient(135deg, #f38383, #e16e6e)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                            }}
                        >
                            ↩ Send Back For Recheck
                        </button>

                        <button
                            className="enroll-btn1"
                            onClick={enroll}
                            disabled={!selectedBatch}
                            style={{
                                flex: 1,
                                height: "46px",
                                background: !selectedBatch ? "#e2e8f0" : "#226ec5",
                                color: !selectedBatch ? "#94a3b8" : "#fff",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: !selectedBatch ? "not-allowed" : "pointer",
                                boxShadow: !selectedBatch ? "none" : "0 4px 12px rgba(34, 197, 94, 0.15)",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                            }}
                        >
                            ✓ Approve & Enroll Student
                        </button>
                    </div>
                )}

                {/* Recheck Modal */}
                {showRecheckModal && (
                    <div className="recheck-overlay">
                        <div className="recheck-modal">
                            <h3>Recheck Required</h3>
                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleReasonChange("Invalid Visa Information")}
                                />
                                Invalid Visa Information
                            </label>
                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleReasonChange("Education Details Need Correction")}
                                />
                                Education Details Need Correction
                            </label>
                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleReasonChange("Work Experience Details Need Correction")}
                                />
                                Work Experience Details Need Correction
                            </label>
                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleReasonChange("Document Not Clear")}
                                />
                                Document Not Clear
                            </label>
                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleReasonChange("Other")}
                                />
                                Other
                            </label>

                            {selectedReasons.includes("Other") && (
                                <textarea
                                    rows="3"
                                    placeholder="Enter custom reason"
                                    value={recheckReason}
                                    onChange={(e) => setRecheckReason(e.target.value)}
                                />
                            )}

                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '18px' }}>
                                <button onClick={() => setShowRecheckModal(false)}>
                                    Cancel
                                </button>
                                <button onClick={submitRecheck}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}