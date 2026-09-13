import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  IndianRupee,
  Receipt,
  Search,
  ShieldCheck,
  WalletCards,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPaymentOrder, getMyPayments, verifyPayment } from "../lib/api.js";
import "./payments.css";

const paymentsData = [];

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function Payments() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [payments, setPayments] = useState(paymentsData);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMyPayments()
      .then((response) => {
        if (mounted) setPayments(response?.payments || []);
      })
      .catch((error) => {
        console.error("Load payments error:", error);
        if (mounted) setPaymentError(error?.message || "Unable to load payments.");
      })
;

    return () => { mounted = false; };
  }, []);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesFilter = filter === "All" || payment.status === filter;
      const matchesSearch =
        !term ||
        payment.invoice.toLowerCase().includes(term) ||
        payment.request.toLowerCase().includes(term) ||
        payment.service.toLowerCase().includes(term) ||
        payment.id.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [payments, search, filter]);

  const paidTotal = payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingTotal = payments
    .filter((item) => item.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

  const openPayment = (payment) => {
    if (!payment?.requestId) return;
    setPaymentError("");
    setSelectedPayment(payment);
    setShowPayModal(true);
  };

  const startRazorpayPayment = async () => {
    if (!selectedPayment?.requestId || isPaying) return;
    setIsPaying(true);
    setPaymentError("");

    try {
      const orderResponse = await createPaymentOrder(selectedPayment.requestId);

      if (!orderResponse?.order?.id) {
        throw new Error(orderResponse?.message || "Unable to start payment.");
      }

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const existing = document.querySelector('script[data-agx-razorpay="true"]');
          if (existing) {
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.dataset.agxRazorpay = "true";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Razorpay Checkout could not be loaded."));
          document.body.appendChild(script);
        });
      }

      await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: orderResponse.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency || "INR",
          name: "AGX Software Services",
          description: `${orderResponse.request.serviceName} · ${orderResponse.request.requestNumber}`,
          order_id: orderResponse.order.id,
          theme: { color: "#0f766e" },
          modal: {
            ondismiss: () => resolve(),
          },
          handler: async (response) => {
            try {
              await verifyPayment({
                requestId: selectedPayment.requestId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              resolve();
              setShowPayModal(false);
              setSelectedPayment(null);
              const refreshed = await getMyPayments();
              setPayments(refreshed?.payments || []);
              navigate("/payments", { replace: true });
            } catch (error) {
              reject(error);
            }
          },
        });

        checkout.on("payment.failed", (response) => {
          reject(new Error(response?.error?.description || "Payment failed. Please try again."));
        });
        checkout.open();
      });
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setPaymentError(error?.message || "Unable to complete payment.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <main className="payments-page">
      <section className="payments-hero">
        <div className="container">
          <div className="payments-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <span>Payments & Invoices</span>
          </div>

          <div className="payments-hero-row">
            <div>
              <div className="payments-eyebrow">
                <WalletCards size={15} />
                BILLING CENTER
              </div>
              <h1>Payments & Invoices</h1>
              <p>
                View your payment activity, manage pending payments and access
                your AGX invoices in one place.
              </p>
            </div>

            <div className="payments-hero-badge">
              <ShieldCheck size={17} />
              Secure billing experience
            </div>
          </div>
        </div>
      </section>

      <section className="payments-content">
        <div className="container">
          <div className="payments-summary-grid">
            <article className="payment-summary-card">
              <div className="summary-card-top">
                <span>Total Paid</span>
                <div className="summary-icon paid">
                  <CheckCircle2 size={19} />
                </div>
              </div>
              <strong>{formatAmount(paidTotal)}</strong>
              <small>Across completed payments</small>
            </article>

            <article className="payment-summary-card">
              <div className="summary-card-top">
                <span>Pending</span>
                <div className="summary-icon pending">
                  <WalletCards size={19} />
                </div>
              </div>
              <strong>{formatAmount(pendingTotal)}</strong>
              <small>Requires your attention</small>
            </article>

            <article className="payment-summary-card">
              <div className="summary-card-top">
                <span>Invoices</span>
                <div className="summary-icon invoices">
                  <Receipt size={19} />
                </div>
              </div>
              <strong>{paymentsData.length}</strong>
              <small>Total billing records</small>
            </article>

            <article className="payment-summary-card">
              <div className="summary-card-top">
                <span>Payment Methods</span>
                <div className="summary-icon methods">
                  <CreditCard size={19} />
                </div>
              </div>
              <strong>3</strong>
              <small>UPI, Card & Net Banking</small>
            </article>
          </div>

          <div className="payments-main-grid">
            <section className="payments-panel">
              <div className="payments-panel-header">
                <div>
                  <span className="panel-kicker">TRANSACTION HISTORY</span>
                  <h2>Recent payments</h2>
                </div>

                <button type="button" className="export-btn">
                  <ArrowDownToLine size={16} />
                  Export
                </button>
              </div>

              <div className="payments-toolbar">
                <div className="payments-search">
                  <Search size={17} />
                  <input
                    type="search"
                    placeholder="Search invoice, request or service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="payments-filter-wrap">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Filter payments"
                  >
                    <option>All</option>
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>

              {paymentError && (
                <div className="request-form-error" role="alert">{paymentError}</div>
              )}

              <div className="payments-table-wrap">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <div className="invoice-cell">
                            <div className="invoice-icon">
                              <FileText size={16} />
                            </div>
                            <div>
                              <strong>{payment.invoice}</strong>
                              <span>{payment.id}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="service-cell">
                            <strong>{payment.service}</strong>
                            <span>Request {payment.request}</span>
                          </div>
                        </td>

                        <td>{payment.date}</td>

                        <td>
                          <strong className="amount-cell">
                            {formatAmount(payment.amount)}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`payment-status ${payment.status.toLowerCase()}`}
                          >
                            {payment.status === "Paid" && (
                              <CheckCircle2 size={13} />
                            )}
                            {payment.status === "Pending" && (
                              <WalletCards size={13} />
                            )}
                            {payment.status === "Failed" && (
                              <XCircle size={13} />
                            )}
                            {payment.status}
                          </span>
                        </td>

                        <td>
                          <div className="payment-actions">
                            {payment.status === "Pending" ? (
                              <button
                                type="button"
                                className="pay-now-btn"
                                onClick={() => openPayment(payment)}
                              >
                                Pay now
                                <ArrowUpRight size={14} />
                              </button>
                            ) : (
                              <button type="button" className="invoice-action">
                                <Download size={15} />
                                Invoice
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!filteredPayments.length && (
                  <div className="payments-empty">
                    <Search size={23} />
                    <strong>No payments found</strong>
                    <span>Try another search or filter.</span>
                  </div>
                )}
              </div>
            </section>

            <aside className="billing-side">
              <div className="billing-card pending-card">
                <div className="billing-card-icon">
                  <IndianRupee size={19} />
                </div>
                <span className="panel-kicker">PAYMENT DUE</span>
                <h3>{formatAmount(pendingTotal)}</h3>
                <p>
                  One payment is currently pending for your Website Development
                  request.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    openPayment(
                      payments.find((item) => item.status === "Pending")
                    )
                  }
                  className="billing-primary-btn"
                >
                  Complete payment
                  <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="billing-card invoice-tip">
                <div className="billing-tip-icon">
                  <Receipt size={18} />
                </div>
                <div>
                  <strong>Need an invoice?</strong>
                  <p>
                    Download invoices directly from your completed payment
                    records.
                  </p>
                </div>
              </div>

              <div className="billing-card support-card">
                <span className="panel-kicker">BILLING SUPPORT</span>
                <h3>Have a payment question?</h3>
                <p>
                  Contact AGX support with your invoice or request ID for
                  quicker assistance.
                </p>
                <Link to="/contact">Contact support</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {showPayModal && selectedPayment && (
        <div
          className="payment-modal-backdrop"
          onClick={() => setShowPayModal(false)}
        >
          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowPayModal(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="modal-payment-icon">
              <CreditCard size={23} />
            </div>

            <span className="panel-kicker">SECURE PAYMENT</span>
            <h2>Complete your payment</h2>
            <p>
              Payment for <strong>{selectedPayment.service}</strong>.
            </p>

            <div className="modal-amount">
              <span>Amount payable</span>
              <strong>{formatAmount(selectedPayment.amount)}</strong>
            </div>

            <div className="modal-methods">
              <button type="button" className="method-option">
                <WalletCards size={18} />
                UPI
              </button>
              <button type="button" className="method-option">
                <CreditCard size={18} />
                Card
              </button>
              <button type="button" className="method-option">
                <IndianRupee size={18} />
                Net Banking
              </button>
            </div>

            <button
              type="button"
              className="modal-pay-btn"
              onClick={startRazorpayPayment}
              disabled={isPaying}
            >
              {isPaying ? "Opening secure payment..." : "Proceed to secure payment"}
              <ArrowUpRight size={17} />
            </button>

            <div className="modal-security">
              <ShieldCheck size={15} />
              <span>Secure payment interface • AGX billing</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Payments;
