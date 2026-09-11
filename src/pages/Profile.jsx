import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  LockKeyhole,
  Mail,
  Pencil,
  Phone,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { apiRequest, updateStoredUser } from "../lib/api.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await apiRequest("/profile");
        if (active) setProfile(data.profile);
      } catch (error) {
        if (active) setProfileError(error.message || "Unable to load profile");
      } finally {
        if (active) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => { active = false; };
  }, []);

  return (
    <main className="profile-page">
      {profileLoading && <div className="profile-loading-banner">Loading your profile…</div>}
      {profileError && <div className="profile-error-banner" role="alert">{profileError}</div>}

      <div className="profile-container">

        {/* Header */}
        <section className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              <UserRound size={14} />
              ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information, security and account preferences.
            </p>
          </div>

          <Link to="/dashboard" className="profile-back-btn">
            <ArrowRight size={16} />
            Back to Dashboard
          </Link>
        </section>


        {/* Profile Hero */}
        <section className="profile-hero-card">

          <div className="profile-identity">

            <div className="profile-avatar-large">
              AA
              <span className="profile-online-dot" />
            </div>

            <div className="profile-identity-info">
              <span className="profile-account-label">
                AGX CLIENT ACCOUNT
              </span>

              <h2>{profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "My Profile"}</h2>

              <p>
                <Mail size={15} />
                your@email.com
              </p>

              <span className="profile-verified">
                <CheckCircle2 size={14} />
                Verified Account
              </span>
            </div>

          </div>

          <Link to="/profile/edit" className="profile-edit-btn">
            <Pencil size={15} />
            Edit Profile
          </Link>

        </section>


        {/* Main Grid */}
        <section className="profile-main-grid">

          {/* Personal Information */}
          <div className="profile-panel">

            <div className="profile-panel-header">
              <div>
                <span className="profile-section-label">
                  PERSONAL DETAILS
                </span>

                <h2>Personal Information</h2>
              </div>

              <div className="profile-panel-icon">
                <UserRound size={18} />
              </div>
            </div>


            <div className="profile-fields">

              <div className="profile-field">
                <span>FULL NAME</span>
                <strong>{profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "My Profile"}</strong>
              </div>

              <div className="profile-field">
                <span>EMAIL ADDRESS</span>
                <strong>your@email.com</strong>
              </div>

              <div className="profile-field">
                <span>MOBILE NUMBER</span>
                <strong>+91 XXXXX XXXXX</strong>
              </div>

              <div className="profile-field">
                <span>ACCOUNT TYPE</span>
                <strong>Client Account</strong>
              </div>

            </div>

          </div>


          {/* Business Information */}
          <div className="profile-panel">

            <div className="profile-panel-header">
              <div>
                <span className="profile-section-label">
                  BUSINESS DETAILS
                </span>

                <h2>Business Information</h2>
              </div>

              <div className="profile-panel-icon">
                <FileText size={18} />
              </div>
            </div>


            <div className="profile-fields">

              <div className="profile-field">
                <span>BUSINESS / ORGANIZATION</span>
                <strong>Not Added</strong>
              </div>

              <div className="profile-field">
                <span>PAN</span>
                <strong>Not Added</strong>
              </div>

              <div className="profile-field">
                <span>GSTIN</span>
                <strong>Not Added</strong>
              </div>

              <div className="profile-field">
                <span>BUSINESS ADDRESS</span>
                <strong>Not Added</strong>
              </div>

            </div>

          </div>

        </section>


        {/* Account Security */}
        <section className="profile-panel profile-security-panel">

          <div className="profile-panel-header">

            <div>
              <span className="profile-section-label">
                SECURITY
              </span>

              <h2>Account Security</h2>

              <p>
                Keep your AGX account protected and manage your login security.
              </p>
            </div>

            <div className="profile-panel-icon security-icon">
              <ShieldCheck size={18} />
            </div>

          </div>


          <div className="security-list">

            <button className="security-item" type="button">
              <span className="security-item-icon">
                <LockKeyhole size={18} />
              </span>

              <span className="security-item-content">
                <strong>Password</strong>
                <small>Change your account password</small>
              </span>

              <ChevronRight size={17} />
            </button>


            <button className="security-item" type="button">
              <span className="security-item-icon">
                <ShieldCheck size={18} />
              </span>

              <span className="security-item-content">
                <strong>Two-Factor Authentication</strong>
                <small>Add an extra layer of account protection</small>
              </span>

              <span className="security-status">
                Not Enabled
              </span>

              <ChevronRight size={17} />
            </button>


            <button className="security-item" type="button">
              <span className="security-item-icon">
                <Bell size={18} />
              </span>

              <span className="security-item-content">
                <strong>Login Notifications</strong>
                <small>Get notified about important account activity</small>
              </span>

              <span className="security-enabled">
                Enabled
              </span>

              <ChevronRight size={17} />
            </button>

          </div>

        </section>


        {/* Quick Links */}
        <section className="profile-quick-section">

          <div className="profile-panel-header">
            <div>
              <span className="profile-section-label">
                QUICK ACCESS
              </span>

              <h2>Manage Your Account</h2>
            </div>
          </div>


          <div className="profile-quick-grid">

            <Link to="/myrequests" className="profile-quick-card">
              <span className="quick-card-icon">
                <FileText size={19} />
              </span>

              <span>
                <strong>My Requests</strong>
                <small>Track your service requests</small>
              </span>

              <ChevronRight size={16} />
            </Link>


            <Link to="/documents" className="profile-quick-card">
              <span className="quick-card-icon">
                <FileText size={19} />
              </span>

              <span>
                <strong>Documents</strong>
                <small>Manage your uploaded documents</small>
              </span>

              <ChevronRight size={16} />
            </Link>


            <Link to="/payments" className="profile-quick-card">
              <span className="quick-card-icon">
                <CreditCard size={19} />
              </span>

              <span>
                <strong>Payments</strong>
                <small>View transactions and invoices</small>
              </span>

              <ChevronRight size={16} />
            </Link>


            <Link to="/settings" className="profile-quick-card">
              <span className="quick-card-icon">
                <Settings size={19} />
              </span>

              <span>
                <strong>Preferences</strong>
                <small>Manage account preferences</small>
              </span>

              <ChevronRight size={16} />
            </Link>

            <Link to="/notifications" className="profile-quick-card">
                <Bell size={20} />
                <div>
                    <strong>Notifications</strong>
                    <span>View account alerts and updates</span>
                </div>
            </Link>

          </div>

        </section>


        {/* Contact Strip */}
        <section className="profile-support-card">

          <div className="profile-support-icon">
            <Phone size={19} />
          </div>

          <div>
            <strong>Need help with your account?</strong>
            <p>
              Contact AGX support if you need assistance with your profile or
              account security.
            </p>
          </div>

          <Link to="/contact">
            Contact AGX
            <ArrowRight size={15} />
          </Link>

        </section>

      </div>
    </main>
  );
}

export default Profile;
