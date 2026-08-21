import { useState } from "react";
import {
    changePassword,
    changePasswordByInvitation
} from "../../user/service/userService";

import "../styles/Password.css";

export default function ChangePasswordCard({ token = null, onSuccess }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!currentPassword.trim()) {
            alert("Please enter your current password");
            return;
        }

        if (!newPassword.trim()) {
            alert("Please enter your new password");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (!confirmPassword.trim()) {
            alert("Please confirm your new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (currentPassword === newPassword) {
            alert("New password must be different from current password");
            return;
        }

        try {
            setLoading(true);

           if (token) {
    const res = await changePasswordByInvitation({
        token,
        currentPassword,
        newPassword,
        confirmPassword
    });

    console.log("Invitation password change response:", res.data);

    if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
    }

    if (res.data?.role) {
        localStorage.setItem("role", res.data.role);
    }

    if (res.data?.userId) {
        localStorage.setItem("userId", res.data.userId);
    }

    if (res.data?.personId) {
        localStorage.setItem("personId", res.data.personId);
    }

    localStorage.setItem("mustChangePassword", "false");
} else {
                await changePassword({
                    oldPassword: currentPassword,
                    newPassword,
                    confirmPassword
                });

                localStorage.setItem("mustChangePassword", "false");
            }

            alert("Password Changed Successfully");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Change password error:", error);
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to change password";

            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="unique-password-card" onSubmit={handleSubmit}>
            <h2>Change Password</h2>

            {/* CURRENT PASSWORD */}
            <div className="form-group">
                <label>Current Password</label>
                <div className="input-wrapper">
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={loading}
                    >
                        {showCurrentPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={loading}
                    >
                        {showNewPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <small>Password must be at least 6 characters.</small>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Changing Password..." : "Change Password"}
            </button>
        </form>
    );
}