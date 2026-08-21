import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../shared/styles/sidebar.css";
import api from "../../api/axios";

function LeadTable({ leads }) {

  // =====================================
  // NAVIGATION
  // =====================================

  const navigate = useNavigate();


  // =====================================
  // NEXT FOLLOWUP TIMES
  // =====================================

  const [nextFollowups, setNextFollowups] = useState({});


  // =====================================
  // FETCH REMINDERS FOR ALL LEADS
  // =====================================

  useEffect(() => {

    const fetchNextFollowups = async () => {

      if (!Array.isArray(leads) || leads.length === 0) {

        setNextFollowups({});
        return;

      }

      try {

        const results = await Promise.all(

            leads.map(async (lead) => {

              if (!lead.personId) {

                return {
                  personId: lead.personId,
                  reminderTime: null
                };

              }

              try {

                const response =
                    await api.get(
                        `/api/reminders/lead/${lead.personId}`
                    );

                const reminders =
                    Array.isArray(response.data)
                        ? response.data
                        : [];


                // =====================================
                // ONLY PENDING REMINDERS
                // =====================================

                const pendingReminders =
                    reminders
                        .filter(
                            (reminder) =>
                                !reminder.completed &&
                                reminder.reminderTime
                        )
                        .sort(
                            (a, b) =>
                                new Date(a.reminderTime) -
                                new Date(b.reminderTime)
                        );


                // =====================================
                // NEXT REMINDER
                // =====================================

                return {
                  personId: lead.personId,
                  reminderTime:
                      pendingReminders[0]?.reminderTime
                      || null
                };

              } catch (error) {

                console.error(
                    `Failed to load reminders for lead ${lead.personId}:`,
                    error
                );

                return {
                  personId: lead.personId,
                  reminderTime: null
                };

              }

            })

        );


        // =====================================
        // CONVERT TO MAP
        // =====================================

        const reminderMap = {};

        results.forEach((item) => {

          if (item.personId) {

            reminderMap[item.personId] =
                item.reminderTime;

          }

        });


        console.log(
            "========== MY LEADS NEXT FOLLOWUPS =========="
        );

        console.log(reminderMap);


        setNextFollowups(reminderMap);

      } catch (error) {

        console.error(
            "Failed to load lead reminders:",
            error
        );

        setNextFollowups({});

      }

    };


    fetchNextFollowups();

  }, [leads]);


  // =====================================
  // OPEN LEAD
  // =====================================

  const handleOpenLead = (personId) => {

    if (!personId) {

      console.error("Person ID missing");

      return;

    }


    const role =
        localStorage.getItem("role");


    // =====================================
    // ADMIN
    // =====================================

    if (role === "ADMIN") {

      navigate(
          `/admin/lead/${personId}`
      );

      return;

    }


    // =====================================
    // COUNSELLOR
    // =====================================

    if (role === "COUNSELLOR") {

      navigate(
          `/COUNSELLOR/lead/${personId}`
      );

      return;

    }


    // =====================================
    // DEFAULT
    // =====================================

    navigate(
        `/lead/${personId}`
    );

  };


  // =====================================
  // FORMAT NEXT FOLLOWUP
  // =====================================

  const formatNextFollowup = (reminderTime) => {

    if (!reminderTime) {

      return "No Followup";

    }


    const date =
        new Date(reminderTime);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

      return "No Followup";

    }


    return date.toLocaleString(
        [],
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
    );

  };


  // =====================================
  // UI
  // =====================================

  return (

      <div className="table-wrapper">

        <table className="lead-table">

          <thead>

          <tr>

            <th>
              Name
            </th>

            <th>
              Next Followup
            </th>

            <th>
              Email
            </th>

            <th>
              Status
            </th>

            <th>
              Actions
            </th>

          </tr>

          </thead>


          <tbody>

          {!Array.isArray(leads)
          || leads.length === 0 ? (

              <tr>

                <td colSpan="5">
                  No Leads Found
                </td>

              </tr>

          ) : (

              leads.map((lead) => (

                  <tr
                      key={lead.personId}
                  >

                    {/* ================================= */}
                    {/* NAME */}
                    {/* ================================= */}

                    <td>

                      {[
                            lead.firstName,
                            lead.middleName,
                            lead.lastName
                          ]
                              .filter(Boolean)
                              .join(" ")
                          || "-"}

                    </td>


                    {/* ================================= */}
                    {/* NEXT FOLLOWUP */}
                    {/* ================================= */}

                    <td>

                      {formatNextFollowup(
                          nextFollowups[
                              lead.personId
                              ]
                      )}

                    </td>


                    {/* ================================= */}
                    {/* EMAIL */}
                    {/* ================================= */}

                    <td>

                      {lead.email || "-"}

                    </td>


                    {/* ================================= */}
                    {/* STATUS */}
                    {/* ================================= */}

                    <td>

                  <span
                      className={
                        `status-badge ${
                            lead.leadStatus
                                ?.toLowerCase()
                            || ""
                        }`
                      }
                  >

                    {lead.leadStatus || "-"}

                  </span>

                    </td>


                    {/* ================================= */}
                    {/* ACTION */}
                    {/* ================================= */}

                    <td>

                      <button
                          type="button"
                          className="table-btn"
                          onClick={() =>
                              handleOpenLead(
                                  lead.personId
                              )
                          }
                      >

                        Open

                      </button>

                    </td>

                  </tr>

              ))

          )}

          </tbody>

        </table>

      </div>

  );

}


export default LeadTable;