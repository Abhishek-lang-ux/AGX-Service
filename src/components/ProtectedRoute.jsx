import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { apiRequest, clearAuthSession, getAuthToken } from "../lib/api.js";

function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let active = true;

    async function validateSession() {
      const token = getAuthToken();

      if (!token) {
        if (active) {
          setAuthenticated(false);
          setChecking(false);
        }
        return;
      }

      try {
        const meData = await apiRequest("/auth/me");
        const role = meData?.user?.role || meData?.role || null;

        if (active) {
          setUserRole(role);
          setAuthenticated(true);
        }
      } catch {
        clearAuthSession();

        if (active) {
          setAuthenticated(false);
          setUserRole(null);
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
  }, []);

  if (checking) {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        Checking your secure session...
      </div>
    );
  }

  if (!authenticated) {
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
