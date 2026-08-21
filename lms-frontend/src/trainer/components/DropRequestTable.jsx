import React from "react";

import DropStatusBadge from "./DropStatusBadge";

import "../styles/dropRequest.css";


function DropRequestTable({
                              requests = [],
                              onAction,
                              actionLabel = "View",
                              onRecommend,
                              showRecommend = false,
                          }) {

    return (

        <table className="drop-request-table">

            <thead>

            <tr>
                <th>Student</th>
                <th>Batch</th>
                <th>Trainer</th>
                <th>COUNSELLOR</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Requested On</th>
                <th>Action</th>
            </tr>

            </thead>


            <tbody>

            {requests.length > 0 ? (

                requests.map((request) => (

                    <tr
                        key={request.dropRequestId}
                    >

                        <td>
                            {request.studentName || "-"}
                        </td>


                        <td>
                            {request.batchCode || "-"}
                        </td>


                        <td>
                            {request.requestedByName || "-"}
                        </td>


                        <td>
                            {request.assignedToName || "-"}
                        </td>


                        <td>

                            <DropStatusBadge
                                status={request.dropStatus}
                            />

                        </td>


                        <td>
                            {request.dropReason || "-"}
                        </td>


                        <td>

                            {request.requestedAt
                                ? new Date(
                                    request.requestedAt
                                ).toLocaleString()
                                : "-"
                            }

                        </td>


                        <td>

                            <button
                                type="button"
                                className="view-btn"
                                onClick={() =>
                                    onAction(request)
                                }
                            >
                                {actionLabel}
                            </button>


                            {showRecommend &&
                                request.dropStatus ===
                                "CONSULTANT_ASSIGNED" && (

                                    <button
                                        type="button"
                                        className="save-btn"
                                        style={{
                                            marginLeft: "8px"
                                        }}
                                        onClick={() =>
                                            onRecommend(
                                                request
                                            )
                                        }
                                    >
                                        Recommend
                                    </button>

                                )}

                        </td>

                    </tr>

                ))

            ) : (

                <tr>

                    <td
                        colSpan="8"
                        style={{
                            textAlign: "center",
                            padding: "20px"
                        }}
                    >
                        No Drop Requests Found
                    </td>

                </tr>

            )}

            </tbody>

        </table>
    );
}


export default DropRequestTable;