import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/studentCredentials.css";
import { useToast } from "../../shared/components/ToastContext";

export default function StudentSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");

    if (savedRole) {
      setRole(savedRole.toUpperCase());
    }
  }, []);

  useEffect(() => {
    if (!role) return;
    fetchTickets();
  }, [role]);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      let url = "";

      if (role === "ADMIN") {
        url = "/student/admin/support-tickets";
      } else if (role === "COUNSELLOR") {
        url = "/student/counselor/support-tickets";
      } else {
        setLoading(false);
        return;
      }

      const response = await api.get(url);
      setTickets(response.data);
    } catch (err) {
      console.error("Fetch Support Tickets Error:", err);
      showToast("Failed to load support requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowResolveModal(true);
  };

  const confirmResolve = async () => {
    try {
      await api.put(`/student/support/${selectedTicketId}/resolve`);

      setTickets((prev) =>
        prev.filter((ticket) => ticket.ticketId !== selectedTicketId)
      );

      setShowResolveModal(false);
      setSelectedTicketId(null);

      showToast(
        "Support ticket has been marked as resolved successfully.",
        "success"
      );
    } catch (err) {
      console.error("Resolve Support Ticket Error:", err);

      showToast(
        "Unable to resolve support ticket.",
        "error"
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStudentNumber = (personId, applicationStage) => {
    if (!personId) {
      return "N/A";
    }

    if (applicationStage === "ENROLLED") {
      return `ENR${personId}`;
    }

    return `APP${personId}`;
  };

  if (loading) {
    return (
      <div className="support-loading">
        Loading Support Request...
      </div>
    );
  }

  return (
    <div className="support-page">
      <div className="support-content-card">

        <div className="support-header">
          <h2>Support Requests</h2>

          <p>
            {role === "ADMIN"
              ? "View and manage all student support requests."
              : "View and manage support requests raised by your assigned students."}
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="support-empty">
            <div className="support-empty-icon">
              ✓
            </div>

            <h3>No Open Support Requests</h3>

            <p>
              There are currently no open support requests.
            </p>
          </div>
        ) : (
          <div className="support-table">

            <div className="support-table-head">

              <div>
                Student
              </div>

              <div style={{ whiteSpace: "nowrap" }}>
                {tickets.some(
                  (ticket) => ticket.applicationStage === "ENROLLED"
                )
                  ? "Enrollment No."
                  : "Application No."}
              </div>

              <div>
                Subject
              </div>

              <div>
                Message
              </div>

              <div>
                Date
              </div>

              <div>
                Action
              </div>

            </div>

            {tickets.map((ticket) => (
              <div
                key={ticket.ticketId}
                className="support-table-row"
              >

                <div className="support-cell">
                  <strong>
                    {ticket.studentName}
                  </strong>
                </div>

                <div
                  className="support-cell"
                  style={{
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                  }}
                >
                  <span className="enrollment-badge">
                    {formatStudentNumber(
                      ticket.personId,
                      ticket.applicationStage
                    )}
                  </span>
                </div>

                <div className="support-cell">
                  {ticket.subject}
                </div>

                <div className="support-cell support-message">
                  {ticket.message}
                </div>

                <div className="support-cell">
                  {formatDate(ticket.createdAt)}
                </div>

                <div className="support-cell">
                  <button
                    className="resolve-btn"
                    onClick={() =>
                      handleResolveClick(ticket.ticketId)
                    }
                  >
                    Resolve
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {showResolveModal && (
        <div className="modal-overlay">

          <div className="resolve-modal">

            <h3>
              Resolve Support Ticket
            </h3>

            <p>
              Are you sure you want to mark this support Request as resolved?
            </p>

            <p className="modal-note">
              This ticket will be removed from the Open Support Tickets list.
            </p>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowResolveModal(false);
                  setSelectedTicketId(null);
                }}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={confirmResolve}
              >
                Resolve
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}