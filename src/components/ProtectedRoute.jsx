import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken, getStoredUser } from "../lib/api.js";

function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();

  const token = getAuthToken();
  const storedUser = getStoredUser();

  const userRole =
    storedUser?.role ||
    storedUser?.user?.role ||
    null;

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRole && userRole && userRole !== allowedRole) {
    if (userRole === "retailer") {
      return <Navigate to="/retailer/dashboard" replace />;
    }

    if (userRole === "client") {
      return <Navigate to="/dashboard" replace />;
    }

    if (userRole === "distributor") {
      return <Navigate to="/distributor/dashboard" replace />;
    }

    if (userRole === "superadmin") {
      return <Navigate to="/superadmin" replace />;
    }
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
