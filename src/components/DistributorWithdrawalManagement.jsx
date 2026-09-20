import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  getDistributorWithdrawalRequests,
  updateDistributorWithdrawalStatus,
} from "../lib/api.js";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function label(value) {
  return String(value || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function DistributorWithdrawalManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");
      const response = await getDistributorWithdrawalRequests();

      setRequests(
        Array.isArray(response?.withdrawals)
          ? response.withdrawals
          : Array.isArray(response?.requests)
            ? response.requests
            : [],
      );
    } catch (err) {
      setError(err.message || "Unable to load withdrawal requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function approveRequest(item) {
    try {
      setActionId(item.id);
      setError("");
      await updateDistributorWithdrawalStatus(item.id, {
        status: "approved",
      });
      await loadRequests();
    } catch (err) {
      setError(err.message || "Unable to approve withdrawal.");
    } finally {
      setActionId(null);
    }
  }

  async function rejectRequest(item) {
    const reason = window.prompt(
      "Enter rejection reason:",
      "Withdrawal request rejected by SuperAdmin.",
    );

    if (!reason?.trim()) return;

    try {
      setActionId(item.id);
      setError("");
      await updateDistributorWithdrawalStatus(item.id, {
        status: "rejected",
        rejectionReason: reason.trim(),
      });
      await loadRequests();
    } catch (err) {
      setError(err.message || "Unable to reject withdrawal.");
    } finally {
      setActionId(null);
    }
  }

  async function markPaid(item) {
    const reference = window.prompt(
      "Enter bank transfer reference / UTR number:",
      "",
    );

    if (!reference?.trim()) return;

    const note = window.prompt(
      "Optional admin note:",
      "Payment transferred manually to distributor bank account.",
    );

    try {
      setActionId(item.id);
      setError("");
      await updateDistributorWithdrawalStatus(item.id, {
        status: "paid",
        transferReference: reference.trim(),
        adminNote: note?.trim() || "",
      });
      await loadRequests();
    } catch (err) {
      setError(err.message || "Unable to mark withdrawal as paid.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="superadmin-panel" style={{ marginTop: 24 }}>
      <div
        className="superadmin-panel-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="dashboard-section-label">
            DISTRIBUTOR PAYOUTS
          </span>
          <h2>Withdrawal Requests</h2>
          <p>
            Review distributor withdrawal requests and process manual bank
            transfers.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          disabled={loading}
          className="dashboard-view-link"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error ? (
        <div
          className="dashboard-state-card dashboard-state-error"
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <div className="dashboard-state-card" style={{ marginTop: 16 }}>
          Loading withdrawal requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="dashboard-state-card" style={{ marginTop: 16 }}>
          <CheckCircle2 size={24} />
          <strong>No withdrawal requests</strong>
          <span>Distributor withdrawal requests will appear here.</span>
        </div>
      ) : (
        <div className="request-list" style={{ marginTop: 16 }}>
          {requests.map((item) => (
            <div className="request-card" key={item.id}>
              <div className="request-card-top">
                <div className="request-service">
                  <div className="request-icon">
                    <IndianRupee size={19} />
                  </div>
                  <div>
                    <strong>
                      {item.distributorCode || "Distributor"} —{" "}
                      {item.distributorName || "Distributor"}
                    </strong>
                    <span>
                      {item.email || "No email"}
                      {item.phone ? ` • ${item.phone}` : ""}
                    </span>
                  </div>
                </div>
                <strong>{money(item.amount)}</strong>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 10,
                  marginTop: 16,
                  fontSize: 13,
                }}
              >
                <span>
                  <strong>Status:</strong> {label(item.status)}
                </span>
                <span>
                  <strong>Account:</strong> {item.accountNumber || "—"}
                </span>
                <span>
                  <strong>IFSC:</strong> {item.ifscCode || "—"}
                </span>
                <span>
                  <strong>Bank:</strong> {item.bankName || "—"}
                </span>
                <span>
                  <strong>Branch:</strong> {item.branchName || "—"}
                </span>
                <span>
                  <strong>Requested:</strong>{" "}
                  {item.requestedAt
                    ? new Date(item.requestedAt).toLocaleString("en-IN")
                    : "—"}
                </span>
              </div>

              {item.rejectionReason ? (
                <div style={{ marginTop: 12 }}>
                  <strong>Rejection:</strong> {item.rejectionReason}
                </div>
              ) : null}

              {item.transferReference ? (
                <div style={{ marginTop: 12 }}>
                  <strong>Transfer Reference:</strong>{" "}
                  {item.transferReference}
                </div>
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 18,
                }}
              >
                {item.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      className="dashboard-view-link"
                      disabled={actionId === item.id}
                      onClick={() => approveRequest(item)}
                    >
                      <CheckCircle2 size={16} />
                      {actionId === item.id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      className="dashboard-view-link"
                      disabled={actionId === item.id}
                      onClick={() => rejectRequest(item)}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </>
                ) : null}

                {item.status === "approved" ? (
                  <button
                    type="button"
                    className="dashboard-view-link"
                    disabled={actionId === item.id}
                    onClick={() => markPaid(item)}
                  >
                    <CheckCircle2 size={16} />
                    {actionId === item.id ? "Processing..." : "Mark Paid"}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default DistributorWithdrawalManagement;
