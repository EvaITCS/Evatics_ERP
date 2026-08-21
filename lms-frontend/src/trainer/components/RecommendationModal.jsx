import React, { useState } from "react";

import dropRequestService from "../services/dropRequestService";

import "../styles/dropRequest.css";


function RecommendationModal({
                               request,
                               counselorPersonId,
                               onClose,
                               onSuccess,
                             }) {

  const [recommendation, setRecommendation] = useState("");

  const [counselorRemarks, setCounselorRemarks] = useState("");

  const [saving, setSaving] = useState(false);


  // =========================================================
  // NO REQUEST
  // =========================================================

  if (!request) {
    return null;
  }


  // =========================================================
  // SUBMIT RECOMMENDATION
  // =========================================================

  const handleSubmit = async () => {

    // -------------------------------------------------------
    // VALIDATE RECOMMENDATION
    // -------------------------------------------------------

    if (!recommendation) {

      alert("Please select a recommendation.");

      return;
    }


    // -------------------------------------------------------
    // VALIDATE REMARKS
    // -------------------------------------------------------

    if (!counselorRemarks.trim()) {

      alert("Counsellor remarks are required.");

      return;
    }


    // -------------------------------------------------------
    // VALIDATE COUNSELLOR ID
    // -------------------------------------------------------

    if (!counselorPersonId || Number(counselorPersonId) <= 0) {

      console.error(
          "Invalid Counsellor Person ID:",
          counselorPersonId
      );

      alert("Counsellor person ID not found.");

      return;
    }


    try {

      setSaving(true);


      const personId = Number(counselorPersonId);


      console.log(
          "========== SUBMIT RECOMMENDATION =========="
      );

      console.log({
        dropRequestId: request.dropRequestId,
        counselorPersonId: personId,
        recommendation: recommendation,
        counselorRemarks: counselorRemarks.trim(),
      });


      // =====================================================
      // API
      // =====================================================

      await dropRequestService.submitRecommendation(

          request.dropRequestId,

          personId,

          {
            // IMPORTANT:
            // Must exactly match Java enum:
            // APPROVE / REJECT / HOLD
            recommendation: recommendation,

            counselorRemarks:
                counselorRemarks.trim(),
          }

      );


      // =====================================================
      // SUCCESS
      // =====================================================

      alert(
          "Recommendation submitted successfully."
      );


      // Refresh list first
      if (onSuccess) {
        await onSuccess();
      }


      // Close modal
      onClose();


    } catch (error) {

      console.error(
          "========== RECOMMENDATION ERROR =========="
      );

      console.error(error);

      console.error(
          "STATUS:",
          error.response?.status
      );

      console.error(
          "BACKEND RESPONSE:",
          error.response?.data
      );


      const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error;


      alert(
          backendMessage ||
          "Failed to submit recommendation."
      );


    } finally {

      setSaving(false);

    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (

      <div className="modal-overlay">

        <div className="drop-modal">

          <h2>
            Counsellor Recommendation
          </h2>

          <hr />


          <div className="drop-form">

            {/* =================================================
              STUDENT
          ================================================= */}

            <label>
              Student
            </label>

            <input
                type="text"
                value={request.studentName || "-"}
                readOnly
            />


            {/* =================================================
              BATCH
          ================================================= */}

            <label>
              Batch
            </label>

            <input
                type="text"
                value={request.batchCode || "-"}
                readOnly
            />


            {/* =================================================
              TRAINER
          ================================================= */}

            <label>
              Trainer
            </label>

            <input
                type="text"
                value={request.requestedByName || "-"}
                readOnly
            />


            {/* =================================================
              COUNSELLOR
          ================================================= */}

            <label>
              Counsellor
            </label>

            <input
                type="text"
                value={request.assignedToName || "-"}
                readOnly
            />


            {/* =================================================
              DROP REASON
          ================================================= */}

            <label>
              Trainer's Drop Reason
            </label>

            <textarea
                rows="3"
                value={request.dropReason || "-"}
                readOnly
            />


            {/* =================================================
              RECOMMENDATION
          ================================================= */}

            <label>
              Recommendation *
            </label>

            <select
                value={recommendation}
                onChange={(e) =>
                    setRecommendation(e.target.value)
                }
                disabled={saving}
            >

              <option value="">
                Select Recommendation
              </option>

              {/* Java enum: APPROVE */}
              <option value="APPROVE">
                Approve Drop
              </option>

              {/* Java enum: REJECT */}
              <option value="REJECT">
                Reject Drop
              </option>

              {/* Java enum: HOLD */}
              <option value="HOLD">
                Hold for Further Review
              </option>

            </select>


            {/* =================================================
              COUNSELLOR REMARKS
          ================================================= */}

            <label>
              Counsellor Remarks *
            </label>

            <textarea
                rows="5"
                value={counselorRemarks}
                onChange={(e) =>
                    setCounselorRemarks(e.target.value)
                }
                placeholder="Enter your remarks..."
                disabled={saving}
            />

          </div>


          {/* ===================================================
            BUTTONS
        =================================================== */}

          <div className="drop-actions">

            <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={saving}
            >
              Cancel
            </button>


            <button
                type="button"
                className="save-btn"
                onClick={handleSubmit}
                disabled={
                    saving ||
                    !recommendation ||
                    !counselorRemarks.trim()
                }
            >

              {saving
                  ? "Submitting..."
                  : "Submit Recommendation"
              }

            </button>

          </div>

        </div>

      </div>

  );
}


export default RecommendationModal;