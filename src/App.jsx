import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import SuperAdminRoute from "./components/SuperAdminRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import RetailerRegister from "./pages/RetailerRegister";

import Dashboard from "./pages/Dashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import MyRequests from "./pages/MyRequests";
import RequestDetails from "./pages/RequestDetails";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminLayout from "./components/SuperAdminLayout";

import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminStaff from "./pages/SuperAdminStaff";
import SuperAdminServices from "./pages/SuperAdminServices";
import SuperAdminRequests from "./pages/SuperAdminRequests";
import SuperAdminDocuments from "./pages/SuperAdminDocuments";
import SuperAdminPayments from "./pages/SuperAdminPayments";
import SuperAdminNotifications from "./pages/SuperAdminNotifications";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import Documents from "./pages/Documents";
import NewRequest from "./pages/NewRequest";
import Payments from "./pages/Payments";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AccountSettings from "./pages/AccountSettings";
import ChangePassword from "./pages/ChangePassword";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import ActiveSessions from "./pages/ActiveSessions";
import Notifications from "./pages/Notifications";

import NotFound from "./pages/NotFound";
import "./App.css";

function AppLayout() {
  const location = useLocation();

  const hideNavbarFooter =
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  location.pathname.startsWith("/superadmin");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/services" element={<Services />} />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/register" element={<Register />} />
        <Route path="/retailer/register" element={<RetailerRegister />} />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Retailer Portal */}
        <Route
          path="/retailer/dashboard"
          element={<ProtectedRoute allowedRole="retailer"><RetailerDashboard /></ProtectedRoute>}
        />

        <Route
          path="/myrequests"
          element={<MyRequests />}
        />

        <Route
          path="/request-details"
          element={<RequestDetails />}
        />

        <Route
          path="/documents"
          element={<Documents />}
        />

        <Route
          path="/new-request"
          element={<NewRequest />}
        />

        <Route
          path="/payments"
          element={<Payments />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/profile/edit"
          element={<EditProfile />}
        />

        <Route
          path="/settings"
          element={<AccountSettings />}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/two-factor-auth"
          element={<TwoFactorAuth />}
        />

        <Route
          path="/active-sessions"
          element={<ActiveSessions />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

      </Route>


      {/* =========================
          SUPERADMIN
      ========================= */}

      <Route element={<SuperAdminRoute />}>
  <Route element={<SuperAdminLayout />}>

    <Route
      path="/superadmin"
      element={<SuperAdminDashboard />}
    />

    <Route
      path="/superadmin/users"
      element={<SuperAdminUsers />}
    />

    <Route
      path="/superadmin/staff"
      element={<SuperAdminStaff />}
    />

    <Route
      path="/superadmin/services"
      element={<SuperAdminServices />}
    />

    <Route
      path="/superadmin/requests"
      element={<SuperAdminRequests />}
    />

    <Route
      path="/superadmin/documents"
      element={<SuperAdminDocuments />}
    />

    <Route
      path="/superadmin/payments"
      element={<SuperAdminPayments />}
    />

    <Route
      path="/superadmin/notifications"
      element={<SuperAdminNotifications />}
    />

    <Route
      path="/superadmin/settings"
      element={<SuperAdminSettings />}
    />

  </Route>
</Route>


        {/* =========================
            404
        ========================= */}

        <Route path="*" element={<NotFound />} />

      </Routes>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;