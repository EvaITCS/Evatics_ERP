import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../styles/AdminStudentList.css";

export default function AdminApplicationList() {

    const [apps, setApps] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        api.get("/admin/application/all")
            .then(res => {
                setApps(res.data || []);
            })
            .catch(err => {
                console.error("Error fetching applications:", err);
            });

    }, []);

    const getStatusClass = (status) => {

        if (!status) return "pending";

        switch (status.toUpperCase()) {

            case "ENROLLED":
                return "enrolled";

            case "RECHECK_REQUIRED":
                return "recheck";

            case "REGISTERED":
            case "APPLICATION_STARTED":
            case "DRAFT":
            case "SUBMITTED":
            case "UNDER_REVIEW":
                return "pending";

            default:
                return "pending";
        }
    };

    return (

        <div className="admin-page-font-wrapper">

            <div className="admin-list-container">

                <h2 className="admin-page-title">
                    All Student Applications
                </h2>

                <div className="application-grid">

                    {apps.length === 0 ? (

                        <div className="no-data-msg">
                            No applications found in the system.
                        </div>

                    ) : (

                        apps.map((app, index) => (

                            <div
                                key={app.personId || index}
                                className="application-card"
                            >

                                <div className="card-header-flex">

                                    <h3>
                                        {`${app.firstName || ""} ${app.middleName || ""} ${app.lastName || ""}`.trim()}
                                    </h3>

                                    <span
                                        className={`status-badge ${getStatusClass(app.applicationStage)}`}
                                    >
                                        {app.applicationStage || "PENDING"}
                                    </span>

                                </div>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {app.email || "N/A"}
                                </p>

                               <p>
    <strong>Application Number:</strong>{" "}
    {app.personId
        ? `APP${app.personId}`
        : "N/A"}
</p>

                                {app.batchName && (
                                    <p>
                                        <strong>Batch:</strong>{" "}
                                        {app.batchName}
                                    </p>
                                )}

                                <button
                                    className="view-btn1"
                                    onClick={() =>
                                        navigate(`/admin/applications/${app.personId}`)
                                    }
                                >
                                    View Full Application →
                                </button>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );
}