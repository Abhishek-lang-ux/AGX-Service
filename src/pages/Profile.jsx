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

import { apiRequest } from "../lib/api.js";
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
        setProfileLoading(true);
        setProfileError("");

        const data = await apiRequest("/profile");

        if (active) {
          setProfile(data.profile);
        }
      } catch (error) {
        if (active) {
          setProfileError(
            error.message || "Unable to load profile",
          );
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  /* =========================================================
     DISPLAY NAME
  ========================================================= */

  const displayName =
    profile
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : "";

  const finalDisplayName =
    displayName || "AGX Client";

  /* =========================================================
     INITIALS
  ========================================================= */

  const initials =
    finalDisplayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "AA";

  /* =========================================================
     PROFILE PHOTO
  ========================================================= */

  const profilePhoto = profile?.avatarPath || "";

  return (
    <main className="profile-page">

      {/* =====================================================
          LOADING / ERROR
      ===================================================== */}

      {profileLoading && (
        <div className="profile-loading-banner">
          Loading your profile…
        </div>
      )}

      {profileError && (
        <div
          className="profile-error-banner"
          role="alert"
        >
          {profileError}
        </div>
      )}

      <div className="profile-container">

        {/* ===================================================
            HEADER
        =================================================== */}

        <section className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              <UserRound size={14} />
              ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information, security and
              account preferences.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="profile-back-btn"
          >
            <ArrowRight size={16} />
            Back to Dashboard
          </Link>
        </section>

        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section className="profile-hero-card">

          <div className="profile-identity">

            {/* PROFILE AVATAR */}

            <div className="profile-avatar-large">

              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={`${finalDisplayName} profile`}
                  className="profile-avatar-image"
                />
              ) : (
                initials
              )}

              <span className="profile-online-dot" />
            </div>

            {/* PROFILE INFO */}

            <div className="profile-identity-info">

              <span className="profile-account-label">
                AGX CLIENT ACCOUNT
              </span>

              <h2>
                {finalDisplayName}
              </h2>

              <p>
                <Mail size={15} />
                {profile?.email || "your@email.com"}
              </p>

              <span className="profile-verified">
                <CheckCircle2 size={14} />
                Verified Account
              </span>

            </div>
          </div>

          <Link
            to="/profile/edit"
            className="profile-edit-btn"
          >
            <Pencil size={15} />
            Edit Profile
          </Link>

        </section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <section className="profile-main-grid">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="profile-panel">

            <div className="profile-panel-header">

              <div>
                <span className="profile-section-label">
                  PERSONAL DETAILS
                </span>

                <h2>
                  Personal Information
                </h2>
              </div>

              <div className="profile-panel-icon">
                <UserRound size={18} />
              </div>

            </div>

            <div className="profile-fields">

              {/* FULL NAME */}

              <div className="profile-field">
                <span>
                  FULL NAME
                </span>

                <strong>
                  {displayName || "Not Added"}
                </strong>
              </div>

              {/* EMAIL */}

              <div className="profile-field">
                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {profile?.email || "Not Added"}
                </strong>
              </div>

              {/* MOBILE */}

              <div className="profile-field">
                <span>
                  MOBILE NUMBER
                </span>

                <strong>
                  {profile?.phone || "Not Added"}
                </strong>
              </div>

              {/* ACCOUNT TYPE */}

              <div className="profile-field">
                <span>
                  ACCOUNT TYPE
                </span>

                <strong>
                  {profile?.role || "Client Account"}
                </strong>
              </div>

              {/* DATE OF BIRTH */}

              <div className="profile-field">
                <span>
                  DATE OF BIRTH
                </span>

                <strong>
                  {profile?.dateOfBirth
                    ? String(profile.dateOfBirth).slice(0, 10)
                    : "Not Added"}
                </strong>
              </div>

              {/* CITY */}

              <div className="profile-field">
                <span>
                  CITY
                </span>

                <strong>
                  {profile?.city || "Not Added"}
                </strong>
              </div>

              {/* STATE */}

              <div className="profile-field">
                <span>
                  STATE
                </span>

                <strong>
                  {profile?.state || "Not Added"}
                </strong>
              </div>

              {/* POSTAL CODE */}

              <div className="profile-field">
                <span>
                  POSTAL CODE
                </span>

                <strong>
                  {profile?.postalCode || "Not Added"}
                </strong>
              </div>

            </div>
          </div>

          {/* =================================================
              BUSINESS INFORMATION
          ================================================= */}

          <div className="profile-panel">

            <div className="profile-panel-header">

              <div>
                <span className="profile-section-label">
                  BUSINESS DETAILS
                </span>

                <h2>
                  Business Information
                </h2>
              </div>

              <div className="profile-panel-icon">
                <FileText size={18} />
              </div>

            </div>

            <div className="profile-fields">

              <div className="profile-field">
                <span>
                  BUSINESS / ORGANIZATION
                </span>

                <strong>
                  Not Added
                </strong>
              </div>

              <div className="profile-field">
                <span>
                  PAN
                </span>

                <strong>
                  Not Added
                </strong>
              </div>

              <div className="profile-field">
                <span>
                  GSTIN
                </span>

                <strong>
                  Not Added
                </strong>
              </div>

              <div className="profile-field">
                <span>
                  BUSINESS ADDRESS
                </span>

                <strong>
                  Not Added
                </strong>
              </div>

            </div>
          </div>

        </section>

        {/* ===================================================
            ADDRESS / BIO
        =================================================== */}

        <section className="profile-panel">

          <div className="profile-panel-header">

            <div>
              <span className="profile-section-label">
                ABOUT
              </span>

              <h2>
                Additional Information
              </h2>
            </div>

            <div className="profile-panel-icon">
              <UserRound size={18} />
            </div>

          </div>

          <div className="profile-fields">

            <div className="profile-field">
              <span>
                ADDRESS
              </span>

              <strong>
                {[
                  profile?.addressLine1,
                  profile?.addressLine2,
                  profile?.city,
                  profile?.state,
                  profile?.postalCode,
                  profile?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not Added"}
              </strong>
            </div>

            <div className="profile-field">
              <span>
                BIO
              </span>

              <strong>
                {profile?.bio || "Not Added"}
              </strong>
            </div>

          </div>

        </section>

        {/* ===================================================
            ACCOUNT SECURITY
        =================================================== */}

        <section className="profile-panel profile-security-panel">

          <div className="profile-panel-header">

            <div>
              <span className="profile-section-label">
                SECURITY
              </span>

              <h2>
                Account Security
              </h2>

              <p>
                Keep your AGX account protected and manage
                your login security.
              </p>
            </div>

            <div className="profile-panel-icon security-icon">
              <ShieldCheck size={18} />
            </div>

          </div>

          <div className="security-list">

            <button
              className="security-item"
              type="button"
            >
              <span className="security-item-icon">
                <LockKeyhole size={18} />
              </span>

              <span className="security-item-content">
                <strong>
                  Password
                </strong>

                <small>
                  Change your account password
                </small>
              </span>

              <ChevronRight size={17} />
            </button>

            <button
              className="security-item"
              type="button"
            >
              <span className="security-item-icon">
                <ShieldCheck size={18} />
              </span>

              <span className="security-item-content">
                <strong>
                  Two-Factor Authentication
                </strong>

                <small>
                  Add an extra layer of account protection
                </small>
              </span>

              <span className="security-status">
                Not Enabled
              </span>

              <ChevronRight size={17} />
            </button>

            <button
              className="security-item"
              type="button"
            >
              <span className="security-item-icon">
                <Bell size={18} />
              </span>

              <span className="security-item-content">
                <strong>
                  Login Notifications
                </strong>

                <small>
                  Get notified about important account activity
                </small>
              </span>

              <span className="security-enabled">
                Enabled
              </span>

              <ChevronRight size={17} />
            </button>

          </div>
        </section>

        {/* ===================================================
            QUICK LINKS
        =================================================== */}

        <section className="profile-quick-section">

          <div className="profile-panel-header">

            <div>
              <span className="profile-section-label">
                QUICK ACCESS
              </span>

              <h2>
                Manage Your Account
              </h2>
            </div>

          </div>

          <div className="profile-quick-grid">

            <Link
              to="/myrequests"
              className="profile-quick-card"
            >
              <span className="quick-card-icon">
                <FileText size={19} />
              </span>

              <span>
                <strong>
                  My Requests
                </strong>

                <small>
                  Track your service requests
                </small>
              </span>

              <ChevronRight size={16} />
            </Link>

            <Link
              to="/documents"
              className="profile-quick-card"
            >
              <span className="quick-card-icon">
                <FileText size={19} />
              </span>

              <span>
                <strong>
                  Documents
                </strong>

                <small>
                  Manage your uploaded documents
                </small>
              </span>

              <ChevronRight size={16} />
            </Link>

            <Link
              to="/payments"
              className="profile-quick-card"
            >
              <span className="quick-card-icon">
                <CreditCard size={19} />
              </span>

              <span>
                <strong>
                  Payments
                </strong>

                <small>
                  View transactions and invoices
                </small>
              </span>

              <ChevronRight size={16} />
            </Link>

            <Link
              to="/settings"
              className="profile-quick-card"
            >
              <span className="quick-card-icon">
                <Settings size={19} />
              </span>

              <span>
                <strong>
                  Preferences
                </strong>

                <small>
                  Manage account preferences
                </small>
              </span>

              <ChevronRight size={16} />
            </Link>

            <Link
              to="/notifications"
              className="profile-quick-card"
            >
              <Bell size={20} />

              <div>
                <strong>
                  Notifications
                </strong>

                <span>
                  View account alerts and updates
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* ===================================================
            CONTACT
        =================================================== */}

        <section className="profile-support-card">

          <div className="profile-support-icon">
            <Phone size={19} />
          </div>

          <div>
            <strong>
              Need help with your account?
            </strong>

            <p>
              Contact AGX support if you need assistance
              with your profile or account security.
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