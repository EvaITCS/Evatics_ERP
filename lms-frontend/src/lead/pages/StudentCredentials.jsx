import React, { useEffect, useState } from "react";
import studentCredentialService from "../../services/studentCredentialService";
import "../styles/studentCredentials.css";

const StudentCredentials = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await studentCredentialService.getAll();
           
            setStudents(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyCredentials = (student) => {
        navigator.clipboard.writeText(
`Student Name: ${student.studentName}
Username: ${student.username}
Password: ${student.temporaryPassword}`
        );
        alert("Credentials Copied");
    };

    if (loading) {
        return <div className="loading-wrapper">Loading credentials...</div>;
    }

    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="card-header">
                    <h4 className="mb-0">Student Credentials</h4>
                </div>
                <div className="card-body">
                    {/* Responsive clean wrapper for table layout */}
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th style={{ width: "120px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.personId}>
                                        <td style={{ fontWeight: "600", color: "#1e293b" }}>
                                            {student.studentName}
                                        </td>
                                        <td>{student.username}</td>
                                        <td>
                                            <span className="credential-badge">
                                                {student.temporaryPassword}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-copy"
                                                onClick={() => copyCredentials(student)}
                                            >
                                                Copy
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCredentials;