import { FileCheck2 } from "lucide-react";

function SuperAdminDocuments() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            DOCUMENT MANAGEMENT
          </span>

          <h1>Documents</h1>

          <p>
            Review and manage client submitted documents.
          </p>
        </div>
      </div>

      <div className="superadmin-empty-panel">
        <FileCheck2 size={42} />

        <h2>Document Management</h2>

        <p>
          Document review module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminDocuments;