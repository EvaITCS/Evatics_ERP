import "../styles/notification.css";

import {
    FiCalendar,
    FiClock,
    FiBell,
    FiPhone
} from "react-icons/fi";



    function NotificationSummary({
                                     todayCount,
                                     pendingCount,
                                     escalatedCount,
                                     callbackCount,
                                     smsReplyCount,
                                     role
                                 }) {
    // =====================================================
    // ADMIN SUMMARY
    // =====================================================

    if (role === "ADMIN") {

        return (

            <div className="notification-summary">

                {/* =========================================
                    TOTAL ACTIVE
                ========================================= */}

                <div className="summary-card total-card">

                    <div className="summary-icon">

                        <FiBell size={28} />

                    </div>

                    <div className="summary-content">

                        <span className="summary-label">
                            Total Active
                        </span>

                        <h2>
                            {escalatedCount + callbackCount}
                        </h2>

                        <p>
                            Active notifications to handle
                        </p>

                    </div>

                </div>


                {/* =========================================
                    48-HOUR ESCALATIONS
                ========================================= */}

                <div className="summary-card escalation-card">

                    <div className="summary-icon">

                        <FiBell size={28} />

                    </div>

                    <div className="summary-content">

                        <span className="summary-label">
                            48-Hour Escalations
                        </span>

                        <h2>
                            {escalatedCount}
                        </h2>

                        <p>
                            Followups escalated to admin
                        </p>

                    </div>

                </div>




            </div>

        );
    }


    // =====================================================
    // COUNSELLOR SUMMARY
    // =====================================================

    return (

        <div className="notification-summary">

            {/* =============================================
                TODAY
            ============================================= */}

            <div className="summary-card today-card">

                <div className="summary-icon">

                    <FiCalendar size={28} />

                </div>

                <div className="summary-content">

                    <span className="summary-label">
                        Today's Followups
                    </span>

                    <h2>
                        {todayCount}
                    </h2>

                    <p>
                        Scheduled for today
                    </p>

                </div>

            </div>


            {/* =============================================
                PENDING
            ============================================= */}

            <div className="summary-card pending-card">

                <div className="summary-icon">

                    <FiClock size={28} />

                </div>

                <div className="summary-content">

                    <span className="summary-label">
                        Incomplete Followups
                    </span>

                    <h2>
                        {pendingCount}
                    </h2>

                    <p>
                        Need immediate attention
                    </p>

                </div>

            </div>


            {/* =============================================
                TOTAL ACTIVE
            ============================================= */}

            <div className="summary-card total-card">

                <div className="summary-icon">

                    <FiBell size={28} />

                </div>

                <div className="summary-content">

                    <span className="summary-label">
                        Total Active
                    </span>

                    <h2>
                        {
                            todayCount +
                            pendingCount +
                            callbackCount +
                            smsReplyCount
                        }
                    </h2>

                    <p>
                        Total reminders to handle
                    </p>

                </div>

            </div>


            {/* =============================================
                CALLBACK NOTIFICATIONS
            ============================================= */}

            <div className="summary-card callback-card">

                <div className="summary-icon">

                    <FiPhone size={28} />

                </div>

                <div className="summary-content">

                    <span className="summary-label">
                        Callback Notifications
                    </span>

                    <h2>
                        {callbackCount}
                    </h2>

                    <p>
                        Upcoming and due callbacks
                    </p>

                </div>

            </div>
            {/* =============================================
    SMS REPLY NOTIFICATIONS
============================================= */}

            <div className="summary-card sms-reply-card">

                <div className="summary-icon">

                    <FiBell size={28} />

                </div>

                <div className="summary-content">

        <span className="summary-label">
            SMS Reply Followups
        </span>

                    <h2>
                        {smsReplyCount}
                    </h2>

                    <p>
                        Scheduled after SMS reply
                    </p>

                </div>

            </div>
        </div>

    );

}


export default NotificationSummary;