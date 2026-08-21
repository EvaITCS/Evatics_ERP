// WorkModeBadge.jsx

import React from "react";
import "../../shared/styles/sidebar.css";
import "../styles/employee.css";
function WorkModeBadge({ mode }) {

    const getClassName = () => {

        switch (mode?.toUpperCase()) {

            case "REMOTE":
                return "badge remote-badge";

            case "HYBRID":
                return "badge hybrid-badge";

            case "OFFICE":
                return "badge office-badge";

            default:
                return "badge";
        }
    };

    return (

        <span className={getClassName()}>
            {mode}
        </span>
    );
}

export default WorkModeBadge;