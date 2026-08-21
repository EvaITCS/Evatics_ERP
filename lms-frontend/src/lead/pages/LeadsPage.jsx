import { useEffect, useState } from "react";

import {
  getAllLeads,
  filterLeads
} from "../services/leadService";

import { getCounsellors } from "../../user/service/userService";

import LeadTable from "../components/LeadTable";
import PageTitle from "../../shared/components/PageTitle";


function LeadsPage() {

  // =====================================
  // STATE
  // =====================================

  const [counsellors, setCounsellors] = useState([]);
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================
  // FILTER STATE
  // =====================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [counsellorFilter, setCounsellorFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadCounsellors();
    loadAllLeads();

  }, []);


  // =====================================
  // LOAD COUNSELLORS
  // =====================================

  const loadCounsellors = async () => {

    try {

      const data = await getCounsellors();

      console.log("COUNSELLORS:", data);

      setCounsellors(
          Array.isArray(data) ? data : []
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
  // LOAD ALL ACTIVE LEADS
  // =====================================

  const loadAllLeads = async () => {

    setLoading(true);
    setError("");

    try {

      const data = await getAllLeads();

      console.log("ALL ACTIVE LEADS:", data);
      console.log(
          "TOTAL ACTIVE LEADS:",
          Array.isArray(data) ? data.length : 0
      );

      setLeads(
          Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.error(
          "Failed to load all leads:",
          err
      );

      setLeads([]);

      setError(
          "Failed to load leads"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // APPLY FILTER
  // =====================================

  const handleSearch = async () => {

    setLoading(true);
    setError("");

    try {

      const filters = {

        // IMPORTANT:
        // This is CURRENT ASSIGNED COUNSELLOR
        // personId, NOT userId.
        counsellorPersonId:
            counsellorFilter
                ? Number(counsellorFilter)
                : null,

        keyword:
            search.trim()
                ? search.trim()
                : null,

        status:
            statusFilter
                ? statusFilter
                : null,

        priority:
            priorityFilter
                ? priorityFilter
                : null,

        fromDate:
            fromDate
                ? fromDate
                : null,

        toDate:
            toDate
                ? toDate
                : null
      };


      console.log(
          "========== LEAD FILTER =========="
      );

      console.log(
          "Filter Request:",
          filters
      );


      const data = await filterLeads(filters);


      console.log(
          "Filtered Leads:",
          data
      );

      console.log(
          "Filtered Lead Count:",
          Array.isArray(data)
              ? data.length
              : 0
      );


      setLeads(
          Array.isArray(data)
              ? data
              : []
      );

    } catch (err) {

      console.error(
          "Failed to filter leads:",
          err
      );

      setLeads([]);

      setError(
          "Failed to filter leads"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // CLEAR FILTERS
  // =====================================

  const handleClearFilters = () => {

    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCounsellorFilter("");
    setFromDate("");
    setToDate("");

    // Show all active leads again
    loadAllLeads();

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

        <div className="leads-page">

          <div className="page-header">

            <PageTitle
                title="All Leads"
            />

          </div>

          <div className="empty-state">

            Loading Leads...

          </div>

        </div>

    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (

        <div className="leads-page">

          <div className="page-header">

            <PageTitle
                title="All Leads"
            />

          </div>

          <div className="empty-state">

            <p>{error}</p>

            <button
                type="button"
                className="search-btn"
                onClick={loadAllLeads}
            >
              Retry
            </button>

          </div>

        </div>

    );

  }


  // =====================================
  // UI
  // =====================================

  return (

      <div className="leads-page">


        {/* =====================================
          PAGE TITLE
      ===================================== */}

        <div className="page-header">

          <PageTitle
              title="All Leads"
          />

        </div>


        {/* =====================================
          FILTERS
      ===================================== */}

        <div className="lead-filters">


          {/* =====================================
            SEARCH
        ===================================== */}

          <input
              type="text"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(e) =>
                  setSearch(e.target.value)
              }
          />


          {/* =====================================
            COUNSELLOR
        ===================================== */}

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
                        key={counsellor.personId}
                        value={counsellor.personId}
                    >

                      {
                          counsellor.fullName ||
                          counsellor.counsellorName ||
                          `${counsellor.firstName || ""} ${counsellor.lastName || ""}`
                              .trim() ||
                          `Counsellor ${counsellor.personId}`
                      }

                    </option>

                )
            )}

          </select>


          {/* =====================================
            STATUS
        ===================================== */}

          <select
              value={statusFilter}
              onChange={(e) =>
                  setStatusFilter(
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

            <option value="RE_ENGAGEMENT">
              RE-ENGAGEMENT
            </option>

          </select>


          {/* =====================================
            PRIORITY
        ===================================== */}

          <select
              value={priorityFilter}
              onChange={(e) =>
                  setPriorityFilter(
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


          {/* =====================================
            FROM DATE
        ===================================== */}

          <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                  setFromDate(
                      e.target.value
                  )
              }
          />


          {/* =====================================
            TO DATE
        ===================================== */}

          <input
              type="date"
              value={toDate}
              onChange={(e) =>
                  setToDate(
                      e.target.value
                  )
              }
          />


          {/* =====================================
            SEARCH BUTTON
        ===================================== */}

          <button
              type="button"
              className="search-btn"
              onClick={handleSearch}
          >
            Search
          </button>


          {/* =====================================
            CLEAR BUTTON
        ===================================== */}

          <button
              type="button"
              className="clear-btn"
              onClick={handleClearFilters}
          >
            Clear
          </button>

        </div>


        {/* =====================================
          RESULT COUNT
      ===================================== */}

        <p className="result-count">

          Total Results:{" "}

          {leads.length}

        </p>


        {/* =====================================
          TABLE
      ===================================== */}

        {leads.length === 0 ? (

            <div className="empty-state">

              <h3>
                No Leads Found
              </h3>

              <p>
                No active leads match
                the selected filters.
              </p>

            </div>

        ) : (

            <LeadTable
                leads={leads}
            />

        )}

      </div>

  );
}


export default LeadsPage;