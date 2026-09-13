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
import { useEffect, useState } from "react";
import "./myrequests.css";

const requestData = [
  {
    id: "AGX-1024",
    service: "GST Registration",
    category: "Business Services",
    date: "10 Sep 2026",
    status: "Processing",
    progress: 68,
    amount: "₹1,499",
    description: "GST registration assistance and application processing.",
  },
  {
    id: "AGX-1018",
    service: "Income Tax Filing",
    category: "Tax & Compliance",
    date: "08 Sep 2026",
    status: "Under Review",
    progress: 42,
    amount: "₹799",
    description: "Income tax return preparation and filing assistance.",
  },
  {
    id: "AGX-1012",
    service: "PF Withdrawal Assistance",
    category: "Government Services",
    date: "06 Sep 2026",
    status: "Correction Required",
    progress: 54,
    amount: "₹499",
    description: "EPFO/PF withdrawal assistance and document support.",
  },
  {
    id: "AGX-1009",
    service: "PAN Card Assistance",
    category: "Documentation",
    date: "04 Sep 2026",
    status: "Completed",
    progress: 100,
    amount: "₹299",
    description: "PAN application assistance and document verification.",
  },
  {
    id: "AGX-0998",
    service: "Website Development",
    category: "Digital Services",
    date: "29 Aug 2026",
    status: "Completed",
    progress: 100,
    amount: "₹4,999",
    description: "Professional business website development service.",
  },
  {
    id: "AGX-0986",
    service: "Accounting Support",
    category: "Accounting",
    date: "22 Aug 2026",
    status: "Completed",
    progress: 100,
    amount: "₹1,999",
    description: "Monthly accounting and bookkeeping assistance.",
  },
];

const statusIcons = {
  Processing: Clock3,
  "Under Review": Search,
  "Correction Required": AlertCircle,
  Completed: CheckCircle2,
};

function MyRequests() {
  const [apiRequests, setApiRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  useEffect(() => {
    let active = true;
    getMyRequests()
      .then((data) => active && setApiRequests(data.requests || []))
      .catch((error) => active && setRequestsError(error.message || "Unable to load requests"))
      .finally(() => active && setRequestsLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <main className="requests-page">
      {requestsLoading && <div className="api-status-banner">Loading your requests…</div>}
      {requestsError && <div className="api-error-banner" role="alert">{requestsError}</div>}

      <div className="requests-container">
        <section className="requests-header">
          <div>
            <span className="requests-eyebrow">
              <FileText size={14} />
              CLIENT PORTAL
            </span>
            <h1>My Requests</h1>
            <p>Track and manage all your AGX service requests in one place.</p>
          </div>

          <Link to="/new-request" className="requests-new-btn">
            <Plus size={18} />
            New Request
          </Link>
        </section>

        <section className="requests-summary">
          <div>
            <span>Total Requests</span>
            <strong>12</strong>
          </div>
          <div>
            <span>In Progress</span>
            <strong>03</strong>
          </div>
          <div>
            <span>Completed</span>
            <strong>07</strong>
          </div>
          <div>
            <span>Action Required</span>
            <strong>01</strong>
          </div>
        </section>

        <section className="requests-panel">
          <div className="requests-toolbar">
            <div className="requests-search">
              <Search size={18} />
              <input type="search" placeholder="Search requests..." />
            </div>

            <div className="requests-filter-group">
              <button className="requests-filter active" type="button">
                All <span>12</span>
              </button>
              <button className="requests-filter" type="button">
                Active <span>03</span>
              </button>
              <button className="requests-filter" type="button">
                Completed <span>07</span>
              </button>
              <button className="requests-filter" type="button">
                Action Required <span>01</span>
              </button>
            </div>

            <button className="requests-mobile-filter" type="button">
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>

          <div className="requests-list">
            {requestData.map((request) => {
              const StatusIcon = statusIcons[request.status];

              return (
                <article className="request-row" key={request.id}>
                  <div className="request-row-main">
                    <div className="request-row-icon">
                      <FileText size={20} />
                    </div>

                    <div className="request-row-info">
                      <div className="request-row-title">
                        <h2>{request.service}</h2>
                        <span className={`requests-status ${request.status.toLowerCase().replaceAll(" ", "-")}`}>
                          <StatusIcon size={13} />
                          {request.status}
                        </span>
                      </div>

                      <div className="request-meta">
                        <span>{request.id}</span>
                        <i />
                        <span>{request.category}</span>
                        <i />
                        <span>
                          <CalendarDays size={13} />
                          {request.date}
                        </span>
                      </div>

                      <p>{request.description}</p>
                    </div>
                  </div>

                  <div className="request-row-progress">
                    <div className="progress-label">
                      <span>Progress</span>
                      <strong>{request.progress}%</strong>
                    </div>
                    <div className="requests-progress">
                      <span style={{ width: `${request.progress}%` }} />
                    </div>
                  </div>

                  <div className="request-row-payment">
                    <span>Service amount</span>
                    <strong>{request.amount}</strong>
                  </div>

                  <Link to="/request-details" className="request-details-btn">
                    View Details
                    <ChevronRight size={17} />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="requests-pagination">
            <span>Showing <strong>1–6</strong> of <strong>12</strong> requests</span>
            <div>
              <button type="button" disabled>Previous</button>
              <button type="button" className="page-active">1</button>
              <button type="button">2</button>
              <button type="button">Next <ArrowRight size={14} /></button>
            </div>
          </div>
        </section>

        <div className="requests-info">
          <Filter size={17} />
          <span>
            Request statuses are updated by the AGX team as your service moves through each stage.
          </span>
        </div>
      </div>
    </main>
  );
}

export default MyRequests;
