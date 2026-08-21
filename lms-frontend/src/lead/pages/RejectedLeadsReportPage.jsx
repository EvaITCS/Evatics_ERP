// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
//
// import { getImportReport } from "../services/leadImportService";
//
// import "../styles/lead.css";
//
// function RejectedLeadsReportPage() {
//     const { importJobId } = useParams();
//
//     const navigate = useNavigate();
//
//     const [leads, setLeads] = useState([]);
//
//     useEffect(() => {
//         loadData();
//     }, []);
//
//     const loadData = async () => {
//         try {
//             const data = await getImportReport(importJobId);
//
//             console.log("REJECTED LEADS =", data);
//
//             setLeads(data);
//         } catch (error) {
//             console.error("Failed to load rejected leads", error);
//         }
//     };
//
//     return (
//         <div className="page-container">
//             <button
//                 onClick={() =>
//                     navigate("/admin/lead-import", {
//                         state: {
//                             fromReport: true,
//                         },
//                     })
//                 }
//                 style={{
//                     backgroundColor: "#0d6efd",
//                     color: "#fff",
//                     border: "none",
//                     padding: "10px 18px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     marginBottom: "20px",
//                     fontWeight: "600",
//                     fontSize: "14px",
//                 }}
//             >
//                 ← Back to Import
//             </button>
//
//             <h2>Rejected Leads Report</h2>
//
//             <h3>Total Rejected Leads : {leads.length}</h3>
//
//             <table className="lead-table">
//                 <thead>
//                 <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Reason</th>
//                     <th>Date</th>
//                 </tr>
//                 </thead>
//
//                 <tbody>
//                 {leads.length === 0 ? (
//                     <tr>
//                         <td colSpan={5} style={{ textAlign: "center" }}>
//                             No Rejected Leads Found
//                         </td>
//                     </tr>
//                 ) : (
//                     leads.map((lead) => (
//                         <tr key={lead.stagingId}>
//                             <td>
//                                 {[lead.firstName, lead.middleName, lead.lastName]
//                                     .filter(Boolean)
//                                     .join(" ")}
//                             </td>
//
//                             <td>{lead.email}</td>
//
//                             <td>{lead.phone}</td>
//
//                             <td>{lead.rejectReason || "-"}</td>
//
//                             <td>
//                                 {lead.createdAt
//                                     ? new Date(lead.createdAt).toLocaleString()
//                                     : "-"}
//                             </td>
//                         </tr>
//                     ))
//                 )}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
//
// export default RejectedLeadsReportPage;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getImportReport } from "../services/leadImportService";
import PageTitle from "../../shared/components/PageTitle";

import "../styles/lead.css";

function RejectedLeadsReportPage() {
    const { importJobId } = useParams();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getImportReport(importJobId);
            console.log("REJECTED LEADS =", data);
            setLeads(data);
        } catch (error) {
            console.error("Failed to load rejected leads", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rejected-report-page">
            {/* White Card Wrapper with Blue Top Accent */}
            <div className="report-card-wrapper">
                {/* HEADER WITH TITLE AND BACK BUTTON */}
                <div className="card-header">
                    <PageTitle title="Rejected Leads Report" />
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() =>
                            navigate("/admin/lead-import", {
                                state: {
                                    fromReport: true,
                                },
                            })
                        }
                    >
                        ← Back to Import
                    </button>
                </div>

                {/* RESULT COUNT */}
                <p className="result-count">
                    Total Rejected Leads : <strong>{leads.length}</strong>
                </p>

                {/* TABLE OR EMPTY STATE */}
                {loading ? (
                    <div className="empty-state">
                        <h3>Loading Rejected Leads...</h3>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Rejected Leads Found</h3>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="lead-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Reason</th>
                                <th>Date</th>
                            </tr>
                            </thead>

                            <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.stagingId || lead.id}>
                                    <td>
                                        {[lead.firstName, lead.middleName, lead.lastName]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </td>

                                    <td>{lead.email || "-"}</td>

                                    <td>{lead.phone || "-"}</td>

                                    <td>
                      <span className="status-badge reject-reason">
                        {lead.rejectReason || "Invalid Data"}
                      </span>
                                    </td>

                                    <td>
                                        {lead.createdAt
                                            ? new Date(lead.createdAt).toLocaleString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RejectedLeadsReportPage;