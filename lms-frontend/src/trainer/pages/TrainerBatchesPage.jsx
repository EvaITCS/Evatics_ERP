import { useEffect, useState } from "react";
import StudentListModal from "../components/StudentListModal";
import Sidebar from "../../shared/components/Sidebar";
import Navbar from "../../shared/components/Navbar";
import DropStudentModal from "../components/DropStudentModal";
import api from "../../api/axios";
import "../../shared/styles/sidebar.css";
import "../styles/trainer.css";

export default function TrainerBatchesPage() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] = useState("ALL");

const [sortOrder, setSortOrder] = useState("DESC");
const [students, setStudents] = useState([]);

const [selectedBatch, setSelectedBatch] = useState(null);

const [studentType, setStudentType] = useState("");

const [showStudentModal, setShowStudentModal] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);

const [showProfileModal, setShowProfileModal] = useState(false);

const [showDropModal, setShowDropModal] = useState(false);

const [selectedDropStudent, setSelectedDropStudent] =
    useState(null);




    const loadBatches = async () => {
        try {
            const res = await api.get("/api/trainer-batches/batch-page");
            setBatches(res.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBatches();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "ONGOING":
                return {
                    background: "#e0f2fe",
                    color: "#0369a1",
                    border: "1px solid #bae6fd",
                };
            case "UPCOMING":
    return {
        background: "#e0e7ff",
        color: "#4338ca",
        border: "1px solid #c7d2fe",
    };
            case "COMPLETED":
            case "ACTIVE":
                return {
                    background: "#dcfce7",
                    color: "#15803d",
                    border: "1px solid #bbf7d0",
                };
            default:
                return {
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                };
        }
    };
const filteredBatches = [...batches]

    .filter(batch => {

        const matchesSearch =
            batch.batchName
                .toLowerCase()
                .includes(search.toLowerCase()) ||

            batch.programName
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL"
            ||
            batch.batchStatus === statusFilter;

        return matchesSearch && matchesStatus;

    })

    .sort((a, b) => {

        const dateA = new Date(a.startDate);

        const dateB = new Date(b.startDate);

        return sortOrder === "ASC"

            ? dateA - dateB

            : dateB - dateA;

    });
    const loadStudents = async (batchId, type) => {

    console.log("Clicked", batchId, type);

    try {

        const res = await api.get(
            `/api/trainer-batches/batch/${batchId}/students?type=${type}`
        );

        console.log("API Response", res.data);

        setStudents(res.data);
        setSelectedBatch(batchId);
        setStudentType(type);
        setShowStudentModal(true);

    } catch (err) {

        console.log("API Error", err);

    }

};
//     const loadStudents = async (batchId, type) => {

//     try {

//         const res = await api.get(
//             `/api/trainer-batches/batch/${batchId}/students?type=${type}`
//         );

//         setStudents(res.data);

//         setSelectedBatch(batchId);

//         setStudentType(type);

//         setShowStudentModal(true);

//     } catch (err) {

//         console.log(err);

//     }

// };

// const handleDropStudent = async (student) => {

//     const reason = prompt("Enter Drop Reason");

//     if (!reason) return;

//     try {

//         await api.put(
//             `/api/trainer-batches/drop-student/${student.studentBatchId}`,
//             {
//                 reason
//             }
//         );

//         alert("Student Dropped Successfully");

//         loadStudents(selectedBatch, studentType);

//         loadBatches();

//     } catch (err) {

//         console.log(err);

//         alert("Unable to Drop Student");

//     }

// };

const handleDropStudent = (student) => {

    setSelectedDropStudent(student);

    setShowDropModal(true);

};
const modalTitle =
    studentType === "ENROLLED"
        ? "Enrolled Students"
        : studentType === "GRADUATED"
        ? "Graduated Students"
        : studentType === "DROPPED"
        ? "Dropped Students"
        : "Students";
    return (
        <div className="trainer-layout">
            {/* Sidebar tracks its open state internally via its toggle button */}
            <Sidebar role="TRAINER" />

            {/* Main content pane fluidly adjusts via CSS selectors based on sibling state */}
            <div className="trainer-main">
                <Navbar />
                
                <div className="trainer-content">
                    <div style={{ marginBottom: "25px" }}>
                        <h2 style={{ margin: 0, fontSize: "28px" }}>
                            My Batches
                        </h2>
                        <p style={{ marginTop: "8px", color: "#64748b" }}>
                            View all batches assigned to you
                        </p>
                    </div>

                    {loading ? (
                        <div
                            style={{
                                background: "white",
                                padding: "40px",
                                borderRadius: "10px",
                                textAlign: "center",
                                boxShadow: "0 2px 10px rgba(0,0,0,.08)",
                            }}
                        >
                            Loading...
                        </div>
                    ) : (
                        
                        <div className="table-responsive-wrapper">
                            <div
    style={{
        display: "flex",
        gap: "15px",
        marginBottom: "20px",
        alignItems: "center",
        flexWrap: "wrap",
    }}
>

    <input
        type="text"
        placeholder="Search Batch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
            padding: "10px 14px",
            width: "280px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
        }}
    />

    <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
            padding: "10px",
            borderRadius: "8px",
        }}
    >
        <option value="ALL">All Status</option>
        <option value="UPCOMING">Upcoming</option>
        <option value="ONGOING">Ongoing</option>
        <option value="COMPLETED">Completed</option>
    </select>

    <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{
            padding: "10px",
            borderRadius: "8px",
        }}
    >
        <option value="DESC">Newest First</option>
        <option value="ASC">Oldest First</option>
    </select>

</div>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    minWidth: "900px",
                                }}
                            >
                                <thead>
                                    <tr style={{ background: "#f8fafc" }}>
                                        {[
                                           "Batch Name",
    "Program",
    "Start Date",
    "End Date",
    "Status",
    "Enrolled",
    "Graduated",
     "Dropped",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                style={{
                                                    padding: "18px",
                                                    textAlign: "left",
                                                    borderBottom: "1px solid #e2e8f0",
                                                    fontSize: "13px",
                                                    textTransform: "uppercase",
                                                    color: "#64748b",
                                                }}
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {batches.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                style={{
                                                    textAlign: "center",
                                                    padding: "30px",
                                                }}
                                            >
                                                No batches assigned yet
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBatches.map((batch, index) => (
                                            <tr
                                                key={batch.batchId || index}
                                                style={{ borderBottom: "1px solid #e2e8f0" }}
                                            >
                                             <td style={{ padding: "18px" }}>
    {batch.batchName}
</td>

<td style={{ padding: "18px" }}>
    {batch.programName}
</td>

<td style={{ padding: "18px" }}>
    {batch.startDate
        ? new Date(batch.startDate).toLocaleDateString("en-GB")
        : "-"}
</td>

<td style={{ padding: "18px" }}>
    {batch.endDate
        ? new Date(batch.endDate).toLocaleDateString("en-GB")
        : "-"}
</td>

<td style={{ padding: "18px" }}>
    <span
        style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "12px",
            ...getStatusStyle(batch.batchStatus),
        }}
    >
        {batch.batchStatus}
    </span>
</td>

                                                <td
                                                    style={{
                                                        padding: "18px",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: "#2563eb",
                                                        cursor: "pointer",
                                                    }}
                                                >
    <span
        onClick={() =>
            loadStudents(
                batch.batchId,
                "ENROLLED"
            )
        }
    >
        {batch.enrolledStudentCount ?? 0}
    </span>
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "18px",
                                                        textAlign: "center",
                                                        fontWeight: "bold",
                                                        color: "#16a34a",
                                                        cursor: "pointer",
                                                    }}
                                                >
    <span
        onClick={() =>
            loadStudents(
                batch.batchId,
                "GRADUATED"
            )
        }
    >
        {batch.graduatedStudentCount ?? 0}
    </span>
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "18px",
                                                        textAlign: "center",
                                                        cursor: "pointer",
                                                        color: "#dc2626",
                                                        fontWeight: "bold",
                                                    }}
                                                >
    <span
        onClick={() =>
            loadStudents(
                batch.batchId,
                "DROPPED"
            )
        }
    >
        {batch.droppedStudentCount ?? 0}
    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
    <StudentListModal
    open={showStudentModal}
    onClose={() => setShowStudentModal(false)}
    students={students}
    title={modalTitle}
    onStudentClick={(student) => {
        console.log(student);
    }}
    onDropStudent={handleDropStudent}
/>


            <DropStudentModal
                student={selectedDropStudent}
                batchName={
                    batches.find(
                        batch => batch.batchId === selectedBatch
                    )?.batchName
                }
  

    onClose={() => {

        setShowDropModal(false);

        setSelectedDropStudent(null);

    }}

    onSuccess={() => {

        loadStudents(
            selectedBatch,
            studentType
        );

        loadBatches();

    }}

/>
        </div>
        
    );
}