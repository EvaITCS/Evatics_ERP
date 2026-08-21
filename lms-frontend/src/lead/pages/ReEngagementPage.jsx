import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getReEngagementLeads } from "../services/leadService";
import { getCounsellors } from "../../user/service/userService";

import PageTitle from "../../shared/components/PageTitle";
import SearchBar from "../components/SearchBar";

import "../styles/lead.css";

function ReEngagementPage() {

    const navigate = useNavigate();

    // =====================================
    // STATE
    // =====================================

    const [leads, setLeads] = useState([]);
    const [counsellors, setCounsellors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================
    // FILTER STATE
    // =====================================

    const [search, setSearch] = useState("");
    const [counsellorFilter, setCounsellorFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    // =====================================
    // INITIAL LOAD
    // =====================================

    useEffect(() => {

        fetchLeads();
        loadCounsellors();

    }, []);


    // =====================================
    // LOAD RE-ENGAGEMENT LEADS
    // =====================================

    const fetchLeads = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getReEngagementLeads();

            console.log(
                "========== RE-ENGAGEMENT LEADS =========="
            );

            console.log("Total:", data?.length);
            console.log("Leads:", data);

            setLeads(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load Re-Engagement Leads:",
                err
            );

            setLeads([]);

            setError(
                "Failed to load Re-Engagement Leads"
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // LOAD COUNSELLORS
    // =====================================

    const loadCounsellors = async () => {

        try {

            const data = await getCounsellors();

            console.log(
                "========== COUNSELLORS =========="
            );

            console.log("Counsellors:", data);

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
    // FRONTEND FILTERING
    // =====================================

    const filteredLeads = useMemo(() => {

        return leads.filter((lead) => {

            // =================================
            // SEARCH
            // =================================

            const keyword =
                search.trim().toLowerCase();

            const fullName = [
                lead.firstName,
                lead.middleName,
                lead.lastName
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const email =
                (lead.email || "").toLowerCase();

            const phone =
                lead.phone || "";

            const status =
                (lead.leadStatus || "").toLowerCase();

            const matchesSearch =
                !keyword ||
                fullName.includes(keyword) ||
                email.includes(keyword) ||
                phone.includes(keyword) ||
                status.includes(keyword);


            // =================================
            // COUNSELLOR
            // =================================

            const matchesCounsellor =
                !counsellorFilter ||
                Number(lead.employeePersonId) ===
                Number(counsellorFilter);


            // =================================
            // CREATED DATE
            // =================================

            const createdDate =
                lead.createdAt
                    ? new Date(lead.createdAt)
                    : null;


            // =================================
            // FROM DATE
            // =================================

            const matchesFrom =
                !fromDate ||
                (
                    createdDate &&
                    createdDate >=
                    new Date(`${fromDate}T00:00:00`)
                );


            // =================================
            // TO DATE
            // =================================

            const matchesTo =
                !toDate ||
                (
                    createdDate &&
                    createdDate <=
                    new Date(`${toDate}T23:59:59`)
                );


            return (
                matchesSearch &&
                matchesCounsellor &&
                matchesFrom &&
                matchesTo
            );

        });

    }, [
        leads,
        search,
        counsellorFilter,
        fromDate,
        toDate
    ]);


    // =====================================
    // CLEAR FILTERS
    // =====================================

    const clearFilters = () => {

        setSearch("");
        setCounsellorFilter("");
        setFromDate("");
        setToDate("");

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (
            <div className="re-engagement-page">

                <div className="re-engagement-card-wrapper">

                    <div className="card-header">

                        <PageTitle
                            title="Re-Engagement Leads"
                        />

                    </div>

                    <div className="empty-state">

                        <h3>
                            Loading Re-Engagement Leads...
                        </h3>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (
            <div className="re-engagement-page">

                <div className="re-engagement-card-wrapper">

                    <div className="card-header">

                        <PageTitle
                            title="Re-Engagement Leads"
                        />

                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>

                    </div>

                    <div className="empty-state">

                        <h3>{error}</h3>

                        <button
                            type="button"
                            className="primary-btn"
                            onClick={fetchLeads}
                        >
                            Retry
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    // =====================================
    // UI
    // =====================================

    return (

        <div className="re-engagement-page">

            <div className="re-engagement-card-wrapper">


                {/* =====================================
                        HEADER
                    ===================================== */}

                <div className="card-header">

                    <PageTitle
                        title="Re-Engagement Leads"
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

                <div className="lead-filters">


                    {/* SEARCH */}

                    <SearchBar
                        value={search}
                        onSearch={setSearch}
                        placeholder="Search by Name, Email or Phone"
                    />


                    {/* =================================
                            COUNSELLOR
                        ================================= */}

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

                                    {counsellor.fullName
                                        ||
                                        `${counsellor.firstName || ""}
                                         ${counsellor.lastName || ""}`
                                            .trim()
                                        ||
                                        `Counsellor ${counsellor.personId}`
                                    }

                                </option>

                            )
                        )}

                    </select>


                    {/* =================================
                            FROM DATE
                        ================================= */}

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                            setFromDate(
                                e.target.value
                            )
                        }
                    />


                    {/* =================================
                            TO DATE
                        ================================= */}

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) =>
                            setToDate(
                                e.target.value
                            )
                        }
                    />


                    {/* =================================
                            SEARCH BUTTON
                        ================================= */}

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={fetchLeads}
                    >
                        Search
                    </button>


                    {/* =================================
                            CLEAR BUTTON
                        ================================= */}

                    <button
                        type="button"
                        className="clear-btn"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>


                {/* =====================================
                        RESULT COUNT
                    ===================================== */}

                <p className="result-count">

                    Total Results :
                    {" "}
                    {filteredLeads.length}

                </p>


                {/* =====================================
                        TABLE / EMPTY STATE
                    ===================================== */}

                {filteredLeads.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Re-Engagement Leads Found
                        </h3>

                        <p>
                            No re-engagement leads match
                            the selected filters.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="lead-table">

                            <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Name
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

                                <th>
                                    Status
                                </th>

                                <th>
                                    Created At
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {filteredLeads.map(
                                (lead) => (

                                    <tr
                                        key={
                                            lead.personId
                                        }
                                    >

                                        <td>
                                            {lead.personId}
                                        </td>


                                        <td>

                                            {[
                                                lead.firstName,
                                                lead.middleName,
                                                lead.lastName
                                            ]
                                                .filter(Boolean)
                                                .join(" ") || "-"}

                                        </td>


                                        <td>
                                            {lead.email || "-"}
                                        </td>


                                        <td>
                                            {lead.phone || "-"}
                                        </td>


                                        <td>
                                            {
                                                lead.assignedEmployeeName
                                                || "Unassigned"
                                            }
                                        </td>


                                        <td>

                                            <span className="status-badge re-engagement">

                                                {
                                                    lead.leadStatus
                                                    || "RE_ENGAGEMENT"
                                                }

                                            </span>

                                        </td>


                                        <td>

                                            {
                                                lead.createdAt
                                                    ? new Date(
                                                        lead.createdAt
                                                    ).toLocaleDateString()
                                                    : "-"
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

export default ReEngagementPage;