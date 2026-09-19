import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Store, CheckCircle2, XCircle } from "lucide-react";
import {
  getSuperAdminRetailers,
  updateRetailerApproval,
} from "../lib/api";

function getFullName(retailer) {
  const name = `${retailer?.firstName || ""} ${retailer?.lastName || ""}`.trim();
  return name || "Retailer";
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function SuperAdminRetailers() {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadRetailers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await getSuperAdminRetailers();
      setRetailers(response?.retailers || []);
    } catch (err) {
      console.error("Load retailers error:", err);
      setError(err?.message || "Unable to load retailers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRetailers();
  }, [loadRetailers]);

  async function handleApproval(retailer, action) {
    const actionText = action === "approve" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${getFullName(retailer)}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(retailer.id);
      setError("");

      await updateRetailerApproval(retailer.id, action);
      await loadRetailers(true);
    } catch (err) {
      console.error("Retailer approval error:", err);
      setError(err?.message || `Unable to ${actionText} retailer.`);
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingCount = retailers.filter(
    (retailer) => retailer.status === "pending"
  ).length;

  return (
    <div className="superadmin-page">
      <div className="superadmin-page-header">
        <div>
          <div className="superadmin-eyebrow">RETAILER MANAGEMENT</div>
          <h1>Retailers</h1>
          <p>Manage retailer accounts and pending applications.</p>
        </div>

        <button
          type="button"
          className="superadmin-refresh-btn"
          onClick={() => loadRetailers(true)}
          disabled={refreshing}
        >
          <RefreshCw size={17} className={refreshing ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="superadmin-error">
          {error}
        </div>
      )}

      <div className="superadmin-summary-card">
        <Store size={20} />
        <div>
          <strong>{retailers.length}</strong>
          <span>Total Retailers</span>
        </div>
        <div>
          <strong>{pendingCount}</strong>
          <span>Pending Applications</span>
        </div>
      </div>

      <div className="superadmin-table-card">
        <div className="superadmin-table-header">
          <div>
            <Store size={18} />
            <h2>Retailer Accounts</h2>
          </div>
          <span>{retailers.length} Retailers</span>
        </div>

        {loading ? (
          <div className="superadmin-empty-state">
            Loading retailers...
          </div>
        ) : retailers.length === 0 ? (
          <div className="superadmin-empty-state">
            No retailers found.
          </div>
        ) : (
          <div className="superadmin-table-wrap">
            <table className="superadmin-table">
              <thead>
                <tr>
                  <th>Retailer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {retailers.map((retailer) => {
                  const isUpdating = updatingId === retailer.id;
                  const isPending = retailer.status === "pending";

                  return (
                    <tr key={retailer.id}>
                      <td>
                        <strong>{getFullName(retailer)}</strong>
                      </td>

                      <td>{retailer.phone || "-"}</td>

                      <td>{retailer.email || "-"}</td>

                      <td>
                        <span
                          className={`superadmin-status-badge status-${retailer.status}`}
                        >
                          {formatStatus(retailer.status)}
                        </span>
                      </td>

                      <td>{formatDate(retailer.created_at)}</td>

                      <td>
                        {isPending ? (
                          <div className="superadmin-action-group">
                            <button
                              type="button"
                              className="superadmin-action-btn approve"
                              disabled={isUpdating}
                              onClick={() =>
                                handleApproval(retailer, "approve")
                              }
                            >
                              <CheckCircle2 size={15} />
                              Approve
                            </button>

                            <button
                              type="button"
                              className="superadmin-action-btn reject"
                              disabled={isUpdating}
                              onClick={() =>
                                handleApproval(retailer, "reject")
                              }
                            >
                              <XCircle size={15} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="superadmin-muted">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
