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
import { useMemo, useRef, useState } from "react";

import {
  createServiceRequest,
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

const services = [
  {
    id: 1,
    title: "GST Registration",
    category: "business",
    description:
      "Complete assistance for GST registration and application processing.",
    price: "₹1,499",
    popular: true,
  },
  {
    id: 2,
    title: "Income Tax Filing",
    category: "tax",
    description:
      "Professional assistance for preparing and filing your income tax return.",
    price: "₹799",
    popular: true,
  },
  {
    id: 3,
    title: "PAN Card Assistance",
    category: "government",
    description:
      "PAN application assistance with document verification and submission.",
    price: "₹299",
    popular: false,
  },
  {
    id: 4,
    title: "PF Withdrawal Assistance",
    category: "government",
    description:
      "Assistance with EPFO/PF withdrawal process and required documents.",
    price: "₹499",
    popular: true,
  },
  {
    id: 5,
    title: "Business Registration",
    category: "business",
    description:
      "Guidance and assistance for registering your business.",
    price: "₹2,499",
    popular: false,
  },
  {
    id: 6,
    title: "Accounting Support",
    category: "accounting",
    description:
      "Bookkeeping and accounting assistance for your business requirements.",
    price: "₹1,999",
    popular: false,
  },
  {
    id: 7,
    title: "Website Development",
    category: "digital",
    description:
      "Professional business website design and development assistance.",
    price: "₹4,999",
    popular: false,
  },
  {
    id: 8,
    title: "Documentation Services",
    category: "business",
    description:
      "Organised documentation and application support for selected requirements.",
    price: "₹599",
    popular: false,
  },
];

function NewRequest() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);

  // Step 2 form state
  const [requirement, setRequirement] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [reference, setReference] = useState("");
  const [consent, setConsent] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category;

      const matchesSearch = `${service.title} ${service.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const selectService = (service) => {
    setSelectedService(service);
    setStep(2);

    // Reset form for a fresh request
    setRequirement("");
    setContactMethod("whatsapp");
    setReference("");
    setConsent(false);
    setSelectedFiles([]);
    setError("");
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
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

    setError("");
    setIsSubmitting(true);

    try {
      // Payload exactly according to request.controller.js
      const payload = {
        serviceId: Number(selectedService.id),
        title: selectedService.title,
        description: requirement.trim(),
        priority: "normal",
      };

      const response = await createServiceRequest(payload);

      if (!response?.success || !response?.request) {
        throw new Error(
          response?.message || "Unable to create service request."
        );
      }

      const createdRequest = response.request;

      // Upload documents after request creation, if any were selected.
      if (selectedFiles.length > 0 && createdRequest.id) {
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

      // Go to My Requests after successful creation.
      navigate("/myrequests");
    } catch (requestError) {
      console.error("Create request error:", requestError);

      setError(
        requestError?.message ||
          "Something went wrong while creating your request."
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
                          categories.find(
                            (item) =>
                              item.id === service.category
                          )?.label
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

              {!filteredServices.length && (
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

                  <div className="requirements-upload">
                    <div>
                      <div className="requirements-upload-icon">
                        <FileText size={19} />
                      </div>

                      <div>
                        <strong>
                          Have supporting documents?
                        </strong>

                        <p>
                          You can upload documents now or
                          after creating the request.
                        </p>

                        {selectedFiles.length > 0 && (
                          <p>
                            {selectedFiles.length} file
                            {selectedFiles.length > 1
                              ? "s"
                              : ""}{" "}
                            selected
                          </p>
                        )}
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      hidden
                      onChange={handleFileChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      Choose Files
                    </button>
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
                onClick={handleCreateRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Creating Request..."
                ) : (
                  <>
                    Create Request
                    <ArrowRight size={16} />
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