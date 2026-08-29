import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    filterReEngagementLeads,
    filterMyReEngagementLeads
} from "../services/leadService";

import {
    getCounsellors
} from "../../user/service/userService";

import PageTitle from "../../shared/components/PageTitle";
import SearchBar from "../components/SearchBar";

import "../styles/lead.css";


function ReEngagementPage() {

    const navigate = useNavigate();


    // =====================================================
    // USER / ROLE
    // =====================================================

    const USER_ROLE_KEY = "role";

    const storedRole =
        localStorage.getItem(USER_ROLE_KEY);

    const userRole =
        (storedRole || "")
            .trim()
            .toUpperCase();

    const isAdmin =
        userRole === "ADMIN";

    const isCounsellor =
        userRole === "COUNSELLOR";


    // =====================================================
    // STATE
    // =====================================================

    const [leads, setLeads] =
        useState([]);

    const [counsellors, setCounsellors] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // FILTER STATE
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [counsellorFilter, setCounsellorFilter] =
        useState("");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchLeads();

        // Counsellor dropdown is required
        // only for ADMIN
        if (isAdmin) {
            loadCounsellors();
        }

    }, [isAdmin]);


    // =====================================================
    // FETCH RE-ENGAGEMENT LEADS
    // =====================================================

    const fetchLeads = async (
        searchValue = "",
        counsellorValue = "",
        fromDateValue = "",
        toDateValue = ""
    ) => {

        try {

            setLoading(true);
            setError("");


            let data;


            // =================================================
            // ADMIN
            // =================================================

            if (isAdmin) {

                data =
                    await filterReEngagementLeads({

                        keyword:
                            searchValue?.trim() || "",

                        counsellorPersonId:
                            counsellorValue
                                ? Number(counsellorValue)
                                : null,

                        fromDate:
                            fromDateValue || null,

                        toDate:
                            toDateValue || null

                    });

            }


                // =================================================
                // COUNSELLOR
            // =================================================

            else if (isCounsellor) {

                data =
                    await filterMyReEngagementLeads({

                        keyword:
                            searchValue?.trim() || "",

                        fromDate:
                            fromDateValue || null,

                        toDate:
                            toDateValue || null

                    });

            }


                // =================================================
                // OTHER ROLE
            // =================================================

            else {

                data = [];

            }


            console.log(
                "========== RE-ENGAGEMENT FILTER =========="
            );

            console.log(
                "Role:",
                userRole
            );

            console.log(
                "Search:",
                searchValue
            );

            console.log(
                "Counsellor:",
                counsellorValue
            );

            console.log(
                "From Date:",
                fromDateValue
            );

            console.log(
                "To Date:",
                toDateValue
            );

            console.log(
                "Result:",
                data
            );


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


    // =====================================================
    // LOAD COUNSELLORS
    // ADMIN ONLY
    // =====================================================

    const loadCounsellors = async () => {

        try {

            const data =
                await getCounsellors();

            console.log(
                "========== COUNSELLORS =========="
            );

            console.log(
                "Counsellors:",
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


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = () => {

        fetchLeads(
            search,
            counsellorFilter,
            fromDate,
            toDate
        );

    };


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");

        setCounsellorFilter("");

        setFromDate("");

        setToDate("");


        fetchLeads(
            "",
            "",
            "",
            ""
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

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


    // =====================================================
    // ERROR
    // =====================================================

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
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            ← Back
                        </button>

                    </div>


                    <div className="empty-state">

                        <h3>
                            {error}
                        </h3>


                        <button
                            type="button"
                            className="primary-btn"
                            onClick={() =>
                                fetchLeads(
                                    search,
                                    counsellorFilter,
                                    fromDate,
                                    toDate
                                )
                            }
                        >
                            Retry
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="re-engagement-page">

            <div className="re-engagement-card-wrapper">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="card-header">

                    <PageTitle
                        title="Re-Engagement Leads"
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


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <SearchBar
                        value={search}
                        onSearch={setSearch}
                        placeholder="Search by Name, Email or Phone"
                    />


                    {/* =================================================
                        COUNSELLOR
                        ADMIN ONLY
                    ================================================= */}

                    {isAdmin && (

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

                                        {
                                            counsellor.employeeName ||
                                            counsellor.fullName ||
                                            counsellor.counsellorName ||
                                            [
                                                counsellor.firstName,
                                                counsellor.middleName,
                                                counsellor.lastName
                                            ]
                                                .filter(Boolean)
                                                .join(" ")
                                            ||
                                            `Counsellor ${counsellor.personId}`
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    )}


                    {/* =================================================
                        FROM DATE
                    ================================================= */}

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                            setFromDate(
                                e.target.value
                            )
                        }
                    />


                    {/* =================================================
                        TO DATE
                    ================================================= */}

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) =>
                            setToDate(
                                e.target.value
                            )
                        }
                    />


                    {/* =================================================
                        SEARCH BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={handleSearch}
                    >
                        Search
                    </button>


                    {/* =================================================
                        CLEAR BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="clear-btn"
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>


                {/* =================================================
                    RESULT COUNT
                ================================================= */}

                <p className="result-count">

                    Total Results:
                    {" "}
                    {leads.length}

                </p>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {leads.length === 0 ? (

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


                    /* =================================================
                       TABLE
                    ================================================= */

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

                                {isAdmin && (
                                    <th>
                                        Counsellor
                                    </th>
                                )}

                                <th>
                                    Status
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


                                        {/* =================================================
                                                ID
                                            ================================================= */}

                                        <td>
                                            {
                                                lead.personId
                                            }
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
                                                    .join(" ")
                                                || "-"}

                                        </td>


                                        {/* =================================================
                                                EMAIL
                                            ================================================= */}

                                        <td>

                                            {
                                                lead.email
                                                || "-"
                                            }

                                        </td>


                                        {/* =================================================
                                                PHONE
                                            ================================================= */}

                                        <td>

                                            {
                                                lead.phone
                                                || "-"
                                            }

                                        </td>


                                        {/* =================================================
                                                COUNSELLOR
                                                ADMIN ONLY
                                            ================================================= */}

                                        {isAdmin && (

                                            <td>

                                                {
                                                    lead.employeeName ||
                                                    lead.assignedEmployeeName ||
                                                    lead.counsellorName ||
                                                    "Unassigned"
                                                }

                                            </td>

                                        )}


                                        {/* =================================================
                                                STATUS
                                            ================================================= */}

                                        <td>

                                                <span className="status-badge re-engagement">

                                                    {
                                                        lead.leadStatus
                                                        ||
                                                        "RE_ENGAGEMENT"
                                                    }

                                                </span>

                                        </td>


                                        {/* =================================================
                                                RE-ENGAGEMENT DATE
                                            ================================================= */}




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