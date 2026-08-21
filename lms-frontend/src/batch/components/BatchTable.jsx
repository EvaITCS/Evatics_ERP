// src/batch/components/BatchTable.jsx
import { useNavigate } from "react-router-dom";

export default function BatchTable({ batches }) {
    const navigate = useNavigate();

    return (
        <table className="batch-table">
            <thead>
                <tr>
                    <th>Batch Code</th>
                    <th>Program</th>
                    <th>Trainer</th>
                    <th style={{ textAlign: "center" }}>Strength</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                </tr>
            </thead>
            <tbody>
                {batches.map((batch) => (
                    <tr key={batch.batchId || batch.id}>
                        {/* Batch Code Emphasized */}
                        <td style={{ fontWeight: "600", color: "#0f172a" }}>
                            {batch.batchCode}
                        </td>
                        
                        {/* Program Name */}
                        <td>{batch.programName || "N/A"}</td>
                        
                        {/* Trainer Fallback Protection */}
                        <td style={{ color: batch.trainerName ? "#334155" : "#94a3b8", italic: !batch.trainerName ? "true" : "false" }}>
                            {batch.trainerName ? batch.trainerName : "🔄 Assign Pending"}
                        </td>
                        
                        {/* Batch Strength Centered with a clean modern text treatment */}
                        <td style={{ textAlign: "center", fontWeight: "600" }}>
                            <span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontSize: "13px" }}>
                                {batch.currentStrength || 0} Students
                            </span>
                        </td>
                        
                        {/* Action Button styled beautifully with pure CSS hooks */}
                        <td style={{ textAlign: "center" }}>
                            <button
                                className="table-action-view-btn"
                                onClick={() => navigate(`/batch/details/${batch.batchId || batch.id}`)}
                            >
                                <span>View Details</span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="12" 
                                    height="12" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    style={{ marginLeft: "4px" }}
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}