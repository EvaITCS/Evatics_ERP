import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../shared/components/ToastContext";
// =====================================================
// SERVICES
// =====================================================

import employeeService from "../services/employeeService";
import api from "../../api/axios";

// =====================================================
// SHARED
// =====================================================

import PageTitle from "../../shared/components/PageTitle";

// =====================================================
// STYLES
// =====================================================

import "../styles/employee.css";

// =====================================================
// COMPONENT
// =====================================================

function EmployeeDocumentsPage() {

    const { employeeId } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [employee, setEmployee] = useState(null);

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const { showToast } = useToast();
    // =====================================================
    // LOAD EMPLOYEE
    // =====================================================

    const loadEmployee = async () => {

        try {

            setLoading(true);

            setError("");

            // =================================================
            // GET EMPLOYEE
            // =================================================

            const response =
                await employeeService.getEmployeeById(
                    employeeId
                );

            const employeeData =
                response.data;

            console.log(
                "Employee Response:",
                employeeData
            );

            console.log(
                "Employee Documents:",
                employeeData?.documents
            );

            // =================================================
            // SET EMPLOYEE
            // =================================================

            setEmployee(
                employeeData
            );

            // =================================================
            // SET DOCUMENTS
            // =================================================

            setDocuments(
                employeeData?.documents || []
            );

        } catch (error) {

            console.error(
                "Failed to load employee documents:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to load employee documents."
            );

            setEmployee(null);

            setDocuments([]);

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // LOAD PAGE
    // =====================================================

    useEffect(() => {

        if (!employeeId) {
            return;
        }

        loadEmployee();

    }, [employeeId]);

    // =====================================================
    // VIEW DOCUMENT
    // =====================================================

    const handleViewDocument = async (
        documentId
    ) => {

        // =================================================
        // CHECK DOCUMENT ID
        // =================================================

        if (!documentId) {

            showToast(
                "Document ID is not available.",
                "error"
            );

            return;
        }

        try {

            console.log(
                "Opening document:",
                documentId
            );

            // =================================================
            // GET ACTUAL FILE FROM DATABASE
            // =================================================
            //
            // Backend:
            //
            // GET
            // /api/person-documents/{documentId}/file
            //
            // =================================================

            const response =
                await api.get(
                    `/api/person-documents/${documentId}/file`,
                    {
                        responseType: "blob",
                    }
                );

            // =================================================
            // CREATE BLOB URL
            // =================================================

            const blobUrl =
                window.URL.createObjectURL(
                    response.data
                );

            // =================================================
            // OPEN DOCUMENT
            // =================================================

            window.open(
                blobUrl,
                "_blank",
                "noopener,noreferrer"
            );

            // =================================================
            // CLEAN BLOB URL
            // =================================================

            setTimeout(() => {

                window.URL.revokeObjectURL(
                    blobUrl
                );

            }, 60000);

        } catch (error) {

            console.error(
                "Failed to open document:",
                error
            );

            // =================================================
            // UNAUTHORIZED
            // =================================================

            if (
                error?.response?.status === 401 ||
                error?.response?.status === 403
            ) {
                showToast(
                    "You are not authorized to view this document.",
                    "error"
                );

                return;
            }

            // =================================================
            // NOT FOUND
            // =================================================

            if (
                error?.response?.status === 404
            ) {

                showToast(
                    "Document file was not found.",
                    "error"
                );

                return;
            }

            // =================================================
            // OTHER ERROR
            // =================================================

            showToast(
                "Failed to open document.",
                "error"
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="employee-documents-page">

                <PageTitle
                    title="Employee Documents"
                />

                <div className="employee-info">

                    <p>
                        Loading employee documents...
                    </p>

                </div>

            </div>

        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="employee-documents-page">

                <PageTitle
                    title="Employee Documents"
                />

                <div className="employee-info">

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="employee-documents-page">

            {/* ================================================= */}
            {/* PAGE TITLE */}
            {/* ================================================= */}

            <PageTitle
                title="Employee Documents"
            />

            {/* ================================================= */}
            {/* EMPLOYEE INFORMATION */}
            {/* ================================================= */}

            {employee && (

                <div className="employee-info">

                    <h3>
                        {employee.fullName || "-"}
                    </h3>

                    <p>

                        <strong>
                            Employee Code:
                        </strong>{" "}

                        {employee.employeeCode || "-"}

                    </p>

                    <p>

                        <strong>
                            Employee ID:
                        </strong>{" "}

                        {employee.employeeId || "-"}

                    </p>

                    <p>

                        <strong>
                            Email:
                        </strong>{" "}

                        {employee.email || "-"}

                    </p>

                    <p>

                        <strong>
                            Phone:
                        </strong>{" "}

                        {employee.phone || "-"}

                    </p>

                </div>

            )}

            {/* ================================================= */}
            {/* DOCUMENT TABLE */}
            {/* ================================================= */}

            <div className="employee-table-wrapper">

                <table className="employee-table">

                    <thead>

                    <tr>

                        <th>
                            Document Type
                        </th>

                        <th>
                            File Name
                        </th>

                        <th>
                            Document Number
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {/* ================================================= */}
                    {/* DOCUMENTS AVAILABLE */}
                    {/* ================================================= */}

                    {documents.length > 0 ? (

                        documents.map(
                            (doc, index) => (

                                <tr
                                    key={
                                        doc.personDocumentId ||
                                        doc.documentId ||
                                        index
                                    }
                                >

                                    {/* ========================================= */}
                                    {/* DOCUMENT TYPE */}
                                    {/* ========================================= */}

                                    <td>

                                        {doc.documentType ||
                                            doc.documentTypeName ||
                                            "-"}

                                    </td>

                                    {/* ========================================= */}
                                    {/* FILE NAME */}
                                    {/* ========================================= */}

                                    <td>

                                        {doc.fileName ? (

                                            <strong>
                                                {doc.fileName}
                                            </strong>

                                        ) : (

                                            "-"

                                        )}

                                    </td>

                                    {/* ========================================= */}
                                    {/* DOCUMENT NUMBER */}
                                    {/* ========================================= */}

                                    <td>

                                        {doc.documentNumber ||
                                            "-"}

                                    </td>

                                    {/* ========================================= */}
                                    {/* ACTION */}
                                    {/* ========================================= */}

                                    <td>

                                        {doc.personDocumentId ? (

                                            <button
                                                type="button"
                                                className="view-btn"
                                                onClick={() =>
                                                    handleViewDocument(
                                                        doc.personDocumentId
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        ) : (

                                            <span>
                                  File Not Available
                                </span>

                                        )}

                                    </td>

                                </tr>

                            )
                        )

                    ) : (

                        // =================================================
                        // NO DOCUMENTS
                        // =================================================

                        <tr>

                            <td
                                colSpan="4"
                                style={{
                                    textAlign: "center",
                                }}
                            >

                                No Documents Uploaded

                            </td>

                        </tr>

                    )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default EmployeeDocumentsPage;