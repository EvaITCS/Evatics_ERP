import { useNavigate } from "react-router-dom";

import {
    FiPhone,
    FiMail,
    FiMessageSquare,
    FiUser,
    FiExternalLink,
    FiCheck,
    FiClock
} from "react-icons/fi";

import "../styles/notification.css";


function ReminderCard({
                          reminder,
                          type,
                          onComplete
                      }) {

    const navigate = useNavigate();


    // =====================================================
    // CALLBACK CHECK
    // =====================================================

    const isCallback =
        reminder?.callbackScheduledAt != null;


    // =====================================================
    // REMINDER ICON
    // =====================================================

    const getReminderIcon = () => {

        if (isCallback) {

            return (
                <FiPhone size={14} />
            );
        }


        switch (reminder?.reminderType) {

            case "CALL":

                return (
                    <FiPhone size={14} />
                );


            case "EMAIL":

                return (
                    <FiMail size={14} />
                );


            case "SMS":

                return (
                    <FiMessageSquare size={14} />
                );


            default:

                return (
                    <FiUser size={14} />
                );
        }
    };


    // =====================================================
    // FULL NAME
    // =====================================================

    const getFullName = () => {

        return [

                reminder?.firstName,

                reminder?.middleName,

                reminder?.lastName

            ]

                .filter(Boolean)

                .join(" ")

            || "Unknown Lead";
    };


    // =====================================================
    // CALLBACK DATE
    // =====================================================

    const getCallbackDate = () => {

        if (!reminder?.callbackScheduledAt) {

            return null;
        }


        const callbackDate =
            new Date(
                reminder.callbackScheduledAt
            );


        return callbackDate.toLocaleString(
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
    // TIME
    // =====================================================

    const getTimeText = () => {

        if (!reminder?.reminderTime) {

            return "-";
        }


        const reminderDate =
            new Date(
                reminder.reminderTime
            );


        const now =
            new Date();


        const diff =
            reminderDate.getTime()
            -
            now.getTime();


        // =================================================
        // OVERDUE
        // =================================================

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
                    `Overdue by ${days} `
                    +
                    `Day${days > 1 ? "s" : ""}`
                );
            }


            if (hours > 0) {

                return (
                    `Overdue by ${hours} `
                    +
                    `Hour${hours > 1 ? "s" : ""}`
                );
            }


            return (
                `Overdue by ${minutes} `
                +
                `Min${minutes !== 1 ? "s" : ""}`
            );
        }


        // =================================================
        // TODAY
        // =================================================

        if (
            reminderDate.toDateString()
            ===
            now.toDateString()
        ) {

            return (
                `Today • `
                +
                reminderDate.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )
            );
        }


        // =================================================
        // FUTURE
        // =================================================

        return reminderDate.toLocaleString(
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
    // OVERDUE
    // =====================================================

    const isOverdue =
        reminder?.reminderTime
        &&
        new Date(
            reminder.reminderTime
        ).getTime()
        <
        new Date().getTime();


    // =====================================================
    // CALLBACK DUE
    // =====================================================

    const isCallbackDue =
        isCallback
        &&
        reminder?.callbackScheduledAt
        &&
        new Date(
            reminder.callbackScheduledAt
        ).getTime()
        <=
        new Date().getTime();


    // =====================================================
    // VIEW LEAD
    // =====================================================

    const handleViewLead = () => {

        if (!reminder?.personId) {

            console.error(
                "Person ID missing:",
                reminder
            );

            return;
        }


        const role =
            localStorage.getItem(
                "role"
            );


        // =================================================
        // ADMIN
        // =================================================

        if (role === "ADMIN") {

            navigate(
                `/admin/lead/${reminder.personId}`
            );

            return;
        }


        // =================================================
        // COUNSELLOR
        // =================================================

        if (role === "COUNSELLOR") {

            navigate(
                `/COUNSELLOR/lead/${reminder.personId}`
            );

            return;
        }


        // =================================================
        // FALLBACK
        // =================================================

        navigate(
            `/lead/${reminder.personId}`
        );
    };


    // =====================================================
    // COMPLETE
    // =====================================================

    const handleComplete = () => {

        if (!reminder?.reminderId) {

            return;
        }


        onComplete?.(
            reminder.reminderId
        );
    };


    // =====================================================
    // CALLBACK ACTION
    // =====================================================

    const handleCallNow = () => {

        if (!reminder?.personId) {

            return;
        }


        /*
         * For now we open the lead.
         *
         * Counsellor can perform the call
         * from Lead Details.
         */

        handleViewLead();
    };


    // =====================================================
    // DISPLAY TYPE
    // =====================================================

    const displayType =
        isCallback
            ? "CALLBACK"
            : (
                reminder?.reminderType
                || "GENERAL"
            );


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className={
                `reminder-card ${
                    type === "TODAY"
                        ? "today-card"
                        : "pending-card"
                } ${
                    isCallback
                        ? "callback-card"
                        : ""
                } ${
                    isCallbackDue
                        ? "callback-due"
                        : ""
                }`
            }
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="reminder-header">

                <div>

                    <h3>
                        {getFullName()}
                    </h3>


                    <small
                        className={
                            isOverdue
                                ? "notification-overdue"
                                : ""
                        }
                    >

                        {isCallbackDue
                            ? "⚠️ CALLBACK DUE"
                            : getTimeText()
                        }

                    </small>

                </div>


                <span className="status-chip">

                    {getReminderIcon()}

                    <span>
                        {displayType}
                    </span>

                </span>

            </div>


            {/* =================================================
                BODY
            ================================================= */}

            <div className="reminder-body">


                {/* =================================================
                    CALLBACK
                ================================================= */}

                {isCallback && (

                    <div className="info-row">

                        <strong>
                            <FiClock size={14} />
                            {" "}Callback:
                        </strong>

                        <span>

                            {getCallbackDate()}

                        </span>

                    </div>

                )}


                {/* =================================================
                    TYPE
                ================================================= */}

                <div className="info-row">

                    <strong>
                        Type:
                    </strong>

                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                        }}
                    >

                        {getReminderIcon()}

                        {displayType}

                    </span>

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div className="info-row">

                    <strong>
                        Email:
                    </strong>

                    <span>
                        {reminder?.email || "-"}
                    </span>

                </div>


                {/* =================================================
                    PHONE
                ================================================= */}

                <div className="info-row">

                    <strong>
                        Phone:
                    </strong>

                    <span>
                        {reminder?.phone || "-"}
                    </span>

                </div>


                {/* =================================================
                    LEAD STATUS
                ================================================= */}

                {reminder?.leadStatus && (

                    <div className="info-row">

                        <strong>
                            Status:
                        </strong>

                        <span className="lead-status">

                            {reminder.leadStatus}

                        </span>

                    </div>

                )}

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="reminder-footer">


                {/* =================================================
                    CALLBACK → CALL NOW
                ================================================= */}

                {isCallback && isCallbackDue && (

                    <button

                        type="button"

                        className="primary-btn"

                        onClick={handleCallNow}

                        disabled={!reminder?.personId}

                    >

                        <FiPhone
                            size={14}
                        />

                        Call Now

                    </button>

                )}


                {/* =================================================
                    VIEW LEAD
                ================================================= */}

                <button

                    type="button"

                    className="secondary-btn"

                    onClick={handleViewLead}

                    disabled={!reminder?.personId}

                >

                    <FiExternalLink
                        size={14}
                    />

                    View Lead

                </button>


                {/* =================================================
                    COMPLETE
                ================================================= */}

                <button

                    type="button"

                    className="primary-btn"

                    onClick={handleComplete}

                    disabled={
                        !reminder?.reminderId
                    }

                >

                    <FiCheck
                        size={14}
                    />

                    Complete

                </button>

            </div>

        </div>
    );
}


export default ReminderCard;