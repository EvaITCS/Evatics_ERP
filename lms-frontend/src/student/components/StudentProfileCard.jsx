import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { BACKEND_API_URL } from "../../shared/constants/env";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiChevronDown,
    FiEdit3,
    FiPlus,
    FiEye,
    FiDownload,
    FiUpload,
    FiFileText,
    FiBookOpen,
    FiBriefcase,
    FiCreditCard,
    FiX,
    FiSave
} from "react-icons/fi";
import "../styles/studentProfile.css";

// ===============================
// STATIC VISA OPTIONS
// ===============================
const visaOptions = [
    {
        visaId: "US_CITIZEN",
        visaName: "US Citizen"
    },
    {
        visaId: "GREEN_CARD",
        visaName: "Green Card"
    },
    {
        visaId: "EAD",
        visaName: "EAD"
    }
];

// ===============================
// STATIC EAD OPTIONS
// ===============================
const eadTypes = [
    "C03B - F1 OPT",
    "C03C - F1 STEM OPT",
    "C09 - Adjustment of Status",
    "A12 - TPS",
    "C08 - Asylum Pending",
    "A05 - Asylee",
    "A10 - Withholding of Removal",
    "C33 - DACA",
    "C18 - L2 Spouse",
    "A17 - H4 EAD",
    "Other"
];

// ===============================
// STATIC DEGREE OPTIONS
// ===============================
const degreeOptions = [
    "High School",
    "Diploma",
    "Associate",
    "Bachelor",
    "Master",
    "PhD"
];

export default function StudentProfileCard({ student }) {
    const [activeSection, setActiveSection] = useState(null);

    const [expandedSections, setExpandedSections] = useState({
        personal: false,
        visa: false,
        address: false,
        education: false,
        experience: false,
        documents: false
    });

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",

        email: "",
        phone: "",
        alternatePhone: "",
        alternateEmail: "",

        addressLine: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",

        visaType: "",
        visaExpiryDate: "",
        eadType: "",
        otherEadType: "",

       newEducation: {
    qualification: "",
    instituteName: "",
    fieldOfStudy: "",
    passingYear: ""
},

        newExperience: {
            companyName: "",
            designation: "",
            startDate: "",
            endDate: "",
    currentlyWorking: false
        },

        selectedDocType: "resume",
        documentFile: null
    });

    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from(
        { length: currentYear - 1950 + 1 },
        (_, index) => currentYear - index
    );

    // ===============================
    // VISA VISIBILITY LOGIC
    // ===============================
    const showEadType = formData.visaType === "EAD";
    const showOtherEadType = showEadType && formData.eadType === "Other";
    const showExpiryDate = formData.visaType === "EAD";

    useEffect(() => {
        if (!student) return;

        setFormData((prev) => ({
            ...prev,
            firstName: student.firstName || "",
            middleName: student.middleName || "",
            lastName: student.lastName || "",

            email: student.email || "",
            phone: student.phone || "",
            alternatePhone: student.alternatePhone || "",
            alternateEmail: student.alternateEmail || "",

            addressLine: student.addressLine || "",
            city: student.city || "",
            state: student.state || "",
            country: student.country || "",
            zipcode: student.zipcode || "",

            visaType: student.visaType || "",
            visaExpiryDate: student.visaExpiryDate || "",
            eadType: student.eadType || "",
            otherEadType: ""
        }));
    }, [student]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeAllModals();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const closeAllModals = () => {
        setActiveSection(null);
        setFormData((prev) => ({
            ...prev,
           newEducation: {
    qualification: "",
    instituteName: "",
    fieldOfStudy: "",
    passingYear: ""
},
            newExperience: {
                companyName: "",
                designation: "",
                startDate: "",
                endDate: "",
    currentlyWorking: false
            },
            selectedDocType: "resume",
            documentFile: null,
            otherEadType: ""
        }));
    };

    const handleOutsideClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            closeAllModals();
        }
    };

    const openModal = (section) => {
        setActiveSection(section);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section, e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            documentFile: e.target.files[0]
        }));
    };

    const handleViewDocument = async (documentPath) => {
        if (!documentPath) {
            alert("Document not available.");
            return;
        }
        try {
            const response = await api.get(documentPath, { responseType: "blob" });
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const blobUrl = window.URL.createObjectURL(blob);
            window.open(blobUrl, "_blank", "noopener,noreferrer");
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
        } catch (error) {
            console.error("Document View Error:", error);
            alert("Unable to open document.");
        }
    };

  const handleSaveSection = async (section, e) => {

    e.preventDefault();

    let payload = {};
    let endpoint = "";

    // =========================================
    // PERSONAL INFORMATION
    // =========================================

    if (section === "personal") {

        endpoint = "/student/profile/personal";

        payload = {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            alternatePhone: formData.alternatePhone,
            alternateEmail: formData.alternateEmail
        };
    }

    // =========================================
    // VISA
    // =========================================

    else if (section === "visa") {

        endpoint = "/student/profile/visa";

        payload = {
            visaType: formData.visaType,

            visaExpiryDate:
                formData.visaType === "EAD"
                    ? formData.visaExpiryDate
                    : null,

            eadType:
                formData.visaType === "EAD"
                    ? (
                        formData.eadType === "Other"
                            ? formData.otherEadType
                            : formData.eadType
                    )
                    : null
        };
    }

    // =========================================
    // ADDRESS
    // =========================================

    else if (section === "address") {

        endpoint = "/student/profile/address";

        payload = {
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipcode: formData.zipcode
        };
    }

    // =========================================
    // EDUCATION
    // =========================================

    else if (section === "education") {

        endpoint = "/student/profile/education";

        payload = {
            qualification:
                formData.newEducation.qualification,

            instituteName:
                formData.newEducation.instituteName,

            fieldOfStudy:
                formData.newEducation.fieldOfStudy,

            passingYear:
                formData.newEducation.passingYear
        };
    }

    // =========================================
    // EXPERIENCE
    // =========================================

    else if (section === "experience") {

        endpoint = "/student/profile/experience";

        payload = {
            companyName:
                formData.newExperience.companyName,

            designation:
                formData.newExperience.designation,

            startDate:
                formData.newExperience.startDate,

            endDate: formData.newExperience.currentlyWorking
        ? null
        : (formData.newExperience.endDate || null),

    currentlyWorking: formData.newExperience.currentlyWorking
        };
    }

    // =========================================
    // DOCUMENT
    // =========================================

    else if (section === "documents") {

        if (!formData.documentFile) {
            alert("Please select a file.");
            return;
        }

        endpoint = "/student/profile/upload-document";

        payload = new FormData();

        payload.append(
            "documentType",
            formData.selectedDocType
        );

        payload.append(
            "file",
            formData.documentFile
        );
    }

    // =========================================
    // API CALL
    // =========================================

    try {

        await api.post(endpoint, payload);

        alert(
            "Your change request has been submitted successfully. It is pending approval."
        );

        closeAllModals();

    } catch (error) {

        console.error(
            "Profile Change Request Error:",
            error
        );

        const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            "Failed to submit change request.";

        alert(message);
    }
};

    const formatPhoneNumber = (phoneStr) => {
        if (!phoneStr) return "N/A";
        const cleaned = String(phoneStr).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) return `${match[1]}-${match[2]}-${match[3]}`;
        return phoneStr;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return "N/A";
        return parsedDate.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getFullName = () => {
        if (student?.firstName || student?.middleName || student?.lastName) {
            return [student.firstName, student.middleName, student.lastName]
                .filter(Boolean)
                .join(" ");
        }
        return student?.name || "Student";
    };

    const getInitials = () => {
        const name = getFullName();
        if (!name || name === "Student") return "ST";
        const words = name.split(" ").filter(Boolean);
        if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    };

    const getMainAddress = () => {
        if (student?.city && student?.state) {
            return `${student.city}, ${student.state}`;
        }
        return student?.city || student?.state || student?.country || "N/A";
    };

    const getUploadedDocsCount = () => {
        let count = 0;
        if (student?.resume) count++;
        if (student?.idProof) count++;
        if (student?.transcript) count++;
        return count;
    };

    const renderDocumentCard = (label, path) => {
        const isUploaded = !!path;
        return (
            <div className="document-card">
                <div className="document-card-top">
                    <div className="document-icon">
                        <FiFileText />
                    </div>
                    <span className={`document-status-badge ${isUploaded ? "uploaded" : "not-uploaded"}`}>
                        {isUploaded ? "Uploaded" : "Not Uploaded"}
                    </span>
                </div>
                <div className="document-card-info">
                    <h4>{label}</h4>
                    <p>{isUploaded ? "Document available" : "No document uploaded"}</p>
                </div>
                <div className="document-card-actions">
                    <button
                        type="button"
                        className={`btn-document-view ${!isUploaded ? "disabled" : ""}`}
                        disabled={!isUploaded}
                        onClick={() => handleViewDocument(path)}
                    >
                        <FiEye /> View
                    </button>
                    <a
                        href={isUploaded ? `${BACKEND_API_URL}${path}` : "#"}
                        download
                        className={`btn-document-download ${!isUploaded ? "disabled" : ""}`}
                        onClick={(e) => !isUploaded && e.preventDefault()}
                    >
                        <FiDownload /> Download
                    </a>
                </div>
            </div>
        );
    };

    const SectionHeader = ({
        section,
        icon,
        title,
        subtitle,
        badgeText,
        themeClass,
        actionLabel,
        actionIcon: ActionIcon,
        onAction
    }) => {
        const isExpanded = expandedSections[section];

        return (
            <div className="profile-section-header">
                <button
                    type="button"
                    className="section-title-button"
                    onClick={() => toggleSection(section)}
                >
                    <span className={`section-icon ${themeClass}`}>
                        {icon}
                    </span>

                    <span className="section-title-content">
                        <span className="section-title">{title}</span>
                        <span className="section-subtitle">{subtitle}</span>
                    </span>
                </button>

                <div className="section-header-right">
                    {badgeText && (
                        <span className={`section-badge ${themeClass}`}>
                            {badgeText}
                        </span>
                    )}

                    <button
                        type="button"
                        className="section-chevron-btn"
                        onClick={() => toggleSection(section)}
                    >
                        <FiChevronDown className={`section-chevron ${isExpanded ? "expanded" : ""}`} />
                    </button>

                    {actionLabel && (
                        <button
                            type="button"
                            className="section-action-btn"
                            onClick={onAction}
                        >
                            {ActionIcon && <ActionIcon />}
                            {actionLabel}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="erp-profile-wrapper">
            {/* PAGE HEADER */}
            <div className="erp-profile-page-header">
                <div>
                    <h1 className="erp-page-title">My Profile</h1>
                </div>
            </div>

            {/* PROFILE SUMMARY */}
            <div className="profile-summary-card">
                <div className="profile-summary-main">
                    
                    <div className="profile-identity">
                        <h2>{getFullName()}</h2>
                    </div>
                </div>

                <div className="profile-summary-details">
                    <div className="summary-detail">
                        <span className="summary-detail-icon"><FiMail /></span>
                        <div>
                            <span className="summary-detail-label">Email</span>
                            <span className="summary-detail-value">{student?.email || "N/A"}</span>
                        </div>
                    </div>

                    <div className="summary-detail">
                        <span className="summary-detail-icon"><FiPhone /></span>
                        <div>
                            <span className="summary-detail-label">Phone</span>
                            <span className="summary-detail-value">
                                {student?.phone
                                    ? (student.phoneCountryCode
                                        ? `${student.phoneCountryCode} ${formatPhoneNumber(student.phone)}`
                                        : formatPhoneNumber(student.phone))
                                    : "N/A"}
                            </span>
                        </div>
                    </div>

                    <div className="summary-detail">
                        <span className="summary-detail-icon"><FiMapPin /></span>
                        <div>
                            <span className="summary-detail-label">Address</span>
                            <span className="summary-detail-value">{getMainAddress()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROFILE SECTIONS */}
            <div className="profile-sections">

                {/* 1. PERSONAL INFORMATION */}
                <section className="profile-section">
                    <SectionHeader
                        section="personal"
                        icon={<FiUser />}
                        title="Personal Information"
                        subtitle="Personal details and contact information"
                        badgeText="7 Fields"
                        themeClass="theme-blue"
                        actionLabel="Update"
                        actionIcon={FiEdit3}
                        onAction={() => openModal("personal")}
                    />

                    {expandedSections.personal && (
                        <div className="profile-section-body">
                            <div className="clean-cards-grid">
                                <div className="clean-info-card">
                                    <span className="card-label">First Name</span>
                                    <strong className="card-value">{student?.firstName || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Middle Name</span>
                                    <strong className="card-value">{student?.middleName || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Last Name</span>
                                    <strong className="card-value">{student?.lastName || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Email Address</span>
                                    <strong className="card-value email-link">{student?.email || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Primary Phone</span>
                                    <strong className="card-value">
                                        {student?.phone
                                            ? (student.phoneCountryCode
                                                ? `${student.phoneCountryCode} ${formatPhoneNumber(student.phone)}`
                                                : formatPhoneNumber(student.phone))
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Alternate Phone</span>
                                    <strong className="card-value">
                                        {student?.alternatePhone
                                            ? (student.alternateCountryCode
                                                ? `${student.alternateCountryCode} ${formatPhoneNumber(student.alternatePhone)}`
                                                : formatPhoneNumber(student.alternatePhone))
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Alternate Email</span>
                                    <strong className="card-value">{student?.alternateEmail || "N/A"}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 2. VISA & IMMIGRATION */}
                <section className="profile-section">
                    <SectionHeader
                        section="visa"
                        icon={<FiCreditCard />}
                        title="Visa & Immigration"
                        subtitle="Visa type and immigration information"
                        badgeText="3 Fields"
                        themeClass="theme-green"
                        actionLabel="Update"
                        actionIcon={FiEdit3}
                        onAction={() => openModal("visa")}
                    />

                    {expandedSections.visa && (
                        <div className="profile-section-body">
                            <div className="clean-cards-grid">
                                <div className="clean-info-card">
                                    <span className="card-label">Visa Type</span>
                                    <strong className="card-value">{student?.visaTypeName || student?.visaType || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">EAD Type</span>
                                    <strong className="card-value">{student?.eadTypeName || student?.eadType || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Visa Expiry Date</span>
                                    <strong className="card-value">{formatDate(student?.visaExpiryDate)}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 3. ADDRESS */}
                <section className="profile-section">
                    <SectionHeader
                        section="address"
                        icon={<FiMapPin />}
                        title="Address Information"
                        subtitle="Current residential"
                        badgeText="4 Fields"
                        themeClass="theme-teal"
                        actionLabel="Update"
                        actionIcon={FiEdit3}
                        onAction={() => openModal("address")}
                    />

                    {expandedSections.address && (
                        <div className="profile-section-body">
                            <div className="clean-cards-grid">
                                <div className="clean-info-card full-width-card">
                                    <span className="card-label">Address Line</span>
                                    <strong className="card-value">{student?.addressLine || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">City</span>
                                    <strong className="card-value">{student?.city || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">State</span>
                                    <strong className="card-value">{student?.state || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">Country</span>
                                    <strong className="card-value">{student?.country || "N/A"}</strong>
                                </div>

                                <div className="clean-info-card">
                                    <span className="card-label">ZIPCode</span>
                                    <strong className="card-value">{student?.zipcode || "N/A"}</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 4. EDUCATION DETAILS */}
                <section className="profile-section">
                    <SectionHeader
                        section="education"
                        icon={<FiBookOpen />}
                        title="Education Details"
                        subtitle="Your academic qualifications and study background"
                        badgeText={`${student?.educations?.length || 0} Records`}
                        themeClass="theme-purple"
                        actionLabel="Add"
                        actionIcon={FiPlus}
                        onAction={() => openModal("education")}
                    />

                    {expandedSections.education && (
                        <div className="profile-section-body">
                            {student?.educations?.length > 0 ? (
                                <div className="record-list">
                                    {student.educations.map((edu, index) => (
                                        <div key={index} className="professional-record">
                                            <div className="record-number">
    {index + 1}
</div>
                                            <div className="record-content">
                                                <div className="record-heading">
                                                    <h4>{edu.qualification || edu.degreeName || "Education Record"}</h4>
                                                </div>
                                                <div className="record-grid">
                                                    <div className="record-field">
                                                        <span className="field-label">INSTITUTE NAME:</span>
                                                        <strong className="field-value">{edu.instituteName || "N/A"}</strong>
                                                    </div>
                                                    <div className="record-field">
                                                        <span className="field-label">FIELD OF STUDY:</span>
                                                        <strong className="field-value">{edu.fieldOfStudy || "N/A"}</strong>
                                                    </div>
                                                    <div className="record-field">
                                                        <span className="field-label">PASSING YEAR:</span>
                                                        <strong className="field-value">{edu.passingYear || "N/A"}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon"><FiBookOpen /></div>
                                    <h4>No Education Records</h4>
                                    <p>No academic information has been added yet.</p>
                                    <button type="button" className="empty-state-action" onClick={() => openModal("education")}>
                                        <FiPlus /> Add Education
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 5. PROFESSIONAL EXPERIENCE */}
                <section className="profile-section">
                    <SectionHeader
                        section="experience"
                        icon={<FiBriefcase />}
                        title="Professional Experience"
                        subtitle="Your work experience and professional background"
                        badgeText={`${student?.experiences?.length || 0} Record`}
                        themeClass="theme-orange"
                        actionLabel="Add"
                        actionIcon={FiPlus}
                        onAction={() => openModal("experience")}
                    />

                    {expandedSections.experience && (
                        <div className="profile-section-body">
                            {student?.experiences?.length > 0 ? (
                                <div className="record-list">
                                    {student.experiences.map((exp, index) => (
                                        <div key={index} className="professional-record">
                                            <div className="record-number">
    {index + 1}
</div>
                                            <div className="record-content">
                                                <div className="record-heading">
                                                    <h4>{exp.designation || "Professional Experience"}</h4>
                                                    <span className="record-company">{exp.companyName || "N/A"}</span>
                                                </div>
                                                <div className="record-grid">
                                                    <div className="record-field">
                                                        <span className="field-label">COMPANY:</span>
                                                        <strong className="field-value">{exp.companyName || "N/A"}</strong>
                                                    </div>
                                                    <div className="record-field">
                                                        <span className="field-label">JOB TITLE:</span>
                                                        <strong className="field-value">{exp.designation || "N/A"}</strong>
                                                    </div>
                                                    <div className="record-field">
                                                        <span className="field-label">START DATE:</span>
                                                        <strong className="field-value">{formatDate(exp.startDate)}</strong>
                                                    </div>
                                                    <div className="record-field">
                                                        <span className="field-label">END DATE:</span>
                                                       <strong className="field-value">
    {exp.endDate ? formatDate(exp.endDate) : "Currently Working"}
</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon"><FiBriefcase /></div>
                                    <h4>No Experience Records</h4>
                                    <p>No professional experience has been added yet.</p>
                                    <button type="button" className="empty-state-action" onClick={() => openModal("experience")}>
                                        <FiPlus /> Add Experience
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 6. UPLOADED DOCUMENTS */}
                <section className="profile-section">
                    <SectionHeader
                        section="documents"
                        icon={<FiFileText />}
                        title="Uploaded Documents"
                        subtitle="View and manage your documents"
                        badgeText={`${getUploadedDocsCount()} Uploaded`}
                        themeClass="theme-blue"
                        actionLabel="Upload"
                        actionIcon={FiUpload}
                        onAction={() => openModal("documents")}
                    />

                    {expandedSections.documents && (
                        <div className="profile-section-body">
                            <div className="documents-grid-layout">
                                {renderDocumentCard("Resume", student?.resume)}
                                {renderDocumentCard("ID Proof", student?.idProof)}
                                {renderDocumentCard("Academic Transcript", student?.transcript)}
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* MODALS RENDER */}
            {activeSection === "personal" && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-container animated-modal">
                        <div className="modal-header">
                            <div className="modal-title-wrapper">
                                <span className="modal-title-icon"><FiUser /></span>
                                <div>
                                    <h3>Personal Information</h3>
                                    <p>Update basic student details</p>
                                </div>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={closeAllModals}><FiX /></button>
                        </div>
                        <form onSubmit={(e) => handleSaveSection("personal", e)} className="modal-form-layout">
                            <div className="form-input-group">
                                <label>First Name</label>
                                <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="form-input-group">
                                <label>Middle Name</label>
                                <input type="text" name="middleName" className="form-control" value={formData.middleName} onChange={handleInputChange} />
                            </div>
                            <div className="form-input-group">
                                <label>Last Name</label>
                                <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleInputChange} />
                            </div>
                            <div className="form-input-group">
                                <label>Primary Email</label>
                                <input type="email" name="email" className="form-control form-control-readonly" value={formData.email} readOnly />
                            </div>
                            <div className="form-input-group">
                                <label>Primary Phone</label>
                                <input type="text" name="phone" className="form-control form-control-readonly" value={formData.phone} readOnly />
                            </div>
                           <div className="form-input-group">
    <label>Alternate Phone</label>
    <input 
        type="text" 
        name="alternatePhone" 
        className="form-control" 
        placeholder="Enter 10-digit phone number"
        value={formData.alternatePhone} 
        maxLength={10}
        onChange={(e) => {
            
            const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({
                ...prev,
                alternatePhone: onlyNums
            }));
        }} 
    />
</div>
                            <div className="form-input-group">
                                <label>Alternate Email</label>
                                <input type="email" name="alternateEmail" className="form-control" value={formData.alternateEmail} onChange={handleInputChange} />
                            </div>
                            <div className="form-action-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={closeAllModals}>Cancel</button>
                                <button type="submit" className="btn-modal-save"><FiSave /> Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeSection === "visa" && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-container animated-modal visa-modal">
                        <div className="modal-header">
                            <div className="modal-title-wrapper">
                                <span className="modal-title-icon"><FiCreditCard /></span>
                                <div>
                                    <h3>Visa & Immigration</h3>
                                    <p>Update immigration information</p>
                                </div>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={closeAllModals}><FiX /></button>
                        </div>
                        <form onSubmit={(e) => handleSaveSection("visa", e)} className="modal-form-layout">
                            <div className="form-input-group">
                                <label>Visa Type</label>
                                <select
                                    name="visaType"
                                    className="form-control select-dropdown"
                                    value={formData.visaType}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setFormData(prev => ({
                                            ...prev,
                                            visaType: value,

                                            // If not EAD, clear EAD-related fields
                                            eadType: value === "EAD" ? prev.eadType : "",
                                            otherEadType: value === "EAD" ? prev.otherEadType : "",

                                            // Only EAD has expiry
                                            visaExpiryDate: value === "EAD"
                                                ? prev.visaExpiryDate
                                                : ""
                                        }));
                                    }}
                                >
                                    <option value="">Select Visa</option>

                                    {visaOptions.map((visa) => (
                                        <option
                                            key={visa.visaId}
                                            value={visa.visaId}
                                        >
                                            {visa.visaName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {showEadType && (
                                <div className="form-input-group">
                                    <label>EAD Type</label>

                                    <select
                                        name="eadType"
                                        className="form-control select-dropdown"
                                        value={formData.eadType}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setFormData(prev => ({
                                                ...prev,
                                                eadType: value,
                                                otherEadType:
                                                    value === "Other"
                                                        ? prev.otherEadType
                                                        : ""
                                            }));
                                        }}
                                    >
                                        <option value="">Select EAD Type</option>

                                        {eadTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {showOtherEadType && (
                                <div className="form-input-group">
                                    <label>Specify EAD Type</label>

                                    <input
                                        type="text"
                                        name="otherEadType"
                                        className="form-control"
                                        placeholder="Enter custom EAD type"
                                        value={formData.otherEadType}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            {showExpiryDate && (
                                <div className="form-input-group">
                                    <label>Visa Expiry Date</label>

                                    <input
                                        type="date"
                                        name="visaExpiryDate"
                                        className="form-control"
                                        value={formData.visaExpiryDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <div className="form-action-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={closeAllModals}>Cancel</button>
                                <button type="submit" className="btn-modal-save"><FiSave /> Save Visa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeSection === "address" && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-container animated-modal">
                        <div className="modal-header">
                            <div className="modal-title-wrapper">
                                <span className="modal-title-icon"><FiMapPin /></span>
                                <div>
                                    <h3>Address Information</h3>
                                    <p>Update current address</p>
                                </div>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={closeAllModals}><FiX /></button>
                        </div>
                        <form onSubmit={(e) => handleSaveSection("address", e)} className="modal-form-layout">
                            <div className="form-input-group full-width">
                                <label>Address Line</label>
                                <input type="text" name="addressLine" className="form-control" value={formData.addressLine} onChange={handleInputChange} />
                            </div>
                            <div className="form-input-group">
                                <label>City</label>
                                <input type="text" name="city" className="form-control" value={formData.city} onChange={handleInputChange} />
                            </div>
                            <div className="form-input-group">
                                <label>State</label>
                                <input type="text" name="state" className="form-control" value={formData.state} onChange={handleInputChange} />
                            </div>
                         <div className="form-input-group">
    <label>Country</label>
    <input 
        type="text" 
        name="country" 
        className="form-control" 
        value={formData.country} 
        onChange={handleInputChange} 
        readOnly 
    />
</div>
                            <div className="form-input-group">
                                <label>ZIPCode</label>
                                <input type="text" name="zipcode" className="form-control" value={formData.zipcode} onChange={handleInputChange} />
                            </div>
                            <div className="form-action-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={closeAllModals}>Cancel</button>
                                <button type="submit" className="btn-modal-save"><FiSave /> Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeSection === "education" && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-container animated-modal">
                        <div className="modal-header">
                            <div className="modal-title-wrapper">
                                <span className="modal-title-icon"><FiBookOpen /></span>
                                <div>
                                    <h3>Add Education</h3>
                                    <p>Add academic qualification</p>
                                </div>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={closeAllModals}><FiX /></button>
                        </div>
                        <form onSubmit={(e) => handleSaveSection("education", e)} className="modal-form-layout">
                            <div className="form-input-group">
                                <label>Degree Name</label>

                                <select
                                    name="qualification"
                                    className="form-control select-dropdown"
                                    value={formData.newEducation.qualification}
                                    onChange={(e) =>
                                        handleNestedChange("newEducation", e)
                                    }
                                    required
                                >
                                    <option value="">Select Degree</option>

                                    {degreeOptions.map((degree) => (
                                        <option key={degree} value={degree}>
                                            {degree}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-input-group">
                                <label>Passing Year</label>
                                <select name="passingYear" className="form-control select-dropdown" value={formData.newEducation.passingYear} onChange={(e) => handleNestedChange("newEducation", e)} required>
                                    <option value="">Select Year</option>
                                    {yearsArray.map((year) => (<option key={year} value={year}>{year}</option>))}
                                </select>
                            </div>
                            <div className="form-input-group full-width">
                                <label>Institute Name</label>
                                <input type="text" name="instituteName" className="form-control" value={formData.newEducation.instituteName} onChange={(e) => handleNestedChange("newEducation", e)} required />
                            </div>
                            <div className="form-input-group full-width">
                                <label>Field of Study</label>
                                <input type="text" name="fieldOfStudy" className="form-control" value={formData.newEducation.fieldOfStudy} onChange={(e) => handleNestedChange("newEducation", e)} required />
                            </div>
                            <div className="form-action-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={closeAllModals}>Cancel</button>
                                <button type="submit" className="btn-modal-save"><FiPlus /> Add Education</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeSection === "experience" && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-container animated-modal">
                        <div className="modal-header">
                            <div className="modal-title-wrapper">
                                <span className="modal-title-icon"><FiBriefcase /></span>
                                <div>
                                    <h3>Add Professional Experience</h3>
                                    <p>Add employment history</p>
                                </div>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={closeAllModals}><FiX /></button>
                        </div>
                        <form onSubmit={(e) => handleSaveSection("experience", e)} className="modal-form-layout">
                            <div className="form-input-group full-width">
                                <label>Company Name</label>
                                <input type="text" name="companyName" className="form-control" value={formData.newExperience.companyName} onChange={(e) => handleNestedChange("newExperience", e)} required />
                            </div>
                            <div className="form-input-group">
                                <label>Job Title</label>
                                <input type="text" name="designation" className="form-control" value={formData.newExperience.designation} onChange={(e) => handleNestedChange("newExperience", e)} required />
                            </div>
                            <div className="form-input-group">
                                <label>Start Date</label>
                                <input type="date" name="startDate" className="form-control" value={formData.newExperience.startDate} onChange={(e) => handleNestedChange("newExperience", e)} required />
                            </div>
                           <div className="form-input-group">
    <label>End Date</label>

    <input
        type="date"
        name="endDate"
        className="form-control"
        value={formData.newExperience.endDate}
        onChange={(e) =>
            handleNestedChange("newExperience", e)
        }
        disabled={formData.newExperience.currentlyWorking}
    />
</div>

<div className="form-input-group full-width">
    <label className="currently-working-checkbox">
        <input
            type="checkbox"
            checked={formData.newExperience.currentlyWorking}
            onChange={(e) => {
                const checked = e.target.checked;

                setFormData((prev) => ({
                    ...prev,
                    newExperience: {
                        ...prev.newExperience,
                        currentlyWorking: checked,
                        endDate: checked
                            ? ""
                            : prev.newExperience.endDate
                    }
                }));
            }}
        />

        <span>Currently Working</span>
    </label>
</div>
                            <div className="form-action-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={closeAllModals}>Cancel</button>
                                <button type="submit" className="btn-modal-save"><FiPlus /> Add Experience</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeSection === "documents" && (
                <div className="modal-overlay" onClick={handleOutsideClick}>
                    <div className="modal-container animated-modal">
                        <div className="modal-header">
                            <div className="modal-title-wrapper">
                                <span className="modal-title-icon"><FiUpload /></span>
                                <div>
                                    <h3>Upload Document</h3>
                                    <p>Add a student document</p>
                                </div>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={closeAllModals}><FiX /></button>
                        </div>
                        <form onSubmit={(e) => handleSaveSection("documents", e)} className="modal-form-layout">
                            <div className="form-input-group full-width">
                                <label>Document Type</label>
                                <select name="selectedDocType" className="form-control select-dropdown" value={formData.selectedDocType} onChange={handleInputChange}>
                                    <option value="resume">Resume</option>
                                    <option value="idProof">ID Proof</option>
                                    <option value="transcript">Academic Transcript</option>
                                </select>
                            </div>
                            <div className="form-input-group full-width">
                                <label>Choose File</label>
                                <input type="file" className="form-control file-input-control" onChange={handleFileChange} required />
                            </div>
                            <div className="form-action-buttons">
                                <button type="button" className="btn-modal-cancel" onClick={closeAllModals}>Cancel</button>
                                <button type="submit" className="btn-modal-save"><FiUpload /> Upload File</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}