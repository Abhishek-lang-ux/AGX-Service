import { useEffect, useMemo, useState } from "react";
import {
  assignRetailerDistributor,
  getDistributors,
  getRetailerDistributorMapping,
} from "../lib/api.js";

export default function RetailerDistributorMapping() {
  const [retailers, setRetailers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [retailerResponse, distributorResponse] = await Promise.all([
        getRetailerDistributorMapping(),
        getDistributors(),
      ]);

      setRetailers(retailerResponse?.retailers || []);
      setDistributors(
        (distributorResponse?.distributors || []).filter(
          (distributor) => distributor.status === "active"
        )
      );
    } catch (err) {
      setError(err?.message || "Failed to load retailer-distributor mapping.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleChange(retailerId, distributorId) {
    try {
      setSavingId(retailerId);
      setError("");
      setSuccess("");

      await assignRetailerDistributor(
        retailerId,
        distributorId === "" ? null : distributorId
      );

      setSuccess(
        distributorId === ""
          ? "Retailer distributor mapping removed successfully."
          : "Retailer distributor mapping updated successfully."
      );

      await loadData();
    } catch (err) {
      setError(err?.message || "Failed to update retailer distributor mapping.");
    } finally {
      setSavingId(null);
    }
  }

  const assignedCount = useMemo(
    () => retailers.filter((retailer) => retailer.distributorId).length,
    [retailers]
  );

  return (
    <section className="superadmin-panel" style={{ marginTop: 24 }}>
      <div className="superadmin-section-head">
        <div>
          <h2>Retailer–Distributor Mapping</h2>
          <p>
            Assign retailers to active distributors. SuperAdmin controls all
            mappings.
          </p>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {assignedCount} / {retailers.length} Assigned
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 8,
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 8,
            background: "#dcfce7",
            color: "#166534",
          }}
        >
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 20, textAlign: "center" }}>
          Loading retailer mappings...
        </div>
      ) : retailers.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center" }}>
          No retailers found.
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="superadmin-table">
            <thead>
              <tr>
                <th>Retailer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Distributor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {retailers.map((retailer) => {
                const currentDistributorId = retailer.distributorId ?? "";

                return (
                  <tr key={retailer.id}>
                    <td>
                      <strong>
                        {[retailer.firstName, retailer.lastName]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </strong>
                    </td>
                    <td>{retailer.email || "—"}</td>
                    <td>{retailer.phone || "—"}</td>
                    <td>{retailer.status || "unknown"}</td>
                    <td>
                      {retailer.distributorCode ? (
                        <strong>{retailer.distributorCode}</strong>
                      ) : (
                        <span style={{ opacity: 0.6 }}>Not assigned</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={currentDistributorId}
                        disabled={savingId === retailer.id}
                        onChange={(event) =>
                          handleChange(retailer.id, event.target.value)
                        }
                        style={{
                          minWidth: 180,
                          padding: "8px 10px",
                          borderRadius: 7,
                          border: "1px solid #d1d5db",
                          background: "#fff",
                        }}
                      >
                        <option value="">
                          {savingId === retailer.id
                            ? "Saving..."
                            : "Unassigned"}
                        </option>

                        {distributors.map((distributor) => (
                          <option
                            key={distributor.id}
                            value={distributor.id}
                          >
                            {distributor.distributor_code}
                          </option>
                        ))}
                      </select>
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
