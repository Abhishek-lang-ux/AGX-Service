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
import DistributorRegister from "./pages/DistributorRegister";

import Dashboard from "./pages/Dashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import DistributorDashboard from "./pages/DistributorDashboard";
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
import SuperAdminRetailers from "./pages/SuperAdminRetailers";
import SuperAdminRetailerRequests from "./pages/SuperAdminRetailerRequests";
import SuperAdminRetailerDocuments from "./pages/SuperAdminRetailerDocuments";
import SuperAdminRetailerPayments from "./pages/SuperAdminRetailerPayments";
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
        <Route path="/distributor/register" element={<DistributorRegister />} />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}


        <Route
          path="/dashboard"
          element={<ProtectedRoute allowedRole="client"><Dashboard /></ProtectedRoute>}
        />

        {/* Retailer Portal */}
        <Route
          path="/retailer/dashboard"
          element={<ProtectedRoute allowedRole="retailer"><RetailerDashboard /></ProtectedRoute>}
        />

        <Route
          path="/distributor/dashboard"
          element={<ProtectedRoute allowedRole="distributor"><DistributorDashboard /></ProtectedRoute>}
        />

        <Route
          path="/myrequests"
          element={<ProtectedRoute><MyRequests /></ProtectedRoute>}
        />

        <Route
          path="/request-details/:id"
          element={<ProtectedRoute><RequestDetails /></ProtectedRoute>}
        />

        <Route
          path="/documents"
          element={<ProtectedRoute><Documents /></ProtectedRoute>}
        />

        <Route
          path="/new-request"
          element={<ProtectedRoute><NewRequest /></ProtectedRoute>}
        />

        <Route
          path="/payments"
          element={<ProtectedRoute><Payments /></ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route
          path="/profile/edit"
          element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
        />

        <Route
          path="/settings"
          element={<ProtectedRoute><AccountSettings /></ProtectedRoute>}
        />

        <Route
          path="/change-password"
          element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
        />

        <Route
          path="/two-factor-auth"
          element={<ProtectedRoute><TwoFactorAuth /></ProtectedRoute>}
        />

        <Route
          path="/active-sessions"
          element={<ProtectedRoute><ActiveSessions /></ProtectedRoute>}
        />

        <Route
          path="/notifications"
          element={<ProtectedRoute><Notifications /></ProtectedRoute>}
        />



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
        path="/superadmin/retailers"
        element={<SuperAdminRetailers />}
      />

      <Route
        path="/superadmin/retailers/requests"
        element={<SuperAdminRetailerRequests />}
      />

      <Route
        path="/superadmin/retailers/documents"
        element={<SuperAdminRetailerDocuments />}
      />

      <Route
        path="/superadmin/retailers/payments"
        element={<SuperAdminRetailerPayments />}
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