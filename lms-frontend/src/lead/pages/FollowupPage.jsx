import { useEffect, useState } from "react";

import { getFollowups } from "../services/followupService";

import PageTitle from "../../shared/components/PageTitle";

import "../styles/lead.css";

function FollowupPage() {

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        fetchFollowups();

    }, []);

    const fetchFollowups =
        async () => {

            try {

                const response =
                    await getFollowups();

                console.log(
                    "FOLLOWUPS = ",
                    response
                );

                setData(response);

            }

            catch (err) {

                console.log(err);

                setError(
                    "Failed to load followups"
                );
            }

            finally {

                setLoading(false);
            }
        };

    if (loading) {

        return (
            <div className="page-container">
                <h2>Loading Followups...</h2>
            </div>
        );
    }

    if (error) {

        return (
            <div className="page-container">
                <h2>{error}</h2>
            </div>
        );
    }

    return (

        <div className="page-container">

            <PageTitle
                title="Followup History"
            />

            <div className="table-wrapper">

                <table className="lead-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Lead</th>

                            <th>Type</th>

                            <th>Result</th>

                            <th>Notes</th>

                            <th>Next Followup</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            data.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="empty-cell"
                                    >

                                        No Followups Found

                                    </td>

                                </tr>

                            ) : (

                                data.map((f) => (

                                    <tr
                                        key={f.actionId}
                                    >

                                        <td>
                                            {f.actionId}
                                        </td>

                                        <td>

                                            {
                                                f.leadName ||
                                                f.candidateName ||
                                                "-"
                                            }

                                        </td>

                                        <td>

                                            <span
                                                className="status-badge"
                                            >

                                                {
                                                    f.followupType
                                                }

                                            </span>

                                        </td>

                                        <td>

                                            {
                                                f.actionResult ||
                                                "-"
                                            }

                                        </td>

                                        <td>

                                            {
                                                f.notes ||
                                                "-"
                                            }

                                        </td>

                                        <td>

                                            {
                                                f.scheduledTime
                                                    ?
                                                    new Date(
                                                        f.scheduledTime
                                                    ).toLocaleString()
                                                    :
                                                    "-"
                                            }

                                        </td>

                                        <td>

                                            {
                                                f.leadStatus ||
                                                "-"
                                            }

                                        </td>

                                    </tr>

                                ))
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default FollowupPage;