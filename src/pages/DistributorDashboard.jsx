import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Copy,
  IndianRupee,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  apiRequest,
  getAssignedRetailers,
} from "../lib/api.js";
import "./dashboard.css";
import DistributorWithdrawalPanel from "../components/DistributorWithdrawalPanel.jsx";

function DistributorDashboard() {
  const [data, setData] = useState(null);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [retailersLoading, setRetailersLoading] = useState(true);
  const [error, setError] = useState("");
  const [retailersError, setRetailersError] = useState("");
  const [copied, setCopied] = useState(false);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/distributor/dashboard");
      setData(response);
    } catch (err) {
      setError(err.message || "Unable to load distributor dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadWallet() {
    try {
      setWalletLoading(true);
      setWalletError("");
      const response = await getDistributorWallet();
      setWallet(response?.wallet || null);
      setWalletTransactions(Array.isArray(response?.transactions) ? response.transactions : []);
    } catch (err) {
      setWalletError(err.message || "Unable to load wallet");
    } finally {
      setWalletLoading(false);
    }
  }

  async function loadRetailers() {
    try {
      setRetailersLoading(true);
      setRetailersError("");

      const response = await getAssignedRetailers();
      setRetailers(response?.retailers || []);
    } catch (err) {
      setRetailersError(
        err.message || "Unable to load assigned retailers"
      );
    } finally {
      setRetailersLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    loadWallet();
    loadRetailers();
  }, []);

  async function copyCode() {
    const code = data?.distributor?.distributorCode;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-state-card">
            <div className="dashboard-loader" />
            <strong>Loading Distributor Portal…</strong>
            <span>
              Fetching your distributor account information.
            </span>
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
            <strong>Distributor dashboard unavailable</strong>
            <span>{error}</span>
            <button type="button" onClick={loadDashboard}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const distributor = data?.distributor;
  const stats = data?.stats || {};

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-topbar">
          <div>
            <div className="dashboard-eyebrow">
              <BriefcaseBusiness size={14} />
              DISTRIBUTOR PORTAL
            </div>

            <h1>
              Welcome back, {distributor?.firstName || "Distributor"}
            </h1>

            <p>
              Manage your retailers, monitor activity and track your AGX
              distributor account.
            </p>
          </div>

          <div className="dashboard-profile">
            <span className="dashboard-avatar">
              {(distributor?.firstName?.[0] || "D").toUpperCase()}
              {(distributor?.lastName?.[0] || "").toUpperCase()}
            </span>

            <span className="dashboard-profile-text">
              <strong>
                {distributor?.firstName || ""}{" "}
                {distributor?.lastName || ""}
              </strong>
              <small>Distributor Portal</small>
            </span>
          </div>
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <Users size={21} />
            </div>
            <div>
              <span>Total Retailers</span>
              <strong>{stats.totalRetailers || 0}</strong>
              <small>Retailers under you</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Active Retailers</span>
              <strong>{stats.activeRetailers || 0}</strong>
              <small>Currently active</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon orange">
              <Users size={21} />
            </div>
            <div>
              <span>Pending Retailers</span>
              <strong>{stats.pendingRetailers || 0}</strong>
              <small>Awaiting action</small>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <IndianRupee size={21} />
            </div>
            <div>
              <span>Available Wallet</span>
              <strong>
                ₹{Number(stats.availableWallet || 0).toLocaleString("en-IN")}
              </strong>
              <small>Current balance</small>
            </div>
          </div>
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-primary">
            <div className="dashboard-section-head">
              <div>
                <span className="dashboard-section-label">
                  DISTRIBUTOR ACCOUNT
                </span>
                <h2>Your Distributor ID</h2>
              </div>
            </div>

            <div className="request-card">
              <div className="request-card-top">
                <div className="request-service">
                  <div className="request-icon">
                    <Store size={19} />
                  </div>

                  <div>
                    <strong>
                      {distributor?.distributorCode || "—"}
                    </strong>
                    <span>Use this ID for retailer mapping</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="dashboard-view-link"
                  onClick={copyCode}
                >
                  <Copy size={16} />
                  {copied ? "Copied" : "Copy ID"}
                </button>
              </div>
            </div>

            <div
              className="dashboard-section-head"
              style={{ marginTop: 28 }}
            >
              <div>
                <span className="dashboard-section-label">
                  MY NETWORK
                </span>
                <h2>My Retailers</h2>
              </div>

              <span>{retailers.length} Retailers</span>
            </div>

            <div className="request-list">
              {retailersLoading ? (
                <div className="request-card">
                  <div className="request-service">
                    <div className="request-icon">
                      <Users size={19} />
                    </div>
                    <div>
                      <strong>Loading retailers...</strong>
                      <span>
                        Fetching retailers assigned to you.
                      </span>
                    </div>
                  </div>
                </div>
              ) : retailersError ? (
                <div className="request-card">
                  <div className="request-service">
                    <div className="request-icon">
                      <AlertCircle size={19} />
                    </div>
                    <div>
                      <strong>Unable to load retailers</strong>
                      <span>{retailersError}</span>
                    </div>
                  </div>
                </div>
              ) : retailers.length === 0 ? (
                <div className="request-card">
                  <div className="request-service">
                    <div className="request-icon">
                      <Users size={19} />
                    </div>
                    <div>
                      <strong>No retailers assigned</strong>
                      <span>
                        Retailers assigned to your distributor account
                        will appear here.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                retailers.map((retailer) => (
                  <div className="request-card" key={retailer.id}>
                    <div className="request-card-top">
                      <div className="request-service">
                        <div className="request-icon">
                          <Store size={19} />
                        </div>

                        <div>
                          <strong>
                            {[
                              retailer.firstName,
                              retailer.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ") || "Retailer"}
                          </strong>

                          <span>
                            {retailer.email || "No email"}
                            {retailer.phone
                              ? ` • ${retailer.phone}`
                              : ""}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {retailer.status || "unknown"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div
              className="dashboard-section-head"
              style={{ marginTop: 28 }}
            >
              <div>
                <span className="dashboard-section-label">
                  WALLET
                </span>
                <h2>Commission Wallet</h2>
              </div>
            </div>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon green">
                  <IndianRupee size={21} />
                </div>
                <div>
                  <span>Total Earned</span>
                  <strong>₹{Number(wallet?.totalEarned || 0).toLocaleString("en-IN")}</strong>
                  <small>Lifetime commission</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon green">
                  <IndianRupee size={21} />
                </div>
                <div>
                  <span>Available Balance</span>
                  <strong>₹{Number(wallet?.availableBalance || 0).toLocaleString("en-IN")}</strong>
                  <small>Available for withdrawal</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon orange">
                  <IndianRupee size={21} />
                </div>
                <div>
                  <span>Pending</span>
                  <strong>₹{Number(wallet?.pendingBalance || 0).toLocaleString("en-IN")}</strong>
                  <small>Pending settlement</small>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon">
                  <IndianRupee size={21} />
                </div>
                <div>
                  <span>Withdrawn</span>
                  <strong>₹{Number(wallet?.withdrawnAmount || 0).toLocaleString("en-IN")}</strong>
                  <small>Total withdrawn</small>
                </div>
              </div>
            </div>
          </div>

          <DistributorWithdrawalPanel
            availableBalance={wallet?.availableBalance || 0}
            onWalletRefresh={loadWallet}
          />

          <div
            className="dashboard-section-head"
            style={{ marginTop: 28 }}
          >
            <div>
              <span className="dashboard-section-label">
                TRANSACTIONS
              </span>
              <h2>Commission History</h2>
            </div>
          </div>

          <div className="request-list">
            {walletTransactions.length === 0 ? (
              <div className="request-card">
                <div className="request-service">
                  <div className="request-icon">
                    <IndianRupee size={19} />
                  </div>
                  <div>
                    <strong>No commission transactions yet</strong>
                    <span>
                      Commission entries will appear here after retailer payments are accepted.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              walletTransactions.map((transaction) => (
                <div className="request-card" key={transaction.id}>
                  <div className="request-card-top">
                    <div className="request-service">
                      <div className="request-icon">
                        <IndianRupee size={19} />
                      </div>
                      <div>
                        <strong>
                          {transaction.type === "commission"
                            ? "Retailer Payment Commission"
                            : String(transaction.type || "Wallet Transaction").replaceAll("_", " ")}
                        </strong>
                        <span>
                          {transaction.description || "Distributor wallet transaction"}
                        </span>
                      </div>
                    </div>

                    <strong>
                      ₹{Number(transaction.amount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 18,
                      flexWrap: "wrap",
                      marginTop: 12,
                      fontSize: 13,
                      opacity: 0.78,
                    }}
                  >
                    <span>
                      Payment #{transaction.paymentId || "—"}
                    </span>
                    <span>
                      Rate: {transaction.commissionRate || 0}%
                    </span>
                    <span>
                      Status: {transaction.status || "completed"}
                    </span>
                    <span>
                      {transaction.createdAt
                        ? new Date(transaction.createdAt).toLocaleString("en-IN")
                        : "—"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="dashboard-secondary">
            <div className="dashboard-section-head">
              <div>
                <span className="dashboard-section-label">
                  ACCOUNT
                </span>
                <h2>Status</h2>
              </div>
            </div>

            <div className="dashboard-state-card">
              <CheckCircle2 size={28} />
              <strong>
                {distributor?.status === "active"
                  ? "Active"
                  : distributor?.status}
              </strong>
              <span>
                Your distributor account is currently active.
              </span>
            </div>

            <div
              className="dashboard-section-head"
              style={{ marginTop: 28 }}
            >
              <div>
                <span className="dashboard-section-label">
                  EARNINGS
                </span>
                <h2>Commission</h2>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon green">
                <IndianRupee size={21} />
              </div>

              <div>
                <span>Total Commission</span>
                <strong>
                  ₹{Number(stats.totalCommission || 0).toLocaleString("en-IN")}
                </strong>
                <small>Commission system will be connected next</small>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default DistributorDashboard;
