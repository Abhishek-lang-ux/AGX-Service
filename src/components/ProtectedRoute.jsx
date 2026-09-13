import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { apiRequest, clearAuthSession, getAuthToken } from "../lib/api.js";

function ProtectedRoute() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

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
        await apiRequest("/auth/me");
        if (active) setAuthenticated(true);
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

  return <Outlet />;
}

export default ProtectedRoute;
