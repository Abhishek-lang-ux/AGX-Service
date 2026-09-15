import { UserCog } from "lucide-react";

function SuperAdminStaff() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Staff</h1>

          <p>
            Manage AGX staff members and administrative access.
          </p>
        </div>
      </div>

      <div className="superadmin-empty-panel">
        <UserCog size={42} />

        <h2>Staff Management</h2>

        <p>
          Staff management module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminStaff;