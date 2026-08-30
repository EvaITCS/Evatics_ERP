import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../shared/components/PageTitle";
import NotificationSummary from "../components/NotificationSummary";
import ReminderCard from "../components/ReminderCard";

import {
    FiCalendar,
    FiClock,
    FiBell,
    FiPhone
} from "react-icons/fi";

import {
    getNotificationPage,
    markNotificationAsRead
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

    const [callbackNotifications, setCallbackNotifications] =
        useState([]);

    const [smsReplyNotifications, setSmsReplyNotifications] =
        useState([]);

    const [followupNotifications, setFollowupNotifications] =
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
    // FOLLOW-UP NOTIFICATION CLICK
    // =====================================================

    const handleFollowupNotification = async (
        notification
    ) => {

        if (!notification) {
            return;
        }

        try {

            // ---------------------------------------------
            // MARK AS READ
            // ---------------------------------------------

            if (
                notification.notificationId &&
                notification.isRead !== true
            ) {

                await markNotificationAsRead(
                    notification.notificationId
                );
            }


            // ---------------------------------------------
            // UPDATE OTHER COMPONENTS
            // ---------------------------------------------

            window.dispatchEvent(
                new Event("notification-read")
            );


            // ---------------------------------------------
            // OPEN FOLLOW-UP
            // ---------------------------------------------

            if (notification.followupId) {

                navigate(
                    `/leads/${notification.leadPersonId}/followups`
                );

                return;
            }


            // ---------------------------------------------
            // FALLBACK
            // ---------------------------------------------

            if (notification.leadPersonId) {

                navigate(
                    `/leads/${notification.leadPersonId}`
                );
            }

        } catch (error) {

            console.error(
                "Failed to process follow-up notification:",
                error
            );
        }
    };


    // =====================================================
    // UNIQUE ESCALATIONS
    // =====================================================

    const getUniqueEscalations = (
        notifications
    ) => {

        const uniqueEscalations =
            new Map();

        notifications.forEach(
            (notification) => {

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
            }
        );

        return Array.from(
            uniqueEscalations.values()
        );
    };


    // =====================================================
    // COUNSELLOR NAME
    // =====================================================

    const getCounsellorName = (
        notification
    ) => {

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

    const getScheduledTime = (
        notification
    ) => {

        return (
            notification?.nextFollowupAt ||
            notification?.callbackScheduledAt ||
            notification?.followupScheduledAt ||
            notification?.scheduledAt ||
            notification?.followUpScheduledAt ||
            null
        );
    };


    // =====================================================
    // OVERDUE HOURS
    // =====================================================

    const getOverdueHours = (
        notification
    ) => {

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


            if (role !== "ADMIN") {

                setTodayReminders(
                    getUniquePersons(
                        rawToday
                    )
                );

            } else {

                setTodayReminders([]);

            }


            // =================================================
            // PENDING
            // =================================================

            const rawPending =
                Array.isArray(data?.pending)
                    ? data.pending
                    : [];


            if (role !== "ADMIN") {

                setPendingReminders(
                    getUniquePersons(
                        rawPending
                    )
                );

            } else {

                setPendingReminders([]);

            }


            // =================================================
            // ALL NOTIFICATIONS
            // =================================================

            const allNotifications =
                Array.isArray(data?.notifications)
                    ? data.notifications
                    : [];


            // =================================================
            // NORMAL FOLLOW-UP NOTIFICATIONS
            // =================================================

            if (role !== "ADMIN") {

                const normalFollowupNotifications =
                    allNotifications.filter(
                        (notification) =>
                            notification?.notificationType ===
                            "FOLLOWUP" &&
                            notification?.actionResult !==
                            "SMS_REPLIED" &&
                            notification?.isRead !== true
                    );


                setFollowupNotifications(
                    normalFollowupNotifications
                );


                // =================================================
                // SMS REPLIED NOTIFICATIONS
                //
                // Important:
                // Backend must return:
                //
                // notificationType = FOLLOWUP
                // actionResult = SMS_REPLIED
                // nextFollowupAt = selected date/time
                // =================================================

                // =================================================
// SMS REPLY FOLLOW-UP NOTIFICATIONS
//
// SMS_REPLIED follow-ups come from ReminderResponse
// inside TODAY / PENDING, not necessarily from
// data.notifications.
//
// Backend ReminderResponse contains:
// actionResult
// nextFollowupAt
// =================================================

                const smsReplyReminders = [
                    ...rawToday,
                    ...rawPending
                ].filter(
                    (reminder) =>
                        reminder?.actionResult === "SMS_REPLIED" &&
                        reminder?.nextFollowupAt
                );

// Remove duplicate person + follow-up combinations
                const uniqueSmsReplies = [];

                const smsReplyKeys = new Set();

                smsReplyReminders.forEach((reminder) => {

                    const personId =
                        reminder?.personId;

                    const followupTime =
                        reminder?.nextFollowupAt;

                    const key =
                        `${personId}_${followupTime}`;

                    if (!smsReplyKeys.has(key)) {

                        smsReplyKeys.add(key);

                        uniqueSmsReplies.push({
                            ...reminder,

                            // Keep same naming convention
                            leadPersonId:
                            reminder?.personId,

                            notificationType:
                                "FOLLOWUP",

                            title:
                                "SMS Reply Received",

                            message:
                                "SMS reply received. Follow-up has been scheduled.",

                            isRead:
                                false,

                            createdAt:
                            reminder?.reminderTime
                        });
                    }
                });

                setSmsReplyNotifications(
                    uniqueSmsReplies
                );

            } else {

                setFollowupNotifications([]);

                setSmsReplyNotifications([]);

            }


            // =================================================
            // CALLBACK NOTIFICATIONS
            // =================================================

            if (role !== "ADMIN") {

                // -------------------------------------------------
                // TODAY CALLBACKS
                // -------------------------------------------------

                const todayCallbacks =
                    rawToday
                        .filter(
                            (reminder) =>
                                reminder?.callbackScheduledAt
                        )
                        .map(
                            (reminder) => ({

                                notificationId:
                                    null,

                                notificationType:
                                    "CALLBACK_REMINDER",

                                title:
                                    "Callback Scheduled",

                                message:
                                    "Callback is scheduled.",

                                isRead:
                                    false,

                                createdAt:
                                    reminder?.reminderTime ||
                                    reminder?.callbackScheduledAt,

                                leadPersonId:
                                reminder?.personId,

                                followupScheduledAt:
                                reminder?.callbackScheduledAt,

                                callbackScheduledAt:
                                reminder?.callbackScheduledAt,

                                personId:
                                reminder?.personId,

                                firstName:
                                reminder?.firstName,

                                middleName:
                                reminder?.middleName,

                                lastName:
                                reminder?.lastName,

                                email:
                                reminder?.email,

                                phone:
                                reminder?.phone
                            })
                        );


                // -------------------------------------------------
                // REAL CALLBACK NOTIFICATIONS
                // -------------------------------------------------

                const notificationCallbacks =
                    allNotifications.filter(
                        (notification) =>
                            (
                                notification?.notificationType ===
                                "CALLBACK_REMINDER" ||

                                notification?.notificationType ===
                                "CALLBACK_DUE"
                            )
                            &&
                            notification?.isRead !== true
                    );


                // -------------------------------------------------
                // MERGE
                // -------------------------------------------------

                const mergedCallbacks = [

                    ...todayCallbacks,

                    ...notificationCallbacks

                ];


                // -------------------------------------------------
                // REMOVE DUPLICATES
                // -------------------------------------------------

                const uniqueCallbacks = [];

                const callbackKeys =
                    new Set();


                mergedCallbacks.forEach(
                    (callback) => {

                        const leadId =
                            callback?.leadPersonId ||
                            callback?.personId;


                        const callbackTime =
                            callback?.callbackScheduledAt ||
                            callback?.followupScheduledAt ||
                            "";


                        const notificationType =
                            callback?.notificationType ||
                            "";


                        const key =
                            `${leadId}_${callbackTime}_${notificationType}`;


                        if (
                            !callbackKeys.has(
                                key
                            )
                        ) {

                            callbackKeys.add(
                                key
                            );

                            uniqueCallbacks.push(
                                callback
                            );
                        }
                    }
                );


                setCallbackNotifications(
                    uniqueCallbacks
                );

            } else {

                setCallbackNotifications([]);

            }


            // =================================================
            // ADMIN ESCALATIONS
            // =================================================

            if (role === "ADMIN") {

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
            setInterval(
                () => {

                    loadNotifications(true);

                },
                30000
            );


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


        if (role === "ADMIN") {

            navigate(
                `/admin/lead/${leadPersonId}`
            );

        } else {

            navigate(
                `/COUNSELLOR/lead/${leadPersonId}`
            );

        }
    };


    // =====================================================
    // CALLBACK NOTIFICATION
    // =====================================================

    const handleCallbackNotification = async (
        notification
    ) => {

        try {

            if (
                notification?.notificationId &&
                notification?.isRead !== true
            ) {

                await markNotificationAsRead(
                    notification.notificationId
                );
            }


            window.dispatchEvent(
                new Event("notification-read")
            );


            if (!notification?.leadPersonId) {

                console.error(
                    "Lead person ID is missing from callback notification."
                );

                return;
            }


            if (role === "ADMIN") {

                navigate(
                    `/admin/lead/${notification.leadPersonId}`
                );

            } else {

                navigate(
                    `/COUNSELLOR/lead/${notification.leadPersonId}`
                );

            }

        } catch (error) {

            console.error(
                "Failed to process callback notification:",
                error
            );
        }
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


        if (
            assigningNotificationId ===
            notification.notificationId
        ) {

            setAssigningNotificationId(null);

            setSelectedCounsellor("");

            return;
        }


        setAssigningNotificationId(
            notification.notificationId
        );

        setSelectedCounsellor("");


        if (
            counsellors.length === 0
        ) {

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


            await reassignCounsellor(
                notificationId,
                employeePersonId
            );


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


            setAssigningNotificationId(null);

            setSelectedCounsellor("");


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

                            {
                                refreshing
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

                        callbackCount={
                            callbackNotifications.length
                        }

                        smsReplyCount={
                            smsReplyNotifications.length
                        }

                        role={
                            role
                        }

                    />

                </div>


                {/* ================================================= */}
                {/* TODAY */}
                {/* ================================================= */}

                {role !== "ADMIN" && (

                    <section className="notification-section">

                        <div className="section-header">

                            <div className="section-title">

                                <span className="status-dot green" />

                                <h2>
                                    Today's Followups
                                </h2>

                            </div>


                            <span className="count-badge today">

                                {
                                    todayReminders.length
                                }

                            </span>

                        </div>


                        {
                            todayReminders.length === 0

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

                                        {
                                            todayReminders.map(
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
                                            )
                                        }

                                    </div>

                                )
                        }

                    </section>

                )}


                {/* ================================================= */}
                {/* PENDING */}
                {/* ================================================= */}

                {role !== "ADMIN" && (

                    <section className="notification-section">

                        <div className="section-header">

                            <div className="section-title">

                                <span className="status-dot orange" />

                                <h2>
                                    Incomplete Followups
                                </h2>

                            </div>


                            <span className="count-badge pending">

                                {
                                    pendingReminders.length
                                }

                            </span>

                        </div>


                        {
                            pendingReminders.length === 0

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

                                        {
                                            pendingReminders.map(
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
                                            )
                                        }

                                    </div>

                                )
                        }

                    </section>

                )}


                {/* ================================================= */}
                {/* NORMAL FOLLOW-UP NOTIFICATIONS */}
                {/* ================================================= */}




                {/* ================================================= */}
                {/* SMS REPLY FOLLOW-UPS */}
                {/* ================================================= */}

                {role !== "ADMIN" && (

                    <section className="notification-section">

                        <div className="section-header">

                            <div className="section-title">

                                <span className="status-dot green" />

                                <h2>
                                    SMS Reply Follow-Ups
                                </h2>

                            </div>


                            <span className="count-badge today">

                                {
                                    smsReplyNotifications.length
                                }

                            </span>

                        </div>


                        {
                            smsReplyNotifications.length === 0

                                ? (

                                    <div className="empty-card">

                                        <h3
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                        >

                                            <FiBell
                                                size={20}
                                            />

                                            No SMS Reply Follow-Ups

                                        </h3>


                                        <p>
                                            No SMS reply follow-up has been scheduled.
                                        </p>

                                    </div>

                                )

                                : (

                                    <div className="notification-grid">

                                        {
                                            smsReplyNotifications.map(
                                                (notification) => {

                                                    const nextFollowup =
                                                        notification?.nextFollowupAt ||
                                                        notification?.followupScheduledAt ||
                                                        notification?.scheduledAt;


                                                    return (

                                                        <div
                                                            className="admin-escalation-card"
                                                            key={
                                                                notification.notificationId ||
                                                                notification.followupId
                                                            }
                                                        >

                                                            {/* ========================= */}
                                                            {/* HEADER */}
                                                            {/* ========================= */}

                                                            <div className="admin-escalation-header">

                                                                <div>

                                                                    <h3
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: "8px"
                                                                        }}
                                                                    >

                                                                        <FiBell
                                                                            size={20}
                                                                        />

                                                                        SMS Reply Received

                                                                    </h3>


                                                                    <span className="escalation-label">

                                                                        SMS REPLIED

                                                                    </span>

                                                                </div>

                                                            </div>


                                                            {/* ========================= */}
                                                            {/* INFORMATION */}
                                                            {/* ========================= */}

                                                            <div className="escalation-info">


                                                                {/* MESSAGE */}

                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Message
                                                                    </span>

                                                                    <strong className="info-value">

                                                                        {
                                                                            notification?.message ||
                                                                            "SMS reply received. Follow-up has been scheduled."
                                                                        }

                                                                    </strong>

                                                                </div>


                                                                {/* NEXT FOLLOW-UP DATE */}

                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Next Follow-Up
                                                                    </span>

                                                                    <strong
                                                                        className="info-value"
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: "6px"
                                                                        }}
                                                                    >

                                                                        <FiCalendar
                                                                            size={15}
                                                                        />

                                                                        {
                                                                            nextFollowup
                                                                                ? new Date(
                                                                                    nextFollowup
                                                                                ).toLocaleDateString(
                                                                                    "en-IN",
                                                                                    {
                                                                                        day: "2-digit",
                                                                                        month: "short",
                                                                                        year: "numeric"
                                                                                    }
                                                                                )
                                                                                : "-"
                                                                        }

                                                                    </strong>

                                                                </div>


                                                                {/* NEXT FOLLOW-UP TIME */}

                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Scheduled Time
                                                                    </span>

                                                                    <strong
                                                                        className="info-value"
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: "6px"
                                                                        }}
                                                                    >

                                                                        <FiClock
                                                                            size={15}
                                                                        />

                                                                        {
                                                                            nextFollowup
                                                                                ? new Date(
                                                                                    nextFollowup
                                                                                ).toLocaleTimeString(
                                                                                    "en-IN",
                                                                                    {
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit"
                                                                                    }
                                                                                )
                                                                                : "-"
                                                                        }

                                                                    </strong>

                                                                </div>


                                                                {/* CREATED */}

                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Created
                                                                    </span>

                                                                    <strong className="info-value">

                                                                        {
                                                                            notification?.createdAt
                                                                                ? new Date(
                                                                                    notification.createdAt
                                                                                ).toLocaleString(
                                                                                    "en-IN"
                                                                                )
                                                                                : "-"
                                                                        }

                                                                    </strong>

                                                                </div>

                                                            </div>


                                                            {/* ========================= */}
                                                            {/* ACTION */}
                                                            {/* ========================= */}

                                                            <div className="admin-escalation-actions">

                                                                <button
                                                                    type="button"
                                                                    className="primary-btn"
                                                                    onClick={() =>
                                                                        handleViewLead(
                                                                            notification?.leadPersonId ||
                                                                            notification?.personId
                                                                        )
                                                                    }
                                                                >
                                                                    <FiBell
                                                                        size={15}
                                                                        style={{
                                                                            marginRight: "6px",
                                                                            verticalAlign: "middle"
                                                                        }}
                                                                    />

                                                                    View Follow-Up
                                                                </button>

                                                            </div>

                                                        </div>

                                                    );

                                                }
                                            )
                                        }

                                    </div>

                                )
                        }

                    </section>

                )}


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

                                {
                                    escalatedNotifications.length
                                }

                            </span>

                        </div>


                        {
                            escalatedNotifications.length === 0

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

                                        {
                                            escalatedNotifications.map(
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


                                                            <div className="escalation-info">

                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Counsellor
                                                                    </span>

                                                                    <strong className="info-value">
                                                                        {
                                                                            counsellorName
                                                                        }
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


                                                            {/* ================================================= */}
                                                            {/* COUNSELLOR PANEL */}
                                                            {/* ================================================= */}

                                                            {
                                                                isAssignOpen && (

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


                                                                            {
                                                                                counsellors.map(
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
                                                                                )
                                                                            }

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

                                                                )
                                                            }

                                                        </div>

                                                    );

                                                }
                                            )
                                        }

                                    </div>

                                )
                        }

                    </section>

                )}


                {/* ================================================= */}
                {/* CALLBACK NOTIFICATIONS */}
                {/* ================================================= */}

                {role !== "ADMIN" && (

                    <section className="notification-section">

                        <div className="section-header">

                            <div className="section-title">

                                <span className="status-dot red" />

                                <h2>
                                    Callback Notifications
                                </h2>

                            </div>


                            <span className="count-badge pending">

                                {
                                    callbackNotifications.length
                                }

                            </span>

                        </div>


                        {
                            callbackNotifications.length === 0

                                ? (

                                    <div className="empty-card">

                                        <h3>

                                            <FiPhone
                                                size={20}
                                            />

                                            No Callback Notifications

                                        </h3>


                                        <p>
                                            You have no pending callback notifications.
                                        </p>

                                    </div>

                                )

                                : (

                                    <div className="notification-grid">

                                        {
                                            callbackNotifications.map(
                                                (notification) => {

                                                    const callbackTime =
                                                        notification?.callbackScheduledAt ||
                                                        notification?.followupScheduledAt ||
                                                        notification?.scheduledAt;


                                                    const isDue =
                                                        notification?.notificationType ===
                                                        "CALLBACK_DUE"
                                                        ||
                                                        (
                                                            callbackTime &&
                                                            new Date(
                                                                callbackTime
                                                            ).getTime() <=
                                                            Date.now()
                                                        );


                                                    return (

                                                        <div
                                                            className={
                                                                `admin-escalation-card ${
                                                                    isDue
                                                                        ? "callback-due"
                                                                        : ""
                                                                }`
                                                            }
                                                            key={
                                                                notification.notificationId ||
                                                                `${notification.leadPersonId}_${callbackTime}`
                                                            }
                                                        >

                                                            <div className="admin-escalation-header">

                                                                <div>

                                                                    <h3>

                                                                        {
                                                                            isDue ? (

                                                                                <>
                                                                                    <FiBell
                                                                                        size={20}
                                                                                    />

                                                                                    Callback Due
                                                                                </>

                                                                            ) : (

                                                                                <>
                                                                                    <FiClock
                                                                                        size={20}
                                                                                    />

                                                                                    Callback Reminder
                                                                                </>

                                                                            )
                                                                        }

                                                                    </h3>


                                                                    <span className="escalation-label">

                                                                        {
                                                                            isDue
                                                                                ? "CALL NOW"
                                                                                : "5 Minutes Before"
                                                                        }

                                                                    </span>

                                                                </div>

                                                            </div>


                                                            <div className="escalation-info">

                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Message
                                                                    </span>


                                                                    <strong className="info-value">

                                                                        {
                                                                            notification?.message
                                                                            ||
                                                                            (
                                                                                isDue
                                                                                    ? "Callback is due now."
                                                                                    : "Callback is scheduled in 5 minutes."
                                                                            )
                                                                        }

                                                                    </strong>

                                                                </div>


                                                                <div className="escalation-info-row">

                                                                    <span className="info-label">
                                                                        Created
                                                                    </span>


                                                                    <strong className="info-value">

                                                                        {
                                                                            notification?.createdAt

                                                                                ? new Date(
                                                                                    notification.createdAt
                                                                                ).toLocaleString(
                                                                                    "en-IN"
                                                                                )

                                                                                : "-"
                                                                        }

                                                                    </strong>

                                                                </div>

                                                            </div>


                                                            <div className="admin-escalation-actions">

                                                                <button
                                                                    type="button"
                                                                    className="primary-btn"
                                                                    onClick={() =>
                                                                        handleCallbackNotification(
                                                                            notification
                                                                        )
                                                                    }
                                                                >

                                                                    {
                                                                        isDue ? (

                                                                            <>
                                                                                <FiPhone
                                                                                    size={15}
                                                                                />

                                                                                Call Now
                                                                            </>

                                                                        ) : (

                                                                            <>
                                                                                <FiClock
                                                                                    size={15}
                                                                                />

                                                                                View Callback
                                                                            </>

                                                                        )
                                                                    }

                                                                </button>

                                                            </div>

                                                        </div>

                                                    );

                                                }
                                            )
                                        }

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