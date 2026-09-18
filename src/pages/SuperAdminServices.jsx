import { useEffect, useState } from "react";
import { Save, RefreshCw, IndianRupee } from "lucide-react";
import {
  getServices,
  updateRetailerServicePrice,
} from "../lib/api.js";

function SuperAdminServices() {
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await getServices();
      const list = Array.isArray(response?.services)
        ? response.services
        : [];

      setServices(list);

      const initialPrices = {};
      list.forEach((service) => {
        initialPrices[service.id] = service.retailerPrice ?? 0;
      });

      setPrices(initialPrices);
    } catch (err) {
      setError(err?.message || "Unable to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handlePriceChange = (serviceId, value) => {
    setPrices((current) => ({
      ...current,
      [serviceId]: value,
    }));
    setSuccess("");
  };

  const handleSave = async (service) => {
    const value = Number(prices[service.id]);

    if (!Number.isFinite(value) || value < 0) {
      setError("Please enter a valid retailer price.");
      return;
    }

    try {
      setSavingId(service.id);
      setError("");
      setSuccess("");

      const response = await updateRetailerServicePrice(
        service.id,
        value
      );

      const updatedPrice =
        Number(response?.service?.retailerPrice) || 0;

      setPrices((current) => ({
        ...current,
        [service.id]: updatedPrice,
      }));

      setSuccess(`${service.name} retailer price updated.`);
    } catch (err) {
      setError(
        err?.message || "Unable to update retailer price."
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="superadmin-section-page">
      <div className="superadmin-page-header">
        <div>
          <span className="superadmin-eyebrow">
            SERVICE MANAGEMENT
          </span>

          <h1>Service Pricing</h1>

          <p>
            Manage retailer-specific pricing without changing
            client service prices.
          </p>
        </div>

        <button
          type="button"
          className="superadmin-refresh-btn"
          onClick={loadServices}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="auth-form-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "9px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {success}
        </div>
      )}

      <div className="superadmin-table-card">
        <div className="superadmin-table-wrap">
          {loading ? (
            <div style={{ padding: "30px", textAlign: "center" }}>
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center" }}>
              No active services found.
            </div>
          ) : (
            <table className="superadmin-table">
              <thead>
                <tr>
                  <th>SERVICE</th>
                  <th>CATEGORY</th>
                  <th>CLIENT PRICE</th>
                  <th>RETAILER PRICE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                      <small>{service.slug}</small>
                    </td>

                    <td>{service.category || "—"}</td>

                    <td>
                      <strong>
                        ₹{Number(service.basePrice || 0).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                        }}
                      >
                        <IndianRupee size={15} />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={prices[service.id] ?? ""}
                          onChange={(event) =>
                            handlePriceChange(
                              service.id,
                              event.target.value
                            )
                          }
                          style={{
                            width: "130px",
                            height: "40px",
                            border: "1px solid #d7e0eb",
                            borderRadius: "8px",
                            padding: "0 10px",
                            outline: "none",
                            fontSize: "14px",
                          }}
                        />
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="superadmin-refresh-btn"
                        onClick={() => handleSave(service)}
                        disabled={savingId === service.id}
                      >
                        <Save size={15} />
                        {savingId === service.id
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminServices;
