import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  CreditCard,
  Download,
  Eye,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import {
  getSuperAdminPayments,
  openSuperAdminPaymentScreenshot,
  downloadSuperAdminPaymentScreenshot,
  updateSuperAdminPaymentStatus,
} from "../lib/api";

function SuperAdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [processingId, setProcessingId] = useState(null);

  const [rejectPayment, setRejectPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  async function loadPayments(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getSuperAdminPayments();

      setPayments(
        Array.isArray(response?.payments)
          ? response.payments
          : []
      );
    } catch (err) {
      console.error("Failed to load SuperAdmin payments:", err);
      setError(
        err?.message || "Unable to load payments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "all" ||
        String(payment.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        payment.invoice,
        payment.request,
        payment.service,
        payment.email,
        payment.userEmail,
        payment.provider,
        payment.method,
        payment.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [payments, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: payments.length,

      pending: payments.filter(
        (payment) =>
          String(payment.status).toLowerCase() ===
          "pending"
      ).length,

      accepted: payments.filter(
        (payment) =>
          String(payment.status).toLowerCase() ===
            "accepted" ||
          String(payment.status).toLowerCase() === "paid"
      ).length,

      rejected: payments.filter(
        (payment) =>
          String(payment.status).toLowerCase() ===
          "rejected"
      ).length,
    };
  }, [payments]);

  function formatAmount(amount) {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusClass(status) {
    const normalized = String(status || "")
      .toLowerCase();

    if (
      normalized === "accepted" ||
      normalized === "paid"
    ) {
      return "superadmin-payment-status accepted";
    }

    if (normalized === "rejected") {
      return "superadmin-payment-status rejected";
    }

    if (normalized === "pending") {
      return "superadmin-payment-status pending";
    }

    return "superadmin-payment-status";
  }

  function getDisplayStatus(status) {
    const normalized = String(status || "")
      .toLowerCase();

    if (normalized === "paid") {
      return "Accepted";
    }

    if (normalized === "rejected") {
      return "Rejected";
    }

    if (normalized === "pending") {
      return "Pending";
    }

    return status || "Unknown";
  }

  async function handleView(payment) {
    try {
      setProcessingId(payment.id);

      await openSuperAdminPaymentScreenshot(
        payment.id
      );
    } catch (err) {
      console.error(err);
      window.alert(
        err?.message ||
          "Unable to open payment screenshot."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDownload(payment) {
    try {
      setProcessingId(payment.id);

      await downloadSuperAdminPaymentScreenshot(
        payment.id
      );
    } catch (err) {
      console.error(err);
      window.alert(
        err?.message ||
          "Unable to download payment screenshot."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleAccept(payment) {
    const confirmed = window.confirm(
      `Accept payment ${payment.invoice || `#${payment.id}`}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(payment.id);
      setError("");

      await updateSuperAdminPaymentStatus(
        payment.id,
        "paid"
      );

      await loadPayments(true);
    } catch (err) {
      console.error(err);
      window.alert(
        err?.message ||
          "Unable to accept payment."
      );
    } finally {
      setProcessingId(null);
    }
  }

  function openRejectModal(payment) {
    setRejectPayment(payment);
    setRejectionReason("");
  }

  function closeRejectModal() {
    if (processingId !== null) {
      return;
    }

    setRejectPayment(null);
    setRejectionReason("");
  }

  async function handleReject() {
    if (!rejectPayment) {
      return;
    }

    try {
      setProcessingId(rejectPayment.id);
      setError("");

      await updateSuperAdminPaymentStatus(
        rejectPayment.id,
        "rejected",
        rejectionReason.trim()
      );

      setRejectPayment(null);
      setRejectionReason("");

      await loadPayments(true);
    } catch (err) {
      console.error(err);
      window.alert(
        err?.message ||
          "Unable to reject payment."
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="superadmin-section-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            FINANCIAL MANAGEMENT
          </span>

          <h1>Payments</h1>

          <p>
            Review client payment proofs and manage
            payment verification.
          </p>
        </div>

        <button
          type="button"
          className="superadmin-payment-refresh"
          onClick={() => loadPayments(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "superadmin-payment-spin"
                : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="superadmin-payment-summary">
        <div className="superadmin-payment-summary-card">
          <div className="superadmin-payment-summary-icon">
            <CreditCard size={22} />
          </div>

          <div>
            <span>Total Payments</span>
            <strong>{counts.total}</strong>
          </div>
        </div>

        <div className="superadmin-payment-summary-card">
          <div className="superadmin-payment-summary-icon">
            <RefreshCw size={22} />
          </div>

          <div>
            <span>Pending</span>
            <strong>{counts.pending}</strong>
          </div>
        </div>

        <div className="superadmin-payment-summary-card">
          <div className="superadmin-payment-summary-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Accepted</span>
            <strong>{counts.accepted}</strong>
          </div>
        </div>

        <div className="superadmin-payment-summary-card">
          <div className="superadmin-payment-summary-icon">
            <XCircle size={22} />
          </div>

          <div>
            <span>Rejected</span>
            <strong>{counts.rejected}</strong>
          </div>
        </div>
      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="superadmin-payment-toolbar">
        <div className="superadmin-payment-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search invoice, request, service..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          className="superadmin-payment-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="superadmin-payment-error">
          {error}
        </div>
      )}

      {/* =========================
          TABLE
      ========================= */}

      <div className="superadmin-payment-table-panel">
        {loading ? (
          <div className="superadmin-payment-loading">
            <RefreshCw
              size={28}
              className="superadmin-payment-spin"
            />

            <p>Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="superadmin-payment-empty">
            <CreditCard size={42} />

            <h2>No payments found</h2>

            <p>
              There are no payments matching the
              current filters.
            </p>
          </div>
        ) : (
          <div className="superadmin-payment-table-wrap">
            <table className="superadmin-payment-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Request</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment Proof</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => {
                  const normalizedStatus = String(
                    payment.status || ""
                  ).toLowerCase();

                  const isPending =
                    normalizedStatus === "pending";

                  const isProcessing =
                    processingId === payment.id;

                  const clientEmail =
                    payment.email ||
                    payment.userEmail ||
                    payment.user_email ||
                    "—";

                  return (
                    <tr key={payment.id}>
                      <td>
                        <strong>
                          {payment.invoice ||
                            `PAY-${payment.id}`}
                        </strong>
                      </td>

                      <td>
                        <span className="superadmin-payment-request">
                          {payment.request || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="superadmin-payment-client">
                          {clientEmail}
                        </span>
                      </td>

                      <td>
                        {payment.service || "—"}
                      </td>

                      <td>
                        <strong>
                          {formatAmount(
                            payment.amount
                          )}
                        </strong>
                      </td>

                      <td>
                        {formatDate(payment.date)}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            payment.status
                          )}
                        >
                          {getDisplayStatus(
                            payment.status
                          )}
                        </span>
                      </td>

                      <td>
                        {payment.hasScreenshot ||
                        payment.paymentScreenshot ||
                        payment.screenshot ? (
                          <button
                            type="button"
                            className="superadmin-payment-view-btn"
                            onClick={() =>
                              handleView(payment)
                            }
                            disabled={isProcessing}
                          >
                            <Eye size={16} />
                            View
                          </button>
                        ) : (
                          <span>Not available</span>
                        )}
                      </td>

                      <td>
                        <div className="superadmin-payment-actions">
                          <button
                            type="button"
                            className="superadmin-payment-action-btn"
                            title="Download screenshot"
                            onClick={() =>
                              handleDownload(payment)
                            }
                            disabled={isProcessing}
                          >
                            <Download size={16} />
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                className="superadmin-payment-accept-btn"
                                onClick={() =>
                                  handleAccept(payment)
                                }
                                disabled={isProcessing}
                              >
                                <CheckCircle size={16} />
                                Accept
                              </button>

                              <button
                                type="button"
                                className="superadmin-payment-reject-btn"
                                onClick={() =>
                                  openRejectModal(payment)
                                }
                                disabled={isProcessing}
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          REJECT MODAL
      ========================= */}

      {rejectPayment && (
        <div
          className="superadmin-payment-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeRejectModal();
            }
          }}
        >
          <div className="superadmin-payment-modal">
            <div className="superadmin-payment-modal-header">
              <div>
                <span className="superadmin-page-eyebrow">
                  PAYMENT VERIFICATION
                </span>

                <h2>Reject Payment</h2>
              </div>

              <button
                type="button"
                onClick={closeRejectModal}
                disabled={processingId !== null}
                className="superadmin-payment-modal-close"
              >
                <XCircle size={22} />
              </button>
            </div>

            <p>
              You are rejecting payment{" "}
              <strong>
                {rejectPayment.invoice ||
                  `#${rejectPayment.id}`}
              </strong>
              .
            </p>

            <label className="superadmin-payment-modal-label">
              Rejection reason
              <textarea
                value={rejectionReason}
                onChange={(event) =>
                  setRejectionReason(
                    event.target.value
                  )
                }
                placeholder="Enter reason for rejecting this payment..."
                rows={4}
              />
            </label>

            <div className="superadmin-payment-modal-actions">
              <button
                type="button"
                onClick={closeRejectModal}
                disabled={processingId !== null}
                className="superadmin-payment-modal-cancel"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReject}
                disabled={processingId !== null}
                className="superadmin-payment-reject-confirm"
              >
                <XCircle size={17} />

                {processingId !== null
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminPayments;