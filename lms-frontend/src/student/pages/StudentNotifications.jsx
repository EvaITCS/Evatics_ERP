import { useEffect, useState } from "react";
import StudentLayout from "../layouts/StudentLayout";
import api from "../../api/axios";
import studentService from "../services/studentService";
import {
    getMyNotifications,
    markNotificationAsRead
} from "../../lead/services/notificationService";

// Modern Icons Import
import { FiBell, FiCheck, FiCheckCircle2 } from "react-icons/fi"; 
import "../styles/student.css";

export default function StudentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [student, setStudent] = useState({});

    const email = localStorage.getItem("email");

    // FETCH STUDENT PROFILE + BATCH
    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await api.get("/student/profile");
                const masterData = response.data;

                if (masterData) {
                    const formattedApplicationNo =
                        masterData.applicationNumber?.startsWith("LEAD-")
                            ? "APP" + String(masterData.applicationNumber.replace("LEAD-", ""))
                            : masterData.applicationNumber ||
                              masterData.enrollmentNo ||
                              masterData.studentId ||
                              "";

                    setStudent((prev) => ({
                        ...prev,
                        ...masterData,
                        name: masterData.firstName
                            ? `${masterData.firstName} ${masterData.lastName || ""}`.trim()
                            : "Student",
                        dashboardType: "DETAIL",
                        applicationNumber: formattedApplicationNo,
                        enrollmentNo: formattedApplicationNo,
                        personId: masterData.personId,
                        program:
                            masterData.programName ||
                            masterData.program ||
                            prev.program ||
                            ""
                    }));
                }
            } catch (err) {
                console.error("Profile Fetch Error in Notifications Page:", err);
                setStudent((prev) => ({
                    ...prev,
                    name: "Student",
                    dashboardType: "DETAIL"
                }));
            }
        };

        const fetchStudentBatch = async () => {
            try {
                const response = await studentService.getMyBatch(email);
                setStudent((prev) => ({
                    ...prev,
                    program: response.data?.programName || prev.program || ""
                }));
            } catch (err) {
                console.error("Notifications - My Batch Fetch Error:", err);
            }
        };

        fetchStudentProfile();
        fetchStudentBatch();
    }, [email]);

    // LOAD NOTIFICATIONS
    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getMyNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load notifications:", err);
            setError("Unable to load notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    // MARK AS READ
    const handleRead = async (notification) => {
        if (notification.isRead) return;

        try {
            await markNotificationAsRead(notification.notificationId);
            setNotifications((prev) =>
                prev.map((item) =>
                    item.notificationId === notification.notificationId
                        ? { ...item, isRead: true }
                        : item
                )
            );
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    // FORMAT DATE
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <StudentLayout student={student}>
            <div className="student-notifications-page">

                {/* PAGE HEADER */}
                <div className="student-notifications-header">
                    <div>
                        <h2>Notifications</h2>
                        <p>Stay updated with your latest notifications.</p>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="student-notifications-state">
                        Loading notifications...
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="student-notifications-state error">
                        {error}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && notifications.length === 0 && (
                    <div className="student-notifications-state">
                        <div className="notification-empty-icon">
                            <FiBell size={38} color="#94a3b8" />
                        </div>
                        <h3>No notifications</h3>
                        <p>You don't have any notifications right now.</p>
                    </div>
                )}

                {/* NOTIFICATION LIST */}
                {!loading && !error && notifications.length > 0 && (
                    <div className="student-notifications-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.notificationId}
                                className={`student-notification-card ${
                                    notification.isRead ? "read" : "unread"
                                }`}
                                onClick={() => handleRead(notification)}
                            >
                                {/* DYNAMIC REACT ICON */}
                                <div className="student-notification-icon">
                                    {notification.isRead ? (
                                        <FiCheck className="icon-read" size={18} />
                                    ) : (
                                        <FiBell className="icon-unread" size={18} />
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="student-notification-content">
                                    <div className="student-notification-title-row">
                                        <h3>{notification.title}</h3>
                                        {!notification.isRead && (
                                            <span className="student-notification-dot" />
                                        )}
                                    </div>

                                    <p>{notification.message}</p>

                                    <span className="student-notification-date">
                                        {formatDate(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}