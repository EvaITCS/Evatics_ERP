import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../shared/components/PageTitle";
import NotificationSummary from "../components/NotificationSummary";
import ReminderCard from "../components/ReminderCard";

import {
    getNotificationPage
} from "../services/notificationService";

import {
    completeReminder
} from "../services/reminderService";

import {
    resetFollowupCycle,
    reassignCounsellor
} from "../services/adminFollowupService";

import employeeService from "../../employee/services/employeeService";

import "../styles/notification.css";


function NotificationsPage() {

    const navigate = useNavigate();

    const role =
        localStorage.getItem("role");


    // =====================================================
    // STATE
    // =====================================================

    const [todayReminders, setTodayReminders] =
        useState([]);

    const [pendingReminders, setPendingReminders] =
        useState([]);

    const [escalatedNotifications, setEscalatedNotifications] =
        useState([]);

    const [escalatedCount, setEscalatedCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);


    // =====================================================
    // COUNSELLORS
    // =====================================================

    const [counsellors, setCounsellors] =
        useState([]);

    const [loadingCounsellors, setLoadingCounsellors] =
        useState(false);


    // =====================================================
    // ASSIGNMENT
    // =====================================================

    const [assigningNotificationId, setAssigningNotificationId] =
        useState(null);

    const [selectedCounsellor, setSelectedCounsellor] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);


    // =====================================================
    // UNIQUE PERSON REMINDERS
    // =====================================================

    const getUniquePersons = (reminders) => {

        const uniquePersons = new Map();

        reminders.forEach((reminder) => {

            const personId =
                reminder?.personId;

            if (!personId) {
                return;
            }

            if (!uniquePersons.has(personId)) {

                uniquePersons.set(
                    personId,
                    reminder
                );
            }
        });

        return Array.from(
            uniquePersons.values()
        );
    };


    // =====================================================
    // UNIQUE ESCALATIONS
    // =====================================================

    const getUniqueEscalations = (notifications) => {

        const uniqueEscalations =
            new Map();

        notifications.forEach((notification) => {

            const leadPersonId =
                notification?.leadPersonId;

            if (!leadPersonId) {
                return;
            }

            if (
                !uniqueEscalations.has(
                    leadPersonId
                )
            ) {

                uniqueEscalations.set(
                    leadPersonId,
                    notification
                );
            }
        });

        return Array.from(
            uniqueEscalations.values()
        );
    };


    // =====================================================
    // COUNSELLOR NAME
    // =====================================================

    const getCounsellorName = (notification) => {

        if (notification?.counsellorName) {
            return notification.counsellorName;
        }

        if (notification?.employeeName) {
            return notification.employeeName;
        }

        if (notification?.consultantName) {
            return notification.consultantName;
        }

        const message =
            notification?.message || "";

        const match =
            message.match(
                /pending with (.+?) for more than 48 hours/i
            );

        if (match?.[1]) {
            return match[1].trim();
        }

        return "Unknown Counsellor";
    };


    // =====================================================
    // SCHEDULED TIME
    // =====================================================

    const getScheduledTime = (notification) => {

        return (
            notification?.followupScheduledAt ||
            notification?.scheduledAt ||
            notification?.followUpScheduledAt ||
            null
        );
    };


    // =====================================================
    // OVERDUE HOURS
    // =====================================================

    const getOverdueHours = (notification) => {

        const scheduledAt =
            getScheduledTime(notification);

        if (!scheduledAt) {
            return null;
        }

        const scheduledTime =
            new Date(
                scheduledAt
            ).getTime();

        if (
            Number.isNaN(
                scheduledTime
            )
        ) {
            return null;
        }

        const difference =
            Date.now() -
            scheduledTime;

        if (difference <= 0) {
            return 0;
        }

        return Math.floor(
            difference /
            (1000 * 60 * 60)
        );
    };


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    const loadNotifications = async (
        background = false
    ) => {

        try {

            if (!background) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }


            const data =
                await getNotificationPage();


            // =================================================
            // TODAY
            // =================================================

            const rawToday =
                Array.isArray(data?.today)
                    ? data.today
                    : [];

            setTodayReminders(
                getUniquePersons(
                    rawToday
                )
            );


            // =================================================
            // PENDING
            // =================================================

            const rawPending =
                Array.isArray(data?.pending)
                    ? data.pending
                    : [];

            setPendingReminders(
                getUniquePersons(
                    rawPending
                )
            );


            // =================================================
            // ADMIN ESCALATIONS
            // =================================================

            if (role === "ADMIN") {

                const allNotifications =
                    Array.isArray(
                        data?.notifications
                    )
                        ? data.notifications
                        : [];


                const escalations =
                    allNotifications.filter(
                        (notification) =>
                            notification?.notificationType ===
                            "FOLLOWUP_ESCALATED"
                            &&
                            notification?.isRead !== true
                    );


                const uniqueEscalations =
                    getUniqueEscalations(
                        escalations
                    );


                setEscalatedNotifications(
                    uniqueEscalations
                );


                setEscalatedCount(
                    uniqueEscalations.length
                );

            } else {

                setEscalatedNotifications([]);
                setEscalatedCount(0);
            }


        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =====================================================
    // INITIAL LOAD + AUTO REFRESH
    // =====================================================

    useEffect(() => {

        loadNotifications(false);


        const interval =
            setInterval(() => {

                loadNotifications(true);

            }, 30000);


        return () =>
            clearInterval(interval);

    }, []);


    // =====================================================
    // COMPLETE REMINDER
    // =====================================================

    const handleComplete = async (
        reminderId
    ) => {

        if (!reminderId) {

            console.error(
                "Reminder ID is missing"
            );

            return;
        }


        try {

            await completeReminder(
                reminderId
            );

            await loadNotifications();

        } catch (error) {

            console.error(
                "Failed to complete reminder:",
                error
            );

            alert(
                "Failed to complete reminder."
            );
        }
    };


    // =====================================================
    // VIEW LEAD
    // =====================================================

    const handleViewLead = (
        leadPersonId
    ) => {

        if (!leadPersonId) {

            console.error(
                "Lead person ID is missing"
            );

            return;
        }


        navigate(
            `/admin/lead/${leadPersonId}`
        );
    };


    // =====================================================
    // LOAD COUNSELLORS
    // =====================================================

    const loadCounsellors = async () => {

        try {

            setLoadingCounsellors(true);


            const response =
                await employeeService.getCounsellors();


            const data =
                Array.isArray(
                    response?.data
                )
                    ? response.data
                    : [];


            setCounsellors(
                data
            );

        } catch (error) {

            console.error(
                "Failed to load counsellors:",
                error
            );

            setCounsellors([]);

            alert(
                "Failed to load counsellors."
            );

        } finally {

            setLoadingCounsellors(false);
        }
    };


    // =====================================================
    // OPEN ASSIGN
    // =====================================================

    const handleOpenAssign = async (
        notification
    ) => {

        if (!notification?.notificationId) {

            alert(
                "Notification ID is missing."
            );

            return;
        }


        // Toggle

        if (
            assigningNotificationId ===
            notification.notificationId
        ) {

            setAssigningNotificationId(null);
            setSelectedCounsellor("");

            return;
        }


        // Open

        setAssigningNotificationId(
            notification.notificationId
        );

        setSelectedCounsellor("");


        // Load counsellors

        if (counsellors.length === 0) {

            await loadCounsellors();
        }
    };


    // =====================================================
    // CLOSE ASSIGN
    // =====================================================

    const handleCloseAssign = () => {

        if (actionLoading) {
            return;
        }

        setAssigningNotificationId(null);
        setSelectedCounsellor("");
    };


    // =====================================================
    // RESET FOLLOW-UP
    // SAME COUNSELLOR
    // =====================================================

    const handleResetCycle = async (
        notification
    ) => {

        const personId =
            notification?.leadPersonId;


        if (!personId) {

            alert(
                "Lead person ID is missing."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Reset the follow-up cycle for this lead?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(true);


            await resetFollowupCycle(
                personId
            );


            // =================================================
            // REMOVE ESCALATION IMMEDIATELY
            // =================================================

            setEscalatedNotifications(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item?.leadPersonId !==
                            personId
                    )
            );


            setEscalatedCount(
                (previous) =>
                    Math.max(
                        0,
                        previous - 1
                    )
            );


            setAssigningNotificationId(null);
            setSelectedCounsellor("");


            // =================================================
            // RELOAD BACKEND STATE
            // =================================================

            await loadNotifications();


            alert(
                "Follow-up cycle reset successfully."
            );

        } catch (error) {

            console.error(
                "Failed to reset follow-up cycle:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );

            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Failed to reset follow-up cycle."
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =====================================================
    // ASSIGN + RESET
    // =====================================================

    const handleAssignAndReset = async (
        notification
    ) => {

        const notificationId =
            notification?.notificationId;

        const leadPersonId =
            notification?.leadPersonId;


        if (!notificationId) {

            alert(
                "Notification ID is missing."
            );

            return;
        }


        if (!leadPersonId) {

            alert(
                "Lead person ID is missing."
            );

            return;
        }


        if (!selectedCounsellor) {

            alert(
                "Please select a counsellor."
            );

            return;
        }


        const employeePersonId =
            Number(
                selectedCounsellor
            );


        if (
            Number.isNaN(
                employeePersonId
            )
        ) {

            alert(
                "Invalid counsellor selected."
            );

            return;
        }


        try {

            setActionLoading(true);


            // =================================================
            // BACKEND EXPECTS NOTIFICATION ID
            // =================================================

            await reassignCounsellor(
                notificationId,
                employeePersonId
            );


            // =================================================
            // REMOVE ADMIN ESCALATION
            // =================================================

            setEscalatedNotifications(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item?.leadPersonId !==
                            leadPersonId
                    )
            );


            setEscalatedCount(
                (previous) =>
                    Math.max(
                        0,
                        previous - 1
                    )
            );


            // =================================================
            // CLOSE ASSIGN PANEL
            // =================================================

            setAssigningNotificationId(null);
            setSelectedCounsellor("");


            // =================================================
            // RELOAD EVERYTHING
            // =================================================

            await loadNotifications();


            alert(
                "Counsellor assigned and follow-up cycle reset successfully."
            );

        } catch (error) {

            console.error(
                "Failed to assign counsellor:",
                error
            );

            console.error(
                "SERVER RESPONSE:",
                error?.response?.data
            );

            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Failed to assign counsellor."
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="notifications-page">

                <div className="empty-card">

                    <h3>
                        Loading Notifications...
                    </h3>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="notifications-page">

            <div className="notifications-card-wrapper">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="card-header">

                    <div>

                        <PageTitle
                            title="Notifications"
                        />

                        <p className="subtitle-text">
                            View Today's and Pending Followups
                        </p>

                    </div>


                    <div className="header-actions">

                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={() =>
                                loadNotifications()
                            }
                            disabled={refreshing}
                        >
                            {refreshing
                                ? "Refreshing..."
                                : "↻ Refresh"
                            }
                        </button>


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

                </div>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <div className="summary-wrapper">

                    <NotificationSummary

                        todayCount={
                            todayReminders.length
                        }

                        pendingCount={
                            pendingReminders.length
                        }

                        escalatedCount={
                            escalatedCount
                        }

                        role={
                            role
                        }

                    />

                </div>


                {/* ================================================= */}
                {/* TODAY */}
                {/* ================================================= */}

                <section className="notification-section">

                    <div className="section-header">

                        <div className="section-title">

                            <span className="status-dot green" />

                            <h2>
                                Today's Followups
                            </h2>

                        </div>


                        <span className="count-badge today">
                            {todayReminders.length}
                        </span>

                    </div>


                    {todayReminders.length === 0

                        ? (

                            <div className="empty-card">

                                <h3>
                                    🎉 No Followups Scheduled Today
                                </h3>

                                <p>
                                    You're all caught up for today.
                                </p>

                            </div>

                        )

                        : (

                            <div className="notification-grid">

                                {todayReminders.map(
                                    (reminder) => (

                                        <ReminderCard

                                            key={
                                                reminder.personId
                                            }

                                            reminder={
                                                reminder
                                            }

                                            type="TODAY"

                                            onComplete={
                                                handleComplete
                                            }

                                        />

                                    )
                                )}

                            </div>
                        )
                    }

                </section>


                {/* ================================================= */}
                {/* PENDING */}
                {/* ================================================= */}

                <section className="notification-section">

                    <div className="section-header">

                        <div className="section-title">

                            <span className="status-dot orange" />

                            <h2>
                                Incomplete Followups
                            </h2>

                        </div>


                        <span className="count-badge pending">
                            {pendingReminders.length}
                        </span>

                    </div>


                    {pendingReminders.length === 0

                        ? (

                            <div className="empty-card">

                                <h3>
                                    No Incomplete Followups
                                </h3>

                                <p>
                                    Great! There are no pending followups.
                                </p>

                            </div>

                        )

                        : (

                            <div className="notification-grid">

                                {pendingReminders.map(
                                    (reminder) => (

                                        <ReminderCard

                                            key={
                                                reminder.personId
                                            }

                                            reminder={
                                                reminder
                                            }

                                            type="PENDING"

                                            onComplete={
                                                handleComplete
                                            }

                                        />

                                    )
                                )}

                            </div>
                        )
                    }

                </section>


                {/* ================================================= */}
                {/* ADMIN 48-HOUR ESCALATIONS */}
                {/* ================================================= */}

                {role === "ADMIN" && (

                    <section className="notification-section">

                        <div className="section-header">

                            <div className="section-title">

                                <span className="status-dot red" />

                                <h2>
                                    48-Hour Escalations
                                </h2>

                            </div>


                            <span className="count-badge pending">
                                {escalatedNotifications.length}
                            </span>

                        </div>


                        {escalatedNotifications.length === 0

                            ? (

                                <div className="empty-card">

                                    <h3>
                                        🎉 No 48-Hour Escalations
                                    </h3>

                                    <p>
                                        No follow-up has been escalated to Admin.
                                    </p>

                                </div>

                            )

                            : (

                                <div className="notification-grid admin-escalation-grid">

                                    {escalatedNotifications.map(
                                        (notification) => {

                                            const isAssignOpen =
                                                assigningNotificationId ===
                                                notification.notificationId;


                                            const counsellorName =
                                                getCounsellorName(
                                                    notification
                                                );


                                            const overdueHours =
                                                getOverdueHours(
                                                    notification
                                                );


                                            return (

                                                <div
                                                    className="admin-escalation-card"
                                                    key={
                                                        notification.notificationId ||
                                                        notification.leadPersonId
                                                    }
                                                >

                                                    {/* ================================= */}
                                                    {/* HEADER */}
                                                    {/* ================================= */}

                                                    <div className="admin-escalation-header">

                                                        <div>

                                                            <h3>
                                                                Follow-Up Overdue
                                                            </h3>

                                                            <span className="escalation-label">
                                                                48+ Hour Escalation
                                                            </span>

                                                        </div>

                                                    </div>


                                                    {/* ================================= */}
                                                    {/* INFORMATION */}
                                                    {/* ================================= */}

                                                    <div className="escalation-info">

                                                        <div className="escalation-info-row">

                                                            <span className="info-label">
                                                                Counsellor
                                                            </span>

                                                            <strong className="info-value">
                                                                {counsellorName}
                                                            </strong>

                                                        </div>


                                                        <div className="escalation-info-row">

                                                            <span className="info-label">
                                                                Overdue
                                                            </span>

                                                            <strong className="overdue-value">

                                                                {
                                                                    overdueHours !== null
                                                                        ? `${overdueHours} hours`
                                                                        : "48+ hours"
                                                                }

                                                            </strong>

                                                        </div>

                                                    </div>


                                                    {/* ================================= */}
                                                    {/* ACTIONS */}
                                                    {/* ================================= */}

                                                    <div className="admin-escalation-actions">

                                                        <button
                                                            type="button"
                                                            className="primary-btn"
                                                            onClick={() =>
                                                                handleViewLead(
                                                                    notification.leadPersonId
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading
                                                            }
                                                        >
                                                            View Lead
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="secondary-btn"
                                                            onClick={() =>
                                                                handleResetCycle(
                                                                    notification
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading
                                                            }
                                                        >
                                                            {
                                                                actionLoading
                                                                    ? "Processing..."
                                                                    : "Reset Follow-up"
                                                            }
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="primary-btn assign-counsellor-btn"
                                                            onClick={() =>
                                                                handleOpenAssign(
                                                                    notification
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading
                                                            }
                                                        >
                                                            {
                                                                isAssignOpen
                                                                    ? "Close"
                                                                    : "Assign Counsellor"
                                                            }
                                                        </button>

                                                    </div>


                                                    {/* ================================= */}
                                                    {/* COUNSELLOR PANEL */}
                                                    {/* ================================= */}

                                                    {isAssignOpen && (

                                                        <div className="inline-counsellor-panel">

                                                            <label>
                                                                Select Counsellor
                                                            </label>


                                                            <select
                                                                value={
                                                                    selectedCounsellor
                                                                }
                                                                onChange={
                                                                    (event) =>
                                                                        setSelectedCounsellor(
                                                                            event.target.value
                                                                        )
                                                                }
                                                                disabled={
                                                                    loadingCounsellors ||
                                                                    actionLoading
                                                                }
                                                            >

                                                                <option value="">

                                                                    {
                                                                        loadingCounsellors
                                                                            ? "Loading Counsellors..."
                                                                            : "Select Counsellor"
                                                                    }

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
                                                                                counsellor.counsellorName
                                                                            }
                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>


                                                            <div className="inline-assign-actions">

                                                                <button
                                                                    type="button"
                                                                    className="secondary-btn"
                                                                    onClick={
                                                                        handleCloseAssign
                                                                    }
                                                                    disabled={
                                                                        actionLoading
                                                                    }
                                                                >
                                                                    Cancel
                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    className="primary-btn"
                                                                    onClick={() =>
                                                                        handleAssignAndReset(
                                                                            notification
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        actionLoading ||
                                                                        loadingCounsellors ||
                                                                        !selectedCounsellor
                                                                    }
                                                                >
                                                                    {
                                                                        actionLoading
                                                                            ? "Assigning..."
                                                                            : "Assign & Reset"
                                                                    }
                                                                </button>

                                                            </div>

                                                        </div>

                                                    )}

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )
                        }

                    </section>

                )}

            </div>

        </div>
    );
}


export default NotificationsPage;