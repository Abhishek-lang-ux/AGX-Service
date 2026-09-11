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
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: "pan",
    title: "PAN Card Services",
    category: "Documents",
    description:
      "Apply for a new PAN, correction, reprint and other PAN-related assistance.",
    icon: CreditCard,
    iconClass: "blue",
    popular: true,
    features: [
      "New PAN application",
      "PAN correction",
      "PAN reprint assistance",
    ],
  },
  {
    id: "gst",
    title: "GST Services",
    category: "Tax & Compliance",
    description:
      "GST registration, return filing, amendments and other GST-related assistance.",
    icon: ReceiptText,
    iconClass: "green",
    popular: true,
    features: [
      "GST registration",
      "GST return filing",
      "GST amendment assistance",
    ],
  },
  {
    id: "income-tax",
    title: "Income Tax",
    category: "Tax & Compliance",
    description:
      "Income tax return filing assistance and other tax-related professional services.",
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
    id: "pf",
    title: "PF Withdrawal",
    category: "Documents",
    description:
      "Assistance with PF withdrawal and applicable EPFO-related processes.",
    icon: WalletCards,
    iconClass: "orange",
    features: [
      "PF withdrawal assistance",
      "Claim-related support",
      "EPFO process assistance",
    ],
  },
  {
    id: "accounting",
    title: "Accounting Services",
    category: "Business",
    description:
      "Bookkeeping, accounting assistance and financial support for businesses.",
    icon: BookOpen,
    iconClass: "cyan",
    features: [
      "Bookkeeping",
      "Business accounting",
      "Financial reports",
    ],
  },
  {
    id: "software",
    title: "Software Services",
    category: "Digital",
    description:
      "Professional websites, web applications and custom software solutions.",
    icon: Code2,
    iconClass: "pink",
    popular: true,
    features: [
      "Business websites",
      "E-commerce development",
      "Custom web applications",
    ],
  },
  {
    id: "business",
    title: "Business Registration",
    category: "Business",
    description:
      "Assistance with applicable business registration and documentation requirements.",
    icon: Building2,
    iconClass: "indigo",
    features: [
      "Business registration assistance",
      "Documentation support",
      "Process guidance",
    ],
  },
  {
    id: "documentation",
    title: "Documentation Services",
    category: "Documents",
    description:
      "Professional assistance for document preparation, submission and related services.",
    icon: FileCheck2,
    iconClass: "teal",
    features: [
      "Document preparation",
      "Document review",
      "Submission assistance",
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

function Services() {
  const [apiServices, setApiServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    let active = true;
    getServices()
      .then((data) => active && setApiServices(data.services || []))
      .catch((error) => active && setServicesError(error.message || "Unable to load services"))
      .finally(() => active && setServicesLoading(false));
    return () => { active = false; };
  }, []);

  const [activeCategory, setActiveCategory] = useState("All Services");
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch =
        activeCategory === "All Services" ||
        service.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const searchMatch =
        !searchText ||
        service.title.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <main className="services-page">
      {servicesLoading && <div className="api-status-banner">Loading live services…</div>}
      {servicesError && <div className="api-error-banner" role="alert">{servicesError}</div>}
      {!servicesLoading && !servicesError && apiServices.length > 0 && (
        <div className="api-status-banner">Live services connected: {apiServices.length}</div>
      )}


      {/* =====================================================
          HERO
      ===================================================== */}

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
            Choose the service you need, submit your information
            and documents securely, and let the AGX team handle
            the applicable process.
          </p>


          {/* Search */}

          <div className="service-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search PAN, GST, Income Tax, Accounting..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button type="button"
                onClick={() => setSearch("")}
                className="search-clear"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

          </div>


          {/* Hero mini trust */}

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


      {/* =====================================================
          SERVICES LIST
      ===================================================== */}

      <section className="services-list-section">

        <div className="container">

          {/* Category navigation */}

          <div className="services-toolbar">

            <div className="service-filter">

              {categories.map((category) => (
                <button type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "filter-btn active"
                      : "filter-btn"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}

            </div>

          </div>


          {/* Results */}

          <div className="service-result-row">

            <div>
              Showing{" "}
              <strong>{filteredServices.length}</strong>{" "}
              {filteredServices.length === 1 ? "service" : "services"}
            </div>

            <span>
              Select a service to view what AGX can assist with
            </span>

          </div>


          {/* Cards */}

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

                      <button type="button"
                        className="card-arrow"
                        onClick={() => setSelectedService(service)}
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

                      {service.features.map((feature) => (
                        <div
                          className="feature-line"
                          key={feature}
                        >
                          <span>✓</span>
                          {feature}
                        </div>
                      ))}

                    </div>


                    <button type="button"
                      className="service-start-btn"
                      onClick={() => setSelectedService(service)}
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
                Try another keyword or select a different category.
              </p>

              <button type="button"
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


      {/* =====================================================
          PROCESS CTA
      ===================================================== */}

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
                <span>AGX handles the journey.</span>
              </h2>

              <p>
                Choose your service, provide the required information
                and documents, and track your request through the AGX
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


      {/* =====================================================
          SERVICE PREVIEW MODAL
      ===================================================== */}

      {selectedService && (

        <div
          className="service-modal-overlay"
          onClick={() => setSelectedService(null)}
        >

          <div
            className="service-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button type="button"
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

              {selectedService.features.map((feature) => (
                <div key={feature}>
                  <span>✓</span>
                  {feature}
                </div>
              ))}

            </div>


            <Link
              to="/register"
              className="modal-start-btn"
              onClick={() => setSelectedService(null)}
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