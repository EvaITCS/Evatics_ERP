import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getLeadById } from "../services/leadService";
import {
  convertLead,
  insertLead,
  archiveLeadConversion,
} from "../services/leadConversionService";
import { createFollowup } from "../services/followupService";
import { getLeadFollowups } from "../services/followupService";
import { completeReminder } from "../services/reminderService";

import api from "../../api/axios";
import Timeline from "../components/Timeline";

import FollowupModal from "../components/FollowupModal";
import PageTitle from "../../shared/components/PageTitle";
import { getCounsellors } from "../../user/service/userService";
import "../styles/LeadDetailPage.css";
import { assignLead } from "../services/leadService";

function LeadDetailPage() {
  const role = localStorage.getItem("role");
  // =====================================
  // PARAMS
  // =====================================

  const { id } = useParams();

  // =====================================
  // STATE
  // =====================================

  const [lead, setLead] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openFollowup, setOpenFollowup] = useState(false);
  const [COUNSELLORs, setCOUNSELLORs] = useState([]);

  const [selectedCOUNSELLOR, setSelectedCOUNSELLOR] = useState("");

  const [followups, setFollowups] = useState([]);
  const [activities, setActivities] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [reminders, setReminders] = useState([]);
  const getNextFollowupTime = () => {
    const pending = reminders
        ?.filter(
            (reminder) =>
                !reminder.completed &&
                reminder.reminderTime
        )
        .sort(
            (a, b) =>
                new Date(a.reminderTime) -
                new Date(b.reminderTime)
        );

    return pending?.[0]?.reminderTime || null;
  };
  // =====================================
  // FETCH LEAD
  // =====================================

  const fetchLead = async () => {
    try {
      const data = await getLeadById(id);

      console.log("LEAD RESPONSE =", data);

      setLead(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD
  // =====================================
  const fetchCOUNSELLORs = async () => {
    try {
      const data = await getCounsellors();

      setCOUNSELLORs(data);
    } catch (error) {
      console.log(error);
    }
  };

  // CONST FECT FOLLOWUP

  const fetchFollowups = async () => {
    const data = await getLeadFollowups(id);

    setFollowups(data);
  };
  const fetchActivities = async () => {
    const response = await api.get(`/api/leads/${id}/activities`);

    setActivities(response.data);
  };

  const fetchStatusHistory = async () => {
    const response = await api.get(`/api/leads/${id}/status-history`);

    console.log("STATUS HISTORY =", response.data);

    setStatusHistory(response.data);
  };
  // const fetchAssignmentHistory = async () => {
  //   const response = await api.get(`/api/leads/${id}/assignment-history`);
  //
  //   setAssignmentHistory(response.data);
  // };


  const fetchAssignmentHistory = async () => {
    try {
      const response = await api.get(
          `/api/leads/${id}/assignment-history`
      );

      console.log(
          "========== ASSIGNMENT HISTORY =========="
      );

      console.log(
          JSON.stringify(response.data, null, 2)
      );

      setAssignmentHistory(response.data);

    } catch (error) {
      console.error(
          "Failed to load assignment history:",
          error
      );
    }
  };
  const fetchReminders = async () => {
    const response = await api.get(`/api/reminders/lead/${id}`);

    setReminders(response.data);
  };
  useEffect(() => {
    fetchLead();

    fetchCOUNSELLORs();

    fetchFollowups();

    fetchActivities();

    fetchStatusHistory();

    fetchAssignmentHistory();

    fetchReminders();
  }, [id]);
  // =====================================
  // HANDLE FOLLOWU
  // =====================================

  // =====================================
  // WHEN SHOULD THE NEXT FOLLOWUP BE?
  // Adjust these gaps (in hours) to match your team's process.
  // Any actionResult NOT listed here is treated as "no further
  // action needed" and will not schedule a next followup.
  // =====================================

  const NEXT_FOLLOWUP_HOURS = {
    CALLBACK_REQUESTED: 1,
    NO_RESPONSE: 24,
    EMAIL_OPENED: 24,
    SMS_REPLIED: 4,
    INTERESTED: 24,
  };

  const handleFollowupSubmit = async (followupData) => {
    try {


      const payload = {

        personId: Number(lead.personId),

        employeePersonId: Number(
            localStorage.getItem("personId")
        ),

        followupType: followupData.actionType,

        actionResult: followupData.actionResult,

        remarks: followupData.note
      };

      await createFollowup(payload);

      // This followup action addresses whatever reminder brought the
      // lead up in Pending/Today Followups. Close out any reminders for
      // this lead that are still open, so it drops off those lists.
      // (If the backend already closes the reminder when a followup is
      // created, this becomes a harmless no-op and can be removed.)

      const openReminders = reminders.filter(
        (reminder) => !reminder.completed,
      );

      await Promise.all(
        openReminders.map((reminder) =>
          completeReminder(reminder.reminderId).catch((err) =>
            console.error(
              "Failed to complete reminder",
              reminder.reminderId,
              err,
            ),
          ),
        ),
      );

      alert("Followup Added Successfully");

      setOpenFollowup(false);

      await fetchLead();

      await fetchFollowups();

      await fetchActivities();

      await fetchStatusHistory();

      await fetchAssignmentHistory();

      await fetchReminders();
    } catch (err) {
      console.error(err);

      alert("Failed to save followup");
    }
  };
  // =====================================
  // CONVERT LEAD
  // =====================================

  const handleConvertLead = async () => {
    try {
      await convertLead(lead.personId);

      alert("Lead Converted Successfully");

      fetchLead();
    } catch (error) {
      console.log(error);

      alert("Failed to Convert Lead");
    }
  };

  // =====================================
  // INSERT LEAD
  // =====================================

  const handleInsertLead = async () => {
    try {
      await insertLead(lead.personId);

      alert("Lead Inserted Successfully");

      fetchLead();
    } catch (error) {
      console.log(error);

      alert("Failed to Insert Lead");
    }
  };
  const handleArchiveLead = async () => {
    try {
      await archiveLeadConversion(lead.personId);

      alert("Lead Archived Successfully");

      fetchLead();
    } catch (error) {
      console.log(error);

      alert("Failed to Archive Lead");
    }
  };
  const handleAssignLead = async () => {
    if (!selectedCOUNSELLOR) {
      alert("Select COUNSELLOR");

      return;
    }

    try {
      await assignLead(
        lead.personId,

        selectedCOUNSELLOR,
      );

      alert("Lead Assigned Successfully");

      fetchLead();
    } catch (error) {
      console.log(error);

      alert("Assignment Failed");
    }
  };
  // const fetchAssignmentHistory = async () => {
  //   const response = await api.get(
  //       `/api/leads/${id}/assignment-history`
  //   );
  //
  //   console.log(
  //       "ASSIGNMENT HISTORY =",
  //       response.data
  //   );
  //
  //   setAssignmentHistory(response.data);
  // };
  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return <h2>Loading Lead...</h2>;
  }

  // =====================================
  // NO LEAD
  // =====================================

  if (!lead) {
    return <h2>Lead Not Found</h2>;
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="lead-detail-page">
      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="lead-header">
        <div>
          <h1>
            {[lead.firstName, lead.middleName, lead.lastName]
              .filter(Boolean)
              .join(" ")}
          </h1>

          <PageTitle title="Lead Profile Details" />
        </div>

        {/* Lead Action */}

        <div className="lead-actions">
          {role === "ADMIN" && (
            <>
              <select
                value={selectedCOUNSELLOR}
                onChange={(e) => setSelectedCOUNSELLOR(e.target.value)}
              >
                <option value="">Assign COUNSELLOR</option>

                {COUNSELLORs.map((counsellor) => (
                    <option
                        key={counsellor.personId}
                        value={counsellor.personId}
                    >
                      {
                          counsellor.fullName ||
                          counsellor.counsellorName ||
                          `${counsellor.firstName || ""} ${counsellor.lastName || ""}`.trim() ||
                          `Counsellor ${counsellor.personId}`
                      }
                    </option>
                ))}
              </select>

              <button className="assign-btn" onClick={handleAssignLead}>
                Assign
              </button>
            </>
          )}

          <button
            className="followup-btn"
            onClick={() => setOpenFollowup(true)}
          >
            Add Followup
          </button>
        </div>

        {role === "ADMIN" && <>{}</>}
      </div>
      {/* ===================================== */}
      {/* INFO GRID */}
      {/* ===================================== */}

      <div className="lead-info-grid">
        <div className="info-card">
          <label>Email</label>
          <p>{lead.email}</p>
        </div>

        <div className="info-card">
          <label>Phone</label>
          <p>{lead.phone}</p>
        </div>

        <div className="info-card">
          <label>Status</label>
          <p>{lead.leadStatus}</p>
        </div>

        <div className="info-card">
          <label>Lead Source</label>

          <p>
            {
              lead.customLeadSource &&
              lead.customLeadSource.trim() !== ""
                  ? lead.customLeadSource
                  : lead.leadSourceName
            }
          </p>
        </div>

        <div className="info-card">
          <label>COUNSELLOR</label>
          <p>{lead.assignedEmployeeName || "Unassigned"}</p>
        </div>

        {/*<div className="info-card">*/}
        {/*  <label>Next Followup</label>*/}
        {/*  <p>*/}
        {/*    {lead.nextFollowupAt*/}
        {/*      ? new Date(lead.nextFollowupAt).toLocaleString()*/}
        {/*      : "No Followup Scheduled"}*/}
        {/*  </p>*/}
        {/*</div>*/}

        <div className="info-card">
          <label>Next Followup</label>
          <p>
            {getNextFollowupTime()
                ? new Date(getNextFollowupTime()).toLocaleString()
                : "No Followup Scheduled"}
          </p>
        </div>

        <div className="info-card">
          <label>Created At</label>
          <p>
            {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "-"}
          </p>
        </div>

        <div className="info-card">
          <label>Lead ID</label>
          <p>{lead.personId}</p>
        </div>
      </div>
      {/* ===================================== */}
      {/* TIMELINE */}
      {/* ===================================== */}

      <div className="timeline-section">
        <h2>Activity Timeline</h2>

        <Timeline
          events={activities.map((activity) => ({
            title: activity.communicationType,
            message: activity.remarks || "No Remarks",
            date: activity.communicationTime,
            status: activity.communicationStatus,
          }))}
        />
        <h2>Followup History</h2>

        <table className="lead-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Notes</th>
              <th>Action Time</th>
              <th>Next Followup</th>
              <th>Retry</th>
            </tr>
          </thead>

          <tbody>
            {followups?.map((item) => (
                <tr key={item.followupId}>
                  <td>{item.followupType}</td>

                  <td>{item.remarks}</td>

                  <td>
                    {item.scheduledAt
                        ? new Date(item.scheduledAt).toLocaleString()
                        : "-"}
                  </td>

                  <td>
                    {item.nextFollowupAt
                        ? new Date(item.nextFollowupAt).toLocaleString()
                        : "-"}
                  </td>

                  <td>{item.retryCount}</td>
                </tr>
            ))}
          </tbody>
        </table>
        <h2>Communication Activity</h2>

        <table className="lead-table">
          <thead>
            <tr>
              <th>Channel</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {activities?.map((activity) => (
              <tr key={activity.logId}>
                <td>{activity.communicationType}</td>

                <td>{activity.communicationStatus}</td>

                <td>{activity.remarks}</td>

                <td>
                  {activity.communicationTime
                      ? new Date(activity.communicationTime).toLocaleString()
                      : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Status History</h2>

        <table className="lead-table">
          <thead>
            <tr>
              <th>Old Status</th>
              <th>New Status</th>
              <th>Changed At</th>
            </tr>
          </thead>

          <tbody>
            {statusHistory?.map((history) => (
              <tr key={history.historyId}>
                <td>{history.oldStatusName}</td>

                <td>{history.newStatusName}</td>

                <td>
                  {history.changedAt
                      ? new Date(history.changedAt).toLocaleString()
                      : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Assignment History</h2>

        <table className="lead-table">

          <thead>
          <tr>
            <th>COUNSELLOR</th>
            <th>Assigned At</th>
            <th>Remarks</th>
          </tr>
          </thead>

          <tbody>

          {assignmentHistory.map((item) => (

              <tr key={item.assignmentId}>

                <td>
                  {item.employeeName || "Unassigned"}
                </td>

                <td>
                  {item.assignedAt
                      ? new Date(
                          item.assignedAt
                      ).toLocaleString()
                      : "-"}
                </td>

                <td>
                  {item.remarks || "-"}
                </td>

              </tr>

          ))}

          </tbody>

        </table>
        <h2>Reminder Schedule</h2>

        <table className="lead-table">
          <thead>
            <tr>
              <th>Reminder Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {reminders?.map((reminder) => (
              <tr key={reminder.reminderId}>
                <td>
                  {reminder.reminderTime
                      ? new Date(reminder.reminderTime).toLocaleString()
                      : "-"}
                </td>
                <td>{reminder.reminderType}</td>

                <td>{reminder.completed ? "Completed" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================================== */}
      {/* FOLLOWUP MODAL */}
      {/* ===================================== */}

      {openFollowup && (
        <FollowupModal
          onClose={() => setOpenFollowup(false)}
          onSubmit={handleFollowupSubmit}
        />
      )}
    </div>
  );
}

export default LeadDetailPage;