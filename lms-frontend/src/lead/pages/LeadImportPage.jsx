
import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import "../styles/lead.css";
import { useNavigate, useLocation } from "react-router-dom";
import PageTitle from "../../shared/components/PageTitle";
import { useToast } from "../../shared/components/ToastContext";
const LeadImportPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const { showToast } = useToast();
    const [file, setFile] = useState(null);
    const [importJobId, setImportJobId] = useState(null);
    const [summary, setSummary] = useState(null);
    const [counselors, setCounselors] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCounselors();

        if (location.state?.fromReport) {
            loadCurrentImport();
        } else {
            setImportJobId(null);
            setSummary(null);
            setSelectedAssignment("");
        }
    }, [location.state]);

    const loadCounselors = async () => {
        try {
            const response = await api.get("/api/lead-import/counselors");
            console.log("COUNSELLORS RESPONSE =", response.data);
            setCounselors(response.data);
        } catch (error) {
            console.error("COUNSELLORS ERROR =", error);
        }
    };

    const loadCurrentImport = async () => {
        try {
            const response = await api.get("/api/lead-import/current", {
                validateStatus: (status) => status === 200 || status === 204,
            });

            if (response.status === 204 || !response.data) {
                setImportJobId(null);
                setSummary(null);
                setSelectedAssignment("");
                return;
            }

            const job = response.data;
            setImportJobId(job.importJobId);
            setSummary(job);

            setSelectedAssignment(
                job.assignmentType === "AUTO"
                    ? "AUTO_ASSIGN"
                    : job.assignedCounselorId
                        ? job.assignedCounselorId.toString()
                        : ""
            );
        } catch (error) {
            console.error(error);
            setImportJobId(null);
            setSummary(null);
            setSelectedAssignment("");
        }
    };

    const uploadExcel = async () => {
        if (!file) {
            showToast("Please select an excel file", "error");
            return;
        }

        if (!selectedAssignment) {
            showToast("Please select assignment", "error");
            return;
        }

        try {
            setLoading(true);
            setSummary(null);
            setImportJobId(null);

            const formData = new FormData();
            formData.append("file", file);

            if (selectedAssignment === "AUTO_ASSIGN") {
                formData.append("assignmentType", "AUTO");
            } else {
                formData.append("assignmentType", "MANUAL");
                formData.append("counselorId", selectedAssignment);
            }

            const response = await api.post("/api/lead-import/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const jobId = response.data.importJobId;
            setImportJobId(jobId);

            const summaryResponse = await api.get(
                `/api/lead-import/summary/${jobId}`
            );
            setSummary(summaryResponse.data);

            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            showToast("Excel uploaded successfully.", "success");
        } catch (error) {
            console.error(error);
            showToast(
                error.response?.data?.message ||
                error.response?.data ||
                "Upload failed", "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const importValidLeads = async () => {
        if (!importJobId) {
            showToast("Please upload excel first", "error");
            return;
        }

        try {
            const response = await api.post(
                `/api/lead-import/import/${importJobId}`
            );
            showToast(response.data, "success");
            setImportJobId(null);
            setSummary(null);
            setFile(null);
            setSelectedAssignment("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            showToast("Import failed", "error");
        }
    };

    const downloadRejectedExcel = async () => {
        if (!importJobId) {
            showToast("Please upload excel first", "error");
            return;
        }

        try {
            const response = await api.get(
                `/api/lead-import/download-rejected/${importJobId}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `Rejected_Leads_${importJobId}.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error.response?.data || error.message);
            showToast("Unable to download rejected leads.", "error");
        }
    };

    return (
        <div className="lead-import-page">
            {/* White Card Container with Blue Accent Top Border */}
            <div className="import-card-wrapper">
                {/* HEADER WITH TITLE AND BACK BUTTON */}
                <div className="card-header">
                    <PageTitle title="Bulk Import Management" />
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                </div>

                {/* UPLOAD FORM SECTION */}
                <div className="import-form-grid">
                    {/* Assignment Dropdown */}
                    <div className="form-group">
                        <label>Assign Leads To</label>
                        <select
                            value={selectedAssignment}
                            onChange={(e) => setSelectedAssignment(e.target.value)}
                            disabled={importJobId !== null}
                        >
                            <option value="">Select Assignment</option>
                            {counselors.map((counselor) => (
                                <option
                                    key={counselor.personId}
                                    value={counselor.personId}
                                >
                                    {counselor.counsellorName}
                                </option>
                            ))}
                            <option value="AUTO_ASSIGN">Auto Assign (Round Robin)</option>
                        </select>
                    </div>

                    {/* Excel File Input */}
                    <div className="form-group">
                        <label>Select Excel File (.xlsx, .xls)</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            disabled={importJobId !== null}
                            accept=".xlsx,.xls"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    {/* Upload Button */}
                    <div className="form-group button-group">
                        <button
                            className="primary-btn upload-btn"
                            onClick={uploadExcel}
                            disabled={
                                loading || !file || !selectedAssignment || importJobId !== null
                            }
                        >
                            {loading ? "Uploading..." : "Upload Excel"}
                        </button>
                    </div>
                </div>

                {/* IMPORT SUMMARY METRICS */}
                {summary && (
                    <div className="import-summary-section">
                        <h3 className="summary-heading">Import Summary</h3>
                        <div className="summary-grid">
                            <div className="analytics-card card-total">
                                <p>Total Records</p>
                                <h2>{summary.totalRecords || 0}</h2>
                            </div>

                            <div className="analytics-card card-converted">
                                <p>Valid Leads</p>
                                <h2>{summary.finalRecords || 0}</h2>
                            </div>

                            <div className="analytics-card card-interested">
                                <p>Duplicate Leads</p>
                                <h2>{summary.duplicateRecords || 0}</h2>
                            </div>

                            <div className="analytics-card card-overdue">
                                <p>Invalid Leads</p>
                                <h2>{summary.invalidRecords || 0}</h2>
                            </div>
                        </div>
                    </div>
                )}

                {/* AFTER UPLOAD ACTIONS */}
                {importJobId && (
                    <div className="import-actions-bar">
                        <div className="action-buttons-group">
                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    navigate(`/admin/lead-import/report/${importJobId}`)
                                }
                            >
                                View Rejected Report
                            </button>

                            <button
                                className="secondary-btn"
                                onClick={downloadRejectedExcel}
                            >
                                Download Rejected Excel
                            </button>
                        </div>

                        <button className="primary-btn import-valid-btn" onClick={importValidLeads}>
                            Import Valid Leads
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadImportPage;