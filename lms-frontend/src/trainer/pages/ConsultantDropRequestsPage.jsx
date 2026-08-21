import React, { useEffect, useState } from "react";

import PageTitle from "../../shared/components/PageTitle";
import DropRequestTable from "../components/DropRequestTable";
import RecommendationModal from "../components/RecommendationModal";

import dropRequestService from "../services/dropRequestService";

import "../styles/dropRequest.css";


function COUNSELLORDropRequestsPage() {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] =
      useState(null);

  const [showRecommendationModal, setShowRecommendationModal] =
      useState(false);


  // =========================================================
  // COUNSELLOR PERSON ID
  // =========================================================

  const counselorPersonId = Number(
      localStorage.getItem("personId")
  );


  console.log(
      "COUNSELLOR PERSON ID:",
      counselorPersonId
  );


  // =========================================================
  // LOAD REQUESTS
  // =========================================================

  const loadRequests = async () => {

    try {

      setLoading(true);


      if (!counselorPersonId) {

        console.error(
            "Counsellor personId not found in localStorage"
        );

        setRequests([]);

        return;
      }


      console.log(
          "Loading counsellor requests for:",
          counselorPersonId
      );


      const response =
          await dropRequestService.getCOUNSELLORRequests(
              counselorPersonId
          );


      console.log(
          "COUNSELLOR REQUEST RESPONSE:",
          response.data
      );


      setRequests(
          Array.isArray(response.data)
              ? response.data
              : []
      );


    } catch (error) {

      console.error(
          "FAILED TO LOAD COUNSELLOR REQUESTS:",
          error
      );


      console.error(
          "STATUS:",
          error.response?.status
      );


      console.error(
          "BACKEND RESPONSE:",
          error.response?.data
      );


      setRequests([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadRequests();

  }, []);


  // =========================================================
  // VIEW
  // =========================================================

  const handleView = (request) => {

    setSelectedRequest(request);

    setShowRecommendationModal(false);

  };


  // =========================================================
  // RECOMMEND
  // =========================================================

  const handleRecommend = (request) => {

    setSelectedRequest(request);

    setShowRecommendationModal(true);

  };


  // =========================================================
  // CLOSE
  // =========================================================

  const closeAllModals = () => {

    setShowRecommendationModal(false);

    setSelectedRequest(null);

  };


  return (

      <div className="trainer-drop-request-page">

        <PageTitle
            title="Assigned Drop Requests"
        />


        {loading ? (

            <p>
              Loading...
            </p>

        ) : (

            <DropRequestTable

                requests={requests}

                onAction={handleView}

                actionLabel="View"

                onRecommend={handleRecommend}

                showRecommend={true}

            />

        )}


        {/* =====================================================
              RECOMMENDATION MODAL
        ===================================================== */}

        {showRecommendationModal &&
            selectedRequest && (

                <RecommendationModal

                    request={selectedRequest}

                    counselorPersonId={
                      counselorPersonId
                    }

                    onClose={
                      closeAllModals
                    }

                    onSuccess={
                      loadRequests
                    }

                />

            )}


        {/* =====================================================
              VIEW DETAILS MODAL
        ===================================================== */}

        {selectedRequest &&
            !showRecommendationModal && (

                <div className="modal-overlay">

                  <div className="drop-details-modal">

                    <h2>
                      Drop Request Details
                    </h2>

                    <hr />


                    <p>
                      <strong>
                        Student:
                      </strong>{" "}

                      {
                          selectedRequest.studentName
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Batch:
                      </strong>{" "}

                      {
                          selectedRequest.batchCode
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Trainer:
                      </strong>{" "}

                      {
                          selectedRequest.requestedByName
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Counsellor:
                      </strong>{" "}

                      {
                          selectedRequest.assignedToName
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Status:
                      </strong>{" "}

                      {
                          selectedRequest.dropStatus
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Drop Reason:
                      </strong>{" "}

                      {
                          selectedRequest.dropReason
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Recommendation:
                      </strong>{" "}

                      {
                          selectedRequest.recommendation
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Counsellor Remarks:
                      </strong>{" "}

                      {
                          selectedRequest.reviewRemarks
                          || "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Requested On:
                      </strong>{" "}

                      {
                        selectedRequest.requestedAt
                            ? new Date(
                                selectedRequest.requestedAt
                            ).toLocaleString()
                            : "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Assigned On:
                      </strong>{" "}

                      {
                        selectedRequest.assignedAt
                            ? new Date(
                                selectedRequest.assignedAt
                            ).toLocaleString()
                            : "-"
                      }
                    </p>


                    <p>
                      <strong>
                        Reviewed On:
                      </strong>{" "}

                      {
                        selectedRequest.reviewedAt
                            ? new Date(
                                selectedRequest.reviewedAt
                            ).toLocaleString()
                            : "-"
                      }
                    </p>


                    <button
                        type="button"
                        className="close-btn"
                        onClick={closeAllModals}
                    >
                      Close
                    </button>

                  </div>

                </div>

            )}

      </div>

  );
}


export default COUNSELLORDropRequestsPage;