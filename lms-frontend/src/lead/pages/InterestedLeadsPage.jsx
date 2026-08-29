import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../shared/components/PageTitle";
import SearchBar from "../components/SearchBar";
import { getCounsellors } from "../../user/service/userService";

import {
  filterInterestedLeads,
  filterMyInterestedLeads,
} from "../services/leadService";

import "../styles/lead.css";

function InterestedLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [role, setRole] = useState("");
  const [counsellors, setCounsellors] = useState([]);

  // =====================================================
  // FILTER INPUTS
  // =====================================================

  const [search, setSearch] = useState("");
  const [counsellorFilter, setCounsellorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // =====================================================
  // APPLIED FILTERS
  // =====================================================

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCounsellor, setAppliedCounsellor] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    setRole(userRole);

    if (userRole === "ADMIN") {
      loadCounsellors();
    }

    fetchInterestedLeads(
        userRole,
        "",
        "",
        "",
        ""
    );
  }, []);

  // =====================================================
  // LOAD COUNSELLORS
  // =====================================================

  const loadCounsellors = async () => {
    try {
      const data = await getCounsellors();

      console.log("COUNSELLORS:", data);

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

  // =====================================================
  // LOAD / FILTER INTERESTED LEADS
  // =====================================================

  const fetchInterestedLeads = async (
      userRole,
      searchValue = "",
      counsellorValue = "",
      fromDateValue = "",
      toDateValue = ""
  ) => {
    setLoading(true);
    setError("");

    try {
      let data = [];

      // =================================================
      // ADMIN
      // =================================================

      if (userRole === "ADMIN") {
        data = await filterInterestedLeads({
          keyword:
              searchValue?.trim() || null,

          counsellorPersonId:
              counsellorValue
                  ? Number(counsellorValue)
                  : null,

          fromDate:
              fromDateValue || null,

          toDate:
              toDateValue || null,
        });
      }

          // =================================================
          // COUNSELLOR
      // =================================================

      else {
        data = await filterMyInterestedLeads({
          keyword:
              searchValue?.trim() || null,

          fromDate:
              fromDateValue || null,

          toDate:
              toDateValue || null,
        });
      }

      console.log(
          "INTERESTED LEADS =",
          data
      );

      setLeads(
          Array.isArray(data)
              ? data
              : []
      );

    } catch (err) {
      console.error(
          "Failed to load Interested Leads:",
          err
      );

      setError(
          "Failed to load Interested Leads"
      );

      setLeads([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH BUTTON
  // =====================================================

  const handleSearch = () => {
    const searchValue =
        search.trim();

    const counsellorValue =
        counsellorFilter;

    const fromDateValue =
        fromDate;

    const toDateValue =
        toDate;

    // Apply filters
    setAppliedSearch(
        searchValue
    );

    setAppliedCounsellor(
        counsellorValue
    );

    setAppliedFromDate(
        fromDateValue
    );

    setAppliedToDate(
        toDateValue
    );

    // Fetch filtered data
    fetchInterestedLeads(
        role,
        searchValue,
        counsellorValue,
        fromDateValue,
        toDateValue
    );
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const handleClearFilters = () => {
    setSearch("");
    setCounsellorFilter("");
    setFromDate("");
    setToDate("");

    setAppliedSearch("");
    setAppliedCounsellor("");
    setAppliedFromDate("");
    setAppliedToDate("");

    fetchInterestedLeads(
        role,
        "",
        "",
        "",
        ""
    );
  };

  // =====================================================
  // FRONTEND FILTERING
  // =====================================================

  const filteredLeads = useMemo(() => {
    const keyword =
        appliedSearch
            .toLowerCase();

    return leads.filter(
        (lead) => {

          // =============================================
          // SEARCH
          // =============================================

          if (keyword) {

            const fullName = [
              lead.firstName,
              lead.middleName,
              lead.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const email =
                (
                    lead.email || ""
                ).toLowerCase();

            const phone =
                (
                    lead.phone || ""
                ).toLowerCase();

            const status =
                (
                    lead.leadStatus || ""
                ).toLowerCase();

            const matchesSearch =
                fullName.includes(keyword) ||
                email.includes(keyword) ||
                phone.includes(keyword) ||
                status.includes(keyword);

            if (!matchesSearch) {
              return false;
            }
          }

          // =============================================
          // COUNSELLOR FILTER
          // =============================================

          if (
              role === "ADMIN" &&
              appliedCounsellor
          ) {

            const leadCounsellorId =
                lead.assignedCounsellorPersonId ||
                lead.assignedCounsellorId ||
                lead.counsellorPersonId ||
                lead.counsellorId ||
                lead.employeePersonId;

            if (
                String(
                    leadCounsellorId || ""
                ) !==
                String(
                    appliedCounsellor
                )
            ) {
              return false;
            }
          }

          // =============================================
          // ACTION PERFORMED DATE
          // FROM DATE
          // =============================================

          if (appliedFromDate) {

            if (
                !lead.actionPerformedAt
            ) {
              return false;
            }

            const actionDate =
                new Date(
                    lead.actionPerformedAt
                );

            const fromDate =
                new Date(
                    `${appliedFromDate}T00:00:00`
                );

            if (
                actionDate < fromDate
            ) {
              return false;
            }
          }

          // =============================================
          // ACTION PERFORMED DATE
          // TO DATE
          // =============================================

          if (appliedToDate) {

            if (
                !lead.actionPerformedAt
            ) {
              return false;
            }

            const actionDate =
                new Date(
                    lead.actionPerformedAt
                );

            const toDate =
                new Date(
                    `${appliedToDate}T23:59:59`
                );

            if (
                actionDate > toDate
            ) {
              return false;
            }
          }

          return true;
        }
    );

  }, [
    leads,
    role,
    appliedSearch,
    appliedCounsellor,
    appliedFromDate,
    appliedToDate,
  ]);

  // =====================================================
  // START APPLICATION
  // =====================================================

  const handleStartApplication = (
      lead
  ) => {

    if (role === "ADMIN") {

      navigate(
          `/admin/student-application/${lead.personId}`
      );

    } else {

      navigate(
          `/counsellor/student-application/${lead.personId}`
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
        <div className="interested-leads-page">
          <h2>
            Loading Interested Leads...
          </h2>
        </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
        <div className="interested-leads-page">
          <h2>
            {error}
          </h2>
        </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
      <div className="interested-leads-page">

        <div className="interested-card-wrapper">

          {/* =================================================
            HEADER
        ================================================= */}

          <div className="card-header">

            <PageTitle
                title="Interested Leads"
            />

            <button
                type="button"
                className="back-btn"
                onClick={() =>
                    navigate(-1)
                }
            >
              ← Back
            </button>

          </div>

          {/* =================================================
            FILTERS
        ================================================= */}

          <div className="lead-filters">

            {/* SEARCH BAR */}

            <SearchBar
                value={search}
                onSearch={setSearch}
                placeholder="Search by Name, Email or Phone"
            />

            {/* COUNSELLOR */}

            {role === "ADMIN" && (
                <select
                    value={counsellorFilter}
                    onChange={(e) =>
                        setCounsellorFilter(
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

                            {counsellor.fullName ||
                                counsellor.counsellorName ||
                                `${counsellor.firstName || ""} ${counsellor.lastName || ""}`
                                    .trim() ||
                                `Counsellor ${counsellor.personId}`}

                          </option>
                      )
                  )}

                </select>
            )}

            {/* FROM DATE */}

            <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                    setFromDate(
                        e.target.value
                    )
                }
            />

            {/* TO DATE */}

            <input
                type="date"
                value={toDate}
                onChange={(e) =>
                    setToDate(
                        e.target.value
                    )
                }
            />

            {/* SEARCH BUTTON */}

            <button
                type="button"
                className="primary-btn"
                onClick={
                  handleSearch
                }
            >
              Search
            </button>

            {/* CLEAR BUTTON */}

            <button
                type="button"
                className="secondary-btn"
                onClick={
                  handleClearFilters
                }
            >
              Clear
            </button>

          </div>

          {/* =================================================
            RESULT COUNT
        ================================================= */}

          <p className="result-count">
            Total Results :{" "}
            {filteredLeads.length}
          </p>

          {/* =================================================
            EMPTY STATE
        ================================================= */}

          {filteredLeads.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No Interested Leads Found
                </h3>

              </div>

          ) : (

              /* =================================================
                 TABLE
              ================================================= */

              <div className="table-wrapper">

                <table className="lead-table">

                  <thead>

                  <tr>

                    <th>ID</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Counsellor</th>

                    <th>Status</th>

                    <th>
                      Action Performed At
                    </th>

                    <th>Actions</th>

                  </tr>

                  </thead>

                  <tbody>

                  {filteredLeads.map(
                      (lead) => (

                          <tr
                              key={
                                  lead.personId ||
                                  lead.id
                              }
                          >

                            {/* ID */}

                            <td>
                              {
                                  lead.personId ||
                                  lead.id ||
                                  "-"
                              }
                            </td>

                            {/* NAME */}

                            <td>
                              {[
                                    lead.firstName,
                                    lead.middleName,
                                    lead.lastName,
                                  ]
                                      .filter(Boolean)
                                      .join(" ") ||
                                  "-"}
                            </td>

                            {/* EMAIL */}

                            <td>
                              {
                                  lead.email ||
                                  "-"
                              }
                            </td>

                            {/* PHONE */}

                            <td>
                              {
                                  lead.phone ||
                                  "-"
                              }
                            </td>

                            {/* COUNSELLOR */}

                            <td>
                              {
                                  lead.assignedEmployeeName ||
                                  lead.assignedCOUNSELLORName ||
                                  "Unassigned"
                              }
                            </td>

                            {/* STATUS */}

                            <td>

                        <span className="status-badge interested">

                          {
                              lead.leadStatus ||
                              "INTERESTED"
                          }

                        </span>

                            </td>

                            {/* ACTION PERFORMED AT */}

                            <td>

                              {lead.actionPerformedAt
                                  ? new Date(
                                      lead.actionPerformedAt
                                  ).toLocaleString()
                                  : "-"}

                            </td>

                            {/* ACTION */}

                            <td>

                              <button
                                  type="button"
                                  className="start-app-btn"
                                  onClick={() =>
                                      handleStartApplication(
                                          lead
                                      )
                                  }
                              >
                                Start Application
                              </button>

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

export default InterestedLeadsPage;