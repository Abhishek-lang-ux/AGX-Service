import { useEffect, useState } from "react";
import {
  AlertCircle,
  Ban,
  Plus,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { apiRequest } from "../lib/api.js";

function getFullName(user) {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "Unknown User";
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClass(status) {
  const map = {
    active: "status-active",
    inactive: "status-inactive",
    suspended: "status-suspended",
    pending: "status-pending",
  };

  return map[status] || "status-default";
}

async function getDistributors() {
  return apiRequest("/superadmin/distributors");
}

async function createDistributor(payload) {
  return apiRequest("/superadmin/distributors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function updateDistributorStatus(id, status) {
  return apiRequest(
    `/superadmin/distributors/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export default function DistributorManagement() {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  async function loadDistributors() {
    try {
      setLoading(true);
      setError("");

      const response = await getDistributors();

      setDistributors(
        response?.distributors ||
        response?.data?.distributors ||
        []
      );
    } catch (err) {
      setError(err?.message || "Unable to load distributors.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDistributors();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await createDistributor(form);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });

      setShowForm(false);

      await loadDistributors();

      const code =
        response?.distributor?.distributorCode ||
        response?.distributor?.distributor_code;

      window.alert(
        code
          ? `Distributor created successfully: ${code}`
          : "Distributor created successfully."
      );
    } catch (err) {
      setError(err?.message || "Unable to create distributor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(id, status) {
    try {
      setActionId(id);
      setError("");

      await updateDistributorStatus(id, status);
      await loadDistributors();
    } catch (err) {
      setError(
        err?.message || "Unable to update distributor status."
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="superadmin-panel distributor-management-panel">
      <div className="superadmin-section-head">
        <div>
          <span>DISTRIBUTOR MANAGEMENT</span>
          <h2>Distributors</h2>
        </div>

        <button
          type="button"
          className="superadmin-refresh"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Add Distributor
        </button>
      </div>

      {error && (
        <div className="superadmin-inline-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div
          style={{
            marginBottom: "22px",
            padding: "20px",
            border: "1px solid rgba(148,163,184,.25)",
            borderRadius: "14px",
            background: "rgba(248,250,252,.7)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <div>
              <strong style={{ fontSize: "18px" }}>
                Create Distributor
              </strong>

              <div
                style={{
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                Distributor ID will be generated automatically.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={saving}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreate}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "14px",
              }}
            >
              <label>
                First Name
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                />
              </label>

              <label>
                Last Name
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                />
              </label>

              <label>
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="Password"
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "18px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="superadmin-refresh"
              >
                <Plus size={16} />
                {saving ? "Creating..." : "Create Distributor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="retailer-empty-state">
          <div className="superadmin-loader" />
          <span>Loading distributors...</span>
        </div>
      ) : distributors.length === 0 ? (
        <div className="retailer-empty-state">
          <Users size={24} />
          <strong>No distributors found</strong>
          <span>Create your first AGX distributor.</span>
        </div>
      ) : (
        <div className="superadmin-table-wrapper">
          <table className="superadmin-table">
            <thead>
              <tr>
                <th>Distributor ID</th>
                <th>Distributor</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {distributors.map((distributor) => {
                const user = distributor.user || distributor;
                const id = distributor.id;

                const code =
                  distributor.distributorCode ||
                  distributor.distributor_code ||
                  "—";

                const status =
                  distributor.status || "pending";

                return (
                  <tr key={id}>
                    <td>
                      <strong>{code}</strong>
                    </td>

                    <td>
                      <div className="table-user">
                        <div className="table-avatar">
                          {getFullName(user)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{getFullName(user)}</strong>
                          <small>
                            User ID #
                            {distributor.userId ||
                              distributor.user_id ||
                              user.id ||
                              "—"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {distributor.email ||
                        user.email ||
                        "—"}
                    </td>

                    <td>
                      {distributor.phone ||
                        user.phone ||
                        "—"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          status
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        distributor.createdAt ||
                        distributor.created_at
                      )}
                    </td>

                    <td>
                      {status === "active" ? (
                        <button
                          type="button"
                          disabled={actionId === id}
                          onClick={() =>
                            handleStatus(id, "suspended")
                          }
                        >
                          <Ban size={14} />
                          {actionId === id
                            ? "Updating..."
                            : "Suspend"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionId === id}
                          onClick={() =>
                            handleStatus(id, "active")
                          }
                        >
                          <UserCheck size={14} />
                          {actionId === id
                            ? "Updating..."
                            : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
