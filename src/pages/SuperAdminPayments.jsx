import { CreditCard } from "lucide-react";

function SuperAdminPayments() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            FINANCIAL MANAGEMENT
          </span>

          <h1>Payments</h1>

          <p>
            Monitor payments, revenue and transaction activity.
          </p>
        </div>
      </div>

      <div className="superadmin-empty-panel">
        <CreditCard size={42} />

        <h2>Payment Management</h2>

        <p>
          Payment management module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminPayments;