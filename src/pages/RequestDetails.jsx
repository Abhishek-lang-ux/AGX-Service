import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  FileText,
  MessageCircle,
  MoreHorizontal,
  ShieldCheck,
  Upload,
  UserRound,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  getMyRequest,
  getRequestDocuments,
  openRequestDocument,
  downloadRequestDocument,
} from "../lib/api";
import "./requestDetails.css";

const STATUS_LABELS = {
  pending: "Pending",
  submitted: "Submitted",
  in_review: "In Review",
  documents_required: "Documents Required",
  processing: "Processing",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFileSize = (bytes) => {
  const size = Number(bytes || 0);

  if (!size) return "—";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

function RequestDetails() {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRequest() {
    try {
      setLoading(true);
      setError("");

      const [requestData, documentsData] = await Promise.all([
        getMyRequest(id),
        getRequestDocuments(id),
      ]);

      setRequest(requestData?.request || requestData);
      setDocuments(
        documentsData?.documents ||
          documentsData?.data ||
          []
      );
    } catch (err) {
      setError(err.message || "Unable to load request details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  const finalReceipt = useMemo(
    () =>
      documents.find(
        (document) =>
          document.document_type === "final_receipt" ||
          document.documentType === "final_receipt"
      ),
    [documents]
  );

  const submittedDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          document.document_type !== "final_receipt" &&
          document.documentType !== "final_receipt"
      ),
    [documents]
  );

  async function handleView(documentId) {
    try {
      setDocumentLoading(true);
      setError("");
      await openRequestDocument(documentId);
    } catch (err) {
      setError(err.message || "Unable to open document.");
    } finally {
      setDocumentLoading(false);
    }
  }

  async function handleDownload(documentId) {
    try {
      setDocumentLoading(true);
      setError("");
      await downloadRequestDocument(documentId);
    } catch (err) {
      setError(err.message || "Unable to download document.");
    } finally {
      setDocumentLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="request-details-page">
        <div className="request-details-container">
          <div className="details-panel">
            <div className="dashboard-empty-state">
              <RefreshCw size={24} />
              <strong>Loading request...</strong>
              <span>Please wait while we load your request details.</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="request-details-page">
        <div className="request-details-container">
          <Link to="/myrequests" className="request-back-link">
            <ArrowLeft size={16} />
            Back to My Requests
          </Link>

          <div className="details-panel">
            <div className="dashboard-empty-state">
              <AlertCircle size={24} />
              <strong>Request not found</strong>
              <span>
                {error || "Unable to load this request."}
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const status = request.status || "pending";
  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <main className="request-details-page">
      <div className="request-details-container">
        <Link to="/myrequests" className="request-back-link">
          <ArrowLeft size={16} />
          Back to My Requests
        </Link>

        {error && (
          <div className="superadmin-error">
            {error}
          </div>
        )}

        <section className="request-details-header">
          <div>
            <div className="request-details-id">
              <span>REQUEST ID</span>
              <strong>
                {request.requestNumber ||
                  request.request_number ||
                  `#${request.id}`}
              </strong>

              <button
                type="button"
                aria-label="More request options"
              >
                <MoreHorizontal size={17} />
              </button>
            </div>

            <h1>
              {request.serviceName ||
                request.service_name ||
                request.title ||
                "Service Request"}
            </h1>

            <p>
              {request.description ||
                "Your AGX service request and processing details."}
            </p>
          </div>

          <div className="request-details-header-actions">
            <span
              className={`request-details-status request-status-${status}`}
            >
              {status === "completed" ? (
                <CheckCircle2 size={14} />
              ) : (
                <Clock3 size={14} />
              )}
              {statusLabel}
            </span>

            <button
              type="button"
              className="request-message-btn"
            >
              <MessageCircle size={16} />
              Contact AGX
            </button>
          </div>
        </section>

        <section className="request-details-overview">
          <div>
            <span>Current Stage</span>
            <strong>{statusLabel}</strong>
            <small>
              {status === "completed"
                ? "Request has been completed"
                : "Request is being handled by AGX"}
            </small>
          </div>

          <div>
            <span>Submitted On</span>
            <strong>{formatDate(request.createdAt || request.created_at)}</strong>
            <small>
              {formatDateTime(
                request.createdAt || request.created_at
              )}
            </small>
          </div>

          <div>
            <span>Service Amount</span>
            <strong>{money(request.amount)}</strong>
            <small>Request amount</small>
          </div>

          <div>
            <span>Expected Update</span>
            <strong>
              {status === "completed"
                ? "Completed"
                : "Next Update"}
            </strong>
            <small>Will be shared by AGX</small>
          </div>
        </section>

        <section className="request-details-layout">
          <div className="request-details-main">
            <div className="details-panel">
              <div className="details-panel-heading">
                <div>
                  <span>REQUEST STATUS</span>
                  <h2>Request progress</h2>
                </div>

                <strong>
                  {status === "completed" ? "100%" : statusLabel}
                </strong>
              </div>

              <div className="details-timeline">
                <div
                  className={`timeline-item ${
                    ["submitted", "in_review", "documents_required", "processing", "completed"].includes(
                      status
                    )
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="timeline-marker">
                    <CheckCircle2 size={17} />
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h3>Request Submitted</h3>
                    </div>
                    <p>Your service request was successfully submitted to AGX.</p>
                    <time>
                      {formatDateTime(
                        request.createdAt || request.created_at
                      )}
                    </time>
                  </div>
                </div>

                <div
                  className={`timeline-item ${
                    ["in_review", "documents_required", "processing", "completed"].includes(
                      status
                    )
                      ? "completed"
                      : status === "submitted"
                        ? "active"
                        : ""
                  }`}
                >
                  <div className="timeline-marker">
                    {["in_review", "documents_required", "processing", "completed"].includes(
                      status
                    ) ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <Clock3 size={17} />
                    )}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h3>Processing</h3>
                      {["submitted", "in_review", "documents_required", "processing"].includes(
                        status
                      ) && <span>Current Stage</span>}
                    </div>
                    <p>
                      Your request is being reviewed and processed by the AGX team.
                    </p>
                    <time>
                      {status === "completed"
                        ? "Completed"
                        : statusLabel}
                    </time>
                  </div>
                </div>

                <div
                  className={`timeline-item ${
                    status === "completed" ? "completed active" : ""
                  }`}
                >
                  <div className="timeline-marker">
                    {status === "completed" ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <span>3</span>
                    )}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-title-row">
                      <h3>Completed</h3>
                      {status === "completed" && (
                        <span>Completed</span>
                      )}
                    </div>
                    <p>
                      Final result and relevant documents are made available here.
                    </p>
                    <time>
                      {status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </time>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-panel">
              <div className="details-panel-heading">
                <div>
                  <span>DOCUMENTS</span>
                  <h2>Submitted documents</h2>
                </div>

                <Link
                  to="/documents"
                  className="details-small-link"
                >
                  Manage Documents <ArrowRight size={14} />
                </Link>
              </div>

              <div className="submitted-documents">
                {submittedDocuments.length ? (
                  submittedDocuments.map((document) => {
                    const documentName =
                      document.original_name ||
                      document.original_filename ||
                      document.originalName ||
                      document.document_type ||
                      "Document";

                    return (
                      <div
                        className="submitted-document"
                        key={document.id}
                      >
                        <div className="document-file-icon">
                          <FileText size={18} />
                        </div>

                        <div className="document-file-info">
                          <strong>{documentName}</strong>
                          <span>
                            {String(
                              document.mime_type ||
                                document.mimeType ||
                                "Document"
                            )
                              .split("/")
                              .pop()
                              .toUpperCase()}{" "}
                            · {formatFileSize(document.file_size || document.fileSize)}
                          </span>
                        </div>

                        <span className="document-verified">
                          <CheckCircle2 size={13} />
                          {document.status || "Uploaded"}
                        </span>

                        <button
                          type="button"
                          aria-label={`Download ${documentName}`}
                          disabled={documentLoading}
                          onClick={() =>
                            handleDownload(document.id)
                          }
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>No documents uploaded.</p>
                )}
              </div>

              <Link
                to="/documents"
                className="upload-more-btn"
              >
                <Upload size={16} />
                Upload Additional Document
              </Link>
            </div>

            {status === "completed" && (
              <div className="details-panel">
                <div className="details-panel-heading">
                  <div>
                    <span>FINAL RESULT</span>
                    <h2>Final Receipt</h2>
                  </div>

                  <FileCheck2 size={20} />
                </div>

                {finalReceipt ? (
                  <div className="submitted-document">
                    <div className="document-file-icon">
                      <FileCheck2 size={18} />
                    </div>

                    <div className="document-file-info">
                      <strong>
                        {finalReceipt.original_name ||
                          finalReceipt.original_filename ||
                          finalReceipt.originalName ||
                          "Final Receipt"}
                      </strong>

                      <span>
                        {String(
                          finalReceipt.mime_type ||
                            finalReceipt.mimeType ||
                            "Document"
                        )
                          .split("/")
                          .pop()
                          .toUpperCase()}{" "}
                        ·{" "}
                        {formatFileSize(
                          finalReceipt.file_size ||
                            finalReceipt.fileSize
                        )}
                      </span>
                    </div>

                    <span className="document-verified">
                      <CheckCircle2 size={13} />
                      Available
                    </span>

                    <button
                      type="button"
                      aria-label="View final receipt"
                      disabled={documentLoading}
                      onClick={() =>
                        handleView(finalReceipt.id)
                      }
                      title="View Final Receipt"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      aria-label="Download final receipt"
                      disabled={documentLoading}
                      onClick={() =>
                        handleDownload(finalReceipt.id)
                      }
                      title="Download Final Receipt"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="dashboard-empty-state">
                    <FileText size={24} />
                    <strong>Final receipt not uploaded yet</strong>
                    <span>
                      AGX will make the final receipt available here after it is uploaded.
                    </span>
                  </div>
                )}
              </div>
            )}
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

              {request.payments?.length ? (
                request.payments.map((payment) => (
                  <div
                    className="payment-status"
                    key={payment.id}
                  >
                    <div>
                      <CheckCircle2 size={17} />
                      <span>{payment.status}</span>
                    </div>
                    <strong>{money(payment.amount)}</strong>
                  </div>
                ))
              ) : (
                <div className="payment-status">
                  <div>
                    <CheckCircle2 size={17} />
                    <span>Payment</span>
                  </div>
                  <strong>{money(request.amount)}</strong>
                </div>
              )}
            </div>

            <div className="details-panel client-panel">
              <div className="details-panel-heading compact">
                <div>
                  <span>ACCOUNT</span>
                  <h2>Request details</h2>
                </div>
              </div>

              <div className="client-info">
                <div>
                  <UserRound size={15} />
                  <span>Account</span>
                  <strong>
                    {request.user?.email || "Your account"}
                  </strong>
                </div>

                <div>
                  <CalendarDays size={15} />
                  <span>Submitted</span>
                  <strong>
                    {formatDate(
                      request.createdAt || request.created_at
                    )}
                  </strong>
                </div>

                <div>
                  <FileCheck2 size={15} />
                  <span>Service</span>
                  <strong>
                    {request.serviceName ||
                      request.service_name ||
                      "AGX Service"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="details-security-card">
              <div>
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>Secure request handling</strong>
                <p>
                  Your documents and request information are handled through your AGX account.
                </p>
              </div>
            </div>

            <Link
              to="/new-request"
              className="details-new-request"
            >
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
