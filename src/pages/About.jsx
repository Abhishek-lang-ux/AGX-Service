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
import Abhishek from "../assets/Abhishek.jpeg";
import Akash from "../assets/Akash.PNG";
import logo from '../assets/logo.PNG'

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
                  <img src={logo} alt="logo" />
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
              <img src={logo} alt="logo" />
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

      {/* ================= FOUNDERS ================= */}
            <section className="home-founders-section">
              <div className="container">
                <div className="home-founders-heading">
                  <span className="home-section-label">THE PEOPLE BEHIND AGX</span>
                  <h2>
                    Meet Our <span>Founders.</span>
                  </h2>
                  <p>
                    AGX is built with a simple vision — making professional services
                    easier, more transparent and accessible through technology.
                  </p>
                </div>
      
                <div className="home-founders-grid">
                  <article className="home-founder-card">
                    <div className="home-founder-image-wrap">
                      <img
                        src={Abhishek}
                        alt="Portrait of Abhishek Awasthi, Founder of AGX"
                        className="home-founder-image"
                      />
                      <div className="home-founder-overlay"></div>
                      <div className="home-founder-info">
                        <span>FOUNDER</span>
                        <h3>Abhishek Awasthi</h3>
                        <strong>Founder &amp; Operations</strong>
                        <p>
                          Driving AGX with a focus on professional services,
                          technology and a better client experience.
                        </p>
                      </div>
                    </div>
                  </article>
      
                  <article className="home-founder-card">
                    <div className="home-founder-image-wrap">
                      <img
                        src={Akash}
                        alt="portrait for AGX Founder"
                        className="home-founder-image"
                      />
                      <div className="home-founder-overlay"></div>
                      <div className="home-founder-info">
                        <span>FOUNDER</span>
                        <h3>Akash Awasthi</h3>
                        <strong>Founder &amp; CEO</strong>
                        <p>
                          Helping build AGX through efficient operations,
                          client support and a commitment to dependable service.
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>
      
            {/* Founder section styles — kept here so no other CSS file needs to be changed */}
            <style>{`
              .home-founders-section {
                position: relative;
                padding: 100px 0;
                background: #f8fbff;
                overflow: hidden;
              }
      
              .home-founders-section::before {
                content: "";
                position: absolute;
                inset: 0;
                background-image:
                  linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px);
                background-size: 48px 48px;
                pointer-events: none;
              }
      
              .home-founders-heading {
                position: relative;
                z-index: 1;
                max-width: 720px;
                margin: 0 auto 48px;
                text-align: center;
              }
      
              .home-founders-heading h2 {
                margin: 10px 0 14px;
                font-size: clamp(32px, 4vw, 48px);
                line-height: 1.08;
                letter-spacing: -1.5px;
                color: #0b1220;
              }
      
              .home-founders-heading h2 span {
                color: #2563eb;
              }
      
              .home-founders-heading p {
                max-width: 650px;
                margin: 0 auto;
                color: #64748b;
                font-size: 16px;
                line-height: 1.7;
              }
      
              .home-founders-grid {
                position: relative;
                z-index: 1;
                max-width: 980px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 28px;
              }
      
              .home-founder-card {
                min-width: 0;
                border-radius: 20px;
                overflow: hidden;
                background: #dce6f0;
                box-shadow: 0 18px 45px rgba(15, 23, 42, 0.14);
                border: 1px solid rgba(148, 163, 184, 0.25);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
      
              .home-founder-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 25px 55px rgba(15, 23, 42, 0.2);
              }
      
              .home-founder-image-wrap {
                position: relative;
                height: 500px;
                overflow: hidden;
                background: linear-gradient(145deg, #cbd5e1, #eef2f7);
              }
      
              .home-founder-image {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
                object-position: center top;
                filter: saturate(0.9);
                transition: transform 0.45s ease;
              }
      
              .home-founder-card:hover .home-founder-image {
                transform: scale(1.035);
              }
      
              .home-founder-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(
                  to bottom,
                  rgba(4, 15, 31, 0) 35%,
                  rgba(4, 15, 31, 0.08) 48%,
                  rgba(3, 35, 67, 0.9) 100%
                );
              }
      
              .home-founder-info {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 28px 30px 30px;
                color: #fff;
              }
      
              .home-founder-info > span {
                display: inline-block;
                margin-bottom: 7px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
                color: rgba(255, 255, 255, 0.72);
              }
      
              .home-founder-info h3 {
                margin: 0 0 5px;
                font-size: 28px;
                line-height: 1.15;
                color: #fff;
              }
      
              .home-founder-info strong {
                display: block;
                font-size: 14px;
                color: #dbeafe;
              }
      
              .home-founder-info p {
                max-width: 430px;
                margin: 11px 0 0;
                color: rgba(255, 255, 255, 0.82);
                font-size: 13px;
                line-height: 1.55;
              }
      
              @media (max-width: 760px) {
                .home-founders-section {
                  padding: 72px 0;
                }
      
                .home-founders-heading {
                  margin-bottom: 34px;
                }
      
                .home-founders-grid {
                  grid-template-columns: 1fr;
                  max-width: 520px;
                }
      
                .home-founder-image-wrap {
                  height: 470px;
                }
              }
      
              @media (max-width: 480px) {
                .home-founder-image-wrap {
                  height: 430px;
                }
      
                .home-founder-info {
                  padding: 24px 22px 24px;
                }
      
                .home-founder-info h3 {
                  font-size: 24px;
                }
              }
            `}</style>


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
