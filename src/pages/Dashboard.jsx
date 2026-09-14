import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  FolderOpen,
  Plus,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, getDashboard, normalizeAssetUrl } from "../lib/api.js";
import "./dashboard.css";

const statusMeta = {
  pending: { label: "Pending", className: "under-review", progress: 10 },
  submitted: { label: "Submitted", className: "under-review", progress: 20 },
  in_review: { label: "Under Review", className: "under-review", progress: 40 },
  documents_required: { label: "Action Required", className: "action-required", progress: 50 },
  processing: { label: "Processing", className: "processing", progress: 70 },
  completed: { label: "Completed", className: "completed", progress: 100 },
  rejected: { label: "Rejected", className: "action-required", progress: 100 },
  cancelled: { label: "Cancelled", className: "action-required", progress: 100 },
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "AG";
}

function getActivityIcon(type) {
  if (type === "document") return Upload;
  if (type === "service") return CheckCircle2;
  return Bell;
}

function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
  let active = true;

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [dashboardData, profileData] = await Promise.all([
        getDashboard(),
        apiRequest("/profile"),
      ]);

      if (!active) return;

      setDashboard(dashboardData);
      setProfilePhoto(
        normalizeAssetUrl(profileData?.profile?.avatarPath || ""),
      );
    } catch (err) {
      if (active) {
        setError(
          err.message || "Unable to load dashboard",
        );
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadDashboardData();

  return () => {
    active = false;
  };
}, []);

  const profile = dashboard?.profile;
  const stats = dashboard?.stats;
  const requests = dashboard?.requests || [];
  const notifications = dashboard?.notifications || [];

  const initials = useMemo(
    () => getInitials(profile?.firstName, profile?.lastName),
    [profile],
  );

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-state-card">
            <div className="dashboard-loader" />
            <strong>Loading your AGX dashboard…</strong>
            <span>Fetching your latest requests and account activity.</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-state-card dashboard-state-error">
            <AlertCircle size={28} />
            <strong>Dashboard unavailable</strong>
            <span>{error}</span>
            <button type="button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-topbar">
          <div>
            <div className="dashboard-eyebrow">
              <Sparkles size={14} />
              CLIENT PORTAL
            </div>
            <h1>Welcome back, {profile?.firstName || "there"}</h1>
            <p>Manage your AGX services, requests and documents from one place.</p>
          </div>

          <div className="dashboard-top-actions">
            <button
              className="dashboard-icon-btn"
              type="button"
              aria-label="Open notifications"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={20} />
              {stats?.unreadNotifications > 0 && (
                <span className="notification-dot" />
              )}
            </button>

            <Link to="/profile" className="dashboard-profile">
  <span className="dashboard-avatar">
    {profilePhoto ? (
      <img
        src={profilePhoto}
        alt="Profile"
        className="dashboard-avatar-image"
      />
    ) : (
      initials
    )}
  </span>

  <span className="dashboard-profile-text">
    <strong>
      {profile?.firstName} {profile?.lastName || ""}
    </strong>

    <small>***********************************</small>
  </span>
</Link>
          </div>
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue"><FileText size={21} /></div>
            <div>
              <span>Total Requests</span>
              <strong>{stats?.totalRequests ?? 0}</strong>
              <small>All service requests</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon orange"><Clock3 size={21} /></div>
            <div>
              <span>Active Requests</span>
              <strong>{stats?.activeRequests ?? 0}</strong>
              <small>Currently in progress</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green"><CheckCircle2 size={21} /></div>
            <div>
              <span>Completed</span>
              <strong>{stats?.completedRequests ?? 0}</strong>
              <small>Successfully completed</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon red"><AlertCircle size={21} /></div>
            <div>
              <span>Action Required</span>
              <strong>{stats?.actionRequired ?? 0}</strong>
              <small>Needs your attention</small>
            </div>
          </div>
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-primary">
            <div className="dashboard-section-head">
              <div>
                <span className="dashboard-section-label">SERVICE ACTIVITY</span>
                <h2>Recent Requests</h2>
              </div>
              <Link to="/myrequests" className="dashboard-view-link">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="request-list">
              {requests.length ? (
                requests.map((request) => {
                  const meta = statusMeta[request.status] || statusMeta.pending;
                  const progress = Math.max(0, Math.min(100, request.progress ?? meta.progress));

                  return (
                    <Link to="/request-details" className="request-card" key={request.id}>
                      <div className="request-card-top">
                        <div className="request-service">
                          <div className="request-icon"><FileText size={19} /></div>
                          <div>
                            <strong>{request.serviceName}</strong>
                            <span>{request.requestNumber} · {formatDate(request.createdAt)}</span>
                          </div>
                        </div>

                        <span className={`request-status ${meta.className}`}>
                          {meta.label}
                        </span>
                      </div>

                      <div className="request-progress-row">
                        <div className="request-progress">
                          <span style={{ width: `${progress}%` }} />
                        </div>
                        <strong>{progress}%</strong>
                      </div>

                      <div className="request-card-bottom">
                        <span>Request progress</span>
                        <ChevronRight size={17} />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="dashboard-empty-state">
                  <FileText size={24} />
                  <strong>No service requests yet</strong>
                  <span>Start your first AGX service request to see it here.</span>
                  <Link to="/new-request">Create Request <ArrowRight size={15} /></Link>
                </div>
              )}
            </div>
          </div>

          <aside className="dashboard-sidebar">
            <div className="dashboard-section-head">
              <div>
                <span className="dashboard-section-label">QUICK ACTIONS</span>
                <h2>What do you need?</h2>
              </div>
            </div>

            <div className="quick-actions">
              <Link to="/new-request" className="quick-action primary">
                <span className="quick-action-icon"><Plus size={19} /></span>
                <span><strong>New Service Request</strong><small>Start a new requirement</small></span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/documents" className="quick-action">
                <span className="quick-action-icon"><Upload size={19} /></span>
                <span><strong>Upload Documents</strong><small>Submit required files</small></span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/myrequests" className="quick-action">
                <span className="quick-action-icon"><FolderOpen size={19} /></span>
                <span><strong>View All Requests</strong><small>Track your applications</small></span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/profile" className="quick-action">
                <span className="quick-action-icon"><UserRound size={19} /></span>
                <span><strong>My Profile</strong><small>Manage account details</small></span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="dashboard-help-card">
              <div className="dashboard-help-icon"><Bell size={18} /></div>
              <div>
                <strong>Need assistance?</strong>
                <p>Our team is here to help with your service request.</p>
                <Link to="/contact">Contact AGX <ArrowRight size={14} /></Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="dashboard-bottom-grid">
          <div className="dashboard-panel">
            <div className="dashboard-section-head">
              <div>
                <span className="dashboard-section-label">UPDATES</span>
                <h2>Recent Activity</h2>
              </div>
              <Bell size={18} className="dashboard-muted-icon" />
            </div>

            <div className="activity-list">
              {notifications.length ? (
                notifications.map((notification) => {
                  const Icon = getActivityIcon(notification.type);
                  return (
                    <button
                      type="button"
                      className={`activity-item ${notification.isRead ? "" : "is-unread"}`}
                      key={notification.id}
                      onClick={() => notification.link && navigate(notification.link)}
                    >
                      <div className="activity-icon"><Icon size={17} /></div>
                      <div className="activity-content">
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                      </div>
                      <time>{formatDate(notification.createdAt)}</time>
                    </button>
                  );
                })
              ) : (
                <div className="dashboard-empty-activity">
                  <Bell size={22} />
                  <span>No recent activity.</span>
                </div>
              )}
            </div>

            <Link to="/notifications" className="dashboard-activity-link">
              View all notifications <ArrowRight size={15} />
            </Link>
          </div>

          <div className="dashboard-panel dashboard-overview-panel">
            <div className="dashboard-section-head">
              <div>
                <span className="dashboard-section-label">ACCOUNT OVERVIEW</span>
                <h2>Your AGX Account</h2>
              </div>
            </div>

            <div className="account-overview">
              <div className="account-overview-avatar">
  {profilePhoto ? (
    <img
      src={profilePhoto}
      alt="Profile"
      className="account-overview-avatar-image"
    />
  ) : (
    initials
  )}
</div>
              <div>
                <strong>{profile?.firstName} {profile?.lastName || ""}</strong>
                <span>Client since {profile?.memberSince || "—"}</span>
              </div>
            </div>

            <div className="account-details">
              <div>
                <span>Email</span>
                <strong>{profile?.email || "—"}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{profile?.phone || "Not added"}</strong>
              </div>
            </div>

            <Link to="/profile" className="account-profile-link">
              Manage Profile <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
