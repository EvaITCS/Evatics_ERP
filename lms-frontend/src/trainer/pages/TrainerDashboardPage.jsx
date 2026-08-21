import React, { useEffect, useState } from "react";
import Sidebar from "../../shared/components/Sidebar";
import Navbar from "../../shared/components/Navbar";
import api from "../../api/axios";

import "../../shared/styles/sidebar.css";
import "../styles/trainer.css";

export default function TrainerDashboardPage() {
    const [dashboard, setDashboard] = useState(null);
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);

    // Complete selected batch object
    const [selectedBatch, setSelectedBatch] = useState(null);

    const [loading, setLoading] = useState(true);
    const [studentsLoading, setStudentsLoading] = useState(false);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadDashboard();
    }, []);

    const formatEnrollmentNumber = (personId) => {
        if (personId == null) return "—";

        return `ENR${personId}`;
    };
    // =====================================================
    // LOAD DASHBOARD + TRAINER BATCHES
    // =====================================================

    const loadDashboard = async () => {
        try {

            // -------------------------------------------------
            // Trainer Dashboard
            // -------------------------------------------------

            const dashboardRes = await api.get(
                "/api/trainers/dashboard"
            );

            setDashboard(dashboardRes.data);


            // -------------------------------------------------
            // Trainer Assigned Batches
            // -------------------------------------------------

            const batchRes = await api.get(
                "/api/trainer-batches"
            );

            const allBatches = batchRes.data || [];


            // -------------------------------------------------
            // Only ongoing batches
            // -------------------------------------------------

            const ongoingBatches = allBatches.filter(
                (batch) =>
                    batch.batchStatus &&
                    batch.batchStatus.toLowerCase() === "ongoing"
            );

            setBatches(ongoingBatches);

        } catch (error) {

            console.error(
                "Dashboard Loading Error:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD STUDENTS FOR SELECTED BATCH
    // =====================================================

    const loadBatchStudents = async (batchId) => {

        if (!batchId) {
            setStudents([]);
            return;
        }

        try {

            setStudentsLoading(true);

            // Clear previous batch students
            setStudents([]);


            const response = await api.get(
                `/api/trainer-batches/batch/${batchId}/students`
            );


            setStudents(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Batch Students Loading Error:",
                error
            );

            setStudents([]);

        } finally {

            setStudentsLoading(false);

        }
    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusClass = (status) => {

        if (!status) {
            return "badge-default";
        }

        const value = status.toLowerCase();

        if (
            value.includes("active") ||
            value.includes("ongoing") ||
            value.includes("convert")
        ) {
            return "badge-success";
        }

        if (
            value.includes("pending") ||
            value.includes("interest")
        ) {
            return "badge-warning";
        }

        return "badge-default";
    };


    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {

        return (
            <div className="trainer-layout">

                <Sidebar role="TRAINER" />

                <div className="trainer-main">

                    <Navbar />

                    <div className="trainer-content">

                        <div className="trainer-loading-container">

                            <div className="trainer-spinner"></div>

                            <p>
                                Loading Dashboard Analytics...
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN DASHBOARD
    // =====================================================

    return (
        <div className="trainer-layout">

            <Sidebar role="TRAINER" />


            <div className="trainer-main">

                <Navbar />


                <div className="trainer-content">


                    {/* =================================================
                        ASSIGNED BATCHES
                    ================================================= */}

                    <div className="dashboard-card-section">

                        <div className="card-header-panel">

                            <h3>
                                Assigned Batches
                            </h3>


                            <span className="count-pill">

                                {batches.length} Batches Total

                            </span>

                        </div>


                        <div className="table-responsive-wrapper">

                            <table className="premium-trainer-table">

                                <thead>

                                <tr>

                                    <th>
                                        Batch Name
                                    </th>

                                    <th>
                                        Start Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Current Strength
                                    </th>

                                    <th className="text-right">
                                        Action
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {batches.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="table-empty-state"
                                        >
                                            No batches currently assigned
                                            to your profile.
                                        </td>

                                    </tr>

                                ) : (

                                    batches.map((batch) => {

                                        const isSelected =
                                            selectedBatch?.batchId ===
                                            batch.batchId;


                                        return (
                                            <tr
                                                key={batch.batchId}
                                                className={
                                                    isSelected
                                                        ? "row-selected"
                                                        : ""
                                                }
                                            >

                                                {/* Batch Name */}

                                                <td className="font-weight-medium">

                                                    {batch.batchName || "-"}

                                                </td>


                                                {/* Start Date */}

                                                <td>

                                                    {batch.startDate
                                                        ? new Date(
                                                            batch.startDate
                                                        ).toLocaleDateString(
                                                            "en-GB"
                                                        )
                                                        : "-"}

                                                </td>


                                                {/* Status */}

                                                <td>

                                                        <span
                                                            className={`status-badge ${getStatusClass(
                                                                batch.batchStatus
                                                            )}`}
                                                        >
                                                            {batch.batchStatus ||
                                                                "-"}
                                                        </span>

                                                </td>


                                                {/* Current Strength */}

                                                <td>

                                                    <div className="strength-indicator">

                                                            <span className="strength-number">

                                                                {batch.currentStrength ??
                                                                    0}

                                                                {" "}
                                                                Students

                                                            </span>

                                                    </div>

                                                </td>


                                                {/* Action */}

                                                <td className="text-right">

                                                    <button
                                                        type="button"
                                                        className={`action-link-btn ${
                                                            isSelected
                                                                ? "btn-active-state"
                                                                : ""
                                                        }`}
                                                        onClick={() => {

                                                            // -----------------------------------------
                                                            // Hide Students
                                                            // -----------------------------------------

                                                            if (isSelected) {

                                                                setSelectedBatch(
                                                                    null
                                                                );

                                                                setStudents(
                                                                    []
                                                                );

                                                                return;
                                                            }


                                                            // -----------------------------------------
                                                            // Select Batch
                                                            // -----------------------------------------

                                                            setSelectedBatch(
                                                                batch
                                                            );


                                                            // -----------------------------------------
                                                            // Load Students
                                                            // -----------------------------------------

                                                            loadBatchStudents(
                                                                batch.batchId
                                                            );

                                                        }}
                                                    >

                                                        {isSelected
                                                            ? "Hide Students"
                                                            : "View Students"}

                                                    </button>

                                                </td>

                                            </tr>
                                        );

                                    })

                                )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================================
                        SELECTED BATCH STUDENTS
                    ================================================= */}

                    {selectedBatch && (

                        <div className="dashboard-card-section dynamic-fade-in">


                            {/* -----------------------------------------
                                STUDENT HEADER
                            ----------------------------------------- */}

                            <div className="card-header-panel match-split">

                                <div className="header-title-block">

                                    <h3>
                                        Students Enrolled
                                    </h3>


                                    <p className="sub-title-context">

                                        <strong>
                                            {selectedBatch.batchName}
                                        </strong>

                                    </p>

                                </div>


                                <span className="count-pill alternate">

                                    {studentsLoading
                                        ? "Loading..."
                                        : `${students.length} Assigned Enrollment`}

                                </span>

                            </div>


                            {/* -----------------------------------------
                                STUDENT TABLE
                            ----------------------------------------- */}

                            <div className="table-responsive-wrapper">

                                <table className="premium-trainer-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            Enrollment No
                                        </th>

                                        <th>
                                            Student Name
                                        </th>

                                        <th>
                                            Email Address
                                        </th>

                                        <th>
                                            Phone Contact
                                        </th>

                                        <th>
                                            Program Mapping
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>


                                    {/* =================================
                                            LOADING
                                        ================================= */}

                                    {studentsLoading ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="table-empty-state"
                                            >

                                                Loading students...

                                            </td>

                                        </tr>

                                    ) : students.length === 0 ? (


                                        /* =================================
                                            NO STUDENTS
                                        ================================= */

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="table-empty-state"
                                            >

                                                No students assigned to
                                                this batch.

                                            </td>

                                        </tr>

                                    ) : (


                                        /* =================================
                                            STUDENT LIST
                                        ================================= */

                                        students.map(
                                            (student, index) => (

                                                <tr
                                                    key={
                                                        student.studentBatchId ??
                                                        student.studentPersonId ??
                                                        index
                                                    }
                                                >


                                                    {/* Enrollment No */}

                                                    <td className="app-num-highlight">
                                                        {formatEnrollmentNumber(student.studentPersonId)}
                                                    </td>


                                                    {/* Student Name */}

                                                    <td className="font-weight-medium">

                                                        {student.studentName ||
                                                            "—"}

                                                    </td>


                                                    {/* Email */}

                                                    <td className="text-muted-email">

                                                        {student.email ||
                                                            "—"}

                                                    </td>


                                                    {/* Phone */}

                                                    <td>

                                                        {student.phone ||
                                                            "—"}

                                                    </td>


                                                    {/* Program */}

                                                    <td>

                                                        {student.programName ||
                                                            "—"}

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}