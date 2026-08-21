import { useEffect, useState } from "react";
import Sidebar from "../../shared/components/Sidebar";
import Navbar from "../../shared/components/Navbar";
import { getTrainerStudents } from "../services/trainerService";
import api from "../../api/axios";
import "../../shared/styles/sidebar.css";
import "../styles/TrainerStudentsPage.css";
import "../styles/trainer.css";

export default function TrainerStudentsPage() {
    const userId = localStorage.getItem("userId");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [trainerName, setTrainerName] = useState("");

    useEffect(() => {
        loadStudents();
    }, []);

    async function loadStudents() {
        try {
            const profileRes = await api.get("/api/trainers/profile");
            setTrainerName(profileRes.data.trainerName);

            const data = await getTrainerStudents(userId);
            setStudents(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    const filteredStudents = students.filter(student =>
        student.studentName
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="trainer-layout">
            {/* Sidebar tracks open/closed configurations internally via the toggle button layer */}
            <Sidebar role="TRAINER" />

            {/* Main dashboard frame panel shifts fluidly based on the sibling selector layout rules */}
            <div className="trainer-main">
                <Navbar />
                
                <div className="trainer-content">
                    <div className="page-header">
                        <h2>My Students</h2>
                        <p>Students assigned in your batches</p>
                    </div>

                    <div className="student-toolbar">
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="student-count">
                            Total Students : <strong>{filteredStudents.length}</strong>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-box">Loading Students...</div>
                    ) : (
                        <div className="table-responsive-wrapper">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Program</th>
                                        <th>Batch</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center" }}>No Students Found</td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map(student => (
                                            <tr key={student.studentId}>
                                                <td>{student.applicationNumber}</td>
                                                <td>{student.studentName}</td>
                                                <td>{student.email}</td>
                                                <td>{student.phone || "—"}</td>
                                                <td>{student.programName}</td>
                                                <td>{student.batchName}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}