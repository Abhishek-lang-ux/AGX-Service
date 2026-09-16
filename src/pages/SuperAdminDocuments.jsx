import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  FileCheck2,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  getSuperAdminDocuments,
  openSuperAdminDocument,
  downloadSuperAdminDocument,
} from "../lib/api.js";

import "./superAdminDocuments.css";


function SuperAdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuperAdminDocuments();

      setDocuments(
        Array.isArray(response?.documents)
          ? response.documents
          : []
      );
    } catch (err) {
      console.error("Load SuperAdmin documents error:", err);

      setError(
        err?.message ||
          "Unable to load client documents."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDocuments();
  }, []);


  const filteredDocuments = documents.filter(
    (document) => {
      const text = [
        document.originalName,
        document.requestNumber,
        document.serviceName,
        document.client?.email,
        document.client?.firstName,
        document.client?.lastName,
        document.documentType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    }
  );


  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )} KB`;
  };


  const getClientName = (client) => {
    const name = [
      client?.firstName,
      client?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return name || "Client";
  };


  const handleView = async (id) => {
    try {
      await openSuperAdminDocument(id);
    } catch (err) {
      alert(
        err?.message ||
          "Unable to open document."
      );
    }
  };


  const handleDownload = async (id) => {
    try {
      await downloadSuperAdminDocument(id);
    } catch (err) {
      alert(
        err?.message ||
          "Unable to download document."
      );
    }
  };


  return (
    <div className="superadmin-section-page">

      <div className="superadmin-page-header">

        <div>
          <span className="superadmin-page-eyebrow">
            DOCUMENT MANAGEMENT
          </span>

          <h1>Client Documents</h1>

          <p>
            Review and access documents submitted
            by clients.
          </p>
        </div>

        <button
          type="button"
          className="superadmin-refresh-btn"
          onClick={loadDocuments}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>


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
          {filteredDocuments.length} Documents
        </strong>

      </div>


      {loading ? (
        <div className="superadmin-empty-panel">
          <RefreshCw size={30} />

          <h2>Loading documents...</h2>

          <p>
            Please wait while AGX loads client
            documents.
          </p>
        </div>
      ) : error ? (
        <div className="superadmin-empty-panel">
          <FileCheck2 size={40} />

          <h2>Unable to load documents</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadDocuments}
          >
            Try Again
          </button>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="superadmin-empty-panel">
          <FileCheck2 size={42} />

          <h2>No Documents Found</h2>

          <p>
            Client submitted documents will appear
            here.
          </p>
        </div>
      ) : (
        <div className="superadmin-documents-table-wrap">

          <table className="superadmin-documents-table">

            <thead>
              <tr>
                <th>Document</th>
                <th>Client</th>
                <th>Request</th>
                <th>Service</th>
                <th>Status</th>
                <th>Size</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredDocuments.map(
                (document) => (
                  <tr key={document.id}>

                    <td>
                      <div className="superadmin-document-name">

                        <div className="superadmin-document-icon">
                          <FileCheck2 size={17} />
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


                    <td>
                      <div className="superadmin-client-cell">
                        <strong>
                          {getClientName(
                            document.client
                          )}
                        </strong>

                        <span>
                          {document.client?.email}
                        </span>
                      </div>
                    </td>


                    <td>
                      <strong>
                        {document.requestNumber}
                      </strong>
                    </td>


                    <td>
                      {document.serviceName || "—"}
                    </td>


                    <td>
                      <span
                        className={`document-status document-status-${String(
                          document.status || "uploaded"
                        ).toLowerCase()}`}
                      >
                        {document.status ||
                          "uploaded"}
                      </span>
                    </td>


                    <td>
                      {formatFileSize(
                        document.fileSize
                      )}
                    </td>


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
                          View
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
                          <Download size={16} />
                          Download
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default SuperAdminDocuments;