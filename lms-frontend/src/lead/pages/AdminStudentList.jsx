import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminStudentList() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/students")
            .then(res => {
                setStudents(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching enrolled students:", err);
                setLoading(false);
            });
    }, []);

    const filteredStudents = students.filter(student => {
        const keyword = search.toLowerCase();

        return (
            student.studentName?.toLowerCase().includes(keyword) ||
            student.email?.toLowerCase().includes(keyword)
        );
    });

    if (loading) {
        return (
            <div className="loading-container">
                Loading Enrolled Students...
            </div>
        );
    }

    return (
        <div
            className="admin-list-container"
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                borderTop: "4px solid #2563eb",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
                padding: "20px",
                margin: "15px 0"
            }}
        >
            <h2 style={{ margin: "0 0 15px 0" }}>Enrolled Students</h2>

            <input
                type="text"
                placeholder="Search By Name Or Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="student-search-input"
            />

            <table className="student-table">
                <thead>
                <tr>
                    <th>Person ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Batch</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>
                {filteredStudents.length === 0 ? (
                    <tr>
                        <td
                            colSpan="5"
                            style={{
                                textAlign: "center",
                                padding: "20px",
                                color: "#64748b"
                            }}
                        >
                            {students.length === 0
                                ? "No enrolled students found in the system."
                                : "No matching student records found."}
                        </td>
                    </tr>
                ) : (
                    filteredStudents.map(student => (
                        <tr key={student.personId}>
                            <td>{student.personId}</td>
                            <td>{student.studentName || "N/A"}</td>
                            <td>{student.email || "N/A"}</td>
                            <td>{student.batchName || "Not Assigned"}</td>
                            <td>
                                    <span className="status-badge enrolled1">
                                        {student.status || "ENROLLED"}
                                    </span>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}