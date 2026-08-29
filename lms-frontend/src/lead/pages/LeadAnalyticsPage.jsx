import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../shared/components/PageTitle";

import { getLeadAnalytics } from "../services/dashboardService";
import { filterLeads } from "../services/leadService";
import { getCounsellors } from "../../user/service/userService";

import "../styles/lead.css";


function LeadAnalyticsPage() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // IMPORTANT:
  // Lead system uses PERSON ID.
  const loggedInPersonId =
      localStorage.getItem("personId");


  // =====================================
  // STATE
  // =====================================

  const [fromDate, setFromDate] =
      useState("");

  const [toDate, setToDate] =
      useState("");

  const [status, setStatus] =
      useState("");

  const [priority, setPriority] =
      useState("");

  const [summary, setSummary] =
      useState(null);

  const [leads, setLeads] =
      useState([]);

  const [count, setCount] =
      useState(0);

  const [counsellors, setCounsellors] =
      useState([]);

  const [selectedCounsellor, setSelectedCounsellor] =
      useState("");

  const [loading, setLoading] =
      useState(false);


  // =====================================
  // LOAD COUNSELLORS
  // =====================================

  const loadCounsellors = async () => {

    try {

      const data =
          await getCounsellors();

      console.log(
          "========== COUNSELLORS =========="
      );

      console.log(
          "Counsellor API:",
          data
      );


      setCounsellors(
          Array.isArray(data)
              ? data
              : []
      );

    } catch (err) {

      console.error(
          "Failed to load counsellors:",
          err
      );

      setCounsellors([]);

    }

  };


  // =====================================
  // GET FULL COUNSELLOR NAME
  // =====================================

  const getCounsellorName = (counsellor) => {

    // ---------------------------------
    // FIRST: if backend already gives
    // fullName, use it.
    // ---------------------------------

    if (
        counsellor.fullName &&
        counsellor.fullName.trim()
    ) {

      return counsellor.fullName.trim();

    }


    // ---------------------------------
    // OTHERWISE BUILD FULL NAME
    // ---------------------------------

    const nameParts = [

      counsellor.firstName,

      counsellor.middleName,

      counsellor.lastName

    ].filter(
        part =>
            part !== null &&
            part !== undefined &&
            String(part).trim() !== ""
    );


    const fullName =
        nameParts
            .map(
                part => String(part).trim()
            )
            .join(" ");


    if (fullName) {

      return fullName;

    }


    // ---------------------------------
    // OTHER POSSIBLE BACKEND FIELDS
    // ---------------------------------

    if (
        counsellor.counsellorName &&
        counsellor.counsellorName.trim()
    ) {

      return counsellor.counsellorName.trim();

    }


    // ---------------------------------
    // LAST FALLBACK
    // ---------------------------------

    return "Counsellor";

  };


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    if (role === "ADMIN") {

      loadCounsellors();

    }

  }, [role]);


  // =====================================
  // SEARCH / LOAD ANALYTICS
  // =====================================

  const loadAnalytics = async () => {

    const hasFilter =
        fromDate ||
        toDate ||
        status ||
        priority ||
        selectedCounsellor;


    if (!hasFilter) {

      setSummary(null);
      setLeads([]);
      setCount(0);

      return;

    }


    try {

      setLoading(true);


      // =====================================
      // COUNSELLOR PERSON ID
      // =====================================

      const counsellorPersonId =
          role === "COUNSELLOR"
              ? loggedInPersonId
              : selectedCounsellor || null;


      console.log(
          "========== ANALYTICS FILTER =========="
      );

      console.log(
          "Role:",
          role
      );

      console.log(
          "Counsellor Person ID:",
          counsellorPersonId
      );

      console.log(
          "From:",
          fromDate
      );

      console.log(
          "To:",
          toDate
      );

      console.log(
          "Status:",
          status
      );

      console.log(
          "Priority:",
          priority
      );


      // =====================================
      // SUMMARY
      // =====================================

      const summaryData =
          await getLeadAnalytics(
              fromDate,
              toDate,
              counsellorPersonId
          );


      setSummary(
          summaryData
      );


      // =====================================
      // LEADS
      // =====================================

      const leadData =
          await filterLeads({

            counsellorPersonId,

            keyword: null,

            fromDate:
                fromDate || null,

            toDate:
                toDate || null,

            status:
                status || null,

            priority:
                priority || null

          });


      console.log(
          "========== ANALYTICS LEADS =========="
      );

      console.log(
          "Lead Data:",
          leadData
      );


      setLeads(
          Array.isArray(leadData)
              ? leadData
              : []
      );


      setCount(
          Array.isArray(leadData)
              ? leadData.length
              : 0
      );


    } catch (err) {

      console.error(
          "Failed to load analytics:",
          err
      );

      setSummary(null);
      setLeads([]);
      setCount(0);

    } finally {

      setLoading(false);

    }

  };


  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters = () => {

    setFromDate("");
    setToDate("");
    setStatus("");
    setPriority("");
    setSelectedCounsellor("");

    setSummary(null);
    setLeads([]);
    setCount(0);

  };


  // =====================================
  // UI
  // =====================================

  return (

      <div className="analytics-page">

        <div className="analytics-card-wrapper">


          {/* =====================================
                        HEADER
                    ===================================== */}

          <div className="card-header">

            <PageTitle
                title="Lead Analytics"
            />

            <button
                type="button"
                className="back-btn"
                onClick={() => navigate(-1)}
            >
              ← Back
            </button>

          </div>


          {/* =====================================
                        FILTERS
                    ===================================== */}

          <div className="lead-filters analytics-filters">


            {/* FROM DATE */}

            <div className="filter-item">

              <label>
                From Date
              </label>

              <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                      setFromDate(
                          e.target.value
                      )
                  }
              />

            </div>


            {/* TO DATE */}

            <div className="filter-item">

              <label>
                To Date
              </label>

              <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                      setToDate(
                          e.target.value
                      )
                  }
              />

            </div>


            {/* =====================================
                            COUNSELLOR
                        ===================================== */}

            {role === "ADMIN" && (

                <div className="filter-item">

                  <label>
                    Counsellor
                  </label>

                  <select
                      value={
                        selectedCounsellor
                      }
                      onChange={(e) =>
                          setSelectedCounsellor(
                              e.target.value
                          )
                      }
                  >

                    <option value="">
                      All Counsellors
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

                              {getCounsellorName(
                                  counsellor
                              )}

                            </option>

                        )
                    )}

                  </select>

                </div>

            )}


            {/* STATUS */}

            <div className="filter-item">

              <label>
                Status
              </label>

              <select
                  value={status}
                  onChange={(e) =>
                      setStatus(
                          e.target.value
                      )
                  }
              >

                <option value="">
                  All Status
                </option>

                <option value="NEW">
                  NEW
                </option>

                <option value="CONTACTED">
                  CONTACTED
                </option>

                <option value="INTERESTED">
                  INTERESTED
                </option>

                <option value="CALLBACK">
                  CALLBACK
                </option>

                <option value="NO_RESPONSE">
                  NO RESPONSE
                </option>

                <option value="NOT_INTERESTED">
                  NOT INTERESTED
                </option>

                <option value="CONVERTED">
                  CONVERTED
                </option>


              </select>

            </div>


            {/* PRIORITY */}

            <div className="filter-item">

              <label>
                Priority
              </label>

              <select
                  value={priority}
                  onChange={(e) =>
                      setPriority(
                          e.target.value
                      )
                  }
              >

                <option value="">
                  All Priority
                </option>

                <option value="HOT">
                  HOT
                </option>

                <option value="WARM">
                  WARM
                </option>

                <option value="COLD">
                  COLD
                </option>

              </select>

            </div>


            {/* SEARCH */}

            <div className="filter-item button-item">

              <button
                  type="button"
                  className="primary-btn"
                  onClick={loadAnalytics}
                  disabled={loading}
              >

                {loading
                    ? "Searching..."
                    : "Search"
                }

              </button>

            </div>


            {/* CLEAR */}

            <div className="filter-item button-item">

              <button
                  type="button"
                  className="clear-btn"
                  onClick={clearFilters}
                  disabled={loading}
              >
                Clear
              </button>

            </div>

          </div>


          {/* =====================================
                        SUMMARY
                    ===================================== */}

          {summary && (

              <div className="summary-section">

                <h3 className="summary-heading">
                  Lead Summary Overview
                </h3>


                <div className="summary-grid">


                  <div className="analytics-card card-total">

                    <p>
                      Total Leads
                    </p>

                    <h2>
                      {summary.totalLeads || 0}
                    </h2>

                  </div>


                  <div className="analytics-card card-new">

                    <p>
                      New Leads
                    </p>

                    <h2>
                      {summary.newLeads || 0}
                    </h2>

                  </div>


                  <div className="analytics-card card-interested">

                    <p>
                      Interested
                    </p>

                    <h2>
                      {summary.interestedLeads || 0}
                    </h2>

                  </div>


                  <div className="analytics-card card-converted">

                    <p>
                      Converted
                    </p>

                    <h2>
                      {summary.convertedLeads || 0}
                    </h2>

                  </div>


                  <div className="analytics-card card-callback">

                    <p>
                      Callback
                    </p>

                    <h2>
                      {summary.callbackLeads || 0}
                    </h2>

                  </div>

                  {/* =====================================
              NOT INTERESTED
          ===================================== */}

                  <div className="analytics-card card-not-interested">

                    <p>
                      Not Interested
                    </p>

                    <h2>
                      {summary.notInterestedLeads || 0}
                    </h2>

                  </div>


                </div>

              </div>

          )}


          {/* =====================================
                        RESULT COUNT
                    ===================================== */}

          {count > 0 && (

              <p className="result-count">

                Leads Found :
                {" "}
                <strong>
                  {count}
                </strong>

              </p>

          )}


          {/* =====================================
                        LEAD TABLE
                    ===================================== */}

          {loading ? (

              <div className="empty-state">
                Loading Leads...
              </div>

          ) : leads.length === 0 ? (

              <div className="empty-state">

                Please select filters
                and click Search.

              </div>

          ) : (

              <div className="table-wrapper">

                <table className="lead-table">

                  <thead>

                  <tr>

                    <th>
                      First Name
                    </th>

                    <th>
                      Last Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Counsellor
                    </th>

                  </tr>

                  </thead>


                  <tbody>

                  {leads.map(
                      (lead) => (

                          <tr
                              key={
                                lead.personId
                              }
                          >

                            <td>
                              {
                                  lead.firstName
                                  || "-"
                              }
                            </td>

                            <td>
                              {
                                  lead.lastName
                                  || "-"
                              }
                            </td>

                            <td>
                              {
                                  lead.email
                                  || "-"
                              }
                            </td>

                            <td>
                              {
                                  lead.phone
                                  || "-"
                              }
                            </td>

                            <td>

                              {
                                  lead.assignedEmployeeName
                                  || (
                                      <span className="text-muted">
                                                        Unassigned
                                                    </span>
                                  )
                              }

                            </td>

                          </tr>

                      )
                  )}

                  </tbody>

                </table>

              </div>

          )}

        </div>

      </div>

  );
}

export default LeadAnalyticsPage;