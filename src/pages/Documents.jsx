import {
  ArrowRight,
  CheckCircle2,
  CloudUpload,
  Download,
  FileImage,
  FileText,
  FolderOpen,
  MoreVertical,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import "./documents.css";

const initialDocuments = [
  {
    id: 1,
    name: "PAN Card.pdf",
    type: "PDF",
    size: "1.2 MB",
    date: "10 Sep 2026",
    service: "GST Registration",
    status: "Verified",
  },
  {
    id: 2,
    name: "Address Proof.pdf",
    type: "PDF",
    size: "860 KB",
    date: "10 Sep 2026",
    service: "GST Registration",
    status: "Verified",
  },
  {
    id: 3,
    name: "Business Details.pdf",
    type: "PDF",
    size: "540 KB",
    date: "10 Sep 2026",
    service: "GST Registration",
    status: "Verified",
  },
  {
    id: 4,
    name: "Bank Statement.pdf",
    type: "PDF",
    size: "2.1 MB",
    date: "08 Sep 2026",
    service: "Income Tax Filing",
    status: "Under Review",
  },
  {
    id: 5,
    name: "Passport Photo.jpg",
    type: "JPG",
    size: "420 KB",
    date: "04 Sep 2026",
    service: "PAN Card Assistance",
    status: "Verified",
  },
];

function Documents() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const filteredDocuments = documents.filter((document) =>
    `${document.name} ${document.service} ${document.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const addFiles = (files) => {
    const selected = Array.from(files || []);

    if (!selected.length) return;

    const newDocuments = selected.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      size: file.size < 1024 * 1024
        ? `${Math.max(1, Math.round(file.size / 1024))} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: "11 Sep 2026",
      service: "Additional Document",
      status: "Uploaded",
    }));

    setDocuments((current) => [...newDocuments, ...current]);
    setShowUpload(false);
  };

  const handleInputChange = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeDocument = (id) => {
    setDocuments((current) => current.filter((document) => document.id !== id));
  };

  return (
    <main className="documents-page">
      <div className="documents-container">
        <section className="documents-header">
          <div>
            <span className="documents-eyebrow">
              <FolderOpen size={14} />
              CLIENT PORTAL
            </span>
            <h1>My Documents</h1>
            <p>Securely manage the documents you have submitted to AGX.</p>
          </div>

          <button
            type="button"
            className="documents-upload-btn"
            onClick={() => setShowUpload(true)}
          >
            <Upload size={17} />
            Upload Document
          </button>
        </section>

        <section className="documents-summary">
          <div>
            <div className="documents-summary-icon blue">
              <FileText size={19} />
            </div>
            <span>Total Documents</span>
            <strong>{documents.length}</strong>
          </div>

          <div>
            <div className="documents-summary-icon green">
              <CheckCircle2 size={19} />
            </div>
            <span>Verified</span>
            <strong>{documents.filter((doc) => doc.status === "Verified").length}</strong>
          </div>

          <div>
            <div className="documents-summary-icon orange">
              <AlertCircle size={19} />
            </div>
            <span>Under Review</span>
            <strong>{documents.filter((doc) => doc.status === "Under Review").length}</strong>
          </div>

          <div>
            <div className="documents-summary-icon purple">
              <CloudUpload size={19} />
            </div>
            <span>Storage Used</span>
            <strong>5.1 MB</strong>
          </div>
        </section>

        <section className="documents-panel">
          <div className="documents-toolbar">
            <div>
              <span className="documents-section-label">DOCUMENT LIBRARY</span>
              <h2>Your uploaded documents</h2>
            </div>

            <div className="documents-search">
              <Search size={17} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search documents..."
              />
            </div>
          </div>

          <div className="documents-table">
            <div className="documents-table-head">
              <span>Document</span>
              <span>Service</span>
              <span>Uploaded</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {filteredDocuments.map((document) => (
              <div className="document-table-row" key={document.id}>
                <div className="document-name-cell">
                  <div className="document-type-icon">
                    {document.type === "JPG" ? (
                      <FileImage size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>
                  <div>
                    <strong>{document.name}</strong>
                    <span>{document.type} · {document.size}</span>
                  </div>
                </div>

                <span className="document-service">{document.service}</span>
                <span className="document-date">{document.date}</span>

                <span className={`document-status ${document.status.toLowerCase().replaceAll(" ", "-")}`}>
                  <CheckCircle2 size={12} />
                  {document.status}
                </span>

                <div className="document-actions">
                  <button type="button" aria-label={`Download ${document.name}`}>
                    <Download size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${document.name}`}
                    onClick={() => removeDocument(document.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button type="button" aria-label={`More options for ${document.name}`}>
                    <MoreVertical size={15} />
                  </button>
                </div>
              </div>
            ))}

            {!filteredDocuments.length && (
              <div className="documents-empty">
                <Search size={25} />
                <strong>No documents found</strong>
                <span>Try a different search term.</span>
              </div>
            )}
          </div>

          <div className="documents-mobile-note">
            <ShieldCheck size={15} />
            <span>Documents are private to your AGX client account.</span>
          </div>
        </section>

        <section className="documents-bottom">
          <div className="documents-guidelines">
            <div className="guidelines-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span>DOCUMENT SECURITY</span>
              <h2>Keep your documents protected</h2>
              <p>
                Upload only documents required for your service request.
                Avoid sharing unnecessary sensitive information.
              </p>
            </div>
          </div>

          <Link to="/myrequests" className="documents-request-link">
            View My Requests
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>

      {showUpload && (
        <div className="documents-modal-backdrop" onMouseDown={() => setShowUpload(false)}>
          <div
            className="documents-upload-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="documents-modal-header">
              <div>
                <span>DOCUMENT UPLOAD</span>
                <h2>Upload a document</h2>
              </div>
              <button
                type="button"
                className="documents-close-btn"
                onClick={() => setShowUpload(false)}
                aria-label="Close upload dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p className="documents-modal-description">
              Select a file from your device or drag and drop it below.
            </p>

            <div
              className={`documents-dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="documents-drop-icon">
                <CloudUpload size={25} />
              </div>
              <strong>Drop your file here</strong>
              <span>or click to browse from your device</span>
              <small>PDF, JPG, PNG · Maximum 10 MB</small>
            </div>

            <input
              ref={inputRef}
              type="file"
              hidden
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleInputChange}
            />

            <div className="documents-modal-warning">
              <AlertCircle size={15} />
              <span>Only upload documents relevant to your AGX service request.</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Documents;
