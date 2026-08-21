import { useState } from "react";

import { adminDecision } from "../services/dropRequestService";
import "../styles/dropRequest.css";

function DecisionModal({
  request,

  adminEmployeeId,

  onClose,

  onSuccess,
}) {
  const [approved, setApproved] = useState(true);

  const [decisionReason, setDecisionReason] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!decisionReason.trim()) {
      alert("Decision reason is required.");

      return;
    }

    try {
      setLoading(true);

      await adminDecision(
        request.dropRequestId,

        adminEmployeeId,

        {
          approved,

          decisionReason,
        },
      );

      alert("Decision submitted successfully.");

      onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      alert("Failed to submit decision.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <h2>Final Decision</h2>

      <p>
        <strong>Student:</strong>

        {request.studentName}
      </p>

      <p>
        <strong>Batch:</strong>

        {request.batchName}
      </p>

      <p>
        <strong>Trainer:</strong>

        {request.trainerName}
      </p>

      <p>
        <strong>COUNSELLOR Recommendation:</strong>

        {request.COUNSELLORRecommendation}
      </p>

      <div>
        <label>
          <input
            type="radio"
            checked={approved}
            onChange={() => setApproved(true)}
          />
          Approve
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            checked={!approved}
            onChange={() => setApproved(false)}
          />
          Reject
        </label>
      </div>

      <br />

      <textarea
        rows={5}
        placeholder="Decision Reason"
        value={decisionReason}
        onChange={(e) => setDecisionReason(e.target.value)}
      />

      <br />

      <div className="modal-actions">
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>

        <button className="save-btn" disabled={loading} onClick={handleSubmit}>
          {loading ? "Submitting..." : "Submit Decision"}
        </button>
      </div>
    </div>
  );
}

export default DecisionModal;
