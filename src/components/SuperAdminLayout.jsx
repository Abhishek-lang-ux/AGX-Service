import {
  LayoutDashboard,
  Users,
  Store,
  UserCog,
  BriefcaseBusiness,
  ClipboardList,
  FileCheck2,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { clearAuthSession } from "../lib/api.js";

import "./superadmin-layout.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/superadmin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Users",
    path: "/superadmin/users",
    icon: Users,
  },
  {
    label: "Staff",
    path: "/superadmin/staff",
    icon: UserCog,
  },
  {
    label: "Services",
    path: "/superadmin/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Requests",
    path: "/superadmin/requests",
    icon: ClipboardList,
  },
  {
    label: "Documents",
    path: "/superadmin/documents",
    icon: FileCheck2,
  },
  {
    label: "Payments",
    path: "/superadmin/payments",
    icon: CreditCard,
  },
  {
    label: "Retailers",
    path: "/superadmin/retailers",
    icon: Store,
  },
  {
    label: "Retailer Requests",
    path: "/superadmin/retailers/requests",
    icon: ClipboardList,
  },
  {
    label: "Retailer Documents",
    path: "/superadmin/retailers/documents",
    icon: FileCheck2,
  },
  {
    label: "Retailer Payments",
    path: "/superadmin/retailers/payments",
    icon: CreditCard,
  },
  {
    label: "Notifications",
    path: "/superadmin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/superadmin/settings",
    icon: Settings,
  },
];

function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const currentItem =
    menuItems.find((item) => {
      if (item.end) {
        return location.pathname === item.path;
      }

      return (
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
      );
    }) || menuItems[0];

  function handleLogout() {
    clearAuthSession();
    navigate("/login", { replace: true });
  }

  function closeMobileSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="superadmin-shell">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          className="superadmin-overlay"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`superadmin-sidebar ${
          sidebarOpen ? "superadmin-sidebar-open" : ""
        }`}
      >

        {/* BRAND */}
        <div className="superadmin-brand">

          <div className="superadmin-brand-mark">
            <ShieldCheck size={23} />
          </div>

          <div className="superadmin-brand-text">
            <strong>AGX</strong>
            <span>Service Portal</span>
          </div>

          <button
            type="button"
            className="superadmin-mobile-close"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

        {/* ADMIN BADGE */}
        <div className="superadmin-admin-badge">
          <div className="superadmin-admin-avatar">
            SA
          </div>

          <div>
            <strong>SuperAdmin</strong>
            <span>Administrator</span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="superadmin-navigation">

          <div className="superadmin-nav-title">
            MAIN MENU
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `superadmin-nav-link ${
                    isActive ? "superadmin-nav-active" : ""
                  }`
                }
              >
                <Icon size={19} strokeWidth={1.9} />

                <span>{item.label}</span>

                {item.path === currentItem.path && (
                  <ChevronRight
                    size={15}
                    className="superadmin-nav-arrow"
                  />
                )}
              </NavLink>
            );
          })}

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="superadmin-sidebar-bottom">

          <div className="superadmin-security-card">
            <ShieldCheck size={18} />

            <div>
              <strong>Secure Mode</strong>
              <span>Admin access protected</span>
            </div>
          </div>

          <button
            type="button"
            className="superadmin-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}
      <div className="superadmin-main">

        {/* TOPBAR */}
        <header className="superadmin-topbar">

          <div className="superadmin-topbar-left">

            <button
              type="button"
              className="superadmin-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <div className="superadmin-breadcrumb">

              <span>AGX</span>

              <ChevronRight size={14} />

              <strong>{currentItem.label}</strong>

            </div>

          </div>

          <div className="superadmin-topbar-right">

            <div className="superadmin-status">
              <span className="superadmin-status-dot" />
              System Online
            </div>

            <div className="superadmin-top-avatar">
              SA
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="superadmin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default SuperAdminLayout;