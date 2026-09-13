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
  createPaymentOrder,
  createServiceRequest,
  getServices,
  uploadRequestDocuments,
  verifyPayment,
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
  { id: 1, slug: "gst-registration", title: "GST Registration", category: "business", description: "Complete GST registration assistance.", price: "₹999", amount: 999, popular: true },
  { id: 2, slug: "income-tax-return", title: "Income Tax Return", category: "tax", description: "Professional ITR preparation and filing.", price: "₹799", amount: 799, popular: true },
  { id: 3, slug: "accounting-bookkeeping", title: "Accounting & Bookkeeping", category: "accounting", description: "Monthly accounting and bookkeeping support.", price: "₹1,499", amount: 1499, popular: false },
  { id: 4, slug: "tax-consultation", title: "Tax Consultation", category: "consultation", description: "Personalized tax planning and consultation.", price: "₹499", amount: 499, popular: false },
  { id: 5, slug: "business-registration", title: "Business Registration", category: "business", description: "Assistance with business registration.", price: "₹1,999", amount: 1999, popular: false },
  { id: 6, slug: "tds-compliance", title: "TDS & Compliance", category: "compliance", description: "TDS return and compliance assistance.", price: "₹999", amount: 999, popular: false },
];

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
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        // Send both IDs for backward compatibility. Backend resolves by slug
        // first so different database auto-increment IDs cannot break requests.
        serviceId: Number(selectedService.id),
        serviceSlug: selectedService.slug,
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
          await uploadRequestDocuments(createdRequest.id, selectedFiles);
        } catch (uploadError) {
          console.error("Request created but document upload failed:", uploadError);
        }
      }

      // Create the Razorpay order on the server. The amount is always taken
      // from the database-backed service/request, never from the browser.
      const orderResponse = await createPaymentOrder(createdRequest.id);

      if (!orderResponse?.success || !orderResponse?.order?.id) {
        throw new Error(orderResponse?.message || "Unable to start secure payment.");
      }

      await openRazorpayCheckout({
        keyId: orderResponse.keyId,
        order: orderResponse.order,
        request: orderResponse.request,
      });
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

  const openRazorpayCheckout = async ({ keyId, order, request }) => {
    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-agx-razorpay="true"]');
        if (existing) {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.dataset.agxRazorpay = "true";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Razorpay Checkout could not be loaded. Please check your internet connection."));
        document.body.appendChild(script);
      });
    }

    if (!window.Razorpay) {
      throw new Error("Razorpay Checkout is unavailable. Please try again.");
    }

    await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "AGX Software Services",
        description: `${request.serviceName} · ${request.requestNumber}`,
        order_id: order.id,
        prefill: {
          email: "",
        },
        theme: { color: "#0f766e" },
        modal: {
          ondismiss: () => {
            setError("Payment window closed. Your request is saved and payment is still pending.");
            resolve();
          },
        },
        handler: async (paymentResponse) => {
          try {
            await verifyPayment({
              requestId: request.id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            resolve();
            navigate("/payments");
          } catch (verificationError) {
            reject(verificationError);
          }
        },
      });

      checkout.on("payment.failed", (response) => {
        reject(new Error(response?.error?.description || "Razorpay payment failed. Please try again."));
      });

      checkout.open();
    });
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