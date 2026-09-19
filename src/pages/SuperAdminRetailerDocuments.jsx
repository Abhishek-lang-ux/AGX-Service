import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  FileCheck2,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getSuperAdminRetailerDocuments,
  openSuperAdminDocument,
  downloadSuperAdminDocument,
} from "../lib/api.js";

import "./superAdminDocuments.css";

function SuperAdminRetailerDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* =========================================================
     LOAD DOCUMENTS
  ========================================================= */

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuperAdminRetailerDocuments();

      setDocuments(
        Array.isArray(response?.documents)
          ? response.documents
          : []
      );
    } catch (err) {
      console.error(
        "Load Retailer documents error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load retailer documents."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadDocuments();
  }, []);

  /* =========================================================
     RETAILER NAME
  ========================================================= */

  const getRetailerName = (document) => {
    const name = [
      document?.firstName,
      document?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return name || "Retailer";
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredDocuments = documents.filter(
    (document) => {
      const retailerName = getRetailerName(document);

      const text = [
        document.originalName,
        document.documentType,
        document.requestNumber,
        document.requestTitle,
        document.serviceName,
        document.userEmail,
        document.phone,
        document.firstName,
        document.lastName,
        retailerName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(
        search.trim().toLowerCase()
      );
    }
  );

  /* =========================================================
     FILE SIZE
  ========================================================= */

  const formatFileSize = (bytes) => {
    const size = Number(bytes || 0);

    if (!size) {
      return "0 KB";
    }

    const mb = size / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(size / 1024)
    )} KB`;
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusLabel = (status) => {
    if (!status) {
      return "Uploaded";
    }

    return String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  /* =========================================================
     VIEW
  ========================================================= */

  const handleView = async (id) => {
    try {
      await openSuperAdminDocument(id);
    } catch (err) {
      console.error(
        "View document error:",
        err
      );

      alert(
        err?.message ||
          "Unable to open document."
      );
    }
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const handleDownload = async (id) => {
    try {
      await downloadSuperAdminDocument(id);
    } catch (err) {
      console.error(
        "Download document error:",
        err
      );

      alert(
        err?.message ||
          "Unable to download document."
      );
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="superadmin-section-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="superadmin-page-header">

        <div>
          <span className="superadmin-page-eyebrow">
            DOCUMENT MANAGEMENT
          </span>

          <h1>Retailer Documents</h1>

          <p>
            Review and access documents submitted
            by retailers.
          </p>
        </div>

        <button
          type="button"
          className="superadmin-refresh-btn"
          onClick={loadDocuments}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "refresh-icon-spinning"
                : ""
            }
          />

          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="superadmin-documents-toolbar">

        <div className="superadmin-document-search">

          <Search size={17} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search client, request or document..."
          />

        </div>

        <strong>
          {filteredDocuments.length}{" "}
          {filteredDocuments.length === 1
            ? "Document"
            : "Documents"}
        </strong>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="superadmin-empty-panel">

          <RefreshCw
            size={30}
            className="refresh-icon-spinning"
          />

          <h2>
            Loading documents...
          </h2>

          <p>
            Please wait while AGX loads
            retailer documents.
          </p>

        </div>

      ) : error ? (

        /* ===================================================
           ERROR
        =================================================== */

        <div className="superadmin-empty-panel">

          <FileCheck2 size={40} />

          <h2>
            Unable to load documents
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadDocuments}
          >
            Try Again
          </button>

        </div>

      ) : filteredDocuments.length === 0 ? (

        /* ===================================================
           EMPTY
        =================================================== */

        <div className="superadmin-empty-panel">

          <FileCheck2 size={42} />

          <h2>
            {search
              ? "No Documents Found"
              : "No Retailer Documents"}
          </h2>

          <p>
            {search
              ? "No documents match your search."
              : "Retailer submitted documents will appear here."}
          </p>

        </div>

      ) : (

        /* ===================================================
           TABLE
        =================================================== */

        <div className="superadmin-documents-table-wrap">

          <table className="superadmin-documents-table">

            <thead>
              <tr>
                <th>Document</th>
                <th>Retailer</th>
                <th>Request</th>
                <th>Service</th>
                <th>Status</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDocuments.map(
                (document) => {

                  const retailerName =
                    getRetailerName(document);

                  return (
                    <tr
                      key={document.id}
                    >

                      {/* =================================
                          DOCUMENT
                      ================================= */}

                      <td>

                        <div className="superadmin-document-name">

                          <div className="superadmin-document-icon">
                            <FileCheck2
                              size={17}
                            />
                          </div>

                          <div>

                            <strong>
                              {document.documentType ||
                                document.originalName}
                            </strong>

                            <span>
                              {document.originalName}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* =================================
                          RETAILER
                      ================================= */}

                      <td>

                        <div className="superadmin-client-cell">

                          <strong>
                            {retailerName}
                          </strong>

                          {document.userEmail && (
                            <span>
                              {document.userEmail}
                            </span>
                          )}

                          {document.phone && (
                            <small>
                              {document.phone}
                            </small>
                          )}

                        </div>

                      </td>

                      {/* =================================
                          REQUEST
                      ================================= */}

                      <td>

                        <div className="superadmin-request-cell">

                          <strong>
                            {document.requestNumber ||
                              "—"}
                          </strong>

                          {document.requestTitle && (
                            <span>
                              {document.requestTitle}
                            </span>
                          )}

                        </div>

                      </td>

                      {/* =================================
                          SERVICE
                      ================================= */}

                      <td>

                        <span className="superadmin-service-name">
                          {document.serviceName ||
                            "—"}
                        </span>

                      </td>

                      {/* =================================
                          STATUS
                      ================================= */}

                      <td>

                        <span
                          className={`document-status document-status-${String(
                            document.status ||
                              "uploaded"
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {getStatusLabel(
                            document.status
                          )}
                        </span>

                      </td>

                      {/* =================================
                          SIZE
                      ================================= */}

                      <td>
                        {formatFileSize(
                          document.fileSize
                        )}
                      </td>

                      {/* =================================
                          ACTION
                      ================================= */}

                      <td>

                        <div className="document-actions">

                          <button
                            type="button"
                            title="View document"
                            onClick={() =>
                              handleView(
                                document.id
                              )
                            }
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            title="Download document"
                            onClick={() =>
                              handleDownload(
                                document.id
                              )
                            }
                          >
                            <Download
                              size={16}
                            />
                            <span>
                              Download
                            </span>
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default SuperAdminRetailerDocuments;