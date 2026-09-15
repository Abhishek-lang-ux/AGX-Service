import { ClipboardList } from "lucide-react";

function SuperAdminRequests() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            SERVICE MANAGEMENT
          </span>

          <h1>Requests</h1>

          <p>
            Review and manage client service requests.
          </p>
        </div>
      </div>

      <div className="superadmin-empty-panel">
        <ClipboardList size={42} />

        <h2>Request Management</h2>

        <p>
          Request management module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminRequests;