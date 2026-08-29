import React from "react";
import {
  
    CheckCircle,
    XCircle,
    ArrowLeft,
    Send,
    AlertTriangle,
    FileCheck,
    Lock
} from "lucide-react";

/* ==========================================================
   Design tokens — Corporate ERP Theme
   ========================================================== */
const COLORS = {
    navy: "#0f172a",
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryTint: "#eff6ff",
    indigo: "#4f46e5",
    indigoTint: "#eef2ff",
    purple: "#7c3aed",
    purpleTint: "#f5f3ff",
    amber: "#d97706",
    amberTint: "#fffbeb",
    teal: "#0d9488",
    tealTint: "#f0fdfa",
    success: "#16a34a",
    successDark: "#15803d",
    successTint: "#f0fdf4",
    danger: "#dc2626",
    slate50: "#f8fafc",
    slate100: "#f1f5f9",
    slate200: "#e2e8f0",
    slate300: "#cbd5e1",
    slate400: "#94a3b8",
    slate500: "#64748b",
    slate600: "#475569",
    slate700: "#334155",
    slate900: "#0f172a",
};

const STYLES = {
    container: {
        fontFamily: 'Cambria, Georgia, "Times New Roman", serif',
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "8px 4px 24px",
        color: COLORS.slate900,
    },
    pageTitle: {
        margin: "0 0 6px",
        fontSize: "26px",
        fontWeight: 700,
        color: COLORS.navy,
    },
    pageSubtitle: {
        margin: "0 0 24px",
        fontSize: "15px",
        color: COLORS.slate500,
    },
    card: (accent) => ({
        background: "#ffffff",
        border: `1.5px solid ${COLORS.slate200}`,
        borderLeft: `3.5px solid ${accent}`,
        borderRadius: "12px",
        boxShadow: "0 3px 10px rgba(15, 23, 42, 0.04)",
        marginBottom: "24px",
        overflow: "hidden",
    }),
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        padding: "16px 24px",
        borderBottom: `1.5px solid ${COLORS.slate200}`,
        background: COLORS.slate50,
        flexWrap: "wrap",
    },
    cardHeaderTitles: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    cardHeaderIcon: (tint, iconColor) => ({
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: tint,
        color: iconColor,
        flexShrink: 0,
    }),
    cardHeaderTitle: {
        margin: 0,
        fontSize: "17px",
        fontWeight: 700,
        letterSpacing: "0.01em",
        color: COLORS.slate900,
    },
    cardHeaderSubtitle: {
        margin: "2px 0 0",
        fontSize: "13px",
        color: COLORS.slate500,
    },
    cardBody: {
        padding: "24px",
    },
    editBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 16px",
        fontSize: "13.5px",
        fontWeight: 600,
        fontFamily: 'Cambria, Georgia, "Times New Roman", serif',
        color: COLORS.primaryDark,
        background: "#ffffff",
        border: `1.5px solid ${COLORS.slate300}`,
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.18s ease",
        whiteSpace: "nowrap",
    },
    fieldGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "18px 20px",
    },
    fieldGrid4: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "18px 20px",
    },
    fieldBox: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "10px 14px",
        borderRadius: "8px",
        background: "#FAFAFA", /* Lighter input background */
        border: `1.5px solid ${COLORS.slate200}`, /* Lighter border color */
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.02)",
    },
    fieldLabel: {
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "#000000",
    },
    fieldValue: {
        fontSize: "15px",
        fontWeight: 500,
        color: COLORS.slate900,
        lineHeight: 1.4,
    },
    fieldValueEmpty: {
        color: COLORS.slate400,
        fontWeight: 400,
    },
    repeatRow: (cols) => ({
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: "16px 20px",
        padding: "0px",
        background: "transparent",
        border: "none",
        borderRadius: "0px",
    }),
    emptyState: {
        margin: 0,
        fontStyle: "italic",
        fontSize: "14px",
        color: COLORS.slate500,
    },
    docCard: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px 14px",
        background: "#FAFAFA", /* Lighter input background */
        border: `1.5px solid ${COLORS.slate200}`, /* Lighter border color */
        borderRadius: "8px",
    },
    docCardTop: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    docCardLabel: {
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "#000000",
    },
    stepNavigation: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        paddingTop: "20px",
        marginTop: "10px",
        borderTop: `1.5px solid ${COLORS.slate200}`,
    },
    backBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 22px",
        fontSize: "15px",
        fontWeight: 600,
        fontFamily: 'Cambria, Georgia, "Times New Roman", serif',
        color: COLORS.slate700,
        background: "#ffffff",
        border: `1.5px solid ${COLORS.slate300}`,
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.18s ease",
    },
    submitBtn: (locked, isSubmitting) => ({
        padding: "10px 26px",
        fontSize: "15px",
        fontWeight: 700,
        fontFamily: 'Cambria, Georgia, "Times New Roman", serif',
        borderRadius: "6px",
        border: "1px solid transparent",
        minWidth: "210px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "all 0.18s ease",
        backgroundColor: locked ? COLORS.slate300 : COLORS.primary,
        borderColor: locked ? COLORS.slate300 : COLORS.primary,
        color: "#fff",
        cursor: locked ? "not-allowed" : isSubmitting ? "wait" : "pointer",
        opacity: locked ? 0.7 : 1,
    }),
    spinner: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.4)",
        borderTopColor: "#ffffff",
        animation: "erp-spin 0.7s linear infinite",
        display: "inline-block",
    },
};

export default function ReviewSection({
    currentStep,
    formData,
    educations,
    experiences,
    status,
    recheckReason,
    resume,
    idProof,
    transcript,
    previousStep,
    handleSubmit,
    setCurrentStep,
    visaOptions = [],
    isSubmitting = false,
    isSubmitted = false
}) {
    const locked = isSubmitted;

    if (currentStep !== 5) {
        return null;
    }

    const renderValue = (value) => {
        if (value === null || value === undefined || String(value).trim() === "") {
            return "N/A";
        }
        return String(value);
    };

    const capitalizeWords = (text) => {
        if (text === null || text === undefined || String(text).trim() === "") {
            return "N/A";
        }
        return String(text)
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    

    const getVisaName = (visaValue) => {
        if (!visaValue) return "-";
        const visa = visaOptions.find(
            (item) =>
                String(item.visaId) === String(visaValue) ||
                String(item.visaName).toLowerCase() === String(visaValue).toLowerCase()
        );
        return visa?.visaName || String(visaValue);
    };

    const isEadSelected =
        String(formData?.visaType || "").toUpperCase() === "EAD" ||
        getVisaName(formData?.visaType).toUpperCase() === "EAD";

    const Field = ({ label, value, span = false }) => (
        <div
            style={{
                ...STYLES.fieldBox,
                ...(span ? { gridColumn: "1 / -1" } : {})
            }}
        >
            <span style={STYLES.fieldLabel}>{label}</span>
            <span
                style={{
                    ...STYLES.fieldValue,
                    ...(value === "-" ? STYLES.fieldValueEmpty : {})
                }}
            >
                {value}
            </span>
        </div>
    );

    const renderDocStatus = (document, isOptional = false) => {
        if (document instanceof File) {
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: COLORS.success, fontWeight: 700, fontSize: "13.5px" }}>
                        <CheckCircle size={15} />
                        <span>Uploaded</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12.5px", color: COLORS.slate600 }}>
                        <FileCheck size={13} />
                        <span>{document.name}</span>
                    </div>
                </div>
            );
        }

        if (document) {
            return (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: COLORS.success, fontWeight: 700, fontSize: "13.5px" }}>
                        <CheckCircle size={15} />
                        <span>Uploaded</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12.5px", color: COLORS.slate600 }}>
                        <FileCheck size={13} />
                        <span>Existing Document Attached</span>
                    </div>
                </div>
            );
        }

        if (isOptional) {
            return (
                <span style={{ color: COLORS.slate400, fontStyle: "italic", fontSize: "13px" }}>
                    Not Provided (Optional)
                </span>
            );
        }

        return (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: COLORS.danger, fontWeight: 700, fontSize: "13.5px" }}>
                <XCircle size={15} />
                <span>Not Uploaded</span>
            </div>
        );
    };

    return (
        <div className="review-section-container" style={STYLES.container}>
            <style>
                {`
                    @keyframes erp-spin {
                        to { transform: rotate(360deg); }
                    }
                    .rs-edit-btn:hover:not(:disabled) {
                        background: ${COLORS.primaryTint} !important;
                        border-color: ${COLORS.primary} !important;
                    }
                    .rs-back-btn:hover:not(:disabled) {
                        background: ${COLORS.slate50} !important;
                        border-color: ${COLORS.slate400} !important;
                    }
                    .rs-submit-btn:hover:not(:disabled) {
                        filter: brightness(1.05);
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
                    }
                `}
            </style>

            <h2 style={STYLES.pageTitle}>Review Your Application</h2>
            <p style={STYLES.pageSubtitle}>
                Please verify your information carefully before submitting your application.
            </p>

            {/* CARD 1: PERSONAL INFORMATION */}
            <div style={STYLES.card(COLORS.primary)}>
                <div style={STYLES.cardHeader}>
                    <div style={STYLES.cardHeaderTitles}>
                        
                        <div>
                            <h3 style={STYLES.cardHeaderTitle}>Personal Information</h3>
                           
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rs-edit-btn"
                        style={{
                            ...STYLES.editBtn,
                            opacity: locked ? 0.5 : 1,
                            cursor: locked ? "not-allowed" : "pointer"
                        }}
                        disabled={locked}
                        onClick={() => !locked && setCurrentStep(0)}
                    >
                       
                        <span>Edit</span>
                    </button>
                </div>

                <div style={STYLES.cardBody}>
                    <div style={STYLES.fieldGrid}>
                        <Field label="First Name" value={capitalizeWords(formData?.firstName)} />
                        <Field label="Middle Name" value={capitalizeWords(formData?.middleName)} />
                        <Field label="Last Name" value={capitalizeWords(formData?.lastName)} />
                        <Field label="Email Address" value={renderValue(formData?.email)} />
                        <Field label="Alternate Email" value={renderValue(formData?.alternateEmail)} />
                        <Field label="Primary Phone" value={renderValue(formData?.phone)} />
                        <Field label="Alternate Phone" value={renderValue(formData?.alternatePhone)} />
                    </div>
                </div>
            </div>

               {/* CARD 3: VISA DETAILS (SEPARATE SECTION) */}
            <div style={STYLES.card(COLORS.teal)}>
                <div style={STYLES.cardHeader}>
                    <div style={STYLES.cardHeaderTitles}>
                      
                        <div>
                            <h3 style={STYLES.cardHeaderTitle}>Visa Details</h3>
                           
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rs-edit-btn"
                        style={{
                            ...STYLES.editBtn,
                            opacity: locked ? 0.5 : 1,
                            cursor: locked ? "not-allowed" : "pointer"
                        }}
                        disabled={locked}
                        onClick={() => !locked && setCurrentStep(0)}
                    >
                      
                        <span>Edit</span>
                    </button>
                </div>

                <div style={STYLES.cardBody}>
                    <div style={STYLES.fieldGrid}>
                        <Field label="Visa Type" value={renderValue(getVisaName(formData?.visaType))} />
                        {isEadSelected && (
                            <Field
                                label="Type of EAD"
                                value={renderValue(
                                    formData?.eadType === "Other" ? formData?.otherEadType : formData?.eadType
                                )}
                            />
                        )}
                        {isEadSelected && (
                            <Field label="EAD Expiry Date" value={renderValue(formData?.visaExpiryDate)} />
                        )}
                    </div>
                </div>
            </div>


            {/* CARD 2: ADDRESS DETAILS */}
            <div style={STYLES.card(COLORS.indigo)}>
                <div style={STYLES.cardHeader}>
                    <div style={STYLES.cardHeaderTitles}>
                     
                        <div>
                            <h3 style={STYLES.cardHeaderTitle}>Address Details</h3>
                          
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rs-edit-btn"
                        style={{
                            ...STYLES.editBtn,
                            opacity: locked ? 0.5 : 1,
                            cursor: locked ? "not-allowed" : "pointer"
                        }}
                        disabled={locked}
                        onClick={() => !locked && setCurrentStep(1)}
                    >
                       
                        <span>Edit</span>
                    </button>
                </div>

                <div style={STYLES.cardBody}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                        <Field label="Street Address" value={renderValue(formData?.addressLine)} span />
                        {/* All 4 fields together in a 4-column row */}
                        <div style={STYLES.fieldGrid4}>
                            <Field label="Country" value={renderValue(formData?.country)} />
                            <Field label="State" value={capitalizeWords(formData?.state)} />
                            <Field label="City" value={capitalizeWords(formData?.city)} />
                            <Field label="Zipcode" value={renderValue(formData?.zipcode)} />
                        </div>
                    </div>
                </div>
            </div>

         
            {/* CARD 4: EDUCATION DETAILS */}
            <div style={STYLES.card(COLORS.purple)}>
                <div style={STYLES.cardHeader}>
                    <div style={STYLES.cardHeaderTitles}>
                      
                        <div>
                            <h3 style={STYLES.cardHeaderTitle}>Education Details</h3>
                            
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rs-edit-btn"
                        style={{
                            ...STYLES.editBtn,
                            opacity: locked ? 0.5 : 1,
                            cursor: locked ? "not-allowed" : "pointer"
                        }}
                        disabled={locked}
                        onClick={() => !locked && setCurrentStep(2)}
                    >
                      
                        <span>Edit</span>
                    </button>
                </div>

                <div style={STYLES.cardBody}>
                    {educations && educations.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {educations.map((education, index) => (
                                <div key={index} style={STYLES.repeatRow(4)}>
                                    <Field label="Qualification" value={renderValue(education?.qualification)} />
                                    <Field label="Institute" value={capitalizeWords(education?.instituteName)} />
                                    <Field label="Field Of Study" value={capitalizeWords(education?.fieldOfStudy)} />
                                    <Field label="Passing Year" value={renderValue(education?.passingYear)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={STYLES.emptyState}>No education history provided.</p>
                    )}
                </div>
            </div>

            {/* CARD 5: WORK EXPERIENCE */}
            <div style={STYLES.card(COLORS.amber)}>
                <div style={STYLES.cardHeader}>
                    <div style={STYLES.cardHeaderTitles}>
                        
                        <div>
                            <h3 style={STYLES.cardHeaderTitle}>Work Experience</h3>
                      
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rs-edit-btn"
                        style={{
                            ...STYLES.editBtn,
                            opacity: locked ? 0.5 : 1,
                            cursor: locked ? "not-allowed" : "pointer"
                        }}
                        disabled={locked}
                        onClick={() => !locked && setCurrentStep(3)}
                    >
                      
                        <span>Edit</span>
                    </button>
                </div>

                <div style={STYLES.cardBody}>
                    {experiences && experiences.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {experiences.map((experience, index) => (
                                <div key={index} style={STYLES.repeatRow(4)}>
                                    <Field label="Company Name" value={capitalizeWords(experience?.companyName)} />
                                    <Field label="Job Title" value={capitalizeWords(experience?.designation)} />
                                    <Field label="Start Date" value={renderValue(experience?.startDate)} />
                                    <Field label="End Date" value={renderValue(experience?.endDate)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={STYLES.emptyState}>No experience history provided.</p>
                    )}
                </div>
            </div>

            {/* CARD 6: UPLOADED DOCUMENTS */}
            <div style={STYLES.card(COLORS.teal)}>
                <div style={STYLES.cardHeader}>
                    <div style={STYLES.cardHeaderTitles}>
                       
                        <div>
                            <h3 style={STYLES.cardHeaderTitle}>Uploaded Documents</h3>
                        
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rs-edit-btn"
                        style={{
                            ...STYLES.editBtn,
                            opacity: locked ? 0.5 : 1,
                            cursor: locked ? "not-allowed" : "pointer"
                        }}
                        disabled={locked}
                        onClick={() => !locked && setCurrentStep(4)}
                    >
                      
                        <span>Edit</span>
                    </button>
                </div>

                <div style={STYLES.cardBody}>
                    <div style={STYLES.fieldGrid}>
                        <div style={STYLES.docCard}>
                            <div style={STYLES.docCardTop}>
                                <span style={STYLES.docCardLabel}>Resume</span>
                            </div>
                            {renderDocStatus(resume)}
                        </div>

                        <div style={STYLES.docCard}>
                            <div style={STYLES.docCardTop}>
                                <span style={STYLES.docCardLabel}>ID Proof</span>
                            </div>
                            {renderDocStatus(idProof, true)}
                        </div>

                        <div style={STYLES.docCard}>
                            <div style={STYLES.docCardTop}>
                                <span style={STYLES.docCardLabel}>Educational Transcript</span>
                            </div>
                            {renderDocStatus(transcript, true)}
                        </div>
                    </div>
                </div>
            </div>

            {/* RECHECK WARNING BOX */}
            {status === "RECHECK_REQUIRED" && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "18px 20px",
                        borderRadius: "10px",
                        background: "#FFF7ED",
                        border: "1.5px solid #F59E0B",
                        color: "#92400E"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
                        <AlertTriangle size={18} />
                        <span>Application Returned For Recheck</span>
                    </div>
                    <strong>Reason:</strong>
                    <div style={{ marginTop: "6px", fontSize: "14px" }}>
                        {renderValue(recheckReason)}
                    </div>
                </div>
            )}

            {/* SUBMITTED LOCK STATUS BOX */}
            {locked && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "16px 20px",
                        background: "#F0FDF4",
                        border: "1.5px solid #16A34A",
                        borderRadius: "10px",
                        color: "#166534",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontSize: "14.5px"
                    }}
                >
                    <Lock size={18} />
                    <span>Your application has already been submitted successfully.</span>
                </div>
            )}

            {/* STEP NAVIGATION */}
            <div style={STYLES.stepNavigation}>
                <button
                    type="button"
                    className="rs-back-btn"
                    style={STYLES.backBtn}
                    onClick={previousStep}
                    disabled={isSubmitting || locked}
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>

                <button
                    type="button"
                    className="rs-submit-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || locked}
                    style={STYLES.submitBtn(locked, isSubmitting)}
                >
                    {isSubmitting ? (
                        <>
                            <span style={STYLES.spinner} />
                            <span>Submitting...</span>
                        </>
                    ) : locked ? (
                        <>
                            <Lock size={16} />
                            <span>Application Submitted</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Application</span>
                            <Send size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}