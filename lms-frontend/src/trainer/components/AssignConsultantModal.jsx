import { useEffect, useState } from "react";

import employeeService from "../../employee/services/employeeService";
import { assignCOUNSELLOR } from "../services/dropRequestService";

import "../styles/dropRequest.css";


function AssignConsultantModal({
                                 request,
                                 adminEmployeeId,
                                 onClose,
                                 onSuccess,
                               }) {

  const [counsellors, setCounsellors] = useState([]);

  const [selectedCOUNSELLOR, setSelectedCOUNSELLOR] =
      useState("");

  const [loading, setLoading] = useState(false);


  // =========================================
  // LOAD COUNSELLORS
  // =========================================

  useEffect(() => {

    loadCounsellors();

  }, []);


  const loadCounsellors = async () => {

    try {

      const response =
          await employeeService.getCounsellors();

      console.log(
          "========== COUNSELLORS =========="
      );

      console.log(
          response.data
      );

      setCounsellors(
          response.data || []
      );

    } catch (error) {

      console.error(
          "FAILED TO LOAD COUNSELLORS:",
          error
      );

      alert(
          "Failed to load Counsellors."
      );
    }
  };


  // =========================================
  // ASSIGN COUNSELLOR
  // =========================================

  const handleAssign = async () => {

    if (!selectedCOUNSELLOR) {

      alert(
          "Please select a COUNSELLOR."
      );

      return;
    }


    if (!adminEmployeeId) {

      console.error(
          "Admin Employee/Person ID:",
          adminEmployeeId
      );

      alert(
          "Admin ID not found."
      );

      return;
    }


    try {

      setLoading(true);


      const counselorPersonId =
          Number(selectedCOUNSELLOR);


      const adminPersonId =
          Number(adminEmployeeId);


      console.log(
          "========== ASSIGN COUNSELLOR =========="
      );

      console.log({
        dropRequestId:
        request.dropRequestId,

        adminPersonId:
        adminPersonId,

        counselorPersonId:
        counselorPersonId,
      });


      // =========================================
      // API CALL
      // =========================================

      await assignCOUNSELLOR(

          request.dropRequestId,

          adminPersonId,

          {
            counselorPersonId:
            counselorPersonId,
          }

      );


      // =========================================
      // SUCCESS
      // =========================================

      alert(
          "COUNSELLOR assigned successfully."
      );


      if (onSuccess) {
        await onSuccess();
      }


      onClose();


    } catch (error) {

      console.error(
          "ASSIGN COUNSELLOR ERROR:",
          error
      );


      if (error.response?.data) {

        console.error(
            "BACKEND RESPONSE:",
            error.response.data
        );

      }


      alert(
          "Failed to assign COUNSELLOR."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // NO REQUEST
  // =========================================

  if (!request) {
    return null;
  }


  // =========================================
  // UI
  // =========================================

  return (

      <div className="modal">

        <h2>
          Assign COUNSELLOR
        </h2>


        <p>
          <strong>
            Student:
          </strong>{" "}

          {request.studentName || "-"}
        </p>


        <p>
          <strong>
            Batch:
          </strong>{" "}

          {request.batchCode || "-"}
        </p>


        <p>
          <strong>
            Trainer:
          </strong>{" "}

          {request.requestedByName || "-"}
        </p>


        <p>
          <strong>
            Reason:
          </strong>{" "}

          {request.dropReason || "-"}
        </p>


        <p>
          <strong>
            Status:
          </strong>{" "}

          {request.dropStatus || "-"}
        </p>


        {/* =========================================
                COUNSELLOR
            ========================================= */}

        <label>
          COUNSELLOR
        </label>


        <select
            value={selectedCOUNSELLOR}
            onChange={(e) =>
                setSelectedCOUNSELLOR(
                    e.target.value
                )
            }
            disabled={loading}
        >

          <option value="">
            Select COUNSELLOR
          </option>


          {counsellors.map(
              (counsellor) => (

                  <option
                      key={
                        counsellor.personId
                      }
                      value={
                        counsellor.personId
                      }
                  >

                    {
                        counsellor.counsellorName ||
                        counsellor.fullName ||
                        `Counsellor ${counsellor.personId}`
                    }

                  </option>

              )
          )}

        </select>


        {/* =========================================
                ACTIONS
            ========================================= */}

        <div className="modal-actions">

          <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
          >
            Cancel
          </button>


          <button
              type="button"
              className="save-btn"
              onClick={handleAssign}
              disabled={
                  loading ||
                  !selectedCOUNSELLOR
              }
          >

            {loading
                ? "Assigning..."
                : "Assign Counsellor"
            }

          </button>

        </div>

      </div>
  );
}


export default AssignConsultantModal;