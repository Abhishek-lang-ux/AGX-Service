import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  CreditCard,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LogoutModal from "./LogoutModal";
import { getNotifications } from "../lib/api";
import "./navbar.css";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Frontend demo authentication state.
  // Backend authentication will replace this later.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("agx_logged_in") === "true";
  });

  const [accountOpen, setAccountOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const accountRef = useRef(null);

  const closeMenu = () => {
    setMobileOpen(false);
    setAccountOpen(false);
  };

  const openLogoutModal = () => {
    setAccountOpen(false);
    setMobileOpen(false);
    setShowLogoutModal(true);
  };

  // Keep navbar state synchronized with frontend login state.
  useEffect(() => {
    const handleAuthChange = () => {
      const loggedIn = sessionStorage.getItem("agx_logged_in") === "true";
      setIsLoggedIn(loggedIn);
      if (!loggedIn) setUnreadNotifications(0);
    };

    window.addEventListener("agx-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("agx-auth-change", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return undefined;

    let cancelled = false;
    const loadUnreadNotifications = async () => {
      try {
        const data = await getNotifications();
        if (!cancelled) setUnreadNotifications(Number(data.unreadCount || 0));
      } catch {
        if (!cancelled) setUnreadNotifications(0);
      }
    };

    const handleNotificationChange = () => loadUnreadNotifications();
    loadUnreadNotifications();
    window.addEventListener("agx-notifications-change", handleNotificationChange);

    return () => {
      cancelled = true;
      window.removeEventListener("agx-notifications-change", handleNotificationChange);
    };
  }, [isLoggedIn]);

  // Keep the mobile menu usable on narrow screens and close it
  // when keyboard users press Escape or the viewport returns to desktop.
  useEffect(() => {
    const handleMobileMenuKeys = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAccountOpen(false);
      }
    };

    const handleViewportChange = () => {
      if (window.innerWidth > 850) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleMobileMenuKeys);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      document.removeEventListener("keydown", handleMobileMenuKeys);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  // Close account dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogoutComplete = () => {
    setShowLogoutModal(false);
    setIsLoggedIn(false);
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <span>AG</span>X
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/services">
            Services
          </NavLink>

          <NavLink to="/how-it-works">
            How It Works
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>

          <NavLink to="/contact">
            Contact
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>

              <Link to="/register" className="start-btn">
                Get Started
              </Link>
            </>
          ) : (
            <div className="account-wrapper" ref={accountRef}>
              <button
                type="button"
                className={`account-trigger ${
                  accountOpen ? "active" : ""
                }`}
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
              >
                <span className="account-avatar">
                  AA
                </span>

                <span className="account-trigger-text">
                  Account
                </span>

                <ChevronDown
                  size={15}
                  className={accountOpen ? "rotate" : ""}
                />
              </button>

              {accountOpen && (
                <div className="account-dropdown">
                  <div className="account-dropdown-header">
                    <div className="account-avatar large">
                      AA
                    </div>

                    <div>
                      <strong>Akash Awasthi</strong>
                      <span>Client Account</span>
                    </div>
                  </div>

                  <div className="account-dropdown-divider" />

                  <Link
                    to="/dashboard"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={17} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <User size={17} />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/notifications"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <Bell size={17} />
                    <span>Notifications</span>
                    <span className="notification-badge">{unreadNotifications > 99 ? "99+" : unreadNotifications}</span>
                  </Link>

                  <Link
                    to="/myrequests"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <FileText size={17} />
                    <span>My Requests</span>
                  </Link>

                  <Link
                    to="/documents"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <FolderOpen size={17} />
                    <span>Documents</span>
                  </Link>

                  <Link
                    to="/payments"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <CreditCard size={17} />
                    <span>Payments</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="account-menu-item"
                    onClick={closeMenu}
                  >
                    <Settings size={17} />
                    <span>Settings</span>
                  </Link>

                  <div className="account-dropdown-divider" />

                  <button
                    type="button"
                    className="account-logout-item"
                    onClick={openLogoutModal}
                  >
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-controls="agx-mobile-navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div id="agx-mobile-navigation" className="mobile-nav">
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>

          <NavLink to="/how-it-works" onClick={closeMenu}>
            How It Works
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {!isLoggedIn ? (
            <div className="mobile-actions">
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>

              <Link to="/register" onClick={closeMenu}>
                Get Started
              </Link>
            </div>
          ) : (
            <div className="mobile-account-menu">
              <div className="mobile-account-profile">
                <span className="account-avatar">
                  AA
                </span>

                <div>
                  <strong>Akash Awasthi</strong>
                  <span>Client Account</span>
                </div>
              </div>

              <Link to="/dashboard" onClick={closeMenu}>
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link to="/profile" onClick={closeMenu}>
                <User size={17} />
                Profile
              </Link>

              <Link to="/notifications" onClick={closeMenu}>
                <Bell size={17} />
                Notifications
                <span className="notification-badge">{unreadNotifications > 99 ? "99+" : unreadNotifications}</span>
              </Link>

              <Link to="/myrequests" onClick={closeMenu}>
                <FileText size={17} />
                My Requests
              </Link>

              <Link to="/documents" onClick={closeMenu}>
                <FolderOpen size={17} />
                Documents
              </Link>

              <Link to="/payments" onClick={closeMenu}>
                <CreditCard size={17} />
                Payments
              </Link>

              <Link to="/settings" onClick={closeMenu}>
                <Settings size={17} />
                Settings
              </Link>

              <button
                type="button"
                className="mobile-account-logout"
                onClick={openLogoutModal}
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogoutComplete}
      />
    </header>
  );
}

export default Navbar;