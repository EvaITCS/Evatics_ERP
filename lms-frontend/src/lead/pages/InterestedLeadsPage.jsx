import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../shared/components/PageTitle";
import SearchBar from "../components/SearchBar";
import { getCounsellors } from "../../user/service/userService";
import {
  filterInterestedLeads,
  filterMyLeadsByStatus,
} from "../services/leadService";

import "../styles/lead.css";

function InterestedLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [role, setRole] = useState("");
  const [counsellors, setCounsellors] = useState([]);

  // Filter inputs
  const [search, setSearch] = useState("");
  const [counsellorFilter, setCounsellorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Applied filters
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCounsellor, setAppliedCounsellor] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    setRole(userRole);

    if (userRole === "ADMIN") {
      loadCounsellors();
    }

    fetchInterestedLeads(userRole);
  }, []);

  const loadCounsellors = async () => {
    try {
      const data = await getCounsellors();
      setCounsellors(data || []);
    } catch (err) {
      console.error("Failed to load counsellors:", err);
    }
  };

  const fetchInterestedLeads = async (userRole = role) => {
    setLoading(true);
    setError("");

    try {
      let data = [];

      if (userRole === "ADMIN") {
        data = await filterInterestedLeads({
          keyword: search || null,
          counsellorPersonId: counsellorFilter || null,
          fromDate: fromDate || null,
          toDate: toDate || null,
        });
      } else {
        data = await filterMyLeadsByStatus("INTERESTED");
      }

      console.log("INTERESTED LEADS =", data);

      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load Interested Leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * SEARCH BUTTON
   */
  const handleSearch = () => {
    setAppliedSearch(search.trim());
    setAppliedCounsellor(counsellorFilter);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);

    /*
     * ADMIN already supports backend filtering,
     * so reload the data with the new filters.
     */
    if (role === "ADMIN") {
      fetchInterestedLeads(role);
    }
  };

  /*
   * CLEAR FILTERS
   */
  const handleClearFilters = () => {
    setSearch("");
    setCounsellorFilter("");
    setFromDate("");
    setToDate("");

    setAppliedSearch("");
    setAppliedCounsellor("");
    setAppliedFromDate("");
    setAppliedToDate("");

    /*
     * Reload ADMIN data without filters.
     */
    if (role === "ADMIN") {
      setTimeout(() => {
        filterInterestedLeads({
          keyword: null,
          counsellorPersonId: null,
          fromDate: null,
          toDate: null,
        })
            .then((data) => {
              setLeads(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
              console.error(err);
              setError("Failed to load Interested Leads");
            });
      }, 0);
    }
  };

  /*
   * FRONTEND FILTERING
   *
   * Applied for BOTH ADMIN and COUNSELLOR.
   *
   * This guarantees that the displayed table
   * never shows records outside the selected filters.
   */
  const filteredLeads = useMemo(() => {
    const keyword = appliedSearch.toLowerCase();

    return leads.filter((lead) => {

      /*
       * SEARCH
       */
      if (keyword) {
        const fullName = [
          lead.firstName,
          lead.middleName,
          lead.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const email = (lead.email || "").toLowerCase();
        const phone = (lead.phone || "").toLowerCase();
        const status = (lead.leadStatus || "").toLowerCase();

        const matchesSearch =
            fullName.includes(keyword) ||
            email.includes(keyword) ||
            phone.includes(keyword) ||
            status.includes(keyword);

        if (!matchesSearch) {
          return false;
        }
      }

      /*
       * COUNSELLOR FILTER
       *
       * Only relevant for ADMIN.
       */
      if (role === "ADMIN" && appliedCounsellor) {
        const leadCounsellorId =
            lead.assignedCounsellorPersonId ||
            lead.assignedCounsellorId ||
            lead.counsellorPersonId ||
            lead.counsellorId;

        if (
            String(leadCounsellorId || "") !==
            String(appliedCounsellor)
        ) {
          return false;
        }
      }

      /*
       * FROM DATE
       */
      if (appliedFromDate) {
        if (!lead.createdAt) {
          return false;
        }

        const leadDate = new Date(lead.createdAt);
        const fromDate = new Date(
            `${appliedFromDate}T00:00:00`
        );

        if (leadDate < fromDate) {
          return false;
        }
      }

      /*
       * TO DATE
       */
      if (appliedToDate) {
        if (!lead.createdAt) {
          return false;
        }

        const leadDate = new Date(lead.createdAt);
        const toDate = new Date(
            `${appliedToDate}T23:59:59`
        );

        if (leadDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    leads,
    role,
    appliedSearch,
    appliedCounsellor,
    appliedFromDate,
    appliedToDate,
  ]);

  /*
   * START APPLICATION
   */
  const handleStartApplication = (lead) => {
    if (role === "ADMIN") {
      navigate(`/admin/student-application/${lead.personId}`);
    } else {
      navigate(`/counsellor/student-application/${lead.personId}`);
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
        <div className="interested-leads-page">
          <h2>Loading Interested Leads...</h2>
        </div>
    );
  }

  /*
   * ERROR
   */
  if (error) {
    return (
        <div className="interested-leads-page">
          <h2>{error}</h2>
        </div>
    );
  }

  return (
      <div className="interested-leads-page">

        <div className="interested-card-wrapper">

          {/* HEADER */}
          <div className="card-header">

            <PageTitle title="Interested Leads" />

            <button
                type="button"
                className="back-btn"
                onClick={() => navigate(-1)}
            >
              ← Back
            </button>

          </div>

          {/* FILTERS */}
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
                        setCounsellorFilter(e.target.value)
                    }
                >
                  <option value="">
                    All Counsellors
                  </option>

                  {counsellors.map((counsellor) => (
                      <option
                          key={counsellor.personId}
                          value={counsellor.personId}
                      >
                        {counsellor.fullName}
                      </option>
                  ))}
                </select>
            )}

            {/* FROM DATE */}
            <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                    setFromDate(e.target.value)
                }
            />

            {/* TO DATE */}
            <input
                type="date"
                value={toDate}
                onChange={(e) =>
                    setToDate(e.target.value)
                }
            />

            {/* SEARCH BUTTON */}
            <button
                type="button"
                className="primary-btn"
                onClick={handleSearch}
            >
              Search
            </button>

            {/* CLEAR BUTTON */}
            <button
                type="button"
                className="secondary-btn"
                onClick={handleClearFilters}
            >
              Clear
            </button>

          </div>

          {/* RESULT COUNT */}
          <p className="result-count">
            Total Results : {filteredLeads.length}
          </p>

          {/* EMPTY STATE */}
          {filteredLeads.length === 0 ? (

              <div className="empty-state">
                <h3>
                  No Interested Leads Found
                </h3>
              </div>

          ) : (

              /* TABLE */
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
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                  </thead>

                  <tbody>

                  {filteredLeads.map((lead) => (

                      <tr
                          key={lead.personId || lead.id}
                      >

                        {/* ID */}
                        <td>
                          {lead.personId || lead.id || "-"}
                        </td>

                        {/* NAME */}
                        <td>
                          {[
                            lead.firstName,
                            lead.middleName,
                            lead.lastName,
                          ]
                              .filter(Boolean)
                              .join(" ") || "-"}
                        </td>

                        {/* EMAIL */}
                        <td>
                          {lead.email || "-"}
                        </td>

                        {/* PHONE */}
                        <td>
                          {lead.phone || "-"}
                        </td>

                        {/* COUNSELLOR */}
                        <td>
                          {lead.assignedEmployeeName ||
                              lead.assignedCOUNSELLORName ||
                              "Unassigned"}
                        </td>

                        {/* STATUS */}
                        <td>
                      <span className="status-badge interested">
                        {lead.leadStatus || "INTERESTED"}
                      </span>
                        </td>

                        {/* CREATED */}
                        <td>
                          {lead.createdAt
                              ? new Date(
                                  lead.createdAt
                              ).toLocaleDateString()
                              : "-"}
                        </td>

                        {/* ACTION */}
                        <td>
                          <button
                              type="button"
                              className="start-app-btn"
                              onClick={() =>
                                  handleStartApplication(lead)
                              }
                          >
                            Start Application
                          </button>
                        </td>

                      </tr>

                  ))}

                  </tbody>

                </table>

              </div>

          )}

        </div>

      </div>
  );
}

export default InterestedLeadsPage;