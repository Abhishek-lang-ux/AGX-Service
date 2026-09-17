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
        if (active) { setUserRole(meData?.user?.role || meData?.role || null); setAuthenticated(true); }
      } catch {
        clearAuthSession();
        if (active) setAuthenticated(false);
      } finally {
        if (active) setChecking(false);
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
    return <Navigate to={userRole === "retailer" ? "/retailer/dashboard" : "/dashboard"} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
