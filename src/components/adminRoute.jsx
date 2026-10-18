
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingAnimation from "./loadingAnimation";

export default function AdminRoute() {
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let cancelled = false;

        const checkAdmin = async () => {
            const token = localStorage.getItem("token");

            // No login token means no admin access.
            if (!token) {
                if (!cancelled) {
                    setStatus("denied");
                }
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Support common API response structures.
                const role =
                    response.data?.role ??
                    response.data?.user?.role ??
                    response.data?.profile?.role;

                // Only an authenticated admin can access admin routes.
                if (!cancelled) {
                    setStatus(
                        role === "admin" ? "allowed" : "denied"
                    );
                }
            } catch (error) {
                // Invalid or expired token, or failed profile request.
                localStorage.removeItem("token");

                if (!cancelled) {
                    setStatus("denied");
                }
            }
        };

        checkAdmin();

        return () => {
            cancelled = true;
        };
    }, []);

    if (status === "checking") {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <LoadingAnimation />
            </div>
        );
    }

    if (status === "denied") {
        return <Navigate to="/404" replace />;
    }

    return <Outlet />;
}
