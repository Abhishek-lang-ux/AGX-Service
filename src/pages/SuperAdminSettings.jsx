import { Settings } from "lucide-react";

function SuperAdminSettings() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            SYSTEM CONFIGURATION
          </span>

          <h1>Settings</h1>

          <p>
            Configure SuperAdmin and portal preferences.
          </p>
        </div>
      </div>

      <div className="superadmin-empty-panel">
        <Settings size={42} />

        <h2>SuperAdmin Settings</h2>

        <p>
          Settings module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminSettings;