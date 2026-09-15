import { Users, Search, Plus } from "lucide-react";

function SuperAdminUsers() {
  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-page-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Manage AGX Service Portal users and their accounts.
          </p>
        </div>

        <button className="superadmin-primary-button">
          <Plus size={17} />
          Add User
        </button>
      </div>

      <div className="superadmin-toolbar">

        <div className="superadmin-search">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search users..."
          />
        </div>

      </div>

      <div className="superadmin-empty-panel">
        <Users size={42} />

        <h2>User Management</h2>

        <p>
          User management module is ready for integration.
        </p>
      </div>

    </div>
  );
}

export default SuperAdminUsers;