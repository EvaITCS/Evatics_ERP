import React, {
    useEffect,
    useState
} from "react";

import {
    FiCheck,
    FiChevronDown,
    FiChevronUp,
    FiExternalLink,
    FiMail,
    FiPhone,
    FiMessageSquare,
    FiUser,
    FiRefreshCw,
    FiArrowLeft
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";

import PageTitle from "../../shared/components/PageTitle";

import {
    getPendingFollowups
} from "../services/reminderService";

import {
    completeReminder
} from "../services/reminderService";

import "../styles/notification.css";


// =====================================================
// PAGE
// =====================================================

function PendingFollowupsPage() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [reminders, setReminders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [completingId, setCompletingId] =
        useState(null);

    const [expandedPerson, setExpandedPerson] =
        useState(null);


    // =====================================================
    // ROLE
    // =====================================================

    const role =
        localStorage.getItem("role");


    // =====================================================
    // LOAD PENDING FOLLOWUPS
    // =====================================================

    const loadPendingFollowups = async (
        background = false
    ) => {

        try {

            if (background) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }


            const data =
                await getPendingFollowups();


            // Backend should already return
            // ONE PERSON = ONE RECORD.

            setReminders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load pending followups:",
                error
            );

        } finally {

            setLoading(false);

            setRefreshing(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadPendingFollowups(false);

    }, []);


    // =====================================================
    // AUTO REFRESH
    //
    // Every 30 seconds
    // =====================================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                loadPendingFollowups(true);

            }, 30000);


        return () =>
            clearInterval(interval);

    }, []);


    // =====================================================
    // FULL NAME
    // =====================================================

    const getFullName = (
        person
    ) => {

        return [

                person?.firstName,

                person?.middleName,

                person?.lastName

            ]
                .filter(Boolean)
                .join(" ")
                .trim()
            || "Unknown Lead";

    };


    // =====================================================
    // REMINDER ICON
    // =====================================================

    const getReminderIcon = (
        reminderType
    ) => {

        switch (
            reminderType?.toUpperCase()
            ) {

            case "CALL":

                return (
                    <FiPhone
                        size={15}
                    />
                );


            case "EMAIL":

                return (
                    <FiMail
                        size={15}
                    />
                );


            case "SMS":

                return (
                    <FiMessageSquare
                        size={15}
                    />
                );


            default:

                return (
                    <FiUser
                        size={15}
                    />
                );

        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatReminderTime = (
        dateTime
    ) => {

        if (!dateTime) {

            return "-";

        }


        const date =
            new Date(dateTime);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

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


    // =====================================================
    // CHECK OVERDUE
    //
    // Pending page contains reminders
    // whose date/time has passed.
    // =====================================================

    const isOverdue = (
        dateTime
    ) => {

        if (!dateTime) {

            return false;

        }


        const reminderTime =
            new Date(dateTime)
                .getTime();


        if (
            Number.isNaN(
                reminderTime
            )
        ) {

            return false;

        }


        return (
            reminderTime <
            Date.now()
        );

    };


    // =====================================================
    // TOGGLE PERSON
    //
    // Expand/collapse all pending
    // reminders for one person.
    // =====================================================

    const togglePerson = (
        personId
    ) => {

        setExpandedPerson(
            current =>
                current === personId
                    ? null
                    : personId
        );

    };


    // =====================================================
    // VIEW LEAD
    // =====================================================

    const handleViewLead = (
        personId
    ) => {

        if (!personId) {

            return;

        }


        if (
            role === "ADMIN"
        ) {

            navigate(
                `/admin/lead/${personId}`
            );

            return;

        }


        if (
            role === "COUNSELLOR"
        ) {

            navigate(
                `/COUNSELLOR/lead/${personId}`
            );

            return;

        }


        navigate(
            `/lead/${personId}`
        );

    };


    // =====================================================
    // COMPLETE REMINDER
    // =====================================================

    const handleComplete = async (
        reminderId
    ) => {

        if (!reminderId) {

            return;

        }


        try {

            setCompletingId(
                reminderId
            );


            await completeReminder(
                reminderId
            );


            // Refresh from backend.
            // This is important because:
            //
            // completed reminder should disappear
            // from Pending page.

            await loadPendingFollowups(
                true
            );


            // If expanded person no longer
            // has pending reminders,
            // close expansion.

            setExpandedPerson(
                null
            );

        } catch (error) {

            console.error(
                "Failed to complete reminder:",
                error
            );


            alert(
                "Failed to complete reminder."
            );

        } finally {

            setCompletingId(
                null
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="notifications-page">

                <div className="notifications-card-wrapper">

                    <div className="empty-state">

                        <h3>
                            Loading Pending Followups...
                        </h3>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="notifications-page">

            <div className="notifications-card-wrapper">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="card-header">

                    <div>

                        <PageTitle
                            title="Pending Followups"
                        />

                        <p className="subtitle-text">

                            Followups that require
                            attention.

                        </p>

                    </div>


                    <div className="header-actions">


                        {/* REFRESH */}

                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={() =>
                                loadPendingFollowups(
                                    true
                                )
                            }
                            disabled={
                                refreshing
                            }
                        >

                            <FiRefreshCw
                                size={16}
                            />

                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}

                        </button>


                        {/* BACK */}

                        <button
                            type="button"
                            className="back-btn"
                            onClick={() =>
                                navigate(-1)
                            }
                        >

                            <FiArrowLeft
                                size={17}
                            />

                            Back

                        </button>

                    </div>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {reminders.length === 0 ? (

                    <div className="empty-card">

                        <h3>
                            ✅ No Pending Followups
                        </h3>

                        <p>

                            Great! There are no
                            pending or overdue
                            followups.

                        </p>

                    </div>

                ) : (


                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="table-wrapper">

                        <table className="lead-table">


                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Next Followup
                                </th>

                                <th>
                                    Pending
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    View
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                            </thead>


                            {/* =================================================
                                BODY
                            ================================================= */}

                            <tbody>

                            {reminders.map(
                                (person) => {

                                    const pendingFollowups =
                                        Array.isArray(
                                            person.pendingFollowups
                                        )
                                            ? person.pendingFollowups
                                            : [];


                                    const pendingCount =
                                        person.pendingCount ??
                                        pendingFollowups.length ??
                                        0;


                                    const expanded =
                                        expandedPerson ===
                                        person.personId;


                                    const overdue =
                                        isOverdue(
                                            person.highestPriorityReminderTime
                                            ||
                                            person.reminderTime
                                        );


                                    return (

                                        <React.Fragment
                                            key={
                                                person.personId
                                            }
                                        >


                                            {/* =================================================
                                                    MAIN PERSON ROW
                                                ================================================= */}

                                            <tr>


                                                {/* NAME */}

                                                <td>

                                                    <strong>

                                                        {
                                                            getFullName(
                                                                person
                                                            )
                                                        }

                                                    </strong>

                                                </td>


                                                {/* PHONE */}

                                                <td>

                                                    {
                                                        person.phone
                                                        ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* EMAIL */}

                                                <td>

                                                    {
                                                        person.email
                                                        ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* NEXT FOLLOWUP */}

                                                <td>

                                                        <span
                                                            className={
                                                                overdue
                                                                    ? "status-overdue"
                                                                    : "status-upcoming"
                                                            }
                                                        >

                                                            {
                                                                formatReminderTime(
                                                                    person.highestPriorityReminderTime
                                                                    ||
                                                                    person.reminderTime
                                                                )
                                                            }

                                                        </span>

                                                </td>


                                                {/* PENDING COUNT */}

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="pending-count-btn"
                                                        onClick={() =>
                                                            togglePerson(
                                                                person.personId
                                                            )
                                                        }
                                                    >

                                                            <span>

                                                                {
                                                                    pendingCount
                                                                }

                                                            </span>

                                                        <span>

                                                                Pending

                                                            </span>


                                                        {expanded ? (

                                                            <FiChevronUp
                                                                size={15}
                                                            />

                                                        ) : (

                                                            <FiChevronDown
                                                                size={15}
                                                            />

                                                        )}

                                                    </button>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                        <span
                                                            className={
                                                                overdue
                                                                    ? "status-overdue"
                                                                    : "status-upcoming"
                                                            }
                                                        >

                                                            {overdue
                                                                ? "Overdue"
                                                                : "Pending"}

                                                        </span>

                                                </td>


                                                {/* VIEW LEAD */}

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="secondary-btn view-lead-btn"
                                                        onClick={() =>
                                                            handleViewLead(
                                                                person.personId
                                                            )
                                                        }
                                                    >

                                                        <FiExternalLink
                                                            size={15}
                                                        />

                                                        View Lead

                                                    </button>

                                                </td>


                                                {/* COMPLETE */}

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="primary-btn complete-btn"
                                                        disabled={
                                                            !person.reminderId
                                                            ||
                                                            completingId ===
                                                            person.reminderId
                                                        }
                                                        onClick={() =>
                                                            handleComplete(
                                                                person.reminderId
                                                            )
                                                        }
                                                    >

                                                        <FiCheck
                                                            size={15}
                                                        />

                                                        {
                                                            completingId ===
                                                            person.reminderId
                                                                ? "Completing..."
                                                                : "Complete"
                                                        }

                                                    </button>

                                                </td>

                                            </tr>


                                            {/* =================================================
                                                    EXPANDED PENDING FOLLOWUPS
                                                ================================================= */}

                                            {expanded && (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="pending-details-cell"
                                                    >

                                                        <div className="pending-followups-list">


                                                            {/* TITLE */}

                                                            <div className="pending-details-title">

                                                                <strong>

                                                                    Pending Followups

                                                                </strong>

                                                                <span>

                                                                        {
                                                                            pendingCount
                                                                        }

                                                                    {" "}
                                                                    total

                                                                    </span>

                                                            </div>


                                                            {/* =================================================
                                                                    INDIVIDUAL REMINDERS
                                                                ================================================= */}

                                                            {pendingFollowups.length === 0 ? (

                                                                <div className="pending-no-details">

                                                                    No reminder
                                                                    details available.

                                                                </div>

                                                            ) : (

                                                                pendingFollowups.map(
                                                                    (followup) => {

                                                                        const followupOverdue =
                                                                            isOverdue(
                                                                                followup.reminderTime
                                                                            );


                                                                        return (

                                                                            <div
                                                                                key={
                                                                                    followup.reminderId
                                                                                }
                                                                                className="pending-followup-item"
                                                                            >


                                                                                {/* TYPE */}

                                                                                <div className="pending-followup-type">

                                                                                        <span className="notification-type-icon">

                                                                                            {
                                                                                                getReminderIcon(
                                                                                                    followup.reminderType
                                                                                                )
                                                                                            }

                                                                                        </span>

                                                                                    <span>

                                                                                            {
                                                                                                followup.reminderType
                                                                                                ||
                                                                                                "GENERAL"
                                                                                            }

                                                                                        </span>

                                                                                </div>


                                                                                {/* TIME */}

                                                                                <div
                                                                                    className={
                                                                                        followupOverdue
                                                                                            ? "status-overdue"
                                                                                            : "status-upcoming"
                                                                                    }
                                                                                >

                                                                                    {
                                                                                        formatReminderTime(
                                                                                            followup.reminderTime
                                                                                        )
                                                                                    }

                                                                                </div>


                                                                                {/* COMPLETE */}

                                                                                <button
                                                                                    type="button"
                                                                                    className="primary-btn complete-btn"
                                                                                    disabled={
                                                                                        completingId ===
                                                                                        followup.reminderId
                                                                                    }
                                                                                    onClick={() =>
                                                                                        handleComplete(
                                                                                            followup.reminderId
                                                                                        )
                                                                                    }
                                                                                >

                                                                                    <FiCheck
                                                                                        size={15}
                                                                                    />

                                                                                    {
                                                                                        completingId ===
                                                                                        followup.reminderId
                                                                                            ? "Completing..."
                                                                                            : "Complete"
                                                                                    }

                                                                                </button>

                                                                            </div>

                                                                        );

                                                                    }
                                                                )

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            )}

                                        </React.Fragment>

                                    );

                                }
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


export default PendingFollowupsPage;