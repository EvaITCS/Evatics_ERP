import React, { useEffect, useState } from "react";
import {
    FiCheck,
    FiX,
    FiEye,
    FiClock,
    FiUser,
    FiBookOpen,
    FiBriefcase,
    FiMapPin,
    FiCreditCard,
    FiFileText,
    FiUserCheck,
    FiAlertCircle,
    FiChevronDown,
    FiChevronUp
} from "react-icons/fi";
import studentService from "../services/studentService";
import { useToast } from "../../shared/components/ToastContext";
import "../styles/profileChangeRequests.css";

export default function ProfileChangeRequestsPage() {
    const { showToast } = useToast();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [viewingDocumentId, setViewingDocumentId] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const handleViewRequestedDocument = async request => {
        try {
            setViewingDocumentId(request.requestId);

            const response =
                await studentService.getPendingProfileChangeDocument(
                    request.requestId
                );

            const blob = new Blob([response.data], {
                type:
                    response.headers["content-type"] ||
                    "application/octet-stream"
            });

            const url = window.URL.createObjectURL(blob);

            window.open(url, "_blank", "noopener,noreferrer");

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 10000);
        } catch (error) {
            console.error("Pending Document View Error:", error);

            showToast("Unable to open requested document.", "error");
        } finally {
            setViewingDocumentId(null);
        }
    };

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await studentService.getPendingProfileChangeRequests();

            setRequests(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Profile Change Requests Error:", err);
            setError(
                err?.response?.data?.message ||
                    "Unable to load profile change requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async request => {
        try {
            setProcessingId(request.requestId);

            await studentService.reviewProfileChangeRequest(
                request.requestId,
                {
                    action: "APPROVE",
                    rejectionReason: null
                }
            );

            showToast(
                "Profile change request approved successfully.",
                "success"
            );

            setRequests(prev =>
                prev.filter(item => item.requestId !== request.requestId)
            );
        } catch (err) {
            console.error("Approve Request Error:", err);

            showToast(
                err?.response?.data?.message || "Failed to approve request.",
                "error"
            );
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectModal = request => {
        setSelectedRequest(request);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectionReason.trim()) {
            showToast("Please enter a rejection reason.", "warning");
            return;
        }

        try {
            setProcessingId(selectedRequest.requestId);

            await studentService.reviewProfileChangeRequest(
                selectedRequest.requestId,
                {
                    action: "REJECT",
                    rejectionReason: rejectionReason.trim()
                }
            );

            showToast("Profile change request rejected.", "success");

            setRequests(prev =>
                prev.filter(
                    item => item.requestId !== selectedRequest.requestId
                )
            );

            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectionReason("");
        } catch (err) {
            console.error("Reject Request Error:", err);

            showToast(
                err?.response?.data?.message || "Failed to reject request.",
                "error"
            );
        } finally {
            setProcessingId(null);
        }
    };

    const formatRequestType = type => {
        const types = {
            PERSONAL: "Personal Info",
            ADDRESS: "Address",
            EDUCATION: "Education",
            EXPERIENCE: "Experience",
            VISA: "Visa",
            DOCUMENT: "Document"
        };

        return types[type?.toUpperCase()] || "Profile";
    };

    const getRequestIcon = type => {
        const icons = {
            PERSONAL: <FiUser />,
            ADDRESS: <FiMapPin />,
            EDUCATION: <FiBookOpen />,
            EXPERIENCE: <FiBriefcase />,
            VISA: <FiCreditCard />,
            DOCUMENT: <FiFileText />
        };

        return icons[type?.toUpperCase()] || <FiUserCheck />;
    };

    const formatOperation = operation =>
        operation
            ? operation.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
            : "Request";

    const formatDate = value => {
        if (!value) return "N/A";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
              });
    };

    const parseData = value => {
        if (!value) return {};
        if (typeof value === "object") return value;

        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    };

    const findValue = (data, key) => {
        if (!data || typeof data !== "object") return undefined;

        if (data[key] !== undefined) {
            return data[key];
        }

        const actualKey = Object.keys(data).find(
            item => item.toLowerCase() === key.toLowerCase()
        );

        return actualKey ? data[actualKey] : undefined;
    };

    const getStudentName = request => {
        const name =
            request.studentName ||
            request.fullName ||
            request.student?.fullName ||
            request.student?.name ||
            [request.firstName, request.middleName, request.lastName]
                .filter(Boolean)
                .join(" ");

        return name?.trim() || "N/A";
    };

    const formatFieldName = key => {
        const labels = {
            firstName: "First Name",
            middleName: "Middle Name",
            lastName: "Last Name",
            alternatePhone: "Alternate Phone",
            alternateEmail: "Alternate Email",
            addressLine: "Address",
            addressLine1: "Address",
            city: "City",
            state: "State",
            country: "Country",
            zipcode: "ZIP Code",

            qualification: "Qualification",
            instituteName: "Institute",
            fieldOfStudy: "Field of Study",
            passingYear: "Passing Year",
            companyName: "Company",
            designation: "Designation",
            startDate: "Start Date",
            endDate: "End Date",
            yearsOfExperience: "Years of Experience",
            visaType: "Visa Type",
            eadType: "EAD Type",
            visaExpiryDate: "Visa Expiry Date",
            documentType: "Document Type",
            documentNumber: "Document Number",
            fileName: "File Name",
            contentType: "File Type",
            fileSize: "File Size",
            fileData: "Document"
        };

        return (
            labels[key] ||
            key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, str => str.toUpperCase())
        );
    };

    const getAllowedFields = type => {
        const fields = {
            PERSONAL: [
                "firstName",
                "middleName",
                "lastName",
                "alternatePhone",
                "alternateEmail"
            ],
            ADDRESS: [
                "addressLine",
                "addressLine1",
                "city",
                "state",
                "country",
                "zipcode"
            ],
            EDUCATION: [
                "qualification",
                "instituteName",
                "fieldOfStudy",
                "passingYear"
            ],
            EXPERIENCE: [
                "companyName",
                "designation",
                "startDate",
                "endDate",
                "yearsOfExperience"
            ],
            VISA: ["visaType", "eadType", "visaExpiryDate"],
            DOCUMENT: [
                "documentType",
                "documentNumber",
                "fileName",
                "contentType",
                "fileSize",
                "fileData"
            ]
        };

        return fields[type?.toUpperCase()] || [];
    };

    const formatFileSize = value => {
        const size = Number(value);

        if (!Number.isFinite(size) || size < 0) {
            return "Not Provided";
        }

        if (size < 1024) {
            return `${size} Bytes`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        }

        if (size < 1024 * 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        }

        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const formatValue = (key, value) => {
        if (key === "fileData") {
            return value ? "Document Uploaded" : "Document Not Provided";
        }

        if (key === "fileSize") {
            return formatFileSize(value);
        }

        if (value === null || value === undefined || value === "") {
            return "Not Provided";
        }

        if (["startDate", "endDate", "visaExpiryDate"].includes(key)) {
            return formatDate(value);
        }

        if (key === "contentType") {
            return String(value).toUpperCase();
        }

        return typeof value === "object"
            ? JSON.stringify(value)
            : String(value);
    };

    const getChangedFields = request => {
        const newData = parseData(request.newData);

        return getAllowedFields(request.requestType)
            .filter(key => {
                const value = findValue(newData, key);

                if (key === "fileData") {
                    return (
                        value !== undefined && value !== null && value !== ""
                    );
                }

                return (
                    value !== undefined && value !== null && value !== ""
                );
            })
            .map(key => ({
                key,
                newValue: findValue(newData, key)
            }));
    };

    const renderRequestedData = request => {
        const fields = getChangedFields(request);

        if (!fields.length) {
            return (
                <div className="pcr-no-data">
                    No requested changes found.
                </div>
            );
        }

        return (
            <div className="pcr-data-grid">
                {fields.map(({ key, newValue }) => (
                    <div className="pcr-data-item" key={key}>
                        <span className="pcr-data-label">
                            {formatFieldName(key)}
                        </span>

                        {key === "fileData" ? (
                            <button
                                type="button"
                                className="pcr-document-view-btn"
                                onClick={() =>
                                    handleViewRequestedDocument(request)
                                }
                                disabled={
                                    viewingDocumentId === request.requestId
                                }
                            >
                                <FiEye />
                                {viewingDocumentId === request.requestId
                                    ? "Opening..."
                                    : "View Document"}
                            </button>
                        ) : (
                            <strong className="pcr-data-value">
                                {formatValue(key, newValue)}
                            </strong>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const filteredRequests = requests.filter(request =>
        filter === "ALL"
            ? true
            : request.requestType?.toUpperCase() === filter
    );

    const countType = type =>
        requests.filter(r => r.requestType?.toUpperCase() === type).length;

    const otherCount = requests.filter(
        r =>
            ![
                "EDUCATION",
                "EXPERIENCE",
                "PERSONAL",
                "ADDRESS",
                "VISA",
                "DOCUMENT"
            ].includes(r.requestType?.toUpperCase())
    ).length;

    const toggleExpanded = id => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    if (loading) {
        return (
            <div className="pcr-page">
                <div className="pcr-loading">
                    <span className="pcr-loader" />
                    <span>Loading profile change requests...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="pcr-page">
            <div className="pcr-header">
                <div className="pcr-header-title-row">
                    <span className="pcr-header-icon">
                        <FiUserCheck />
                    </span>
                    <h1>Profile Change Requests</h1>
                </div>
            </div>

            {error && (
                <div className="pcr-error">
                    <FiAlertCircle />
                    <span>{error}</span>
                    <button type="button" onClick={loadRequests}>
                        Try Again
                    </button>
                </div>
            )}

            <div className="pcr-summary-grid">
                <div className="pcr-summary-card">
                    <div className="pcr-summary-icon pending">
                        <FiClock />
                    </div>
                    <div>
                        <span>Pending Requests</span>
                        <strong>{requests.length}</strong>
                    </div>
                </div>

                <div className="pcr-summary-card">
                    <div className="pcr-summary-icon education">
                        <FiBookOpen />
                    </div>
                    <div>
                        <span>Education</span>
                        <strong>{countType("EDUCATION")}</strong>
                    </div>
                </div>

                <div className="pcr-summary-card">
                    <div className="pcr-summary-icon experience">
                        <FiBriefcase />
                    </div>
                    <div>
                        <span>Experience</span>
                        <strong>{countType("EXPERIENCE")}</strong>
                    </div>
                </div>

                <div className="pcr-summary-card">
                    <div className="pcr-summary-icon personal">
                        <FiUser />
                    </div>
                    <div>
                        <span>Personal / Other</span>
                        <strong>{otherCount}</strong>
                    </div>
                </div>
            </div>

            <div className="pcr-toolbar">
                <div>
                    <h3>Pending Requests</h3>
                    <span>
                        {filteredRequests.length} request
                        {filteredRequests.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="pcr-filter-group">
                    {[
                        ["ALL", "All"],
                        ["PERSONAL", "Personal"],
                        ["ADDRESS", "Address"],
                        ["EDUCATION", "Education"],
                        ["EXPERIENCE", "Experience"],
                        ["VISA", "Visa"],
                        ["DOCUMENT", "Documents"]
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            type="button"
                            className={filter === value ? "active" : ""}
                            onClick={() => setFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {!filteredRequests.length ? (
                <div className="pcr-empty">
                    <div className="pcr-empty-icon">
                        <FiCheck />
                    </div>
                    <h3>No Pending Requests</h3>
                    <p>
                        There are currently no profile changes waiting for
                        review.
                    </p>
                </div>
            ) : (
                <div className="pcr-request-list">
                    {filteredRequests.map(request => {
                        const isExpanded = expandedId === request.requestId;
                        const isProcessing =
                            processingId === request.requestId;

                        return (
                            <div
                                className="pcr-request-card"
                                key={request.requestId}
                            >
                                <div className="pcr-request-top">
                                    <div className="pcr-request-main">
                                        <div className="pcr-request-icon">
                                            {getRequestIcon(
                                                request.requestType
                                            )}
                                        </div>

                                        <div>
                                            <div className="pcr-request-title-row">
                                                <h3>
                                                    {getStudentName(request)}
                                                </h3>

                                                <span className="pcr-operation-badge">
                                                    {formatOperation(
                                                        request.operationType
                                                    )}
                                                </span>
                                            </div>

                                            <div className="pcr-request-meta">
                                                <span>
                                                    {getRequestIcon(
                                                        request.requestType
                                                    )}
                                                    {formatRequestType(
                                                        request.requestType
                                                    )}
                                                </span>

                                                <span>
                                                    <FiClock />
                                                    Submitted{" "}
                                                    {formatDate(
                                                        request.createdAt ||
                                                            request.requestDate
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span className="pcr-status-badge">
                                        <FiClock />
                                        Pending
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="pcr-details-toggle"
                                    onClick={() =>
                                        toggleExpanded(request.requestId)
                                    }
                                >
                                    <span>
                                        <FiEye />
                                        {isExpanded
                                            ? "Hide Details"
                                            : "View Changes"}
                                    </span>

                                    {isExpanded ? (
                                        <FiChevronUp />
                                    ) : (
                                        <FiChevronDown />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="pcr-details">
                                        <div className="pcr-details-header">
                                            <h4>Requested Information</h4>
                                        </div>

                                        <div className="pcr-comparison">
                                            <div className="pcr-comparison-column">
                                                <div className="pcr-column-header new">
                                                    <span>
                                                        Requested Information
                                                    </span>
                                                </div>

                                                <div className="pcr-column-body">
                                                    {renderRequestedData(
                                                        request
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pcr-actions">
                                            <button
                                                type="button"
                                                className="pcr-reject-btn"
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    openRejectModal(request)
                                                }
                                            >
                                                <FiX />
                                                Reject
                                            </button>

                                            <button
                                                type="button"
                                                className="pcr-approve-btn"
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    handleApprove(request)
                                                }
                                            >
                                                <FiCheck />
                                                {isProcessing
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showRejectModal && (
                <div
                    className="pcr-modal-overlay"
                    onClick={e => {
                        if (
                            e.target.classList.contains("pcr-modal-overlay")
                        ) {
                            setShowRejectModal(false);
                        }
                    }}
                >
                    <div className="pcr-modal">
                        <div className="pcr-modal-header">
                            <div>
                                <div className="pcr-modal-icon reject">
                                    <FiX />
                                </div>

                                <div>
                                    <h3>Reject Request</h3>
                                    <p>
                                        Provide a reason for rejecting this
                                        profile change.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="pcr-modal-body">
                            <label>
                                Rejection Reason <span>*</span>
                            </label>

                            <textarea
                                value={rejectionReason}
                                onChange={e =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder="Enter the reason for rejecting this request..."
                                rows={5}
                            />

                            <div className="pcr-modal-note">
                                <FiAlertCircle />
                                <span>
                                    The student will be able to see this
                                    rejection reason.
                                </span>
                            </div>
                        </div>

                        <div className="pcr-modal-actions">
                            <button
                                type="button"
                                className="pcr-cancel-btn"
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="pcr-confirm-reject-btn"
                                disabled={
                                    !rejectionReason.trim() ||
                                    processingId !== null
                                }
                                onClick={handleReject}
                            >
                                <FiX />
                                {processingId !== null
                                    ? "Rejecting..."
                                    : "Reject Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}