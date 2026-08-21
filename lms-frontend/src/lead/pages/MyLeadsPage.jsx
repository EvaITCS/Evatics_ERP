import { useEffect, useState } from "react";

import LeadTable from "../components/LeadTable";
import { getMyLeads } from "../services/leadService";
import PageTitle from "../../shared/components/PageTitle";

function MyLeadsPage() {

    // =====================================
    // STATE
    // =====================================

    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================
    // FILTER STATE
    // =====================================

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // =====================================
    // LOAD MY LEADS
    // =====================================

    useEffect(() => {
        fetchMyLeads();
    }, []);

    // =====================================
    // FETCH MY LEADS
    // =====================================

    const fetchMyLeads = async () => {

        setLoading(true);
        setError("");

        try {

            const data = await getMyLeads();

            console.log("========== MY LEADS ==========");
            console.log(
                "Total My Leads:",
                Array.isArray(data) ? data.length : 0
            );
            console.log("My Leads:", data);

            const result = Array.isArray(data)
                ? data
                : [];

            setLeads(result);
            setFilteredLeads(result);

        } catch (err) {

            console.error(
                "Failed to load my leads:",
                err
            );

            setLeads([]);
            setFilteredLeads([]);

            setError("Failed to load My Leads");

        } finally {

            setLoading(false);

        }
    };

    // =====================================
    // GET SEARCHABLE VALUE
    // =====================================

    const getLeadSearchText = (lead) => {

        const person = lead.person || {};

        const firstName =
            lead.firstName ||
            person.firstName ||
            "";

        const middleName =
            lead.middleName ||
            person.middleName ||
            "";

        const lastName =
            lead.lastName ||
            person.lastName ||
            "";

        const email =
            lead.email ||
            person.email ||
            "";

        const phone =
            lead.phone ||
            person.phone ||
            "";

        const status =
            lead.leadStatus ||
            lead.status ||
            "";

        const priority =
            lead.leadPriority ||
            lead.priority ||
            "";

        return [
            firstName,
            middleName,
            lastName,
            email,
            phone,
            status,
            priority,
            lead.candidateId,
            lead.leadId
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
    };

    // =====================================
    // FILTER LEADS
    // =====================================

    const filterLeads = () => {

        const keyword = search
            .trim()
            .toLowerCase();

        let updatedLeads = [...leads];

        // =====================================
        // SEARCH
        // =====================================

        if (keyword) {

            updatedLeads = updatedLeads.filter(
                (lead) =>
                    getLeadSearchText(lead)
                        .includes(keyword)
            );
        }

        // =====================================
        // STATUS
        // =====================================

        if (statusFilter) {

            updatedLeads = updatedLeads.filter(
                (lead) => {

                    const status =
                        lead.leadStatus ||
                        lead.status ||
                        "";

                    return status === statusFilter;
                }
            );
        }

        // =====================================
        // PRIORITY
        // =====================================

        if (priorityFilter) {

            updatedLeads = updatedLeads.filter(
                (lead) => {

                    const priority =
                        lead.leadPriority ||
                        lead.priority ||
                        "";

                    return priority === priorityFilter;
                }
            );
        }

        // =====================================
        // FROM DATE
        // =====================================

        if (fromDate) {

            const startDate =
                new Date(`${fromDate}T00:00:00`);

            updatedLeads = updatedLeads.filter(
                (lead) => {

                    if (!lead.createdAt) {
                        return false;
                    }

                    const createdDate =
                        new Date(lead.createdAt);

                    return createdDate >= startDate;
                }
            );
        }

        // =====================================
        // TO DATE
        // =====================================

        if (toDate) {

            const endDate =
                new Date(`${toDate}T23:59:59.999`);

            updatedLeads = updatedLeads.filter(
                (lead) => {

                    if (!lead.createdAt) {
                        return false;
                    }

                    const createdDate =
                        new Date(lead.createdAt);

                    return createdDate <= endDate;
                }
            );
        }

        // =====================================
        // SORT NEWEST FIRST
        // =====================================

        updatedLeads.sort(
            (a, b) => {

                const dateA =
                    new Date(a.createdAt || 0);

                const dateB =
                    new Date(b.createdAt || 0);

                return dateB - dateA;
            }
        );

        setFilteredLeads(updatedLeads);
    };

    // =====================================
    // RESET FILTERS
    // =====================================

    const resetFilters = () => {

        setSearch("");
        setStatusFilter("");
        setPriorityFilter("");
        setFromDate("");
        setToDate("");

        const sortedLeads = [...leads].sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );

        setFilteredLeads(sortedLeads);
    };

    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (
            <div className="my-leads-page">

                <div className="page-header">
                    <PageTitle title="My Leads" />
                </div>

                <div className="empty-state">
                    Loading My Leads...
                </div>

            </div>
        );
    }

    // =====================================
    // ERROR
    // =====================================

    if (error) {

        return (
            <div className="my-leads-page">

                <div className="page-header">
                    <PageTitle title="My Leads" />
                </div>

                <div className="empty-state">

                    <h3>{error}</h3>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={fetchMyLeads}
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

        <div className="my-leads-page">

            {/* PAGE HEADER */}

            <div className="page-header">

                <PageTitle
                    title="My Leads"
                />

            </div>

            {/* FILTERS */}

            <div className="lead-filters">

                {/* SEARCH */}

                <input
                    type="text"
                    placeholder="Search by Name, Email, Phone or Status"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                {/* STATUS */}

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
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

                {/* PRIORITY */}

                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(e.target.value)
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
                    onClick={filterLeads}
                >
                    Search
                </button>

                {/* RESET */}

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={resetFilters}
                >
                    Reset
                </button>

            </div>

            {/* RESULT COUNT */}

            <p className="result-count">
                Total Results: {filteredLeads.length}
            </p>

            {/* TABLE */}

            {filteredLeads.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No Leads Found
                    </h3>

                    <p>
                        You currently have no active
                        leads matching the selected filters.
                    </p>

                </div>

            ) : (

                <LeadTable
                    leads={filteredLeads}
                />

            )}

        </div>
    );
}

export default MyLeadsPage;