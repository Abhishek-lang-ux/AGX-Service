import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  IndianRupee,
  Save,
  WalletCards,
} from "lucide-react";
import {
  createDistributorWithdrawal,
  getDistributorBankAccount,
  getDistributorWithdrawals,
  saveDistributorBankAccount,
} from "../lib/api.js";

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusLabel(status) {
  return String(status || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DistributorWithdrawalPanel({ availableBalance = 0, onWalletRefresh }) {
  const [bank, setBank] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
  });

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);

  const [loadingBank, setLoadingBank] = useState(true);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const [savingBank, setSavingBank] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const [bankSaved, setBankSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBank() {
    try {
      setLoadingBank(true);
      const response = await getDistributorBankAccount();

      if (response?.bankAccount) {
        setBank({
          accountHolderName: response.bankAccount.accountHolderName || "",
          accountNumber: response.bankAccount.accountNumber || "",
          ifscCode: response.bankAccount.ifscCode || "",
          bankName: response.bankAccount.bankName || "",
          branchName: response.bankAccount.branchName || "",
        });
      }
    } catch (err) {
      setError(err.message || "Unable to load bank details.");
    } finally {
      setLoadingBank(false);
    }
  }

  async function loadWithdrawals() {
    try {
      setLoadingWithdrawals(true);
      const response = await getDistributorWithdrawals();
      setWithdrawals(
        Array.isArray(response?.withdrawals) ? response.withdrawals : [],
      );
    } catch (err) {
      setError(err.message || "Unable to load withdrawal history.");
    } finally {
      setLoadingWithdrawals(false);
    }
  }

  useEffect(() => {
    loadBank();
    loadWithdrawals();
  }, []);

  function updateBank(field, value) {
    setBank((current) => ({
      ...current,
      [field]: value,
    }));
    setBankSaved(false);
    setMessage("");
    setError("");
  }

  async function handleSaveBank(event) {
    event.preventDefault();

    try {
      setSavingBank(true);
      setMessage("");
      setError("");

      await saveDistributorBankAccount({
        accountHolderName: bank.accountHolderName.trim(),
        accountNumber: bank.accountNumber.trim(),
        ifscCode: bank.ifscCode.trim().toUpperCase(),
        bankName: bank.bankName.trim(),
        branchName: bank.branchName.trim(),
      });

      setBankSaved(true);
      setMessage("Bank account details saved successfully.");
      await loadBank();
    } catch (err) {
      setError(err.message || "Unable to save bank details.");
    } finally {
      setSavingBank(false);
    }
  }

  async function handleWithdrawal(event) {
    event.preventDefault();

    const amount = Number(withdrawalAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid withdrawal amount.");
      return;
    }

    if (amount > Number(availableBalance || 0)) {
      setError("Withdrawal amount cannot exceed your available balance.");
      return;
    }

    try {
      setRequesting(true);
      setMessage("");
      setError("");

      await createDistributorWithdrawal(amount);

      setWithdrawalAmount("");
      setMessage(
        "Withdrawal request submitted. The amount is now reserved for SuperAdmin processing.",
      );

      await Promise.all([
        loadWithdrawals(),
        onWalletRefresh ? onWalletRefresh() : Promise.resolve(),
      ]);
    } catch (err) {
      setError(err.message || "Unable to create withdrawal request.");
    } finally {
      setRequesting(false);
    }
  }

  return (
    <section style={{ marginTop: 28 }}>
      <div className="dashboard-section-head">
        <div>
          <span className="dashboard-section-label">WITHDRAWALS</span>
          <h2>Bank & Withdrawal</h2>
        </div>
      </div>

      {message ? (
        <div
          className="dashboard-state-card"
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <CheckCircle2 size={20} />
          <span>{message}</span>
        </div>
      ) : null}

      {error ? (
        <div
          className="dashboard-state-card dashboard-state-error"
          style={{
            marginBottom: 16,
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

      <div className="withdrawal-layout">
        <div className="dashboard-primary">
          <div className="request-card">
            <div className="request-card-top">
              <div className="request-service">
                <div className="request-icon">
                  <Building2 size={19} />
                </div>
                <div>
                  <strong>Bank Account</strong>
                  <span>
                    SuperAdmin will transfer approved withdrawals to this
                    account.
                  </span>
                </div>
              </div>
            </div>

            {loadingBank ? (
              <div style={{ marginTop: 18 }}>Loading bank details...</div>
            ) : (
              <form onSubmit={handleSaveBank} style={{ marginTop: 18 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <label>
                    <span>Account Holder Name</span>
                    <input
                      value={bank.accountHolderName}
                      onChange={(e) =>
                        updateBank("accountHolderName", e.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    <span>Account Number</span>
                    <input
                      value={bank.accountNumber}
                      onChange={(e) =>
                        updateBank("accountNumber", e.target.value)
                      }
                      inputMode="numeric"
                      required
                    />
                  </label>

                  <label>
                    <span>IFSC Code</span>
                    <input
                      value={bank.ifscCode}
                      onChange={(e) =>
                        updateBank(
                          "ifscCode",
                          e.target.value.toUpperCase(),
                        )
                      }
                      maxLength={11}
                      required
                    />
                  </label>

                  <label>
                    <span>Bank Name</span>
                    <input
                      value={bank.bankName}
                      onChange={(e) =>
                        updateBank("bankName", e.target.value)
                      }
                    />
                  </label>

                  <label>
                    <span>Branch Name</span>
                    <input
                      value={bank.branchName}
                      onChange={(e) =>
                        updateBank("branchName", e.target.value)
                      }
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={savingBank}
                  className="dashboard-view-link"
                  style={{ marginTop: 18 }}
                >
                  <Save size={16} />
                  {savingBank
                    ? "Saving..."
                    : bankSaved
                      ? "Saved"
                      : "Save Bank Details"}
                </button>
              </form>
            )}
          </div>

          <div className="request-card" style={{ marginTop: 16 }}>
            <div className="request-card-top">
              <div className="request-service">
                <div className="request-icon">
                  <WalletCards size={19} />
                </div>
                <div>
                  <strong>Request Withdrawal</strong>
                  <span>
                    Available balance: {formatMoney(availableBalance)}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleWithdrawal} style={{ marginTop: 18 }}>
              <label style={{ display: "block" }}>
                <span>Withdrawal Amount</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={withdrawalAmount}
                  onChange={(e) => {
                    setWithdrawalAmount(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Enter amount"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={
                  requesting ||
                  loadingBank ||
                  !bank.accountNumber ||
                  !bank.ifscCode ||
                  Number(availableBalance || 0) <= 0
                }
                className="dashboard-view-link"
                style={{ marginTop: 18 }}
              >
                <IndianRupee size={16} />
                {requesting ? "Submitting..." : "Request Withdrawal"}
              </button>

              <small
                style={{
                  display: "block",
                  marginTop: 10,
                  opacity: 0.7,
                }}
              >
                Your available balance is reserved when the request is
                submitted. SuperAdmin will review and process the payment.
              </small>
            </form>
          </div>
        </div>

        <aside className="dashboard-secondary">
          <div className="dashboard-section-head">
            <div>
              <span className="dashboard-section-label">HISTORY</span>
              <h2>Withdrawal Requests</h2>
            </div>
          </div>

          <div className="request-list">
            {loadingWithdrawals ? (
              <div className="request-card">
                Loading withdrawal history...
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="request-card">
                <div className="request-service">
                  <div className="request-icon">
                    <WalletCards size={19} />
                  </div>
                  <div>
                    <strong>No withdrawal requests</strong>
                    <span>Your withdrawal history will appear here.</span>
                  </div>
                </div>
              </div>
            ) : (
              withdrawals.map((item) => (
                <div className="request-card" key={item.id}>
                  <div className="request-card-top">
                    <div className="request-service">
                      <div className="request-icon">
                        <IndianRupee size={19} />
                      </div>
                      <div>
                        <strong>
                          Withdrawal #{item.id}
                        </strong>
                        <span>
                          {item.requestedAt
                            ? new Date(item.requestedAt).toLocaleString(
                                "en-IN",
                              )
                            : "—"}
                        </span>
                      </div>
                    </div>

                    <strong>{formatMoney(item.amount)}</strong>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      fontSize: 13,
                      opacity: 0.8,
                    }}
                  >
                    <span>
                      Status: <strong>{statusLabel(item.status)}</strong>
                    </span>

                    {item.transferReference ? (
                      <span>
                        Transfer Ref: {item.transferReference}
                      </span>
                    ) : null}

                    {item.rejectionReason ? (
                      <span>
                        Rejection: {item.rejectionReason}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default DistributorWithdrawalPanel;
