import {
  ArrowRight,
  Award,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Handshake,
  LockKeyhole,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./about.css";

const values = [
  {
    icon: Target,
    title: "Clarity First",
    text: "We keep service requirements, request stages and next steps easy to understand.",
  },
  {
    icon: LockKeyhole,
    title: "Security Mindset",
    text: "Documents and customer information are handled through a structured digital workflow.",
  },
  {
    icon: Handshake,
    title: "Human Support",
    text: "Technology makes the process simpler while the AGX team remains part of the journey.",
  },
  {
    icon: Workflow,
    title: "Process Driven",
    text: "Every request follows an organized flow from submission and review to completion.",
  },
];

const capabilities = [
  "Tax & compliance assistance",
  "Document & application services",
  "Accounting & business support",
  "Websites & digital solutions",
];

function About() {
  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">

        <div className="about-hero-grid"></div>
        <div className="about-hero-glow"></div>

        <div className="container about-hero-inner">

          <div className="about-eyebrow">
            <span></span>
            ABOUT AGX
          </div>

          <h1>
            Professional Services,
            <br />
            <span>Connected Digitally.</span>
          </h1>

          <p>
            AGX is designed to make professional service requests
            simpler, more organized and easier to track — bringing
            customers and the service team together through one
            digital experience.
          </p>

          <div className="about-hero-actions">

            <Link to="/services" className="about-primary-btn">
              Explore Services
              <ArrowRight size={16} />
            </Link>

            <Link to="/how-it-works" className="about-secondary-btn">
              See How It Works
            </Link>

          </div>

          <div className="about-hero-stats">

            <div>
              <strong>01</strong>
              <span>Digital Service Platform</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Online Request Access</span>
            </div>

            <div>
              <strong>01</strong>
              <span>Connected Experience</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="about-intro-section">

        <div className="container about-intro-grid">

          <div className="about-intro-heading">

            <span className="about-section-label">
              OUR APPROACH
            </span>

            <h2>
              Making complicated
              <br />
              <span>processes feel simpler.</span>
            </h2>

          </div>

          <div className="about-intro-copy">

            <p>
              Professional services often involve forms, documents,
              corrections, follow-ups and multiple stages. AGX brings
              these activities into a more structured digital workflow
              so customers can start their request online and stay
              informed as it moves forward.
            </p>

            <p>
              The platform is built around a simple principle:
              <strong> you provide the requirements, AGX handles the
              applicable service process.</strong>
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT AGX DOES
      ===================================================== */}

      <section className="about-capabilities-section">

        <div className="container">

          <div className="about-section-heading">

            <span className="about-section-label">
              WHAT AGX DOES
            </span>

            <h2>
              One platform for
              <br />
              <span>multiple service needs.</span>
            </h2>

            <p>
              AGX brings different professional and digital service
              categories together in one customer-friendly experience.
            </p>

          </div>


          <div className="about-capabilities">

            {capabilities.map((item, index) => (
              <div className="about-capability" key={item}>

                <span className="about-capability-number">
                  0{index + 1}
                </span>

                <div className="about-capability-icon">
                  {index === 0 && <FileCheck2 size={21} />}
                  {index === 1 && <Award size={21} />}
                  {index === 2 && <UsersRound size={21} />}
                  {index === 3 && <Globe2 size={21} />}
                </div>

                <h3>{item}</h3>

                <CheckCircle2 size={16} className="about-capability-check" />

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          DIGITAL EXPERIENCE
      ===================================================== */}

      <section className="about-experience-section">

        <div className="container">

          <div className="about-experience">

            <div className="about-experience-copy">

              <span className="about-section-label light">
                THE AGX EXPERIENCE
              </span>

              <h2>
                Less chasing.
                <br />
                <span>More visibility.</span>
              </h2>

              <p>
                AGX is designed around the complete service journey.
                Customers can see their request, understand its stage,
                respond to corrections and receive the final outcome
                without relying entirely on scattered conversations.
              </p>

              <div className="about-experience-points">

                <div>
                  <CheckCircle2 size={16} />
                  <span>Structured service requests</span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>Organized document workflow</span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>Request status visibility</span>
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  <span>Centralized customer history</span>
                </div>

              </div>

            </div>


            {/* Dashboard visual */}

            <div className="about-dashboard">

              <div className="about-dashboard-top">

                <div className="about-dashboard-brand">
                  <span>AG</span>X
                </div>

                <div>
                  <small>AGX SERVICE PORTAL</small>
                  <strong>My Requests</strong>
                </div>

                <Sparkles size={17} />

              </div>


              <div className="about-dashboard-summary">

                <div>
                  <small>ACTIVE REQUESTS</small>
                  <strong>08</strong>
                </div>

                <div>
                  <small>COMPLETED</small>
                  <strong>16</strong>
                </div>

                <div>
                  <small>STATUS</small>
                  <strong>Live</strong>
                </div>

              </div>


              <div className="about-request">

                <div className="about-request-icon">
                  GST
                </div>

                <div className="about-request-info">
                  <strong>GST Filing</strong>
                  <small>AGX001248</small>
                </div>

                <span>Processing</span>

              </div>


              <div className="about-request-progress">

                <div className="about-progress-labels">
                  <span>Submitted</span>
                  <span>Review</span>
                  <span>Processing</span>
                  <span>Completed</span>
                </div>

                <div className="about-progress-track">
                  <span></span>
                  <span></span>
                  <span className="active"></span>
                  <span></span>
                </div>

              </div>


              <div className="about-request about-request-complete">

                <div className="about-request-icon">
                  PAN
                </div>

                <div className="about-request-info">
                  <strong>PAN Card</strong>
                  <small>AGX001247</small>
                </div>

                <span>Completed</span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values-section">

        <div className="container">

          <div className="about-section-heading">

            <span className="about-section-label">
              OUR PRINCIPLES
            </span>

            <h2>
              Built around the way
              <br />
              <span>people actually need service.</span>
            </h2>

          </div>


          <div className="about-values-grid">

            {values.map((value) => {

              const Icon = value.icon;

              return (
                <article className="about-value-card" key={value.title}>

                  <div className="about-value-icon">
                    <Icon size={21} />
                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.text}</p>

                </article>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section className="about-mission-section">

        <div className="container">

          <div className="about-mission">

            <div className="about-mission-mark">
              <span>AG</span>X
            </div>

            <div className="about-mission-copy">

              <span className="about-section-label light">
                OUR MISSION
              </span>

              <h2>
                Make professional services
                <br />
                <span>easier to access.</span>
              </h2>

              <p>
                AGX aims to create a dependable digital layer around
                professional services — making it easier for customers
                to submit requirements, communicate with the service
                team, follow progress and access completed outcomes.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="about-cta-section">

        <div className="container">

          <div className="about-cta">

            <div>

              <span>START YOUR AGX JOURNEY</span>

              <h2>
                Find the service
                <br />
                you need today.
              </h2>

            </div>

            <Link to="/services" className="about-cta-btn">
              Explore Services
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;
