import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  filterLeadsByStatus,
  filterMyLeadsByStatus,
} from "../services/leadService";

import PageTitle from "../../shared/components/PageTitle";

import "../styles/lead.css";

function ConvertedLeadsPage() {

  const navigate = useNavigate();

  // =====================================================
  // LEADS
  // =====================================================

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const userRole =
        localStorage.getItem("role");

    fetchConvertedLeads(userRole);

  }, []);


  // =====================================================
  // FETCH CONVERTED LEADS
  // =====================================================

  const fetchConvertedLeads = async (
      userRole
  ) => {

    setLoading(true);

    setError("");


    try {

      let data = [];


      // =================================================
      // ADMIN
      // =================================================

      if (userRole === "ADMIN") {

        data =
            await filterLeadsByStatus(
                "CONVERTED"
            );

      }

          // =================================================
          // COUNSELLOR
      // =================================================

      else {

        data =
            await filterMyLeadsByStatus(
                "CONVERTED"
            );
      }


      console.log(
          "========== CONVERTED LEADS =========="
      );

      console.log(
          "Converted Leads:",
          data
      );


      setLeads(
          Array.isArray(data)
              ? data
              : []
      );


    } catch (err) {

      console.error(
          "Failed to fetch converted leads:",
          err
      );

      setError(
          "Failed to load converted leads"
      );

      setLeads([]);

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

        <div className="converted-leads-page">

          <h2>
            Loading Converted Leads...
          </h2>

        </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

        <div className="converted-leads-page">

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

      <div className="converted-leads-page">

        <div className="converted-card-wrapper">


          {/* =================================================
            HEADER
        ================================================= */}

          <div className="card-header">

            <PageTitle
                title="Converted Leads"
            />


            <button
                type="button"
                className="back-btn"
                onClick={() => navigate(-1)}
            >
              ← Back
            </button>

          </div>


          {/* =================================================
            RESULT COUNT
        ================================================= */}

          <p className="result-count">

            Total Converted Leads :{" "}
            {leads.length}

          </p>


          {/* =================================================
            EMPTY STATE
        ================================================= */}

          {leads.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No Converted Leads Found
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

                    <th>Status</th>

                    <th>Priority</th>

                    <th>Counsellor</th>

                    <th>Created</th>

                  </tr>

                  </thead>


                  <tbody>

                  {leads.map(
                      (lead) => (

                          <tr
                              key={
                                  lead.personId ||
                                  lead.id
                              }
                          >


                            {/* =================================================
                        ID
                    ================================================= */}

                            <td>

                              {lead.personId ||
                                  lead.id ||
                                  "-"}

                            </td>


                            {/* =================================================
                        NAME
                    ================================================= */}

                            <td>

                              {[
                                lead.firstName,
                                lead.middleName,
                                lead.lastName
                              ]
                                  .filter(Boolean)
                                  .join(" ") || "-"}

                            </td>


                            {/* =================================================
                        EMAIL
                    ================================================= */}

                            <td>

                              {lead.email || "-"}

                            </td>


                            {/* =================================================
                        PHONE
                    ================================================= */}

                            <td>

                              {lead.phone || "-"}

                            </td>


                            {/* =================================================
                        STATUS
                    ================================================= */}

                            <td>

                      <span
                          className="status-badge converted"
                      >

                        {lead.leadStatus ||
                            "CONVERTED"}

                      </span>

                            </td>


                            {/* =================================================
                        PRIORITY
                    ================================================= */}

                            <td>

                              {lead.leadPriority ||
                                  "-"}

                            </td>


                            {/* =================================================
                        COUNSELLOR
                    ================================================= */}

                            <td>

                              {lead.assignedCOUNSELLORName ||
                                  lead.assignedEmployeeName ||
                                  "-"}

                            </td>


                            {/* =================================================
                        CREATED
                    ================================================= */}

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