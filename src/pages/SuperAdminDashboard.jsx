import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  Users,
  UserRoundCog,
} from "lucide-react";

import { useEffect, useState } from "react";

import { getSuperAdminDashboard, getPendingRetailers, updateRetailerApproval } from "../lib/api.js";

import DistributorManagement from "../components/DistributorManagement.jsx";
import "./superadmin.css";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getFullName(user) {
  const name = `${user?.firstName || ""} ${
    user?.lastName || ""
  }`.trim();

  return name || user?.email || "Unknown User";
}

function getStatusClass(status) {
  const map = {
    active: "status-active",
    inactive: "status-inactive",
    suspended: "status-suspended",
    pending: "status-pending",
    completed: "status-completed",
    processing: "status-processing",
    in_review: "status-review",
    documents_required: "status-required",
    rejected: "status-rejected",
    cancelled: "status-cancelled",
    submitted: "status-review",
  };

  return map[status] || "status-default";
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function SuperAdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [pendingRetailers, setPendingRetailers] = useState([]);
  const [retailerLoading, setRetailerLoading] = useState(true);
  const [retailerActionId, setRetailerActionId] = useState(null);
  const [retailerError, setRetailerError] = useState("");

  async function loadDashboard(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getSuperAdminDashboard();

      setDashboard(response);
    } catch (err) {
      setError(
        err?.message || "Unable to load SuperAdmin dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);
  async function loadPendingRetailers() {
    try {
      setRetailerLoading(true);
      setRetailerError("");

      const response = await getPendingRetailers();

      setPendingRetailers(response?.retailers || []);
    } catch (err) {
      setRetailerError(
        err?.message || "Unable to load pending retailer applications."
      );
    } finally {
      setRetailerLoading(false);
    }
  }

  useEffect(() => {
    loadPendingRetailers();
  }, []);

  async function handleRetailerApproval(retailerId, action) {
    try {
      setRetailerActionId(retailerId);
      setRetailerError("");

      await updateRetailerApproval(retailerId, action);

      await loadPendingRetailers();
    } catch (err) {
      setRetailerError(
        err?.message || "Unable to update retailer application."
      );
    } finally {
      setRetailerActionId(null);
    }
  }


  if (loading) {
    return (
      <main className="superadmin-page">
        <div className="superadmin-container">
          <div className="superadmin-state-card">
            <div className="superadmin-loader" />

            <strong>Loading SuperAdmin dashboard...</strong>

            <span>
              Fetching portal statistics and recent activity.
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="superadmin-page">
        <div className="superadmin-container">
          <div className="superadmin-state-card superadmin-error">
            <AlertCircle size={30} />

            <strong>Dashboard unavailable</strong>

            <span>{error}</span>

            <button
              type="button"
              onClick={() => loadDashboard()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const users = dashboard?.users || {};
  const requests = dashboard?.requests || {};
  const documents = dashboard?.documents || {};
  const payments = dashboard?.payments || {};

  return (
    <main className="superadmin-page">
      <div className="superadmin-container">

        {/* HEADER */}
        <section className="superadmin-header">
          <div>
            <div className="superadmin-eyebrow">
              <ShieldCheck size={15} />
              AGX SUPERADMIN
            </div>

            <h1>Administration Dashboard</h1>

            <p>
              Manage users, service requests, documents,
              payments and the complete AGX Service Portal.
            </p>
          </div>

          <button
            type="button"
            className="superadmin-refresh"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "is-spinning" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* MAIN STATISTICS */}
        <section className="superadmin-stats">

          <div className="superadmin-stat-card">
            <div className="superadmin-stat-icon blue">
              <Users size={22} />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{users.total ?? 0}</strong>
              <small>
                {users.active ?? 0} active accounts
              </small>
            </div>
          </div>

          <div className="superadmin-stat-card">
            <div className="superadmin-stat-icon purple">
              <UserRoundCog size={22} />
            </div>

            <div>
              <span>Clients</span>
              <strong>{users.clients ?? 0}</strong>
              <small>
                {users.staff ?? 0} staff accounts
              </small>
            </div>
          </div>

          <div className="superadmin-stat-card">
            <div className="superadmin-stat-icon orange">
              <FileText size={22} />
            </div>

            <div>
              <span>Total Requests</span>
              <strong>{requests.total ?? 0}</strong>
              <small>
                {requests.pending ?? 0} pending
              </small>
            </div>
          </div>

          <div className="superadmin-stat-card">
            <div className="superadmin-stat-icon green">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{requests.completed ?? 0}</strong>
              <small>
                {requests.processing ?? 0} processing
              </small>
            </div>
          </div>

          <div className="superadmin-stat-card">
            <div className="superadmin-stat-icon red">
              <FileCheck2 size={22} />
            </div>

            <div>
              <span>Documents</span>
              <strong>{documents.total ?? 0}</strong>
              <small>
                {documents.uploaded ?? 0} awaiting review
              </small>
            </div>
          </div>

          <div className="superadmin-stat-card">
            <div className="superadmin-stat-icon gold">
              <IndianRupee size={22} />
            </div>

            <div>
              <span>Paid Revenue</span>
              <strong>
                {formatCurrency(payments.paidAmount)}
              </strong>
              <small>
                {payments.paid ?? 0} paid payments
              </small>
            </div>
          </div>

        </section>

        {/* REQUEST + PAYMENT OVERVIEW */}
        <section className="superadmin-overview-grid">

          <div className="superadmin-panel">
            <div className="superadmin-section-head">
              <div>
                <span>REQUEST OVERVIEW</span>
                <h2>Service Requests</h2>
              </div>

              <FileText size={19} />
            </div>

            <div className="superadmin-metrics">

              <div>
                <span>Pending</span>
                <strong>{requests.pending ?? 0}</strong>
              </div>

              <div>
                <span>Under Review</span>
                <strong>{requests.inReview ?? 0}</strong>
              </div>

              <div>
                <span>Documents Required</span>
                <strong>{requests.documentsRequired ?? 0}</strong>
              </div>

              <div>
                <span>Processing</span>
                <strong>{requests.processing ?? 0}</strong>
              </div>

              <div>
                <span>Completed</span>
                <strong>{requests.completed ?? 0}</strong>
              </div>

              <div>
                <span>Rejected</span>
                <strong>{requests.rejected ?? 0}</strong>
              </div>

            </div>
          </div>

          <div className="superadmin-panel">
            <div className="superadmin-section-head">
              <div>
                <span>PAYMENT OVERVIEW</span>
                <h2>Financial Summary</h2>
              </div>

              <IndianRupee size={19} />
            </div>

            <div className="superadmin-financial">

              <div className="financial-main">
                <span>Total Paid</span>

                <strong>
                  {formatCurrency(payments.paidAmount)}
                </strong>
              </div>

              <div className="financial-row">
                <span>
                  <CheckCircle2 size={15} />
                  Paid Payments
                </span>

                <strong>{payments.paid ?? 0}</strong>
              </div>

              <div className="financial-row">
                <span>
                  <Clock3 size={15} />
                  Pending Payments
                </span>

                <strong>{payments.pending ?? 0}</strong>
              </div>

              <div className="financial-row">
                <span>
                  <AlertCircle size={15} />
                  Failed Payments
                </span>

                <strong>{payments.failed ?? 0}</strong>
              </div>

              <div className="financial-row">
                <span>Pending Amount</span>

                <strong>
                  {formatCurrency(payments.pendingAmount)}
                </strong>
              </div>

            </div>
          </div>

        </section>

        <DistributorManagement />

        {/* PENDING RETAILER APPLICATIONS */}
        <section className="superadmin-panel retailer-applications-panel">

          <div className="superadmin-section-head">
            <div>
              <span>RETAILER MANAGEMENT</span>
              <h2>Pending Retailer Applications</h2>
            </div>

            <UserRoundCog size={19} />
          </div>

          {retailerError && (
            <div className="superadmin-inline-error">
              <AlertCircle size={16} />
              <span>{retailerError}</span>
            </div>
          )}

          {retailerLoading ? (
            <div className="retailer-empty-state">
              <div className="superadmin-loader" />
              <span>Loading retailer applications...</span>
            </div>
          ) : pendingRetailers.length === 0 ? (
            <div className="retailer-empty-state">
              <CheckCircle2 size={24} />
              <strong>No pending retailer applications</strong>
              <span>New retailer registrations will appear here.</span>
            </div>
          ) : (
            <div className="superadmin-table-wrapper">
              <table className="superadmin-table">
                <thead>
                  <tr>
                    <th>Retailer</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingRetailers.map((retailer) => (
                    <tr key={retailer.id}>
                      <td>
                        <strong>{getFullName(retailer)}</strong>
                      </td>
                      <td>{retailer.email}</td>
                      <td>
                        {[retailer.city, retailer.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td>{formatDate(retailer.createdAt)}</td>
                      <td>
                        <span className="status-badge status-pending">
                          Pending
                        </span>
                      </td>
                      <td>
                        <div className="retailer-action-group">
                          <button
                            type="button"
                            className="retailer-approve-btn"
                            disabled={retailerActionId === retailer.id}
                            onClick={() => handleRetailerApproval(retailer.id, "approve")}
                          >
                            <CheckCircle2 size={15} />
                            Approve
                          </button>

                          <button
                            type="button"
                            className="retailer-reject-btn"
                            disabled={retailerActionId === retailer.id}
                            onClick={() => handleRetailerApproval(retailer.id, "reject")}
                          >
                            <AlertCircle size={15} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RECENT USERS */}
        <section className="superadmin-panel">

          <div className="superadmin-section-head">
            <div>
              <span>USER MANAGEMENT</span>
              <h2>Recent Users</h2>
            </div>

            <Users size={19} />
          </div>

          <div className="superadmin-table-wrapper">
            <table className="superadmin-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {dashboard?.recentUsers?.length ? (
                  dashboard.recentUsers.map((user) => (
                    <tr key={user.id}>

                      <td>
                        <div className="table-user">
                          <div className="table-avatar">
                            {getFullName(user)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {getFullName(user)}
                            </strong>

                            <small>
                              ID #{user.id}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span className="role-badge">
                          {formatStatus(user.role)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            user.status,
                          )}`}
                        >
                          {formatStatus(user.status)}
                        </span>
                      </td>

                      <td>
                        {formatDate(user.createdAt)}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="table-empty"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </section>

        {/* RECENT REQUESTS */}
        <section className="superadmin-panel">

          <div className="superadmin-section-head">
            <div>
              <span>SERVICE MANAGEMENT</span>
              <h2>Recent Requests</h2>
            </div>

            <FileText size={19} />
          </div>

          <div className="superadmin-table-wrapper">
            <table className="superadmin-table">

              <thead>
                <tr>
                  <th>Request</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {dashboard?.recentRequests?.length ? (
                  dashboard.recentRequests.map((request) => (
                    <tr key={request.id}>

                      <td>
                        <div className="request-number">
                          <strong>
                            {request.requestNumber}
                          </strong>

                          <small>
                            {request.title}
                          </small>
                        </div>
                      </td>

                      <td>
                        {getFullName(request.user)}
                      </td>

                      <td>
                        {request.serviceName}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            request.status,
                          )}`}
                        >
                          {formatStatus(request.status)}
                        </span>
                      </td>

                      <td>
                        {formatCurrency(request.amount)}
                      </td>

                      <td>
                        {formatDate(request.createdAt)}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="table-empty"
                    >
                      No service requests found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        </section>

      </div>
    </main>
  );
}

export default SuperAdminDashboard;