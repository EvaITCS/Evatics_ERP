import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBatchDetails } from "../services/batchService";
import "../styles/batchDetails.css";

export default function BatchDetailsPage() {
    const { batchId } = useParams();
    const navigate = useNavigate();

    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadBatchDetails = async () => {
        try {
            setLoading(true);
            const response = await getBatchDetails(batchId);
            console.log("BATCH DETAILS:", response.data);
            setBatch(response.data);
        } catch (error) {
            console.error("Batch Details Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBatchDetails();
    }, []);

    if (loading) {
        return (
            <div className="batch-details-page">
                <div className="loading-box">
                    <div className="skeleton-spinner"></div>
                    <h2>Loading Batch Details...</h2>
                </div>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="batch-details-page">
                <div className="loading-box">
                    <h2>Batch Not Found</h2>
                </div>
            </div>
        );
    }

    const currentStrength = batch.currentStrength || 0;
    const maxStudents = batch.maxStudents || 0;
    const remainingSeats =
    Math.max(
        0,
        maxStudents - currentStrength
    );

    return (
        <div className="batch-details-page">
            
            {/* GLOBAL MANAGEMENT HEADER ZONE */}
            <div className="details-header">
                <div>
                    <h1>Batch Details</h1>
                    <p>Complete operational batch overview and analytics</p>
                </div>
                
                {/* 🌟 ACTION HUB TRANSFERRED TO THE TOP */}
                <div className="header-action-hub">
                    <button 
                        className="back-btn" 
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <button 
                        className="edit-prime-btn"
                        onClick={() => navigate(`/admin/batches/edit/${batch.batchId}`)}
                    >
                         Edit Batch
                    </button>
                </div>
            </div>

            {/* BENTO SECTION: OVERVIEW */}
            <div className="details-card">
                <div className="card-title-row">
                    <h2>Batch Specification</h2>
                    <span className={`status-chip ${batch.batchStatusName?.toLowerCase()}`}>
                        {batch.batchStatusName || "N/A"}
                    </span>
                </div>

                <div className="details-grid">
                    <div className="detail-box">
                        <span>Batch Code</span>
                        <h3>{batch.batchCode || "N/A"}</h3>
                    </div>
                    <div className="detail-box">
                        <span>Batch Name</span>
                        <h3>{batch.batchName || "N/A"}</h3>
                    </div>
                    <div className="detail-box">
                        <span>Program</span>
                        <h3>{batch.programName || "N/A"}</h3>
                    </div>
                    <div className="detail-box">
                        <span>Trainer</span>
                        <h3>{batch.trainerName || "Not Assigned"}</h3>
                    </div>
                    <div className="detail-box">
                        <span>Start Date</span>
                        <h3>{batch.startDate || "N/A"}</h3>
                    </div>
                    <div className="detail-box">
                        <span>End Date</span>
                        <h3>{batch.endDate || "N/A"}</h3>
                    </div>
                    <div className="detail-box">
                        <span>Duration</span>
                        {/* 🛠️ ONLY CHANGE HERE: Converted Days to Weeks */}
                        <h3>
                            {batch.durationInDays 
                                ? `${(batch.durationInDays / 7).toFixed(1).replace(".0", "")} Weeks` 
                                : "N/A"
                            }
                        </h3>
                    </div>
                    <div className="detail-box">
                        <span>Created At</span>
                        <h3>{batch.createdAt?.replace("T", " ") || "N/A"}</h3>
                    </div>
                </div>
            </div>

            {/* BENTO SECTION: ANALYTICS CAPACITY */}
            <div className="details-card">
                <h2>Capacity Metrics</h2>
                <div className="analytics-grid">
                    <div className="analytics-box metric-current">
                        <span>Corporate Active Students</span>
                        <h2>{currentStrength}</h2>
                    </div>
                    <div className="analytics-box metric-max">
                        <span>Maximum Threshold Capacity</span>
                        <h2>{maxStudents}</h2>
                    </div>
                    <div className="analytics-box metric-rem">
                        <span>Remaining Available Seats</span>
                        <h2>{remainingSeats}</h2>
                    </div>
                </div>
            </div>

            {/* BENTO SECTION: STUDENTS ALLOCATION ROSTER */}
            <div className="details-card">
                <div className="card-title-row">
                    <h2>Assigned Candidates Roster</h2>
                    <span className="student-count-chip">
                        {batch.students?.length || 0} Students Allocated
                    </span>
                </div>

                {batch.students && batch.students.length > 0 ? (
                    <div className="student-table-wrapper">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Corporate Email</th>
                                    <th>Allocation Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batch.students.map((student) => (
                                    <tr key={student.studentId}>
                                        <td className="student-name-cell">{student.studentName}</td>
                                        <td>{student.email || "N/A"}</td>
                                        <td>
                                            <span className="active-status">
                                                {student.status || "Active"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-student-box">
                         No candidates have been assigned to this batch registry yet.
                    </div>
                )}
            </div>
        </div>
    );
}