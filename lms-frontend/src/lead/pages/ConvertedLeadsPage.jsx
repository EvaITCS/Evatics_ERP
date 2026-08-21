import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  filterLeadsByStatus,
  filterMyLeadsByStatus,
} from "../services/leadService";

import PageTitle from "../../shared/components/PageTitle";
import SearchBar from "../components/SearchBar";
import { getCounsellors } from "../../user/service/userService";

import "../styles/lead.css";

function ConvertedLeadsPage() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [role, setRole] = useState("");
  const [counsellors, setCounsellors] = useState([]);

  // Input values
  const [search, setSearch] = useState("");
  const [counsellorFilter, setCounsellorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Applied filter values
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCounsellor, setAppliedCounsellor] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");

    setRole(userRole);

    if (userRole === "ADMIN") {
      loadCounsellors();
    }

    fetchConvertedLeads(userRole);
  }, []);

  const loadCounsellors = async () => {
    try {
      const data = await getCounsellors();
      setCounsellors(data || []);
    } catch (err) {
      console.error("Failed to load counsellors:", err);
    }
  };

  const fetchConvertedLeads = async (userRole = role) => {
    setLoading(true);
    setError("");

    try {
      let data = [];

      if (userRole === "ADMIN") {
        data = await filterLeadsByStatus("CONVERTED");
      } else {
        data = await filterMyLeadsByStatus("CONVERTED");
      }

      console.log("CONVERTED LEADS =", data);

      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch converted leads:", err);
      setError("Failed to load converted leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * SEARCH BUTTON
   *
   * We apply the current filter values here.
   */
  const handleSearch = () => {
    setAppliedSearch(search.trim());
    setAppliedCounsellor(counsellorFilter);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
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
  };

  /*
   * FILTER CONVERTED LEADS
   *
   * This filtering is done for BOTH:
   * ADMIN
   * COUNSELLOR
   */
  const filteredLeads = useMemo(() => {
    const keyword = appliedSearch.toLowerCase();

    return leads.filter((lead) => {
      /*
       * 1. SEARCH FILTER
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

        const priority = (lead.leadPriority || "").toLowerCase();

        const counsellorName = (
            lead.assignedCOUNSELLORName ||
            lead.assignedEmployeeName ||
            ""
        ).toLowerCase();

        const matchesSearch =
            fullName.includes(keyword) ||
            email.includes(keyword) ||
            phone.includes(keyword) ||
            status.includes(keyword) ||
            priority.includes(keyword) ||
            counsellorName.includes(keyword);

        if (!matchesSearch) {
          return false;
        }
      }

      /*
       * 2. COUNSELLOR FILTER
       *
       * Only ADMIN can use this filter.
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
       * 3. FROM DATE FILTER
       */
      if (appliedFromDate) {
        if (!lead.createdAt) {
          return false;
        }

        const leadDate = new Date(lead.createdAt);
        const fromDateObj = new Date(`${appliedFromDate}T00:00:00`);

        if (leadDate < fromDateObj) {
          return false;
        }
      }

      /*
       * 4. TO DATE FILTER
       */
      if (appliedToDate) {
        if (!lead.createdAt) {
          return false;
        }

        const leadDate = new Date(lead.createdAt);
        const toDateObj = new Date(`${appliedToDate}T23:59:59`);

        if (leadDate > toDateObj) {
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

  if (loading) {
    return (
        <div className="converted-leads-page">
          <h2>Loading Converted Leads...</h2>
        </div>
    );
  }

  if (error) {
    return (
        <div className="converted-leads-page">
          <h2>{error}</h2>
        </div>
    );
  }

  return (
      <div className="converted-leads-page">
        <div className="converted-card-wrapper">

          {/* HEADER */}
          <div className="card-header">
            <PageTitle title="Converted Leads" />

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

            {/* SEARCH */}
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
                  <option value="">All Counsellors</option>

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
                onChange={(e) => setFromDate(e.target.value)}
            />

            {/* TO DATE */}
            <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
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
                <h3>No Converted Leads Found</h3>
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
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Counsellor</th>
                    <th>Created</th>
                  </tr>
                  </thead>

                  <tbody>
                  {filteredLeads.map((lead) => (
                      <tr key={lead.personId || lead.id}>

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

                        {/* STATUS */}
                        <td>
                      <span className="status-badge converted">
                        {lead.leadStatus || "CONVERTED"}
                      </span>
                        </td>

                        {/* PRIORITY */}
                        <td>
                          {lead.leadPriority || "-"}
                        </td>

                        {/* COUNSELLOR */}
                        <td>
                          {lead.assignedCOUNSELLORName ||
                              lead.assignedEmployeeName ||
                              "-"}
                        </td>

                        {/* CREATED */}
                        <td>
                          {lead.createdAt
                              ? new Date(
                                  lead.createdAt
                              ).toLocaleDateString()
                              : "-"}
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

export default ConvertedLeadsPage;