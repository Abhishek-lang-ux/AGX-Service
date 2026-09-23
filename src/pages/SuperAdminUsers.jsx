import {
  Search,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Shield,
  MoreHorizontal,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import {
  getSuperAdminUsers,
  updateSuperAdminUserStatus,
  updateSuperAdminUserRole,
  resetSuperAdminUserPassword,
  deleteSuperAdminUser,
} from "../lib/api.js";

import "./superadmin-users.css";


function getFullName(user) {
  const name = `${user?.firstName || ""} ${
    user?.lastName || ""
  }`.trim();

  return name || user?.email || "Unknown User";
}


function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}


function formatRole(role) {
  if (!role) return "Unknown";

  return role
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}


function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}


function getInitials(user) {
  const name = getFullName(user);

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}


function SuperAdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [updatingId, setUpdatingId] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [modal, setModal] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [actionError, setActionError] = useState("");


  const loadUsers = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await getSuperAdminUsers({
            search,
            role,
            status,
            page,
            limit: 20,
          });

        setUsers(response?.users || []);

        setPagination(
          response?.pagination || {
            page,
            limit: 20,
            total: 0,
            totalPages: 1,
          },
        );
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load users.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, role, status, page],
  );


  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  function handleSearchSubmit(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput);
  }


  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  }


  async function handleStatusChange(user, newStatus) {
    if (!user?.id || !newStatus) return;

    const confirmed = window.confirm(
      `Change ${getFullName(
        user,
      )}'s status to "${formatStatus(newStatus)}"?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user.id);
      setError("");

      await updateSuperAdminUserStatus(
        user.id,
        newStatus,
      );

      await loadUsers(true);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to update user status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }


  async function handleRoleChange(user, newRole) {
    if (!user?.id || !newRole) return;

    const confirmed = window.confirm(
      `Change ${getFullName(
        user,
      )}'s role to "${formatRole(newRole)}"?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user.id);
      setError("");

      await updateSuperAdminUserRole(
        user.id,
        newRole,
      );

      await loadUsers(true);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to update user role.",
      );
    } finally {
      setUpdatingId(null);
    }
  }



  const closeUserModal = () => {
    setModal("");
    setSelectedUser(null);
    setActionMenuId(null);
    setNewPassword("");
    setConfirmPassword("");
    setActionError("");
  };

  const openUserActions = (user) => {
    setActionMenuId((current) =>
      current === user.id ? null : user.id
    );
  };

  const viewUserProfile = (user) => {
    setSelectedUser(user);
    setActionMenuId(null);
    setActionError("");
    setModal("view");
  };

  const resetUserPasswordModal = (user) => {
    if (user.role === "superadmin") {
      window.alert(
        "SuperAdmin password cannot be reset from User Management."
      );
      return;
    }

    setSelectedUser(user);
    setActionMenuId(null);
    setNewPassword("");
    setConfirmPassword("");
    setActionError("");
    setModal("reset");
  };

  const deleteUserModal = (user) => {
    if (user.role === "superadmin") {
      window.alert("SuperAdmin account cannot be deleted.");
      return;
    }

    setSelectedUser(user);
    setActionMenuId(null);
    setActionError("");
    setModal("delete");
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (newPassword.length < 8) {
      setActionError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setActionError("Passwords do not match.");
      return;
    }

    try {
      setActionError("");

      await resetSuperAdminUserPassword(
        selectedUser.id,
        newPassword
      );

      window.alert("Password reset successfully.");
      closeUserModal();
    } catch (error) {
      setActionError(
        error?.message || "Failed to reset password."
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionError("");

      await deleteSuperAdminUser(selectedUser.id);

      closeUserModal();
      await loadUsers();

      window.alert("User deleted successfully.");
    } catch (error) {
      setActionError(
        error?.message || "Failed to delete user."
      );
    }
  };

  return (
    <div className="superadmin-section-page">

      {/* HEADER */}
      <div className="superadmin-page-header">

        <div>
          <span className="superadmin-page-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Manage all AGX Service Portal user
            accounts, roles and statuses.
          </p>
        </div>

        <button
          type="button"
          className="superadmin-refresh-button"
          onClick={() => loadUsers(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "superadmin-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* FILTER BAR */}
      <div className="superadmin-users-toolbar">

        <form
          className="superadmin-users-search"
          onSubmit={handleSearchSubmit}
        >
          <Search size={17} />

          <input
            type="text"
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search name, email, phone..."
          />

          <button type="submit">
            Search
          </button>
        </form>


        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="retailer">Retailer</option>
          <option value="distributor">Distributor</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="superadmin">
            SuperAdmin
          </option>
        </select>


        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">
            Inactive
          </option>
          <option value="suspended">
            Suspended
          </option>
          <option value="pending">
            Pending
          </option>
        </select>


        {(search || role || status) && (
          <button
            type="button"
            className="superadmin-clear-filters"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>


      {/* ERROR */}
      {error && (
        <div className="superadmin-users-error">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}


      {/* TABLE */}
      <div className="superadmin-users-card">

        <div className="superadmin-users-card-header">

          <div>
            <div className="superadmin-users-card-title">
              <Users size={18} />

              <h2>All Users</h2>
            </div>

            <span>
              {pagination.total || 0} total accounts
            </span>
          </div>

        </div>


        {loading ? (
          <div className="superadmin-users-loading">

            <div className="superadmin-users-loader" />

            <strong>
              Loading users...
            </strong>

            <span>
              Fetching user accounts from AGX.
            </span>

          </div>
        ) : users.length === 0 ? (
          <div className="superadmin-users-empty">

            <Users size={40} />

            <h3>No users found</h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>
        ) : (
          <div className="superadmin-users-table-wrapper">

            <table className="superadmin-users-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th />
                </tr>
              </thead>


              <tbody>

                {users.map((user) => {

                  const isUpdating =
                    updatingId === user.id;

                  return (
                    <tr key={user.id}>

                      {/* USER */}
                      <td>
                        <div className="superadmin-user-cell">

                          <div className="superadmin-user-avatar">
                            {getInitials(user)}
                          </div>

                          <div>
                            <strong>
                              {getFullName(user)}
                            </strong>

                            <small>
                              ID #{user.id}
                            </small>
                          </div>

                        </div>
                      </td>


                      {/* CONTACT */}
                      <td>
                        <div className="superadmin-contact-cell">

                          <span>
                            {user.email}
                          </span>

                          <small>
                            {user.phone || "No phone"}
                          </small>

                        </div>
                      </td>


                      {/* ROLE */}
                      <td>

                        <select
                          className="superadmin-role-select"
                          value={user.role || ""}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleRoleChange(
                              user,
                              event.target.value,
                            )
                          }
                        >
                          <option value="client">
                            Client
                          </option>
                          <option value="retailer">
                            Retailer
                          </option>
                          <option value="distributor">
                            Distributor
                          </option>

                          <option value="staff">
                            Staff
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                          <option value="superadmin">
                            SuperAdmin
                          </option>
                        </select>

                      </td>


                      {/* STATUS */}
                      <td>

                        <select
                          className={`superadmin-status-select status-${user.status}`}
                          value={user.status || ""}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleStatusChange(
                              user,
                              event.target.value,
                            )
                          }
                        >
                          <option value="active">
                            Active
                          </option>

                          <option value="inactive">
                            Inactive
                          </option>

                          <option value="suspended">
                            Suspended
                          </option>

                          <option value="pending">
                            Pending
                          </option>
                        </select>

                      </td>


                      {/* JOINED */}
                      <td>
                        <span className="superadmin-date">
                          {formatDate(
                            user.createdAt,
                          )}
                        </span>
                      </td>


                      {/* LAST LOGIN */}
                      <td>
                        <span className="superadmin-date">
                          {formatDate(
                            user.lastLoginAt,
                          )}
                        </span>
                      </td>


                      {/* ACTION */}
                      <td>
                          <div className="superadmin-user-action-wrap">
                            <button
                              type="button"
                              className="superadmin-user-action"
                              title="User actions"
                              onClick={() => openUserActions(user)}
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {actionMenuId === user.id && (
                              <div className="superadmin-user-action-menu">
                                <button
                                  type="button"
                                  onClick={() => viewUserProfile(user)}
                                >
                                  👁️ View Profile
                                </button>

                                {user.role !== "superadmin" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        resetUserPasswordModal(user)
                                      }
                                    >
                                      🔐 Reset Password
                                    </button>

                                    <button
                                      type="button"
                                      className="danger"
                                      onClick={() =>
                                        deleteUserModal(user)
                                      }
                                    >
                                      🗑️ Delete User
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}


        {/* PAGINATION */}
        {!loading && users.length > 0 && (
          <div className="superadmin-users-pagination">

            <span>
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </span>

            <div>

              <button
                type="button"
                disabled={
                  pagination.page <= 1
                }
                onClick={() =>
                  setPage(
                    pagination.page - 1,
                  )
                }
              >
                <ChevronLeft size={16} />
                Previous
              </button>


              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage(
                    pagination.page + 1,
                  )
                }
              >
                Next
                <ChevronRight size={16} />
              </button>

            </div>

          </div>
        )}


      {modal === "view" && selectedUser && (
        <div
          className="superadmin-user-modal-backdrop"
          onClick={closeUserModal}
        >
          <div
            className="superadmin-user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="superadmin-user-modal-header">
              <h3>View User Profile</h3>
              <button
                type="button"
                onClick={closeUserModal}
                className="superadmin-user-modal-close"
              >
                ×
              </button>
            </div>

            <div className="superadmin-user-profile-grid">
              <div>
                <span>User ID</span>
                <strong>{selectedUser.id ?? "—"}</strong>
              </div>
              <div>
                <span>UUID</span>
                <strong>{selectedUser.uuid ?? "—"}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedUser.email ?? "—"}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{selectedUser.phone ?? "—"}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{selectedUser.role ?? "—"}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selectedUser.status ?? "—"}</strong>
              </div>
              <div>
                <span>Joined</span>
                <strong>{formatDate(selectedUser.createdAt)}</strong>
              </div>
              <div>
                <span>Last Login</span>
                <strong>{formatDate(selectedUser.lastLoginAt)}</strong>
              </div>
            </div>

            <div className="superadmin-modal-footer">
              <button
                type="button"
                className="superadmin-modal-primary"
                onClick={closeUserModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "reset" && selectedUser && (
        <div
          className="superadmin-user-modal-backdrop"
          onClick={closeUserModal}
        >
          <div
            className="superadmin-user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="superadmin-user-modal-header">
              <h3>Reset Password</h3>
              <button
                type="button"
                onClick={closeUserModal}
                className="superadmin-user-modal-close"
              >
                ×
              </button>
            </div>

            <p>
              Set a new password for{" "}
              <strong>{selectedUser.email}</strong>.
            </p>

            <div className="superadmin-password-form">
              <label>
                New Password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </label>
            </div>

            {actionError && (
              <div className="superadmin-modal-error">
                {actionError}
              </div>
            )}

            <div className="superadmin-modal-footer">
              <button type="button" onClick={closeUserModal}>
                Cancel
              </button>

              <button
                type="button"
                className="superadmin-modal-primary"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && selectedUser && (
        <div
          className="superadmin-user-modal-backdrop"
          onClick={closeUserModal}
        >
          <div
            className="superadmin-user-modal superadmin-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="superadmin-user-modal-header">
              <h3>Delete User</h3>
              <button
                type="button"
                onClick={closeUserModal}
                className="superadmin-user-modal-close"
              >
                ×
              </button>
            </div>

            <div className="superadmin-delete-icon">🗑️</div>

            <p>
              Are you sure you want to permanently delete{" "}
              <strong>{selectedUser.email}</strong>?
            </p>

            <p className="superadmin-delete-warning">
              This action cannot be undone. Users with linked
              business records will be protected by the backend.
            </p>

            {actionError && (
              <div className="superadmin-modal-error">
                {actionError}
              </div>
            )}

            <div className="superadmin-modal-footer">
              <button type="button" onClick={closeUserModal}>
                Cancel
              </button>

              <button
                type="button"
                className="superadmin-modal-danger"
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

    </div>
  );
}

export default SuperAdminUsers;