import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Globe2,
  Laptop,
  LockKeyhole,
  LogOut,
  MapPin,
  Monitor,
  MoreVertical,
  ShieldCheck,
  Smartphone,
  Tablet,
  Wifi,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./active-sessions.css";

const initialSessions = [
  {
    id: 1,
    device: "Windows PC",
    browser: "Chrome",
    location: "Current device",
    ip: "192.168.xx.xx",
    lastActive: "Active now",
    current: true,
    type: "desktop",
  },
  {
    id: 2,
    device: "Android Phone",
    browser: "Chrome Mobile",
    location: "Previously active",
    ip: "103.xx.xx.xx",
    lastActive: "2 hours ago",
    current: false,
    type: "mobile",
  },
];

function ActiveSessions() {
  const [sessions, setSessions] = useState(initialSessions);
  const [showLogoutAll, setShowLogoutAll] = useState(false);
  const [message, setMessage] = useState("");

  const getDeviceIcon = (type) => {
    if (type === "mobile") {
      return <Smartphone size={20} />;
    }

    if (type === "tablet") {
      return <Tablet size={20} />;
    }

    return <Laptop size={20} />;
  };

  const revokeSession = (id) => {
    setSessions((current) =>
      current.filter((session) => session.id !== id)
    );

    setMessage("Session signed out successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const logoutAll = () => {
    setSessions((current) =>
      current.filter((session) => session.current)
    );

    setShowLogoutAll(false);
    setMessage("Other sessions have been signed out.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <main className="sessions-page">
      <div className="sessions-container">

        {/* Top */}
        <div className="sessions-top">
          <Link to="/settings" className="sessions-back">
            <ArrowLeft size={17} />
            Back to Settings
          </Link>

          <span>SECURITY / SESSIONS</span>
        </div>

        {/* Header */}
        <section className="sessions-header">
          <div className="sessions-header-icon">
            <Monitor size={24} />
          </div>

          <div>
            <span>ACCOUNT SECURITY</span>

            <h1>Active Sessions</h1>

            <p>
              Review the devices and browsers currently connected to your
              AGX account.
            </p>
          </div>
        </section>

        {/* Security Banner */}
        <section className="sessions-security-banner">
          <div className="sessions-security-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>Your account is being monitored</strong>

            <p>
              If you don't recognize a device, sign it out immediately and
              change your password.
            </p>
          </div>

          <Wifi size={18} />
        </section>

        {/* Success Message */}
        {message && (
          <div className="sessions-message">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {/* Sessions Card */}
        <section className="sessions-card">
          <div className="sessions-card-header">
            <div>
              <span>CONNECTED DEVICES</span>

              <h2>
                {sessions.length}{" "}
                {sessions.length === 1 ? "session" : "sessions"}
              </h2>
            </div>

            {sessions.some((session) => !session.current) && (
              <button
                type="button"
                className="logout-all-btn"
                onClick={() => setShowLogoutAll(true)}
              >
                <LogOut size={15} />
                Sign Out Other Devices
              </button>
            )}
          </div>

          <div className="session-list">
            {sessions.length === 0 && (
              <div className="sessions-empty">
                <Monitor size={25} />

                <strong>No active sessions</strong>

                <p>
                  There are currently no active devices connected to your
                  account.
                </p>
              </div>
            )}

            {sessions.map((session) => (
              <div
                className={`session-item ${
                  session.current ? "current" : ""
                }`}
                key={session.id}
              >
                {/* Device Icon */}
                <div className="session-device-icon">
                  {getDeviceIcon(session.type)}
                </div>

                {/* Main Information */}
                <div className="session-main">
                  <div className="session-device-title">
                    <strong>{session.device}</strong>

                    {session.current && (
                      <span className="current-badge">
                        THIS DEVICE
                      </span>
                    )}
                  </div>

                  <div className="session-meta">
                    <span>
                      <Globe2 size={13} />
                      {session.browser}
                    </span>

                    <span>
                      <MapPin size={13} />
                      {session.location}
                    </span>

                    <span>
                      <Clock3 size={13} />
                      {session.lastActive}
                    </span>
                  </div>

                  <div className="session-ip">
                    IP: {session.ip}
                  </div>
                </div>

                {/* Actions */}
                <div className="session-action">
                  {session.current ? (
                    <span className="session-active">
                      <span />
                      Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="revoke-session-btn"
                      onClick={() => revokeSession(session.id)}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  )}

                  <button
                    type="button"
                    className="session-more"
                    aria-label="Session options"
                  >
                    <MoreVertical size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security Tips */}
        <section className="session-tips">
          <div className="session-tip">
            <div>
              <ShieldCheck size={18} />
            </div>

            <section>
              <strong>Don't recognize a device?</strong>

              <p>
                Sign it out immediately, then change your password to protect
                your account.
              </p>
            </section>
          </div>

          <div className="session-tip">
            <div>
              <LockKeyhole size={18} />
            </div>

            <section>
              <strong>Keep your account secure</strong>

              <p>
                Avoid signing in on shared computers and always sign out when
                you're finished.
              </p>
            </section>
          </div>
        </section>

        {/* Logout Confirmation Modal */}
        {showLogoutAll && (
          <div
            className="session-modal-overlay"
            onClick={() => setShowLogoutAll(false)}
          >
            <div
              className="session-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="session-modal-close"
                onClick={() => setShowLogoutAll(false)}
                aria-label="Close"
              >
                <X size={17} />
              </button>

              <div className="session-modal-icon">
                <LogOut size={21} />
              </div>

              <h2>Sign out other devices?</h2>

              <p>
                All other active sessions will be signed out. Your current
                device will remain connected.
              </p>

              <div className="session-modal-actions">
                <button
                  type="button"
                  className="session-modal-cancel"
                  onClick={() => setShowLogoutAll(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="session-modal-confirm"
                  onClick={logoutAll}
                >
                  Sign Out Devices
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ActiveSessions;