import React, { useEffect, useState } from "react";

import PageTitle from "../../shared/components/PageTitle";

import DropRequestTable from "../components/DropRequestTable";

import dropRequestService from "../services/dropRequestService";

import "../styles/dropRequest.css";

function TrainerDropRequestsPage() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const trainerEmployeeId = localStorage.getItem("employeeId");

  const loadRequests = async () => {
    try {
      const response =
        await dropRequestService.getTrainerRequests(trainerEmployeeId);

      setRequests(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="trainer-drop-request-page">
      <PageTitle title="Student Drop Requests" />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DropRequestTable
          requests={requests}
          onView={(request) => setSelectedRequest(request)}
        />
      )}

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="drop-details-modal">
            <h2>Drop Request Details</h2>

            <hr />

            <p>
              <strong>Student :</strong>

              {selectedRequest.studentName}
            </p>

            <p>
              <strong>Batch :</strong>

              {selectedRequest.batchName}
            </p>

            <p>
              <strong>Trainer :</strong>

              {selectedRequest.trainerName}
            </p>

            <p>
              <strong>COUNSELLOR :</strong>

              {selectedRequest.COUNSELLORName || "-"}
            </p>

            <p>
              <strong>Status :</strong>

              {selectedRequest.status}
            </p>

            <p>
              <strong>Trainer Reason :</strong>

              {selectedRequest.trainerReason}
            </p>

            <p>
              <strong>Trainer Remarks :</strong>

              {selectedRequest.trainerRemarks || "-"}
            </p>

            <p>
              <strong>COUNSELLOR Recommendation :</strong>

              {selectedRequest.COUNSELLORRecommendation || "-"}
            </p>

            <p>
              <strong>COUNSELLOR Notes :</strong>

              {selectedRequest.COUNSELLORNotes || "-"}
            </p>

            <p>
              <strong>Admin Decision :</strong>

              {selectedRequest.adminDecisionReason || "-"}
            </p>

            <p>
              <strong>Requested On :</strong>

              {selectedRequest.requestedAt
                ? new Date(selectedRequest.requestedAt).toLocaleString()
                : "-"}
            </p>

            <button
              className="close-btn"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerDropRequestsPage;
