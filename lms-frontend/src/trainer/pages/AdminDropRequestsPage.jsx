import { useEffect, useState } from "react";

import DropRequestTable from "../components/DropRequestTable";
import AssignConsultantModal
  from "../components/AssignConsultantModal";

import dropRequestService from "../services/dropRequestService";
import "../styles/dropRequest.css";

function AdminDropRequestsPage() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const adminEmployeeId = Number(localStorage.getItem("personId"));

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await dropRequestService.getPendingRequests();

      setRequests(response.data);
    } catch (error) {
      console.error(error);

      alert("Failed to load drop requests.");
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (request) => {
    setSelectedRequest(request);

    setShowAssignModal(true);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page">
      <h2>Pending Drop Requests</h2>

      <DropRequestTable
        requests={requests}
        onAction={openAssignModal}
        actionLabel="View"
      />

      {showAssignModal && selectedRequest && (
          <AssignConsultantModal
          request={selectedRequest}
          adminEmployeeId={adminEmployeeId}
          onClose={() => {
            setShowAssignModal(false);

            setSelectedRequest(null);
          }}
          onSuccess={loadRequests}
        />
      )}
    </div>
  );
}

export default AdminDropRequestsPage;
