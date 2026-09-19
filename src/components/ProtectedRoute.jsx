import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  apiRequest,
  clearAuthSession,
  getAuthToken,
  getStoredUser,
} from "../lib/api.js";

function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();
  const storedUser = getStoredUser();
  const storedRole =
    storedUser?.role || storedUser?.user?.role || null;

  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(Boolean(getAuthToken()));
  const [userRole, setUserRole] = useState(storedRole);

  useEffect(() => {
    let active = true;

    async function validateSession() {
      const token = getAuthToken();

      if (!token) {
        if (active) {
          setAuthenticated(false);
          setUserRole(null);
          setChecking(false);
        }
        return;
      }

      try {
        const meData = await apiRequest("/auth/me");
        const role =
          meData?.user?.role ||
          meData?.role ||
          storedRole ||
          null;

        if (active) {
          setUserRole(role);
          setAuthenticated(true);
        }
      } catch (error) {
        /*
         * Do not immediately destroy a locally valid session because
         * a temporary /auth/me request failure can otherwise redirect
         * the user away from the dashboard.
         */
        if (active) {
          setAuthenticated(Boolean(getAuthToken()));
          setUserRole(storedRole);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    validateSession();

    return () => {
      active = false;
    };
  }, [storedRole]);

  if (checking) {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        Checking your secure session...
      </div>
    );
  }

  if (!authenticated) {
    clearAuthSession();
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (allowedRole && userRole !== allowedRole) {
    if (userRole === "retailer") {
      return <Navigate to="/retailer/dashboard" replace />;
    }

    if (userRole === "client") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
