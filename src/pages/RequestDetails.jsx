import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  MessageCircle,
  MoreHorizontal,
  ShieldCheck,
  Upload,
  UserRound,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./requestDetails.css";

const timeline = [
  {
    title: "Request Submitted",
    text: "Your service request was successfully submitted to AGX.",
    date: "10 Sep 2026 · 10:42 AM",
    completed: true,
  },
  {
    title: "Documents Verified",
    text: "Submitted documents were reviewed and verified by the AGX team.",
    date: "10 Sep 2026 · 02:18 PM",
    completed: true,
  },
  {
    title: "Processing",
    text: "Your request is currently being processed by the AGX team.",
    date: "11 Sep 2026 · 09:30 AM",
    active: true,
  },
  {
    title: "Submitted to Authority",
    text: "The request will be submitted to the applicable authority when ready.",
    date: "Pending",
  },
  {
    title: "Awaiting Result",
    text: "Waiting for the applicable authority / service outcome.",
    date: "Pending",
  },
  {
    title: "Completed",
    text: "Final result and relevant documents will be made available here.",
    date: "Pending",
  },
];

const documents = [
  { name: "PAN Card.pdf", type: "PDF", size: "1.2 MB", status: "Verified" },
  { name: "Address Proof.pdf", type: "PDF", size: "860 KB", status: "Verified" },
  { name: "Business Details.pdf", type: "PDF", size: "540 KB", status: "Verified" },
];

function RequestDetails() {
  return (
    <main className="request-details-page">
      <div className="request-details-container">
        <Link to="/myrequests" className="request-back-link">
          <ArrowLeft size={16} />
          Back to My Requests
        </Link>

        <section className="request-details-header">
          <div>
            <div className="request-details-id">
              <span>REQUEST ID</span>
              <strong>AGX-1024</strong>
              <button type="button" aria-label="More request options">
                <MoreHorizontal size={17} />
              </button>
            </div>

            <h1>GST Registration</h1>
            <p>GST registration assistance and application processing.</p>
          </div>

          <div className="request-details-header-actions">
            <span className="request-details-status">
              <Clock3 size={14} />
              Processing
            </span>
            <button type="button" className="request-message-btn">
              <MessageCircle size={16} />
              Contact AGX
            </button>
          </div>
        </section>

        <section className="request-details-overview">
          <div>
            <span>Current Stage</span>
            <strong>Processing</strong>
            <small>Request is actively being handled</small>
          </div>
          <div>
            <span>Submitted On</span>
            <strong>10 Sep 2026</strong>
            <small>10:42 AM</small>
          </div>
          <div>
            <span>Service Amount</span>
            <strong>₹1,499</strong>
            <small>Payment received</small>
          </div>
          <div>
            <span>Expected Update</span>
            <strong>Next Update</strong>
            <small>Will be shared by AGX</small>
          </div>
        </section>

        <section className="request-details-layout">
          <div className="request-details-main">
            <div className="details-panel">
              <div className="details-panel-heading">
                <div>
                  <span>REQUEST JOURNEY</span>
                  <h2>Track your request</h2>
                </div>
                <strong>68% Complete</strong>
              </div>

              <div className="details-timeline">
                {timeline.map((item, index) => (
                  <div
                    className={`timeline-item ${item.completed ? "completed" : ""} ${item.active ? "active" : ""}`}
                    key={item.title}
                  >
                    <div className="timeline-marker">
                      {item.completed ? (
                        <CheckCircle2 size={17} />
                      ) : item.active ? (
                        <Clock3 size={17} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-title-row">
                        <h3>{item.title}</h3>
                        {item.active && <span>Current Stage</span>}
                      </div>
                      <p>{item.text}</p>
                      <time>{item.date}</time>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-panel">
              <div className="details-panel-heading">
                <div>
                  <span>DOCUMENTS</span>
                  <h2>Submitted documents</h2>
                </div>
                <Link to="/documents" className="details-small-link">
                  Manage Documents <ArrowRight size={14} />
                </Link>
              </div>

              <div className="submitted-documents">
                {documents.map((document) => (
                  <div className="submitted-document" key={document.name}>
                    <div className="document-file-icon">
                      <FileText size={18} />
                    </div>
                    <div className="document-file-info">
                      <strong>{document.name}</strong>
                      <span>{document.type} · {document.size}</span>
                    </div>
                    <span className="document-verified">
                      <CheckCircle2 size={13} />
                      {document.status}
                    </span>
                    <button type="button" aria-label={`Download ${document.name}`}>
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <Link to="/documents" className="upload-more-btn">
                <Upload size={16} />
                Upload Additional Document
              </Link>
            </div>
          </div>

          <aside className="request-details-sidebar">
            <div className="details-panel payment-panel">
              <div className="details-panel-heading compact">
                <div>
                  <span>PAYMENT</span>
                  <h2>Payment details</h2>
                </div>
                <CreditCard size={19} />
              </div>

              <div className="payment-status">
                <div>
                  <CheckCircle2 size={17} />
                  <span>Payment Received</span>
                </div>
                <strong>₹1,499</strong>
              </div>

              <div className="payment-lines">
                <div>
                  <span>Transaction ID</span>
                  <strong>AGXTXN1024</strong>
                </div>
                <div>
                  <span>Payment Date</span>
                  <strong>10 Sep 2026</strong>
                </div>
                <div>
                  <span>Payment Method</span>
                  <strong>Online Payment</strong>
                </div>
              </div>

              <button type="button" className="invoice-btn">
                <Download size={15} />
                Download Invoice
              </button>
            </div>

            <div className="details-panel client-panel">
              <div className="details-panel-heading compact">
                <div>
                  <span>CLIENT</span>
                  <h2>Request details</h2>
                </div>
              </div>

              <div className="client-info">
                <div>
                  <UserRound size={15} />
                  <span>Client</span>
                  <strong>Akash Awasthi</strong>
                </div>
                <div>
                  <CalendarDays size={15} />
                  <span>Submitted</span>
                  <strong>10 Sep 2026</strong>
                </div>
                <div>
                  <FileCheck2 size={15} />
                  <span>Service Category</span>
                  <strong>Business Services</strong>
                </div>
              </div>
            </div>

            <div className="details-security-card">
              <div>
                <ShieldCheck size={19} />
              </div>
              <div>
                <strong>Secure request handling</strong>
                <p>Your documents and request information are handled through your AGX client account.</p>
              </div>
            </div>

            <Link to="/new-request" className="details-new-request">
              Start Another Request
              <ArrowRight size={16} />
            </Link>
          </aside>
        </section>

        <div className="request-details-note">
          <AlertCircle size={16} />
          <span>
            Status information is shown for your convenience and may change as AGX processes your request.
          </span>
        </div>
      </div>
    </main>
  );
}

export default RequestDetails;
