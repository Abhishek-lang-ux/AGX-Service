import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  CheckCircle2,
  Clock3,
  FileText,
  CreditCard,
  User,
} from "lucide-react";

import {
  getSuperAdminRequests,
  getSuperAdminRequest,
  updateSuperAdminRequestStatus,
} from "../lib/api";

const STATUS_OPTIONS = [
  ["pending", "Pending"],
  ["submitted", "Submitted"],
  ["in_review", "In Review"],
  ["documents_required", "Documents Required"],
  ["processing", "Processing"],
  ["completed", "Completed"],
  ["rejected", "Rejected"],
  ["cancelled", "Cancelled"],
];

const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS);

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function SuperAdminRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setError("");

      const data = await getSuperAdminRequests({
        search,
        status,
      });

      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message || "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [search, status]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(
        (r) => r.status === "pending"
      ).length,
      processing: requests.filter(
        (r) =>
          r.status === "processing" ||
          r.status === "in_review"
      ).length,
      completed: requests.filter(
        (r) => r.status === "completed"
      ).length,
    };
  }, [requests]);

  async function openRequest(id) {
    try {
      setError("");

      const data = await getSuperAdminRequest(id);

      setSelected(data.request);
    } catch (err) {
      setError(err.message || "Unable to open request.");
    }
  }

  async function changeStatus(requestId, nextStatus) {
    try {
      setUpdating(true);
      setError("");

      await updateSuperAdminRequestStatus(
        requestId,
        nextStatus
      );

      await loadRequests();

      if (selected?.id === requestId) {
        const data = await getSuperAdminRequest(requestId);
        setSelected(data.request);
      }
    } catch (err) {
      setError(
        err.message || "Unable to update request status."
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="superadmin-page">
      <section className="superadmin-page-header">
        <div>
          <span className="superadmin-eyebrow">
            SERVICE MANAGEMENT
          </span>

          <h1>Requests</h1>

          <p>
            Review client requests and keep their service
            progress updated.
          </p>
        </div>

        <button
          type="button"
          className="superadmin-refresh-btn"
          onClick={loadRequests}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {error && (
        <div className="superadmin-error">
          {error}
        </div>
      )}

      <section className="superadmin-stat-grid">
        <div className="superadmin-stat-card">
          <span>Total Requests</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="superadmin-stat-card">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>

        <div className="superadmin-stat-card">
          <span>In Progress</span>
          <strong>{stats.processing}</strong>
        </div>

        <div className="superadmin-stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>
      </section>

      <section className="superadmin-table-card">
        <div className="superadmin-toolbar">
          <div className="superadmin-search">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search request, client, service..."
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="">All Status</option>

            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="superadmin-empty">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="superadmin-empty">
            <FileText size={34} />
            <strong>No requests found</strong>
            <span>
              New client requests will appear here.
            </span>
          </div>
        ) : (
          <div className="superadmin-table-wrap">
            <table className="superadmin-table">
              <thead>
                <tr>
                  <th>REQUEST</th>
                  <th>CLIENT</th>
                  <th>SERVICE</th>
                  <th>AMOUNT</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>
                        {request.requestNumber}
                      </strong>

                      <small>
                        {request.title}
                      </small>
                    </td>

                    <td>
                      <span>
                        {request.user?.email || "—"}
                      </span>

                      {request.user?.phone && (
                        <small>
                          {request.user.phone}
                        </small>
                      )}
                    </td>

                    <td>
                      {request.serviceName || "—"}
                    </td>

                    <td>
                      <strong>
                        {money(request.amount)}
                      </strong>
                    </td>

                    <td>
                      {formatDate(request.createdAt)}
                    </td>

                    <td>
                      <span
                        className={`request-status request-status-${request.status}`}
                      >
                        {STATUS_LABEL[
                          request.status
                        ] || request.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="request-view-btn"
                        onClick={() =>
                          openRequest(request.id)
                        }
                      >
                        <Eye size={16} />
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <div
          className="request-modal-overlay"
          onMouseDown={() => setSelected(null)}
        >
          <div
            className="request-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="request-modal-header">
              <div>
                <span>REQUEST DETAILS</span>

                <h2>
                  {selected.requestNumber}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="request-detail-grid">
              <div>
                <small>Service</small>
                <strong>
                  {selected.serviceName}
                </strong>
              </div>

              <div>
                <small>Amount</small>
                <strong>
                  {money(selected.amount)}
                </strong>
              </div>

              <div>
                <small>Client</small>
                <strong>
                  {selected.user?.email || "—"}
                </strong>
              </div>

              <div>
                <small>Phone</small>
                <strong>
                  {selected.user?.phone || "—"}
                </strong>
              </div>
            </div>

            <div className="request-detail-section">
              <span>TITLE</span>
              <h3>{selected.title}</h3>

              {selected.description && (
                <p>{selected.description}</p>
              )}
            </div>

            <div className="request-detail-section">
              <span>PAYMENT</span>

              {selected.payments?.length ? (
                selected.payments.map((payment) => (
                  <div
                    className="request-payment-row"
                    key={payment.id}
                  >
                    <CreditCard size={17} />

                    <strong>
                      {money(payment.amount)}
                    </strong>

                    <span>
                      {payment.status}
                    </span>
                  </div>
                ))
              ) : (
                <p>No payment record found.</p>
              )}
            </div>

            <div className="request-detail-section">
              <span>DOCUMENTS</span>

              {selected.documents?.length ? (
                selected.documents.map((doc) => (
                  <div
                    className="request-document-row"
                    key={doc.id}
                  >
                    <FileText size={17} />

                    <div>
                      <strong>
                        {doc.original_filename ||
                          doc.document_type ||
                          "Document"}
                      </strong>

                      <small>
                        {doc.status}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p>No documents uploaded.</p>
              )}
            </div>

            <div className="request-detail-section">
              <span>UPDATE REQUEST STATUS</span>

              <div className="request-status-actions">
                {STATUS_OPTIONS.map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        selected.status === value
                          ? "active"
                          : ""
                      }
                      disabled={updating}
                      onClick={() =>
                        changeStatus(
                          selected.id,
                          value
                        )
                      }
                    >
                      {value === "completed" ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <Clock3 size={15} />
                      )}

                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="request-last-update">
              <User size={15} />

              Last updated:{" "}
              {formatDate(selected.updatedAt)}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}