import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import { getMyRequests } from "../lib/api.js";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./myrequests.css";

const statusMeta = {
  pending: {
    label: "Pending",
    className: "pending",
    icon: Clock3,
    progress: 10,
  },
  submitted: {
    label: "Submitted",
    className: "submitted",
    icon: Clock3,
    progress: 20,
  },
  in_review: {
    label: "Under Review",
    className: "under-review",
    icon: Search,
    progress: 42,
  },
  documents_required: {
    label: "Correction Required",
    className: "correction-required",
    icon: AlertCircle,
    progress: 54,
  },
  processing: {
    label: "Processing",
    className: "processing",
    icon: Clock3,
    progress: 68,
  },
  completed: {
    label: "Completed",
    className: "completed",
    icon: CheckCircle2,
    progress: 100,
  },
  rejected: {
    label: "Rejected",
    className: "rejected",
    icon: AlertCircle,
    progress: 100,
  },
  cancelled: {
    label: "Cancelled",
    className: "cancelled",
    icon: AlertCircle,
    progress: 100,
  },
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getRequestProgress(request) {
  if (typeof request.progress === "number") {
    return Math.max(0, Math.min(100, request.progress));
  }

  return statusMeta[request.status]?.progress ?? 10;
}

function getStatusMeta(status) {
  return (
    statusMeta[status] || {
      label: status || "Pending",
      className: "pending",
      icon: Clock3,
      progress: 10,
    }
  );
}

function MyRequests() {
  const [apiRequests, setApiRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      try {
        setRequestsLoading(true);
        setRequestsError("");

        const data = await getMyRequests();

        if (!active) return;

        setApiRequests(Array.isArray(data?.requests) ? data.requests : []);
      } catch (error) {
        if (active) {
          setRequestsError(
            error.message || "Unable to load your requests"
          );
        }
      } finally {
        if (active) {
          setRequestsLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const total = apiRequests.length;

    const completed = apiRequests.filter(
      (request) => request.status === "completed"
    ).length;

    const actionRequired = apiRequests.filter(
      (request) =>
        request.status === "documents_required" ||
        request.status === "rejected"
    ).length;

    const inProgress = apiRequests.filter(
      (request) =>
        !["completed", "rejected", "cancelled"].includes(request.status)
    ).length;

    return {
      total,
      inProgress,
      completed,
      actionRequired,
    };
  }, [apiRequests]);

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return apiRequests.filter((request) => {
      const meta = getStatusMeta(request.status);

      const matchesSearch =
        !search ||
        String(request.requestNumber || "")
          .toLowerCase()
          .includes(search) ||
        String(request.serviceName || "")
          .toLowerCase()
          .includes(search) ||
        String(request.title || "")
          .toLowerCase()
          .includes(search) ||
        String(request.description || "")
          .toLowerCase()
          .includes(search);

      let matchesFilter = true;

      if (activeFilter === "active") {
        matchesFilter = ![
          "completed",
          "rejected",
          "cancelled",
        ].includes(request.status);
      }

      if (activeFilter === "completed") {
        matchesFilter = request.status === "completed";
      }

      if (activeFilter === "action") {
        matchesFilter =
          request.status === "documents_required" ||
          request.status === "rejected";
      }

      return matchesSearch && matchesFilter && meta;
    });
  }, [apiRequests, searchTerm, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  );

  const visibleRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const showingStart =
    filteredRequests.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const showingEnd = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredRequests.length
  );

  return (
    <main className="requests-page">
      {requestsLoading && (
        <div className="api-status-banner">
          Loading your requests…
        </div>
      )}

      {requestsError && (
        <div className="api-error-banner" role="alert">
          {requestsError}
        </div>
      )}

      <div className="requests-container">
        <section className="requests-header">
          <div>
            <span className="requests-eyebrow">
              <FileText size={14} />
              CLIENT PORTAL
            </span>

            <h1>My Requests</h1>

            <p>
              Track and manage all your AGX service requests in one place.
            </p>
          </div>

          <Link to="/new-request" className="requests-new-btn">
            <Plus size={18} />
            New Request
          </Link>
        </section>

        <section className="requests-summary">
          <div>
            <span>Total Requests</span>
            <strong>{summary.total}</strong>
          </div>

          <div>
            <span>In Progress</span>
            <strong>
              {String(summary.inProgress).padStart(2, "0")}
            </strong>
          </div>

          <div>
            <span>Completed</span>
            <strong>
              {String(summary.completed).padStart(2, "0")}
            </strong>
          </div>

          <div>
            <span>Action Required</span>
            <strong>
              {String(summary.actionRequired).padStart(2, "0")}
            </strong>
          </div>
        </section>

        <section className="requests-panel">
          <div className="requests-toolbar">
            <div className="requests-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <div className="requests-filter-group">
              <button
                className={`requests-filter ${
                  activeFilter === "all" ? "active" : ""
                }`}
                type="button"
                onClick={() => setActiveFilter("all")}
              >
                All <span>{summary.total}</span>
              </button>

              <button
                className={`requests-filter ${
                  activeFilter === "active" ? "active" : ""
                }`}
                type="button"
                onClick={() => setActiveFilter("active")}
              >
                Active <span>{summary.inProgress}</span>
              </button>

              <button
                className={`requests-filter ${
                  activeFilter === "completed" ? "active" : ""
                }`}
                type="button"
                onClick={() => setActiveFilter("completed")}
              >
                Completed <span>{summary.completed}</span>
              </button>

              <button
                className={`requests-filter ${
                  activeFilter === "action" ? "active" : ""
                }`}
                type="button"
                onClick={() => setActiveFilter("action")}
              >
                Action Required{" "}
                <span>{summary.actionRequired}</span>
              </button>
            </div>

            <button
              className="requests-mobile-filter"
              type="button"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>

          <div className="requests-list">
            {!requestsLoading && visibleRequests.length > 0 ? (
              visibleRequests.map((request) => {
                const meta = getStatusMeta(request.status);
                const StatusIcon = meta.icon;
                const progress = getRequestProgress(request);

                return (
                  <article
                    className="request-row"
                    key={request.id}
                  >
                    <div className="request-row-main">
                      <div className="request-row-icon">
                        <FileText size={20} />
                      </div>

                      <div className="request-row-info">
                        <div className="request-row-title">
                          <h2>
                            {request.serviceName ||
                              request.title ||
                              "AGX Service Request"}
                          </h2>

                          <span
                            className={`requests-status ${meta.className}`}
                          >
                            <StatusIcon size={13} />
                            {meta.label}
                          </span>
                        </div>

                        <div className="request-meta">
                          <span>
                            {request.requestNumber || "—"}
                          </span>

                          <i />

                          <span>
                            {request.title || "Service Request"}
                          </span>

                          <i />

                          <span>
                            <CalendarDays size={13} />
                            {formatDate(request.createdAt)}
                          </span>
                        </div>

                        <p>
                          {request.description ||
                            "AGX service request submitted by the client."}
                        </p>
                      </div>
                    </div>

                    <div className="request-row-progress">
                      <div className="progress-label">
                        <span>Progress</span>
                        <strong>{progress}%</strong>
                      </div>

                      <div className="requests-progress">
                        <span
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="request-row-payment">
                      <span>Service amount</span>
                      <strong>
                        {formatAmount(request.amount)}
                      </strong>
                    </div>

                    <Link
                      to={`/request-details/${request.id}`}
                      className="request-details-btn"
                    >
                      View Details
                      <ChevronRight size={17} />
                    </Link>
                  </article>
                );
              })
            ) : (
              !requestsLoading && (
                <div className="dashboard-empty-state">
                  <FileText size={24} />

                  <strong>
                    {searchTerm || activeFilter !== "all"
                      ? "No matching requests"
                      : "No service requests yet"}
                  </strong>

                  <span>
                    {searchTerm || activeFilter !== "all"
                      ? "Try changing your search or filter."
                      : "Start your first AGX service request to see it here."}
                  </span>

                  {!searchTerm && activeFilter === "all" && (
                    <Link to="/new-request">
                      Create Request{" "}
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              )
            )}
          </div>

          {filteredRequests.length > 0 && (
            <div className="requests-pagination">
              <span>
                Showing <strong>{showingStart}–{showingEnd}</strong>{" "}
                of <strong>{filteredRequests.length}</strong>{" "}
                requests
              </span>

              <div>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={
                      currentPage === page
                        ? "page-active"
                        : ""
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="requests-info">
          <Filter size={17} />

          <span>
            Request statuses are updated by the AGX team as your
            service moves through each stage.
          </span>
        </div>
      </div>
    </main>
  );
}

export default MyRequests;