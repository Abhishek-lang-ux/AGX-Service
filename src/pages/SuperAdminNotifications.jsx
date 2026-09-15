import { Bell } from "lucide-react";

function SuperAdminNotifications() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            COMMUNICATION
          </span>

          <h1>Notifications</h1>

          <p>
            Manage portal notifications and announcements.
          </p>
        </div>
      </div>

      <div className="superadmin-empty-panel">
        <Bell size={42} />

        <h2>Notification Management</h2>

        <p>
          Notification management module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminNotifications;