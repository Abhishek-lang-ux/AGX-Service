import {
  ArrowLeft,
  Bell,
  ChevronRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./account-settings.css";

function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [serviceUpdates, setServiceUpdates] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  return (
    <main className="settings-page">
      <div className="settings-container">

        {/* Top */}
        <div className="settings-top">
          <Link to="/profile" className="settings-back">
            <ArrowLeft size={17} />
            Back to Profile
          </Link>

          <span>ACCOUNT SETTINGS</span>
        </div>


        {/* Header */}
        <section className="settings-header">
          <span className="settings-eyebrow">
            <UserRound size={14} />
            PREFERENCES & SECURITY
          </span>

          <h1>Account Settings</h1>

          <p>
            Control your account preferences, notifications and security.
          </p>
        </section>


        {/* Security */}
        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <span>SECURITY</span>
              <h2>Login & Security</h2>
            </div>

            <div className="settings-card-icon security">
              <ShieldCheck size={19} />
            </div>
          </div>


          <div className="settings-list">

            <Link to="/change-password" className="settings-row">

              <div className="settings-row-icon">
                <LockKeyhole size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Change Password</strong>
                <small>
                  Update the password used to access your AGX account
                </small>
              </div>

              <ChevronRight size={17} />
            </Link>


            <Link to="/two-factor-auth" className="settings-row">

              <div className="settings-row-icon">
                <Smartphone size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Two-Factor Authentication</strong>
                <small>
                  Add an additional verification step when signing in
                </small>
              </div>

              <span className="settings-badge disabled">
                Not Enabled
              </span>

              <ChevronRight size={17} />
            </Link>


            <Link to="/active-sessions" className="settings-row">

              <div className="settings-row-icon">
                <ShieldCheck size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Active Sessions</strong>
                <small>
                  Review devices currently signed in to your account
                </small>
              </div>

              <span className="settings-badge active">
                1 Active
              </span>

              <ChevronRight size={17} />
            </Link>

          </div>

        </section>


        {/* Notifications */}
        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <span>NOTIFICATIONS</span>
              <h2>Notification Preferences</h2>
            </div>

            <div className="settings-card-icon">
              <Bell size={19} />
            </div>
          </div>


          <div className="settings-list">

            <div className="settings-toggle-row">

              <div className="settings-row-icon">
                <Mail size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Email Notifications</strong>
                <small>
                  Receive important account notifications by email
                </small>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  emailNotifications ? "on" : ""
                }`}
                onClick={() =>
                  setEmailNotifications(!emailNotifications)
                }
                aria-label="Toggle email notifications"
              >
                <span />
              </button>

            </div>


            <div className="settings-toggle-row">

              <div className="settings-row-icon">
                <Bell size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Service Updates</strong>
                <small>
                  Updates about your service requests and applications
                </small>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  serviceUpdates ? "on" : ""
                }`}
                onClick={() =>
                  setServiceUpdates(!serviceUpdates)
                }
                aria-label="Toggle service updates"
              >
                <span />
              </button>

            </div>


            <div className="settings-toggle-row">

              <div className="settings-row-icon">
                <span className="rupee-symbol">₹</span>
              </div>

              <div className="settings-row-content">
                <strong>Payment Alerts</strong>
                <small>
                  Get notified about successful and failed payments
                </small>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  paymentAlerts ? "on" : ""
                }`}
                onClick={() =>
                  setPaymentAlerts(!paymentAlerts)
                }
                aria-label="Toggle payment alerts"
              >
                <span />
              </button>

            </div>


            <div className="settings-toggle-row">

              <div className="settings-row-icon">
                <ShieldCheck size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Login Alerts</strong>
                <small>
                  Receive alerts when a new login is detected
                </small>
              </div>

              <button
                type="button"
                className={`toggle-switch ${
                  loginAlerts ? "on" : ""
                }`}
                onClick={() =>
                  setLoginAlerts(!loginAlerts)
                }
                aria-label="Toggle login alerts"
              >
                <span />
              </button>

            </div>

          </div>

        </section>


        {/* Communication */}
        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <span>COMMUNICATION</span>
              <h2>Contact Preferences</h2>
            </div>

            <div className="settings-card-icon">
              <Smartphone size={19} />
            </div>
          </div>


          <div className="communication-grid">

            <div className="communication-item">
              <span>EMAIL</span>
              <strong>your@email.com</strong>
              <small>Primary communication channel</small>
            </div>

            <div className="communication-item">
              <span>MOBILE</span>
              <strong>+91 XXXXX XXXXX</strong>
              <small>Used for important alerts</small>
            </div>

          </div>

        </section>


        {/* Save */}
        <div className="settings-bottom">

          <p>
            <ShieldCheck size={15} />
            Your preferences are saved securely to your account.
          </p>

          <Link to="/profile" className="settings-done-btn">
            Done
          </Link>

        </div>

      </div>
    </main>
  );
}

export default AccountSettings;
