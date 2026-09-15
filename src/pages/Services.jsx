import { useEffect, useMemo, useState } from "react";
import { getServices } from "../lib/api.js";
import {
  Search,
  ArrowUpRight,
  ArrowRight,
  CreditCard,
  ReceiptText,
  Calculator,
  WalletCards,
  BookOpen,
  Code2,
  Building2,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  ShoppingCart,
  Smartphone,
  FileText,
  BriefcaseBusiness,
  BadgeIndianRupee,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const fallbackServices = [
  {
    id: "website-development",
    title: "Website Development",
    category: "Digital",
    description:
      "Professional, responsive and modern websites for businesses, professionals, startups and personal brands.",
    icon: Code2,
    iconClass: "pink",
    popular: true,
    features: [
      "Business website development",
      "Responsive mobile design",
      "Contact forms and integrations",
    ],
  },
  {
    id: "pf-withdrawal",
    title: "PF Withdrawal Assistance",
    category: "Documents",
    description:
      "Assistance with PF withdrawal, claim submission and applicable EPFO-related processes.",
    icon: WalletCards,
    iconClass: "orange",
    popular: true,
    features: [
      "PF withdrawal assistance",
      "Claim-related support",
      "EPFO process guidance",
    ],
  },
  {
    id: "gst-registration",
    title: "GST Registration",
    category: "Tax & Compliance",
    description:
      "Assistance with GST registration and the required documentation for businesses.",
    icon: ReceiptText,
    iconClass: "green",
    popular: true,
    features: [
      "GST registration assistance",
      "Document preparation",
      "Application support",
    ],
  },
  {
    id: "gst-return",
    title: "GST Return Filing",
    category: "Tax & Compliance",
    description:
      "GST return filing assistance and compliance support for eligible businesses.",
    icon: ReceiptText,
    iconClass: "green",
    features: [
      "GST return filing",
      "Return data review",
      "Compliance assistance",
    ],
  },
  {
    id: "income-tax",
    title: "Income Tax / ITR Filing",
    category: "Tax & Compliance",
    description:
      "Income tax return filing assistance for individuals, professionals and businesses.",
    icon: Calculator,
    iconClass: "purple",
    popular: true,
    features: [
      "ITR filing assistance",
      "Tax document review",
      "Income tax support",
    ],
  },
  {
    id: "pan-card",
    title: "PAN Card Services",
    category: "Documents",
    description:
      "Assistance with new PAN applications, corrections, reprint and related services.",
    icon: CreditCard,
    iconClass: "blue",
    features: [
      "New PAN application",
      "PAN correction",
      "PAN reprint assistance",
    ],
  },
  {
    id: "accounting",
    title: "Accounting Services",
    category: "Business",
    description:
      "Bookkeeping, accounting assistance and financial reporting support for businesses.",
    icon: BookOpen,
    iconClass: "cyan",
    features: [
      "Bookkeeping",
      "Business accounting",
      "Financial reports",
    ],
  },
  {
    id: "msme-udyam",
    title: "MSME / Udyam Registration",
    category: "Business",
    description:
      "Assistance with MSME / Udyam registration and the applicable documentation process.",
    icon: BriefcaseBusiness,
    iconClass: "indigo",
    features: [
      "Udyam registration assistance",
      "Document guidance",
      "Application support",
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce Website",
    category: "Digital",
    description:
      "Online store development with product listings, customer flows and payment integrations.",
    icon: ShoppingCart,
    iconClass: "pink",
    popular: true,
    features: [
      "Online store development",
      "Product management",
      "Payment integration",
    ],
  },
];

const categories = [
  "All Services",
  "Tax & Compliance",
  "Documents",
  "Business",
  "Digital",
];

function normalizeCategory(category) {
  if (!category) return "Documents";

  if (
    category === "GST" ||
    category === "Income Tax" ||
    category === "Compliance" ||
    category === "TDS"
  ) {
    return "Tax & Compliance";
  }

  if (
    category === "Accounting" ||
    category === "Business"
  ) {
    return "Business";
  }

  if (
    category === "Digital" ||
    category === "Software" ||
    category === "Website"
  ) {
    return "Digital";
  }

  if (category === "Documents") {
    return "Documents";
  }

  return category;
}

function getServiceIcon(service) {
  const text = `${service.name || ""} ${
    service.category || ""
  }`.toLowerCase();

  if (text.includes("website") || text.includes("software")) {
    return Code2;
  }

  if (text.includes("pf") || text.includes("provident")) {
    return WalletCards;
  }

  if (text.includes("gst")) {
    return ReceiptText;
  }

  if (
    text.includes("income tax") ||
    text.includes("itr") ||
    text.includes("tds")
  ) {
    return Calculator;
  }

  if (text.includes("pan")) {
    return CreditCard;
  }

  if (text.includes("account")) {
    return BookOpen;
  }

  if (
    text.includes("business") ||
    text.includes("registration") ||
    text.includes("udyam") ||
    text.includes("msme")
  ) {
    return Building2;
  }

  if (
    text.includes("e-commerce") ||
    text.includes("ecommerce") ||
    text.includes("online store")
  ) {
    return ShoppingCart;
  }

  if (text.includes("mobile") || text.includes("app")) {
    return Smartphone;
  }

  return FileCheck2;
}

function getIconClass(category) {
  switch (category) {
    case "Tax & Compliance":
      return "green";

    case "Documents":
      return "orange";

    case "Business":
      return "indigo";

    case "Digital":
      return "pink";

    default:
      return "blue";
  }
}

function Services() {
  const [apiServices, setApiServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    let active = true;

    getServices()
      .then((data) => {
        if (!active) return;

        setApiServices(
          Array.isArray(data?.services) ? data.services : [],
        );
      })
      .catch((error) => {
        if (!active) return;

        setServicesError(
          error?.message || "Unable to load services",
        );
      })
      .finally(() => {
        if (active) {
          setServicesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const [activeCategory, setActiveCategory] =
    useState("All Services");

  const [search, setSearch] = useState("");

  const [selectedService, setSelectedService] =
    useState(null);

  const services = useMemo(() => {
    if (!apiServices.length) {
      return fallbackServices;
    }

    return apiServices.map((service) => {
      const category = normalizeCategory(service.category);

      return {
        id: service.slug || service.id || service.name,
        title: service.name,
        category,
        description:
          service.description ||
          service.shortDescription ||
          "AGX professional service assistance.",
        icon: getServiceIcon(service),
        iconClass: getIconClass(category),
        popular: Number(service.displayOrder) <= 2,
        features: [
          "Professional assistance",
          "Document guidance",
          "Application support",
        ],
      };
    });
  }, [apiServices]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch =
        activeCategory === "All Services" ||
        service.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const searchMatch =
        !searchText ||
        service.title
          .toLowerCase()
          .includes(searchText) ||
        service.description
          .toLowerCase()
          .includes(searchText) ||
        service.category
          .toLowerCase()
          .includes(searchText);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search, services]);

  return (
    <main className="services-page">
      {servicesLoading && (
        <div className="api-status-banner">
          Loading live services…
        </div>
      )}

      {servicesError && (
        <div
          className="api-error-banner"
          role="alert"
        >
          {servicesError}
        </div>
      )}

      {!servicesLoading &&
        !servicesError &&
        apiServices.length > 0 && (
          <div className="api-status-banner">
            Live services connected: {apiServices.length}
          </div>
        )}

      {/* HERO */}

      <section className="services-hero">
        <div className="services-hero-grid"></div>

        <div className="services-hero-glow"></div>

        <div className="container services-hero-content">
          <div className="services-eyebrow">
            <span></span>
            AGX DIGITAL SERVICE PLATFORM
          </div>

          <h1>
            Professional Services,
            <br />
            <span>Handled Simply.</span>
          </h1>

          <p>
            Choose the service you need, submit your
            information and documents securely, and let
            the AGX team handle the applicable process.
          </p>

          {/* SEARCH */}

          <div className="service-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search Website, PF, GST, ITR, PAN..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="search-clear"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* TRUST */}

          <div className="services-hero-trust">
            <div>
              <ShieldCheck size={14} />
              Secure document handling
            </div>

            <div>
              <CheckCircle2 size={14} />
              Transparent request tracking
            </div>

            <div>
              <CheckCircle2 size={14} />
              Simple online process
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES LIST */}

      <section className="services-list-section">
        <div className="container">
          {/* CATEGORY NAVIGATION */}

          <div className="services-toolbar">
            <div className="service-filter">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS */}

          <div className="service-result-row">
            <div>
              Showing{" "}
              <strong>
                {filteredServices.length}
              </strong>{" "}
              {filteredServices.length === 1
                ? "service"
                : "services"}
            </div>

            <span>
              Select a service to view what AGX can
              assist with
            </span>
          </div>

          {/* CARDS */}

          {filteredServices.length > 0 ? (
            <div className="services-page-grid">
              {filteredServices.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    className="large-service-card"
                    key={service.id}
                  >
                    <div className="large-card-top">
                      <div
                        className={`large-service-icon ${service.iconClass}`}
                      >
                        <Icon size={23} />
                      </div>

                      {service.popular && (
                        <span className="popular-badge">
                          Popular
                        </span>
                      )}

                      <button
                        type="button"
                        className="card-arrow"
                        onClick={() =>
                          setSelectedService(service)
                        }
                        aria-label={`View ${service.title}`}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>

                    <div className="service-card-category">
                      {service.category}
                    </div>

                    <h2>{service.title}</h2>

                    <p>{service.description}</p>

                    <div className="service-features">
                      {service.features.map(
                        (feature) => (
                          <div
                            className="feature-line"
                            key={feature}
                          >
                            <span>✓</span>
                            {feature}
                          </div>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      className="service-start-btn"
                      onClick={() =>
                        setSelectedService(service)
                      }
                    >
                      View Service
                      <ArrowRight size={16} />
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="no-services">
              <Search size={34} />

              <h3>No services found</h3>

              <p>
                Try another keyword or select a
                different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Services");
                }}
              >
                View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* PROCESS CTA */}

      <section className="services-process-section">
        <div className="container">
          <div className="services-process-box">
            <div className="services-process-content">
              <span className="section-label light">
                SIMPLE SERVICE JOURNEY
              </span>

              <h2>
                You submit.
                <br />
                <span>
                  AGX handles the journey.
                </span>
              </h2>

              <p>
                Choose your service, provide the
                required information and documents,
                and track your request through the AGX
                service experience.
              </p>

              <Link
                to="/how-it-works"
                className="process-link"
              >
                See How It Works
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mini-process">
              <div className="mini-process-item">
                <strong>01</strong>
                <span>Select Service</span>
                <small>Choose what you need</small>
              </div>

              <div className="mini-process-item">
                <strong>02</strong>
                <span>Submit Documents</span>
                <small>Provide your details</small>
              </div>

              <div className="mini-process-item">
                <strong>03</strong>
                <span>AGX Processes</span>
                <small>Our team handles it</small>
              </div>

              <div className="mini-process-item">
                <strong>04</strong>
                <span>Get Result</span>
                <small>Track and receive updates</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE MODAL */}

      {selectedService && (
        <div
          className="service-modal-overlay"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="service-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedService(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div
              className={`modal-icon ${selectedService.iconClass}`}
            >
              {(() => {
                const Icon = selectedService.icon;

                return <Icon size={26} />;
              })()}
            </div>

            <span className="modal-category">
              {selectedService.category}
            </span>

            <h2>{selectedService.title}</h2>

            <p>{selectedService.description}</p>

            <div className="modal-features">
              {selectedService.features.map(
                (feature) => (
                  <div key={feature}>
                    <span>✓</span>
                    {feature}
                  </div>
                ),
              )}
            </div>

            <Link
              to="/register"
              className="modal-start-btn"
              onClick={() =>
                setSelectedService(null)
              }
            >
              Get Started With AGX
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default Services;