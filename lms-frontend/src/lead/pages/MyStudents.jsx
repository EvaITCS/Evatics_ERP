import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import counselorStudentService from "../../services/counselorStudentService";
import "../styles/MyStudents.css";

const MyStudents = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const counselorId = localStorage.getItem("userId");

            const response =
                await counselorStudentService.getMyStudents(counselorId);

                

            setStudents(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewApplication = (applicationId) => {
        const role = localStorage.getItem("role");

        if (role === "ADMIN") {
            navigate(`/admin/application/${applicationId}`);
        } else if (role === "COUNSELLOR") {
            navigate(`/COUNSELLOR/application/${applicationId}`);
        } else {
            alert("Unauthorized Access");
        }
    };

    // =========================================================
    // STAGE DISPLAY
    // =========================================================

    const getStage = (stage) => {
        switch (stage) {
            case "REGISTERED":
                return "Registration Completed";

            case "SUBMITTED":
                return "Application Submitted";

            case "RECHECK_REQUIRED":
                return "Recheck Required";

            case "ENROLLED":
                return "Successfully Enrolled";

            default:
                return stage;
        }
    };

    // =========================================================
    // STATUS DISPLAY
    // =========================================================

    const getStatus = (status) => {
        switch (status) {
            case "MEETING_PENDING":
                return "Meeting Pending";

            case "RECHECK_REQUIRED":
                return "Returned For Correction";

            case "ENROLLED":
                return "ENROLLED";

            default:
                return status;
        }
    };

    // =========================================================
    // APPLICATION / ENROLLMENT NUMBER
    // =========================================================

  const getDisplayNumber = (personId, stage) => {
    if (!personId) {
        return "N/A";
    }

    if (stage === "ENROLLED") {
        return `ENR${personId}`;
    }

    return `APP${personId}`;
};

const getDisplayNumberLabel = (stage) => {
    return stage === "ENROLLED"
        ? "Enrollment No."
        : "Application No.";
};

    return (
        <div className="container-fluid">

            <div className="card shadow">

                <div className="card-header">
                    <h4 className="mb-0">My Students</h4>
                </div>

                <div className="card-body">

                    <div className="table-responsive">

                       <table className="table table-bordered">

    <thead>
        <tr>

            <th>
                {students.length > 0 &&
                students.every(s => s.applicationStage === "ENROLLED")
                    ? "Enrollment No."
                    : "Application No."}
            </th>

            <th>Name</th>

            <th>Email</th>

            <th>Status</th>

            <th>Action</th>

        </tr>
    </thead>

    <tbody>

        {students.length === 0 ? (

            <tr>
                <td
                    colSpan="5"
                    style={{
                        textAlign: "center",
                        padding: "20px"
                    }}
                >
                    No students found.
                </td>
            </tr>

        ) : (

            students.map((s) => (

                <tr key={s.personId}>

                    {/* APPLICATION / ENROLLMENT NUMBER */}
                  <td>
    {s.personId
        ? s.applicationStage === "ENROLLED"
            ? `ENR${s.personId}`
            : `APP${s.personId}`
        : "N/A"}
</td>

                    {/* NAME */}
                    <td>
                        {s.studentName || "N/A"}
                    </td>

                    {/* EMAIL */}
                    <td>
                        {s.email || "N/A"}
                    </td>

                    {/* STATUS */}
                    <td>
                        {getStatus(s.applicationStage)}
                    </td>

                    {/* ACTION */}
                    <td>
                        <button
                            className="view-app-btn"
                            onClick={() =>
                                handleViewApplication(s.personId)
                            }
                        >
                            View Application
                        </button>
                    </td>

                </tr>

            ))

        )}

    </tbody>

</table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default MyStudents;