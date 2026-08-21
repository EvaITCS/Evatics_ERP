import React from "react";

export default function LockedUsersTable({ users, onUnlock }) {
    return (
        <div className="table-container">

            <table className="security-table">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Failed Attempts</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={index}>

                                {/* ID (employee or student) */}
                                <td>
                                    {user.employeeId || user.personId || "N/A"}
                                </td>

                                {/* Name */}
                                <td>
                                    {user.name ||
 user.fullName ||
 `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
 "Unknown"}
                                </td>

                                {/* Email */}
                                <td>
                                    {user.email || "N/A"}
                                </td>

                                {/* Role */}
                                <td>
                                    {user.role || "USER"}
                                </td>

                                {/* Failed Attempts */}
                                <td>
                                    {user.failedAttempts ?? 0}
                                </td>

                                {/* Status */}
                                <td>
                                    <span className="status-badge locked">
                                        LOCKED
                                    </span>
                                </td>

                                {/* Action */}
                                <td>
                                    <button
                                        className="unlock-btn"
                                        onClick={() => onUnlock(user.userId)}
                                    >
                                        Unlock
                                    </button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No locked users found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

        </div>
    );
}