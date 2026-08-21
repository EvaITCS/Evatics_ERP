import React from "react";

import "../styles/dropRequest.css";


function DropStatusBadge({ status }) {

  const getClassName = () => {

    switch (status) {

      case "PENDING":
        return "status-pending";

      case "CONSULTANT_ASSIGNED":
        return "status-assigned";

      case "CONSULTANT_COMPLETED":
        return "status-completed";

      case "APPROVED":
        return "status-approved";

      case "REJECTED":
        return "status-rejected";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };


  return (

      <span
          className={
            `drop-status-badge ${getClassName()}`
          }
      >
        {status || "-"}
      </span>

  );
}


export default DropStatusBadge;