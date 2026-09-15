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
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import RequestDetails from "./pages/RequestDetails";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
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

        <Route path="/register" element={<Register />} />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
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
        <Route
          path="/superadmin"
          element={<SuperAdminDashboard />}
        />
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