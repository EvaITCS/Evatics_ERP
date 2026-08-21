import {
    FiCalendar,
    FiClock,
    FiBell
} from "react-icons/fi";

import "../styles/notification.css";


function NotificationSummary({

                                 todayCount,

                                 pendingCount,

                                 escalatedCount,

                                 role

                             }) {

    // =====================================
    // TOTAL ACTIVE
    // =====================================

    const totalActive =
        role === "ADMIN"
            ? todayCount + pendingCount + escalatedCount
            : todayCount + pendingCount;


    return (

        <div className="notification-summary">


            {/* ================================= */}
            {/* TODAY */}
            {/* ================================= */}

            <div className="summary-card today-card">

                <div className="summary-icon">

                    <FiCalendar
                        size={28}
                    />

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


            {/* ================================= */}
            {/* PENDING */}
            {/* ================================= */}

            <div className="summary-card pending-card">

                <div className="summary-icon">

                    <FiClock
                        size={28}
                    />

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


            {/* ================================= */}
            {/* TOTAL */}
            {/* ================================= */}

            <div className="summary-card total-card">

                <div className="summary-icon">

                    <FiBell
                        size={28}
                    />

                </div>


                <div className="summary-content">

                    <span className="summary-label">

                        Total Active

                    </span>


                    <h2>

                        {totalActive}

                    </h2>


                    <p>

                        Total reminders to handle

                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* 48-HOUR ESCALATIONS */}
            {/* ADMIN ONLY */}
            {/* ================================= */}

            {role === "ADMIN" && (

                <div className="summary-card escalation-card">

                    <div className="summary-icon">

                        <FiBell
                            size={28}
                        />

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

            )}

        </div>

    );

}


export default NotificationSummary;