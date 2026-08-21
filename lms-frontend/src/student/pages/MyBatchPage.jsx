import { useEffect, useState } from "react";
import StudentLayout from "../layouts/StudentLayout";
import studentService from "../services/studentService";
import api from "../../api/axios";
import "../styles/myBatch.css";

export default function MyBatchPage() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState({});

    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await api.get("/student/profile");
                const masterData = response.data;

                if (masterData) {
                    const formattedApplicationNo =
                        masterData.applicationNumber?.startsWith("LEAD-")
                            ? "APP" +
                              String(
    masterData.applicationNumber.replace(
        "LEAD-",
        ""
    )
)
                            : masterData.applicationNumber ||
                              masterData.enrollmentNo ||
                              masterData.studentId ||
                              "";

                    setStudent((prev) => ({
                        ...prev,
                        ...masterData,

                        name: masterData.firstName
                            ? `${masterData.firstName} ${
                                  masterData.lastName || ""
                              }`.trim()
                            : "Student",

                        dashboardType: "DETAIL",

                        applicationNumber: formattedApplicationNo,

                        enrollmentNo: formattedApplicationNo,

                        program:
                            masterData.programName ||
                            masterData.program ||
                            prev.program ||
                            "",
                    }));
                }
            } catch (err) {
                console.log(
                    "Profile Fetch Error in Batch Page:",
                    err
                );
            }
        };

        fetchStudentProfile();
        loadBatch();
    }, [email]);

    const loadBatch = async () => {
        try {
            const response = await studentService.getMyBatch(email);

            console.log("My Batch Response:", response.data);

            setBatch(response.data);

            setStudent((prev) => ({
                ...prev,
                program:
                    response.data?.programName ||
                    prev.program ||
                    "",
            }));
        } catch (error) {
            console.log("My Batch Fetch Error:", error);
            setBatch(null);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =========================================================
    // CALCULATE BATCH STATUS FROM DATES
    // =========================================================

    const getBatchStatus = (batch) => {
        if (!batch) {
            return {
                label: "Upcoming",
                className: "upcoming",
            };
        }

        if (!batch.startDate) {
            return {
                label: "Upcoming",
                className: "upcoming",
            };
        }

        const today = new Date();

        // Remove time from today's date
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(batch.startDate);
        startDate.setHours(0, 0, 0, 0);

        let endDate = null;

        if (batch.endDate) {
            endDate = new Date(batch.endDate);
            endDate.setHours(0, 0, 0, 0);
        }

        // Before batch starts
        if (today < startDate) {
            return {
                label: "Upcoming",
                className: "upcoming",
            };
        }

        // Batch has started but not completed
        if (endDate && today <= endDate) {
            return {
                label: "Ongoing",
                className: "ongoing",
            };
        }

        // If no end date, once started it is ongoing
        if (!endDate) {
            return {
                label: "Ongoing",
                className: "ongoing",
            };
        }

        // After end date
        if (today > endDate) {
            return {
                label: "Completed",
                className: "completed",
            };
        }

        return {
            label: "Upcoming",
            className: "upcoming",
        };
    };

    // =========================================================
    // RENDER
    // =========================================================

    const batchStatus = getBatchStatus(batch);

    return (
        <StudentLayout student={student}>
            <div
                className="my-batch-page"
                style={{ marginTop: "20px" }}
            >
                {loading ? (
                    <div className="batch-shimmer-card">
                        <div className="shimmer-header"></div>

                        <div className="shimmer-grid">
                            <div className="shimmer-box"></div>
                            <div className="shimmer-box"></div>
                            <div className="shimmer-box"></div>
                            <div className="shimmer-box"></div>
                        </div>
                    </div>
                ) : !batch ? (
                    <div className="no-batch-card">
                        <div className="empty-state-icon">
                            ⚡
                        </div>

                        <h2>No Batch Assigned Yet</h2>

                        <p>
                            Your admission process is complete, but
                            your corporate training batch allocation is
                            currently pending under engineering system
                            operations.
                        </p>
                    </div>
                ) : (
                    <div className="batch-card">

                        {/* =================================================
                            BATCH HEADER
                        ================================================= */}

                        <div className="batch-header">

                            <div>
                                {/* PROGRAM NAME INSTEAD OF BATCH NAME */}
                                <h1>
                                    {batch.programName ||
                                        student.program ||
                                        "Program"}
                                </h1>
                            </div>

                            {/* STATUS CALCULATED FROM START/END DATE */}
                            <span
                                className={`status-badge ${batchStatus.className}`}
                            >
                                <span className="status-dot"></span>

                                {batchStatus.label}
                            </span>
                        </div>

                        {/* =================================================
                            BATCH INFORMATION
                        ================================================= */}

                        <div className="batch-info-grid">

                            {/* BATCH CODE */}

                            <div className="info-box">
                                <label>Batch Code</label>

                                <h4 className="code-value">
                                    {batch.batchCode || "-"}
                                </h4>
                            </div>

                            {/* TRAINER */}

                            <div className="info-box">
                                <label>Trainer</label>

                                <h4>
                                    {batch.trainerName ||
                                        "Allocation Pending"}
                                </h4>
                            </div>

                            {/* START DATE */}

                            <div className="info-box">
                                <label>
                                    Commencement Date
                                </label>

                                <h4>
                                    {formatDate(
                                        batch.startDate
                                    )}
                                </h4>
                            </div>

                            {/* END DATE */}

                            <div className="info-box">
                                <label>
                                    Estimated Completion
                                </label>

                                <h4>
                                    {formatDate(
                                        batch.endDate
                                    )}
                                </h4>
                            </div>

                            {/* DURATION */}

                            <div className="info-box">
                                <label>
                                    Course Duration
                                </label>

                                <h4>
                                    {batch.durationInDays
                                        ? `${Math.ceil(
                                              batch.durationInDays /
                                                  7
                                          )} Weeks`
                                        : "-"}
                                </h4>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}