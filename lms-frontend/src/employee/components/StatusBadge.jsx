// StatusBadge.jsx

import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function StatusBadge({ status }) {

    const getClassName = () => {

        switch (status?.toUpperCase()) {

            case "ACTIVE":
                return "badge active-badge";

            case "INACTIVE":
                return "badge inactive-badge";

            case "PROBATION":
                return "badge probation-badge";

            case "RESIGNED":
                return "badge resigned-badge";

            default:
                return "badge";
        }
    };

    return (

        <span className={getClassName()}>
            {status}
        </span>
    );
}

export default StatusBadge;