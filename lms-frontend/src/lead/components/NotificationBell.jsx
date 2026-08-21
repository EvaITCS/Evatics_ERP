import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";

import {
    getUnreadNotificationCount
} from "../services/notificationService";

import "../../shared/styles/sidebar.css";

function NotificationBell() {

    const [count, setCount] = useState(0);

    const navigate = useNavigate();

    const role = localStorage.getItem("role");


    // =========================================================
    // LOAD UNREAD NOTIFICATION COUNT
    // =========================================================

    const loadNotificationCount = async () => {

        try {

            const data =
                await getUnreadNotificationCount();

            /*
             * Backend response different formats me aa sakta hai:
             *
             * 1. 1
             * 2. { count: 1 }
             * 3. { unreadCount: 1 }
             */

            let unreadCount = 0;

            if (typeof data === "number") {

                unreadCount = data;

            } else if (
                typeof data === "object" &&
                data !== null
            ) {

                unreadCount =
                    data.unreadCount ??
                    data.count ??
                    0;

            }

            setCount(
                Number(unreadCount) || 0
            );

        } catch (error) {

            console.error(
                "Unread Notification Count Error:",
                error
            );

            setCount(0);
        }
    };


    // =========================================================
    // INITIAL LOAD + AUTO REFRESH
    // =========================================================

    useEffect(() => {

        loadNotificationCount();


        /*
         * Refresh every 30 seconds
         */

        const interval = setInterval(() => {

            loadNotificationCount();

        }, 30000);


        /*
         * Notification page se notification read hone ke
         * baad ye event fire hoga.
         */

        const handleNotificationRead = () => {

            loadNotificationCount();

        };


        window.addEventListener(
            "notification-read",
            handleNotificationRead
        );


        /*
         * Browser tab/window wapas active hone par
         * latest unread count fetch karo.
         */

        const handleVisibilityChange = () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                loadNotificationCount();

            }
        };


        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        return () => {

            clearInterval(interval);

            window.removeEventListener(
                "notification-read",
                handleNotificationRead
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };

    }, []);


    // =========================================================
    // OPEN NOTIFICATIONS
    // =========================================================

    const openNotifications = () => {

        if (role === "ADMIN") {

            navigate("/admin/notifications");

        } else if (role === "STUDENT") {

            navigate("/student/notifications");

        } else {

            navigate("/COUNSELLOR/notifications");

        }
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            className="notification-bell-wrapper"
            onClick={openNotifications}
            title="Notifications"
        >

            <FiBell
                size={23}
                className="notification-icon"
            />


            {count > 0 && (

                <span className="notification-badge">

                    {count > 99
                        ? "99+"
                        : count}

                </span>

            )}

        </div>
    );
}

export default NotificationBell;