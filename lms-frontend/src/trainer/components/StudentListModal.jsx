import { useState } from "react";

export default function StudentListModal({
    open,
    onClose,
    students,
    title,
    onStudentClick,
     onDropStudent
}) {

    const [search, setSearch] = useState("");
const isActive = title.includes("Enrolled");

const isGraduated = title.includes("Graduated");

const isDropped = title.includes("Dropped");
    if (!open) return null;

    const filteredStudents = students.filter((student) => {

        return (
            student.studentName
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            student.phone
                ?.includes(search)

            ||

            student.email
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

    });

    return (

        <div
            className="modal-overlay"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >

            <div
                className="modal-content"
                style={{
                   width: "95vw",
maxWidth: "1400px",
height: "85vh",
maxHeight: "85vh",
                    overflowY: "auto",
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "25px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.25)"
                }}
            >

                {/* Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}
                >

                    <h2 style={{ margin: 0 }}>
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "22px"
                        }}
                    >
                        ✕
                    </button>

                </div>

                {/* Search */}

                <input
                    type="text"
                    placeholder="Search Student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db"
                    }}
                />

                {
                    filteredStudents.length === 0 ?

                        (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "30px",
                                    color: "#64748b"
                                }}
                            >
                                No Students Found
                            </div>

                        )

                        :

                        (
<div
    style={{
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "60vh"
    }}
>

    <table
        style={{
            width: "100%",
            minWidth: "1100px",
            borderCollapse: "collapse"
        }}
    >
                       
<thead>

<tr style={{ background: "#f8fafc" }}>

    <th style={headerStyle}>Name</th>

    <th style={headerStyle}>Phone</th>

    <th style={headerStyle}>Email</th>

    <th style={headerStyle}>State</th>

    <th style={headerStyle}>City</th>

    <th style={headerStyle}>Education</th>

    {
        isGraduated &&
        <th style={headerStyle}>Completed Date</th>
    }

    {
        isDropped &&
        <th style={headerStyle}>Dropped Date</th>
    }

    {
        isDropped &&
        <th style={headerStyle}>Reason</th>
    }

    {
        isActive &&
        <th style={headerStyle}>Action</th>
    }

</tr>

</thead>

                                <tbody>

                                    {

                                        filteredStudents.map((student) => (

                                            <tr
                                                key={student.studentId}
                                                style={{
                                                    borderBottom:
                                                        "1px solid #e5e7eb"
                                                }}
                                            >

            <td style={cellStyle}>
    <span
        onClick={() => onStudentClick?.(student)}
        style={{
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: "600"
        }}
    >
        {student.studentName}
    </span>
</td>

<td style={cellStyle}>{student.phone}</td>

<td style={cellStyle}>{student.email}</td>

<td style={cellStyle}>{student.state}</td>

<td style={cellStyle}>{student.city}</td>

<td style={cellStyle}>{student.highestEducation}</td>

{
    isGraduated &&
    <td style={cellStyle}>
        {
            student.completedDate
                ? new Date(student.completedDate).toLocaleDateString("en-GB")
                : "-"
        }
    </td>
}

{
    isDropped &&
    <td style={cellStyle}>
        {
            student.droppedDate
                ? new Date(student.droppedDate).toLocaleDateString("en-GB")
                : "-"
        }
    </td>
}

{
    isDropped &&
    <td style={cellStyle}>
        {student.dropReason || "-"}
    </td>
}

{
    isActive &&
    <td style={cellStyle}>

        <button
            onClick={() => onDropStudent(student)}
            style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer"
            }}
        >
        Request Drop
        </button>

    </td>
}
                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>
</div>
                        )

                }

            </div>

        </div>

    );

}

const headerStyle = {
    padding: "14px",
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    color: "#475569",
    fontSize: "13px",
    textTransform: "uppercase"
};

const cellStyle = {
    padding: "16px"
};