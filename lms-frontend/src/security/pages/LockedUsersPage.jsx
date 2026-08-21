import React, { useEffect, useState } from "react";
import securityService from "../services/securityService";
import LockedUsersTable from "../components/LockedUsersTable";
import "../styles/security.css";

export default function LockedUsersPage() {

    const [lockedUsers, setLockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // LOAD LOCKED USERS
    // ==============================

    const loadLockedUsers = async () => {

        try {

            setLoading(true);

            const data =
                await securityService.getLockedUsers();

            setLockedUsers(data);

        } catch (err) {

            console.error(err);

            setError("Unable to load locked users.");

        } finally {

            setLoading(false);
        }
    };

    // ==============================
    // PAGE LOAD
    // ==============================

    useEffect(() => {

        loadLockedUsers();

    }, []);

    // ==============================
    // UNLOCK USER
    // ==============================

    const handleUnlock = async (userId) => {

        const confirmUnlock = window.confirm(
            "Unlock this account?"
        );

        if (!confirmUnlock) return;

        try {

            await securityService.unlockUser(userId);

            alert("User unlocked successfully.");

            loadLockedUsers();

        } catch (err) {

            console.error(err);

            alert("Unable to unlock user.");
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="security-page">

                <h2>Security Management</h2>

                <p>Loading Locked Users...</p>

            </div>

        );
    }

    // ==============================
    // ERROR
    // ==============================

    if (error) {

        return (

            <div className="security-page">

                <h2>Security Management</h2>

                <p className="security-error">

                    {error}

                </p>

            </div>

        );
    }

    // ==============================
    // PAGE
    // ==============================
return (
    <div className="locked-users-page">

        <div className="security-page">

            <div className="security-header">

                <div>
                    <h2>Locked User Accounts</h2>
                    <p>Accounts locked after 3 failed login attempts.</p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={loadLockedUsers}
                >
                    Refresh
                </button>

            </div>

            <div className="security-summary">

                <div className="summary-card">
                    <h3>{lockedUsers.length}</h3>
                    <span>Locked Accounts</span>
                </div>

            </div>

            <LockedUsersTable
                users={lockedUsers}
                onUnlock={handleUnlock}
            />

        </div>

    </div>
);
}