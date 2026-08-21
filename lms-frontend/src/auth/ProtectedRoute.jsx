import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

function ProtectedRoute({
                            children,
                            allowedRole
                        }) {

    const [loading, setLoading] = useState(true);

    const [authenticated, setAuthenticated] =
        useState(false);

    const [role, setRole] =
        useState(null);

    const [mustChangePassword, setMustChangePassword] =
        useState(false);


    useEffect(() => {

        const checkLogin = async () => {

            try {

                const response =
                    await api.get("/auth/me");

                setAuthenticated(true);

                setRole(response.data.role);

                /*
                 * ==========================================
                 * FIRST LOGIN PASSWORD CHECK
                 * ==========================================
                 *
                 * Backend should return:
                 *
                 * mustChangePassword: true / false
                 *
                 */

                const mustChange =
                    response.data.mustChangePassword === true;

                setMustChangePassword(mustChange);

                /*
                 * Keep localStorage synchronized
                 */

                localStorage.setItem(
                    "mustChangePassword",
                    String(mustChange)
                );

            }

            catch (error) {

                console.error(
                    "Authentication check failed:",
                    error
                );

                setAuthenticated(false);

            }

            finally {

                setLoading(false);

            }

        };


        checkLogin();

    }, []);


    // =====================================================
    // WAIT
    // =====================================================

    if (loading) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!authenticated) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // =====================================================
    // FORCE PASSWORD CHANGE
    // =====================================================

    /*
     * IMPORTANT:
     *
     * ProtectedRoute should NOT redirect the
     * Change Password page itself.
     *
     * Therefore ChangePasswordPage should be outside
     * this ProtectedRoute.
     */

    if (mustChangePassword) {

        return (
            <Navigate
                to="/change-password"
                replace
            />
        );

    }


    // =====================================================
    // ROLE CHECK
    // =====================================================

 if (
    allowedRole &&
    !(
        Array.isArray(allowedRole)
            ? allowedRole.includes(role)
            : role === allowedRole
    )
) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // =====================================================
    // ACCESS GRANTED
    // =====================================================

    return children;
}

export default ProtectedRoute;