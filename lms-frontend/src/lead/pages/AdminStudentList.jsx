import React, { useEffect, useState } from "react";
import api from "../../api/axios";


export default function AdminStudentList() {

    const [students, setStudents] = useState([]);

    const [search, setSearch] = useState("");
    const [admissionDate, setAdmissionDate] = useState("");

    const [appliedSearch, setAppliedSearch] = useState("");
    const [appliedAdmissionDate, setAppliedAdmissionDate] = useState("");

    const [loading, setLoading] = useState(true);


    // =========================================================
    // GET ENROLLED STUDENTS
    // =========================================================

    useEffect(() => {

        api.get("/admin/students")

            .then(res => {

                setStudents(res.data || []);
                setLoading(false);

            })

            .catch(err => {

                console.error(
                    "Error fetching enrolled students:",
                    err
                );

                setLoading(false);

            });

    }, []);


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = () => {

        setAppliedSearch(search.trim());
        setAppliedAdmissionDate(admissionDate);

    };


    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {

        setSearch("");
        setAdmissionDate("");

        setAppliedSearch("");
        setAppliedAdmissionDate("");

    };


    // =========================================================
    // FILTER STUDENTS
    // =========================================================

    const filteredStudents = students.filter(student => {

        const keyword =
            appliedSearch.toLowerCase().trim();


        // -----------------------------
        // Name / Email
        // -----------------------------

        const matchesSearch =
            !keyword ||
            student.studentName
                ?.toLowerCase()
                .includes(keyword) ||
            student.email
                ?.toLowerCase()
                .includes(keyword);


        // -----------------------------
        // Admission Date
        // -----------------------------

        const matchesAdmissionDate =
            !appliedAdmissionDate ||
            student.admissionDate === appliedAdmissionDate;


        return (
            matchesSearch &&
            matchesAdmissionDate
        );

    });


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="loading-container">
                Loading Enrolled Students...
            </div>
        );

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="admin-list-container">

            {/* =================================================
                HEADING
            ================================================= */}

            <h2>
                Enrolled Students
            </h2>


            {/* =================================================
                FILTERS
            ================================================= */}

<div
    style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap"
    }}
>

    {/* =========================
        SEARCH BY NAME / EMAIL
    ========================= */}

    <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
            width: "360px",
            height: "36px",
            boxSizing: "border-box",
            padding: "0 16px",
            fontSize: "14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            backgroundColor: "#ffffff",
            color: "#334155"
        }}
    />


    {/* =========================
        ADMISSION DATE
    ========================= */}

    <input
        type="date"
        value={admissionDate}
        onChange={(e) => setAdmissionDate(e.target.value)}
        style={{
            width: "180px",
            height: "36px",
            boxSizing: "border-box",
            padding: "0 12px",
            fontSize: "14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            backgroundColor: "#ffffff",
            color: "#334155",
            cursor: "pointer"
        }}
    />


    {/* =========================
        SEARCH BUTTON
    ========================= */}

    <button
        type="button"
        onClick={handleSearch}
        style={{
            height: "36px",
            padding: "0 24px",
            border: "1px solid #2563eb",
            borderRadius: "8px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxSizing: "border-box"
        }}
    >
        Search
    </button>


    {/* =========================
        CLEAR BUTTON
    ========================= */}

    <button
        type="button"
        onClick={handleClear}
        style={{
            height: "36px",
            padding: "0 24px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            color: "#334155",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxSizing: "border-box"
        }}
    >
        Clear
    </button>

</div>
            {/* =================================================
                TABLE
            ================================================= */}

            <table className="student-table">

                <thead>

                <tr>

                    <th>
                        Person ID
                    </th>

                    <th>
                        Name
                    </th>

                    <th>
                        Email
                    </th>

                    <th>
                        Batch
                    </th>

                    <th>
                        Status
                    </th>

                </tr>

                </thead>


                <tbody>

                {filteredStudents.length === 0 ? (

                    <tr>

                        <td
                            colSpan="5"
                            className="no-student-data"
                        >
                            {students.length === 0
                                ? "No enrolled students found in the system."
                                : "No matching student records found."
                            }
                        </td>

                    </tr>

                ) : (

                    filteredStudents.map(student => (

                        <tr key={student.personId}>

                            <td>
                                {student.personId}
                            </td>

                            <td>
                                {student.studentName || "N/A"}
                            </td>

                            <td>
                                {student.email || "N/A"}
                            </td>

                            <td>
                                {student.batchName || "Not Assigned"}
                            </td>

                            <td>

                                <span className="status-badge enrolled">

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
