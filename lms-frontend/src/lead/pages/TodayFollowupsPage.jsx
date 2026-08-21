import {
    Fragment,
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
    FiPhone,
    FiMail,
    FiMessageSquare,
    FiUser,
    FiExternalLink,
    FiCheck,
    FiChevronDown,
    FiChevronUp,
    FiArrowLeft
} from "react-icons/fi";

import {
    todayReminders,
    completeReminder
} from "../services/reminderService";

import PageTitle from "../../shared/components/PageTitle";

import "../styles/lead.css";


function TodayFollowupsPage() {

    const navigate = useNavigate();


    // =====================================
    // STATE
    // =====================================

    const [reminders, setReminders] =
        useState([]);

    const [expandedPerson, setExpandedPerson] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const role =
        localStorage.getItem("role");


    // =====================================
    // LOAD TODAY FOLLOWUPS
    // =====================================

    useEffect(() => {

        fetchReminders();

    }, []);


    // =====================================
    // FETCH
    // =====================================

    const fetchReminders = async () => {

        try {

            setLoading(true);
            setError("");


            const data =
                await todayReminders(role);


            console.log(
                "TODAY FOLLOWUPS DATA =",
                data
            );


            const list =
                Array.isArray(data)
                    ? data
                    : [];


            const now =
                new Date();


            // =====================================
            // TODAY ONLY
            // =====================================

            const todayList =
                list.filter((item) => {

                    if (!item.reminderTime) {

                        return false;

                    }


                    const reminderDate =
                        new Date(
                            item.reminderTime
                        );


                    return (
                        reminderDate.getFullYear()
                        ===
                        now.getFullYear()

                        &&

                        reminderDate.getMonth()
                        ===
                        now.getMonth()

                        &&

                        reminderDate.getDate()
                        ===
                        now.getDate()
                    );

                });


            // =====================================
            // PERSON-WISE GROUPING
            // =====================================

            const personMap =
                new Map();


            todayList.forEach((item) => {

                const personId =
                    item.personId;


                if (!personId) {

                    return;

                }


                // =================================
                // FIRST RECORD
                // =================================

                if (!personMap.has(personId)) {

                    personMap.set(
                        personId,
                        {
                            ...item,

                            pendingFollowups:
                                Array.isArray(
                                    item.pendingFollowups
                                )
                                    ? [
                                        ...item.pendingFollowups
                                    ]
                                    : []
                        }
                    );

                    return;

                }


                // =================================
                // EXISTING PERSON
                // =================================

                const existing =
                    personMap.get(
                        personId
                    );


                const existingFollowups =
                    Array.isArray(
                        existing.pendingFollowups
                    )
                        ? existing.pendingFollowups
                        : [];


                const newFollowups =
                    Array.isArray(
                        item.pendingFollowups
                    )
                        ? item.pendingFollowups
                        : [];


                // =================================
                // MERGE
                // =================================

                const merged = [
                    ...existingFollowups,
                    ...newFollowups
                ];


                // =================================
                // REMOVE DUPLICATES
                // =================================

                const uniqueFollowups =
                    Array.from(

                        new Map(

                            merged.map(
                                (followup) => [

                                    followup.reminderId,

                                    followup

                                ]
                            )

                        ).values()

                    );


                // =================================
                // SORT BY TIME
                // Oldest / most urgent first
                // =================================

                uniqueFollowups.sort(
                    (a, b) => {

                        const dateA =
                            a.reminderTime
                                ? new Date(
                                    a.reminderTime
                                ).getTime()
                                : Infinity;


                        const dateB =
                            b.reminderTime
                                ? new Date(
                                    b.reminderTime
                                ).getTime()
                                : Infinity;


                        return (
                            dateA -
                            dateB
                        );

                    }
                );


                // =================================
                // HIGHEST / FIRST REMINDER
                // =================================

                const highest =
                    uniqueFollowups[0];


                personMap.set(
                    personId,
                    {

                        ...existing,

                        ...item,

                        reminderId:
                            highest?.reminderId
                            ??
                            existing.reminderId,

                        reminderType:
                            highest?.reminderType
                            ??
                            existing.reminderType,

                        reminderTime:
                            highest?.reminderTime
                            ??
                            existing.reminderTime,

                        pendingFollowups:
                            uniqueFollowups,

                        pendingCount:
                            uniqueFollowups.length

                    }
                );

            });


            // =====================================
            // FINAL LIST
            // =====================================

            const grouped =
                Array.from(
                    personMap.values()
                );


            // =====================================
            // SORT PEOPLE
            // Most urgent first
            // =====================================

            grouped.sort(
                (a, b) => {

                    const dateA =
                        a.reminderTime
                            ? new Date(
                                a.reminderTime
                            ).getTime()
                            : Infinity;


                    const dateB =
                        b.reminderTime
                            ? new Date(
                                b.reminderTime
                            ).getTime()
                            : Infinity;


                    return (
                        dateA -
                        dateB
                    );

                }
            );


            setReminders(
                grouped
            );


        } catch (error) {

            console.error(
                "Error fetching today's followups:",
                error
            );


            setError(
                "Failed to load today's followups"
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================
    // TOGGLE PERSON
    // =====================================

    const togglePending =
        (personId) => {

            setExpandedPerson(
                (previous) =>
                    previous === personId
                        ? null
                        : personId
            );

        };


    // =====================================
    // COMPLETE REMINDER
    // =====================================

    const handleComplete =
        async (reminderId) => {

            try {

                await completeReminder(
                    reminderId
                );


                alert(
                    "Reminder Completed"
                );


                await fetchReminders();


            } catch (error) {

                console.error(
                    "Error completing reminder:",
                    error
                );


                alert(
                    "Failed to complete reminder"
                );

            }

        };


    // =====================================
    // VIEW LEAD
    // =====================================

    const handleViewLead =
        (personId) => {

            if (!personId) {

                console.error(
                    "Person ID missing"
                );

                return;

            }


            const currentRole =
                localStorage.getItem(
                    "role"
                );


            if (
                currentRole ===
                "ADMIN"
            ) {

                navigate(
                    `/admin/lead/${personId}`
                );

                return;

            }


            if (
                currentRole ===
                "COUNSELLOR"
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


    // =====================================
    // FORMAT REMINDER TIME
    // =====================================

    const formatReminderTime =
        (reminderTime) => {

            if (!reminderTime) {

                return "-";

            }


            const reminderDate =
                new Date(
                    reminderTime
                );


            const now =
                new Date();


            const diff =
                reminderDate.getTime()
                -
                now.getTime();


            // =================================
            // OVERDUE
            // =================================

            if (diff < 0) {

                const totalMinutes =
                    Math.floor(
                        Math.abs(diff)
                        /
                        (1000 * 60)
                    );


                const days =
                    Math.floor(
                        totalMinutes / 1440
                    );


                const hours =
                    Math.floor(
                        (totalMinutes % 1440)
                        /
                        60
                    );


                const minutes =
                    totalMinutes % 60;


                if (days > 0) {

                    return (
                        `Overdue by ${days} ` +
                        `Day${days > 1 ? "s" : ""}`
                    );

                }


                if (hours > 0) {

                    return (
                        `Overdue by ${hours} ` +
                        `Hour${hours > 1 ? "s" : ""}`
                    );

                }


                return (
                    `Overdue by ${minutes} ` +
                    `Minute${minutes !== 1 ? "s" : ""}`
                );

            }


            // =================================
            // TODAY UPCOMING
            // =================================

            return (
                `Today • ` +
                reminderDate.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )
            );

        };


    // =====================================
    // GET PENDING LIST
    // =====================================

    const getPendingList =
        (item) => {

            if (
                !Array.isArray(
                    item.pendingFollowups
                )
            ) {

                return [];

            }


            return item.pendingFollowups

                .filter(
                    (followup) =>
                        !followup.completed
                )

                .sort(
                    (a, b) => {

                        const dateA =
                            a.reminderTime
                                ? new Date(
                                    a.reminderTime
                                ).getTime()
                                : Infinity;


                        const dateB =
                            b.reminderTime
                                ? new Date(
                                    b.reminderTime
                                ).getTime()
                                : Infinity;


                        return (
                            dateA -
                            dateB
                        );

                    }
                );

        };


    // =====================================
    // ICON
    // =====================================

    const getReminderIcon =
        (type) => {

            switch (type) {

                case "CALL":

                    return (
                        <FiPhone
                            size={16}
                        />
                    );


                case "EMAIL":

                    return (
                        <FiMail
                            size={16}
                        />
                    );


                case "SMS":

                    return (
                        <FiMessageSquare
                            size={16}
                        />
                    );


                default:

                    return (
                        <FiUser
                            size={16}
                        />
                    );

            }

        };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (

            <div className="today-followup-page">

                <div className="followup-card-wrapper">

                    <div className="pending-loading">

                        <h2>
                            Loading Today's Followups...
                        </h2>

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

            <div className="today-followup-page">

                <div className="followup-card-wrapper">

                    <div className="pending-error">

                        <h2>
                            {error}
                        </h2>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================
    // PAGE
    // =====================================

    return (

        <div className="today-followup-page">

            <div className="followup-card-wrapper">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="card-header">

                    <div>

                        <PageTitle
                            title="Today's Followups"
                        />

                        <p className="pending-subtitle">

                            Followups scheduled
                            for today.

                        </p>

                    </div>


                    <button
                        type="button"
                        className="back-btn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >

                        <FiArrowLeft
                            size={16}
                        />

                        Back

                    </button>

                </div>


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {reminders.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Followups Today
                        </h3>

                        <p>
                            There are no followups
                            scheduled for today.
                        </p>

                    </div>

                ) : (

                    /* =================================
                       TABLE
                    ================================= */

                    <div className="table-wrapper">

                        <table className="lead-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Next Followup
                                    </th>

                                    <th>
                                        Pending
                                    </th>

                                    <th>
                                        Reminder Status
                                    </th>

                                    <th>
                                        View
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {reminders.map(
                                    (item) => {

                                        const reminderDate =
                                            item.reminderTime
                                                ? new Date(
                                                    item.reminderTime
                                                )
                                                : null;


                                        const isOverdue =
                                            reminderDate
                                            &&
                                            reminderDate.getTime()
                                            <
                                            new Date().getTime();


                                        const pendingList =
                                            getPendingList(
                                                item
                                            );


                                        const pendingCount =
                                            item.pendingCount
                                            ??
                                            pendingList.length;


                                        const isExpanded =
                                            expandedPerson
                                            ===
                                            item.personId;


                                        /*
                                         * IMPORTANT:
                                         *
                                         * The Fragment itself is
                                         * the direct child of map().
                                         *
                                         * Therefore the key MUST
                                         * be on Fragment, not on
                                         * the <tr>.
                                         */

                                        return (

                                            <Fragment
                                                key={
                                                    item.personId
                                                }
                                            >

                                                {/* ================================= */}
                                                {/* MAIN ROW */}
                                                {/* ================================= */}

                                                <tr>

                                                    {/* NAME */}

                                                    <td>

                                                        <strong>

                                                            {[
                                                                item.firstName,
                                                                item.middleName,
                                                                item.lastName
                                                            ]
                                                                .filter(Boolean)
                                                                .join(" ")
                                                                ||
                                                                "-"
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* EMAIL */}

                                                    <td>

                                                        {
                                                            item.email
                                                            ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* LEAD STATUS */}

                                                    <td>

                                                        <span
                                                            className="status-badge"
                                                        >

                                                            {
                                                                item.leadStatus
                                                                ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* NEXT FOLLOWUP */}

                                                    <td>

                                                        <strong
                                                            className={
                                                                isOverdue
                                                                    ? "status-overdue"
                                                                    : "status-upcoming"
                                                            }
                                                        >

                                                            {
                                                                formatReminderTime(
                                                                    item.reminderTime
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* PENDING COUNT */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="pending-count-btn"
                                                            onClick={() =>
                                                                togglePending(
                                                                    item.personId
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

                                                            {
                                                                isExpanded

                                                                    ? (

                                                                        <FiChevronUp
                                                                            size={15}
                                                                        />

                                                                    )

                                                                    : (

                                                                        <FiChevronDown
                                                                            size={15}
                                                                        />

                                                                    )
                                                            }

                                                        </button>

                                                    </td>


                                                    {/* REMINDER STATUS */}

                                                    <td>

                                                        <span
                                                            className={
                                                                isOverdue
                                                                    ? "status-overdue"
                                                                    : "status-upcoming"
                                                            }
                                                        >

                                                            {
                                                                isOverdue
                                                                    ? "Overdue"
                                                                    : "Upcoming"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* VIEW LEAD */}

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="secondary-btn view-lead-btn"
                                                            onClick={() =>
                                                                handleViewLead(
                                                                    item.personId
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
                                                            onClick={() =>
                                                                handleComplete(
                                                                    item.reminderId
                                                                )
                                                            }
                                                        >

                                                            <FiCheck
                                                                size={15}
                                                            />

                                                            Complete

                                                        </button>

                                                    </td>

                                                </tr>


                                                {/* ================================= */}
                                                {/* EXPANDED FOLLOWUPS */}
                                                {/* ================================= */}

                                                {isExpanded && (

                                                    <tr>

                                                        <td
                                                            colSpan="8"
                                                            className="pending-details-cell"
                                                        >

                                                            <div className="pending-followups-list">


                                                                {/* =================================
                                                                   TITLE
                                                                ================================= */}

                                                                <div className="pending-details-title">

                                                                    <strong>

                                                                        {
                                                                            pendingCount
                                                                        }

                                                                        {" "}

                                                                        Followups for

                                                                        {" "}

                                                                        {[
                                                                            item.firstName,
                                                                            item.middleName,
                                                                            item.lastName
                                                                        ]
                                                                            .filter(Boolean)
                                                                            .join(" ")
                                                                            ||
                                                                            "-"
                                                                        }

                                                                    </strong>

                                                                </div>


                                                                {/* =================================
                                                                   LIST
                                                                ================================= */}

                                                                {pendingList.length === 0 ? (

                                                                    <div>

                                                                        No pending
                                                                        followups.

                                                                    </div>

                                                                ) : (

                                                                    pendingList.map(
                                                                        (
                                                                            followup,
                                                                            index
                                                                        ) => {

                                                                            const followupDate =
                                                                                followup.reminderTime
                                                                                    ? new Date(
                                                                                        followup.reminderTime
                                                                                    )
                                                                                    : null;


                                                                            const overdue =
                                                                                followupDate
                                                                                &&
                                                                                followupDate.getTime()
                                                                                <
                                                                                new Date().getTime();


                                                                            return (

                                                                                <div
                                                                                    className="pending-followup-item"
                                                                                    key={
                                                                                        followup.reminderId
                                                                                    }
                                                                                >


                                                                                    {/* NUMBER */}

                                                                                    <div>

                                                                                        <strong>

                                                                                            #
                                                                                            {
                                                                                                index + 1
                                                                                            }

                                                                                        </strong>

                                                                                    </div>


                                                                                    {/* TYPE */}

                                                                                    <div className="pending-followup-type">

                                                                                        <span className="pending-type-icon">

                                                                                            {
                                                                                                getReminderIcon(
                                                                                                    followup.reminderType
                                                                                                )
                                                                                            }

                                                                                        </span>

                                                                                        <span>

                                                                                            {
                                                                                                followup.reminderType
                                                                                            }

                                                                                        </span>

                                                                                    </div>


                                                                                    {/* TIME */}

                                                                                    <span
                                                                                        className={
                                                                                            overdue
                                                                                                ? "status-overdue"
                                                                                                : "status-upcoming"
                                                                                        }
                                                                                    >

                                                                                        {
                                                                                            formatReminderTime(
                                                                                                followup.reminderTime
                                                                                            )
                                                                                        }

                                                                                    </span>


                                                                                    {/* VIEW */}

                                                                                    <button
                                                                                        type="button"
                                                                                        className="secondary-btn view-lead-btn"
                                                                                        onClick={() =>
                                                                                            handleViewLead(
                                                                                                item.personId
                                                                                            )
                                                                                        }
                                                                                    >

                                                                                        <FiExternalLink
                                                                                            size={15}
                                                                                        />

                                                                                        View Lead

                                                                                    </button>


                                                                                    {/* COMPLETE */}

                                                                                    <button
                                                                                        type="button"
                                                                                        className="primary-btn complete-btn"
                                                                                        onClick={() =>
                                                                                            handleComplete(
                                                                                                followup.reminderId
                                                                                            )
                                                                                        }
                                                                                    >

                                                                                        <FiCheck
                                                                                            size={15}
                                                                                        />

                                                                                        Complete

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

                                            </Fragment>

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


export default TodayFollowupsPage;