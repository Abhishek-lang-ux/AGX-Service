import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  FileText,
  IndianRupee,
  Landmark,
  Monitor,
  ReceiptText,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getServices,
  submitRequestWithPayment,
  uploadRequestDocuments,
} from "../lib/api.js";

import "./newRequest.css";

const categories = [
  { id: "all", label: "All Services", icon: BriefcaseBusiness },
  { id: "tax", label: "Tax & Compliance", icon: ReceiptText },
  { id: "business", label: "Business Services", icon: Landmark },
  { id: "government", label: "Government Services", icon: UserRound },
  { id: "accounting", label: "Accounting", icon: IndianRupee },
  { id: "digital", label: "Digital Services", icon: Monitor },
];

const categoryMeta = {
  tax: { label: "Tax & Compliance", icon: ReceiptText },
  business: { label: "Business Services", icon: Landmark },
  government: { label: "Government Services", icon: UserRound },
  accounting: { label: "Accounting", icon: IndianRupee },
  digital: { label: "Digital Services", icon: Monitor },
  consultation: { label: "Consultation", icon: BriefcaseBusiness },
  compliance: { label: "Compliance", icon: ReceiptText },
};

const categoryAliases = {
  gst: "business",
  "income tax": "tax",
  "income tax filing": "tax",
  accounting: "accounting",
  "business": "business",
  "government": "government",
  "digital": "digital",
  consultation: "consultation",
  compliance: "compliance",
};

function normalizeCategory(value = "") {
  const key = String(value).trim().toLowerCase();
  return categoryAliases[key] || key || "business";
}

function formatServicePrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}



const fallbackServices = [
  {
    id: 1,
    slug: "gst-registration",
    title: "GST Registration",
    category: "business",
    description: "Complete GST registration assistance.",
    price: "₹1,999",
    amount: 1999,
    popular: true,
  },
  {
    id: 2,
    slug: "income-tax-return",
    title: "Income Tax Return",
    category: "tax",
    description: "Professional ITR preparation and filing.",
    price: "₹599",
    amount: 599,
    popular: true,
  },
  {
    id: 3,
    slug: "accounting-bookkeeping",
    title: "Accounting & Bookkeeping",
    category: "accounting",
    description:
      "Monthly accounting, bookkeeping and GST Filing support.",
    price: "₹499",
    amount: 499,
    popular: false,
  },
  {
    id: 4,
    slug: "project-report",
    title: "Project Report",
    category: "business",
    description:
      "Professional project report preparation assistance.",
    price: "₹1,999",
    amount: 1999,
    popular: false,
  },
  {
    id: 5,
    slug: "balance-sheet",
    title: "Balance Sheet",
    category: "accounting",
    description:
      "Professional balance sheet preparation assistance.",
    price: "₹1,999",
    amount: 1999,
    popular: false,
  },
  {
    id: 6,
    slug: "aadhaar-pan-link",
    title: "Aadhaar + PAN Link",
    category: "documents",
    description:
      "Assistance with linking Aadhaar with PAN.",
    price: "₹1,099",
    amount: 1099,
    popular: false,
  },
  {
    id: 7,
    slug: "website-development",
    title: "Website Development",
    category: "digital",
    description:
      "Professional website development for businesses and professionals.",
    price: "₹6,999",
    amount: 6999,
    popular: false,
  },
  {
    id: 8,
    slug: "pf-withdrawal",
    title: "PF Withdrawal Assistance",
    category: "documents",
    description:
      "Assistance with PF withdrawal and applicable EPFO processes.",
    price: "₹199",
    amount: 199,
    popular: false,
  },
  {
    id: 9,
    slug: "pvc-aadhaar-card",
    title: "PVC Aadhaar Card",
    category: "documents",
    description:
      "Assistance with PVC Aadhaar card application.",
    price: "₹99",
    amount: 99,
    popular: false,
  },
  {
    id: 10,
    slug: "pan-card-services",
    title: "PAN Card Services",
    category: "documents",
    description:
      "PAN application, correction and reprint assistance.",
    price: "₹179",
    amount: 179,
    popular: false,
  },
  {
    id: 11,
    slug: "ebill-website-development",
    title: "E-Bill Website Development",
    category: "digital",
    description:
      "Professional e-bill and billing website development.",
    price: "₹9,999",
    amount: 9999,
    popular: false,
  },
];

const requiredDocumentsByService = {
  "gst-registration": [
    { key: "pan", label: "PAN Card" },
    { key: "aadhaar-front", label: "Aadhaar Front" },
    { key: "aadhaar-back", label: "Aadhaar Back" },
    { key: "photo", label: "Photograph" },
    { key: "address-proof", label: "Address Proof" },
  ],

  "income-tax-return": [
    { key: "pan", label: "PAN Card" },
    { key: "aadhaar-front", label: "Aadhaar Front" },
    { key: "aadhaar-back", label: "Aadhaar Back" },
    { key: "form-16", label: "Form 16(if salaried" },
    { key: "bank-statement", label: "Bank Statement" },
    { key: "bank-passbook", label: "Bank Passbook" },
  ],

  "accounting-bookkeeping": [
    { key: "gst-certificate", label: "GST Certificate" },
    { key: "bank-statement", label: "Bank Statement" },
    { key: "sales-purchase-data", label: "Sales / Purchase Data" },
  ],

  "aadhaar-pan-link": [
    { key: "pan", label: "PAN Card" },
    { key: "aadhaar-front", label: "Aadhaar Front" },
    { key: "aadhaar-back", label: "Aadhaar Back" },
  ],

  "website-development": [
    { key: "logo", label: "Logo / Brand Assets" },
  ],

  "pf-withdrawal": [
    { key: "pan", label: "PAN Card" },
    { key: "aadhaar-front", label: "Aadhaar Front" },
    { key: "aadhaar-back", label: "Aadhaar Back" },
    { key: "bank-proof", label: "Bank Account Proof" },
  ],

  "pvc-aadhaar-card": [
    { key: "aadhaar-front", label: "Aadhaar Front" },
    { key: "aadhaar-back", label: "Aadhaar Back" },
  ],

  "pan-card-services": [
    { key: "aadhaar-front", label: "Aadhaar Front" },
    { key: "aadhaar-back", label: "Aadhaar Back" },
    { key: "photo", label: "Photograph" },
    { key: "sign", label: "Sign" },
    { key: "markesheet", label: "10ht or 12th Marksheet" },
  ],

  "ebill-website-development": [
    { key: "logo", label: "Logo / Brand Assets" },
  ],
};

function NewRequest() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);

  // Step 2 form state
  const [requirement, setRequirement] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [reference, setReference] = useState("");
  const [consent, setConsent] = useState(false);
  const [documentFiles, setDocumentFiles] = useState({});
  // Manual QR payment state
const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const requiredDocuments =
  requiredDocumentsByService[selectedService?.slug] || [];

const selectedFiles = Object.values(documentFiles).filter(Boolean);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoadingServices(true);
        const response = await getServices();
        if (!mounted) return;

        const backendServices = Array.isArray(response?.services)
          ? response.services
          : [];

        setServices(backendServices.map((service) => ({
          id: Number(service.id),
          slug: service.slug,
          title: service.name,
          category: normalizeCategory(service.category),
          description: service.description || service.shortDescription || "AGX professional service assistance.",
          price: formatServicePrice(service.basePrice),
          amount: Number(service.basePrice) || 0,
          popular: Number(service.displayOrder) <= 2,
        })));

        if (backendServices.length === 0) {
          setServices(fallbackServices);
        }
      } catch (serviceError) {
        console.error("Load services error:", serviceError);
        if (mounted) {
          // Keep the request screen usable even if the service catalog endpoint
          // is temporarily unavailable. The backend also bootstraps these slugs.
          setServices(fallbackServices);
          setError("");
        }
      } finally {
        if (mounted) setIsLoadingServices(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category;

      const matchesSearch = `${service.title} ${service.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search, services]);

  const selectService = (service) => {
    setSelectedService(service);
    setStep(2);

    // Reset form for a fresh request
    setRequirement("");
    setContactMethod("whatsapp");
    setReference("");
    setConsent(false);
    setDocumentFiles({});
    setError("");
    setPaymentScreenshot(null);
  };

  const handleDocumentChange = (documentKey, file) => {
  if (!file) return;

  setDocumentFiles((prev) => ({
    ...prev,
    [documentKey]: file,
  }));

  setError("");
};

  const handlePaymentScreenshotChange = (event) => {
  const file = event.target.files?.[0] || null;

  if (!file) {
    setPaymentScreenshot(null);
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setPaymentScreenshot(null);
    setError("Payment screenshot must be JPG, PNG or WEBP.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setPaymentScreenshot(null);
    setError("Payment screenshot must be smaller than 5 MB.");
    event.target.value = "";
    return;
  }

  setPaymentScreenshot(file);
  setError("");
};

  const handleContinueToReview = () => {
    setError("");

    if (!selectedService) {
      setError("Please select a service first.");
      return;
    }

    if (!requirement.trim()) {
      setError("Please describe your requirement before continuing.");
      return;
    }

    if (!consent) {
      setError(
        "Please confirm that the information provided is accurate."
      );
      return;
    }

    const missingDocuments = requiredDocuments.filter(
  (document) => !documentFiles[document.key]
);

if (missingDocuments.length > 0) {
  setError(
    `Please upload: ${missingDocuments
      .map((document) => document.label)
      .join(", ")}`
  );
  return;
}

    setStep(3);
  };

  const handleCreateRequest = async () => {
  if (!selectedService) {
    setError("Please select a service first.");
    return;
  }

  if (!requirement.trim()) {
    setError("Please enter your requirement.");
    setStep(2);
    return;
  }

  if (!consent) {
    setError(
      "Please confirm that the information provided is accurate."
    );
    setStep(2);
    return;
  }

  if (!paymentScreenshot) {
    setError("Please upload your payment screenshot.");
    setStep(4);
    return;
  }

  setError("");
  setIsSubmitting(true);

  try {
    const response = await submitRequestWithPayment({
      serviceId: Number(selectedService.id),
      serviceSlug: selectedService.slug,
      title: selectedService.title,
      description: requirement.trim(),
      priority: "normal",
      paymentScreenshot,
    });

    if (!response?.success || !response?.request) {
      throw new Error(
        response?.message ||
          "Unable to submit payment proof."
      );
    }

    const createdRequest = response.request;

    /*
     * Supporting documents are uploaded only AFTER
     * the payment-proof submission has successfully
     * created the request.
     */
    if (
      selectedFiles.length > 0 &&
      createdRequest.id
    ) {
      try {
        await uploadRequestDocuments(
          createdRequest.id,
          selectedFiles
        );
      } catch (uploadError) {
        console.error(
          "Request created but document upload failed:",
          uploadError
        );
      }
    }

    navigate("/myrequests");
  } catch (requestError) {
    console.error(
      "Submit request with payment error:",
      requestError
    );

    setError(
      requestError?.message ||
        "Something went wrong while submitting your payment proof."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="new-request-page">
      <div className="new-request-container">
        <Link to="/dashboard" className="new-request-back">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="new-request-heading">
          <div>
            <span className="new-request-eyebrow">
              <BriefcaseBusiness size={14} />
              CLIENT PORTAL
            </span>

            <h1>Start a New Request</h1>

            <p>
              Choose the service you need and continue with your
              requirements.
            </p>
          </div>

          <div className="request-stepper">
            <div
              className={`request-step ${
                step >= 1 ? "active" : ""
              }`}
            >
              <span>1</span>
              <small>Choose Service</small>
            </div>

            <i />

            <div
              className={`request-step ${
                step >= 2 ? "active" : ""
              }`}
            >
              <span>2</span>
              <small>Requirements</small>
            </div>

            <i />

            <div
              className={`request-step ${
                step >= 3 ? "active" : ""
              }`}
            >
              <span>3</span>
              <small>Review</small>
            </div>
            <i />

<div
  className={`request-step ${
    step >= 4 ? "active" : ""
  }`}
>
  <span>4</span>
  <small>Payment</small>
  </div>
          </div>
        </section>

        {/* =========================
            STEP 1
        ========================== */}
        {step === 1 && (
          <>
            <section className="new-request-tools">
              <div className="new-request-search">
                <Search size={18} />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search for a service..."
                />
              </div>

              <div className="new-request-categories">
                {categories.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        category === item.id ? "active" : ""
                      }
                      onClick={() => setCategory(item.id)}
                    >
                      <Icon size={15} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="new-request-service-panel">
              <div className="new-request-panel-heading">
                <div>
                  <span>AVAILABLE SERVICES</span>
                  <h2>What can we help you with?</h2>
                </div>

                <strong>
                  {filteredServices.length} Services
                </strong>
              </div>

              {isLoadingServices ? (
                <div className="new-request-empty">
                  <strong>Loading available services...</strong>
                  <span>Please wait while AGX loads the latest service list.</span>
                </div>
              ) : (
              <div className="new-request-service-grid">
                {filteredServices.map((service) => (
                  <article
                    className="new-service-card"
                    key={service.id}
                  >
                    {service.popular && (
                      <span className="new-service-popular">
                        POPULAR
                      </span>
                    )}

                    <div className="new-service-icon">
                      <FileText size={21} />
                    </div>

                    <div className="new-service-card-content">
                      <span className="new-service-category">
                        {
                          categoryMeta[service.category]?.label || service.category
                        }
                      </span>

                      <h3>{service.title}</h3>

                      <p>{service.description}</p>
                    </div>

                    <div className="new-service-card-bottom">
                      <div>
                        <small>Starting from</small>
                        <strong>{service.price}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => selectService(service)}
                      >
                        Select
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              )}

              {!isLoadingServices && !filteredServices.length && (
                <div className="new-request-empty">
                  <Search size={27} />
                  <strong>No matching service found</strong>
                  <span>
                    Try another service name or category.
                  </span>
                </div>
              )}
            </section>
          </>
        )}

        {/* =========================
            STEP 2
        ========================== */}
        {step === 2 && selectedService && (
          <section className="new-request-requirements">
            <div className="selected-service-card">
              <div className="selected-service-icon">
                <FileText size={22} />
              </div>

              <div>
                <span>SELECTED SERVICE</span>

                <h2>{selectedService.title}</h2>

                <p>{selectedService.description}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                Change
              </button>
            </div>

            <div className="requirements-layout">
              <div className="requirements-main-panel">
                <div className="new-request-panel-heading">
                  <div>
                    <span>STEP 2</span>
                    <h2>Tell us about your requirement</h2>
                  </div>
                </div>

                <div className="requirements-form">
                  <label>
                    <span>
                      What do you need assistance with?
                    </span>

                    <textarea
                      value={requirement}
                      onChange={(event) =>
                        setRequirement(event.target.value)
                      }
                      placeholder="Briefly describe your requirement..."
                      rows="5"
                    />
                  </label>

                  <div className="requirements-two-column">
                    <label>
                      <span>Preferred contact method</span>

                      <div className="select-wrap">
                        <select
                          value={contactMethod}
                          onChange={(event) =>
                            setContactMethod(
                              event.target.value
                            )
                          }
                        >
                          <option value="whatsapp">
                            WhatsApp
                          </option>

                          <option value="phone">
                            Phone Call
                          </option>

                          <option value="email">
                            Email
                          </option>
                        </select>

                        <ChevronDown size={16} />
                      </div>
                    </label>

                    <label>
                      <span>
                        Additional reference (optional)
                      </span>

                      <input
                        type="text"
                        value={reference}
                        onChange={(event) =>
                          setReference(event.target.value)
                        }
                        placeholder="Reference / previous request ID"
                      />
                    </label>
                  </div>

                  <div className="required-documents-box">

  <div className="required-documents-heading">
    <div>
      <strong>Required Documents</strong>
      <p>
        Please upload the documents required for{" "}
        {selectedService.title}.
      </p>
    </div>
  </div>

  <div className="required-documents-list">

    {requiredDocuments.length > 0 ? (
      requiredDocuments.map((document) => (
        <div
          className="required-document-row"
          key={document.key}
        >

          <div className="required-document-info">

            <div className="required-document-icon">
              <FileText size={18} />
            </div>

            <div>
              <strong>{document.label}</strong>

              {documentFiles[document.key] ? (
                <span className="document-selected">
                  ✓ {documentFiles[document.key].name}
                </span>
              ) : (
                <span>
                  Required document
                </span>
              )}
            </div>

          </div>

          <div>

            <input
              id={`document-${document.key}`}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              hidden
              onChange={(event) =>
                handleDocumentChange(
                  document.key,
                  event.target.files?.[0]
                )
              }
            />

            <label
              htmlFor={`document-${document.key}`}
              className="document-upload-btn"
            >
              {documentFiles[document.key]
                ? "Change File"
                : `Upload ${document.label}`}
            </label>

          </div>

        </div>
      ))
    ) : (
      <div className="no-documents-message">
        <FileText size={18} />
        <span>
          No specific documents are required for this service.
        </span>
      </div>
    )}

  </div>

</div>

                  <label className="requirements-consent">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(event) =>
                        setConsent(event.target.checked)
                      }
                    />

                    <span>
                      I confirm that the information provided
                      is accurate and I understand that AGX
                      may contact me for additional details.
                    </span>
                  </label>

                  {error && (
                    <div
                      className="request-form-error"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <div className="requirements-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError("");
                      }}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>

                    <button
                      type="button"
                      className="continue-btn"
                      onClick={handleContinueToReview}
                    >
                      Continue to Review
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <aside className="requirements-side">
                <div className="requirements-side-card">
                  <span>SERVICE SUMMARY</span>

                  <h3>{selectedService.title}</h3>

                  <div>
                    <span>Service Fee</span>
                    <strong>{selectedService.price}</strong>
                  </div>

                  <div>
                    <span>Processing</span>
                    <strong>AGX Assisted</strong>
                  </div>

                  <div>
                    <span>Next Step</span>
                    <strong>Review & Submit</strong>
                  </div>
                </div>

                <div className="requirements-security">
                  <ShieldCheck size={19} />

                  <div>
                    <strong>Your information matters</strong>

                    <p>
                      Only provide documents and information
                      relevant to your selected service.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* =========================
            STEP 3
        ========================== */}
        {step === 3 && selectedService && (
          <section className="request-review-panel">
            <div className="review-success-icon">
              <CheckCircle2 size={28} />
            </div>

            <span>STEP 3 · REVIEW</span>

            <h2>Ready to submit your request?</h2>

            <p>
              Review the selected service and continue. Payment
              and document requirements can be handled in the
              following stage.
            </p>

            <div className="review-summary">
              <div>
                <span>Service</span>
                <strong>{selectedService.title}</strong>
              </div>

              <div>
                <span>Service Fee</span>
                <strong>{selectedService.price}</strong>
              </div>

              <div>
                <span>Contact Method</span>
                <strong>
                  {contactMethod === "whatsapp"
                    ? "WhatsApp"
                    : contactMethod === "phone"
                    ? "Phone Call"
                    : "Email"}
                </strong>
              </div>

              <div>
                <span>Documents</span>
                <strong>
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} Selected`
                    : "None"}
                </strong>
              </div>

              <div>
                <span>Request Status</span>
                <strong>Ready to Submit</strong>
              </div>
            </div>

            <div className="review-security">
              <ShieldCheck size={17} />

              <span>
                Your request will be reviewed by AGX before
                processing.
              </span>
            </div>

            {error && (
              <div
                className="request-form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="review-actions">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setError("");
                }}
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
                Edit Details
              </button>

              <button
  type="button"
  className="review-submit"
  onClick={() => {
    setError("");
    setStep(4);
  }}
  disabled={isSubmitting}
>
  Continue to Payment
  <ArrowRight size={16} />
</button>
            </div>
          </section>
        )}

        {/* =========================
    STEP 4 · PAYMENT
========================== */}
{step === 4 && selectedService && (
  <section className="request-payment-panel">
    <div className="review-success-icon">
      <IndianRupee size={28} />
    </div>

    <span>STEP 4 · PAYMENT</span>

    <h2>Complete your payment</h2>

    <p>
      Scan the QR code or use the bank details below to
      make your payment. After payment, upload the
      screenshot to submit your request.
    </p>

    <div className="payment-summary-card">
      <div>
        <span>Service</span>
        <strong>{selectedService.title}</strong>
      </div>

      <div>
        <span>Amount Payable</span>
        <strong>{selectedService.price}</strong>
      </div>
    </div>

    <div className="payment-details-layout">
      <div className="payment-qr-card">
        <span>SCAN & PAY</span>

        <div className="payment-qr-box">
          <img
            src="/QRcode.jpeg"
            alt="AGX Payment QR Code"
          />
        </div>

        <strong>Scan this QR code to pay</strong>

        <small>
          Please pay the exact amount shown above.
        </small>
      </div>

      <div className="payment-bank-card">
        <span>BANK / UPI DETAILS</span>

        <div className="payment-bank-row">
          <small>Account Holder</small>
          <strong>AGX MULTIVERSE</strong>
        </div>

        <div className="payment-bank-row">
          <small>Bank</small>
          <strong>Bank of Baroda</strong>
        </div>

        <div className="payment-bank-row">
          <small>Account Number</small>
          <strong>45030200000551</strong>
        </div>

        <div className="payment-bank-row">
          <small>IFSC</small>
          <strong>BARKB0MOHLAK</strong>
        </div>

        <div className="payment-bank-row">
          <small>UPI ID</small>
          <strong>agxmu70547551@barodampay</strong>
        </div>
      </div>
    </div>

    <div className="payment-upload-card">
      <div>
        <strong>Upload Payment Screenshot</strong>

        <p>
          Upload a clear screenshot of your successful
          payment. JPG, PNG or WEBP only, maximum 5 MB.
        </p>

        {paymentScreenshot && (
          <p>
            Selected:{" "}
            <strong>{paymentScreenshot.name}</strong>
          </p>
        )}
      </div>

      <input
        id="payment-screenshot"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handlePaymentScreenshotChange}
      />

      <label
        htmlFor="payment-screenshot"
        className="payment-upload-button"
      >
        {paymentScreenshot
          ? "Change Screenshot"
          : "Choose Screenshot"}
      </label>
    </div>

    {error && (
      <div
        className="request-form-error"
        role="alert"
      >
        {error}
      </div>
    )}

    <div className="review-actions">
      <button
        type="button"
        onClick={() => {
          setStep(3);
          setError("");
        }}
        disabled={isSubmitting}
      >
        <ArrowLeft size={16} />
        Back to Review
      </button>

      <button
        type="button"
        className="review-submit"
        onClick={handleCreateRequest}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Submitting Payment Proof..."
        ) : (
          <>
            Submit Payment Proof
            <CheckCircle2 size={16} />
          </>
        )}
      </button>
    </div>
  </section>
)}
      </div>
    </main>
  );
}

export default NewRequest;