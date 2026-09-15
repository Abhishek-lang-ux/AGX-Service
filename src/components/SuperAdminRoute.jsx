import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  apiRequest,
  clearAuthSession,
  getAuthToken,
} from "../lib/api.js";

function SuperAdminRoute() {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function validateSuperAdmin() {
      const token = getAuthToken();

      if (!token) {
        if (active) {
          setAuthorized(false);
          setChecking(false);
        }
        return;
      }

      try {
        const response = await apiRequest("/auth/me");

        const role = response?.user?.role;

        if (role === "superadmin") {
          if (active) {
            setAuthorized(true);
          }
        } else {
          if (active) {
            setAuthorized(false);
          }
        }
      } catch {
        clearAuthSession();

        if (active) {
          setAuthorized(false);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    validateSuperAdmin();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="route-loading" role="status" aria-live="polite">
        Verifying SuperAdmin access...
      </div>
    );
  }

  if (!getAuthToken()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!authorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default SuperAdminRoute;