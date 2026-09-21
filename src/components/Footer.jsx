import { ArrowUpRight, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import "./footer.css";
import logo from '../assets/logo.PNG'

function Footer() {
  return (
    <footer className="agx-footer">
      <div className="container agx-footer-main">
        <div className="agx-footer-brand">
          <Link to="/" className="agx-footer-logo">
            <img src={logo} alt="logo" style={{width: '127px', height: '48px'}} /><small>Services</small>
          </Link>
          <p>A structured digital experience for professional service requests, documents, communication and tracking.</p>
          <div className="agx-footer-security">
            <ShieldCheck size={16} />
            <span>Secure digital service experience</span>
          </div>
        </div>

        <div className="agx-footer-column">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/about">About AGX</Link>
        </div>

        <div className="agx-footer-column">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Create Account</Link>
          <a href="/retailer/register">Become a Retailer</a>
          <a href="/distributor/register">Become a Distributor</a>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="agx-footer-column agx-footer-contact">
          <h4>Connect</h4>
          <a href="tel:+919984710087"><Phone size={14} /><span>+91 9984710087</span></a>
          <a href="tel:+918601295183"><Phone size={14} /><span>+91 8601295183</span></a>
          <a href="mailto:contact@agxservices.in"><Mail size={14} /><span>contact@agxservices.in</span></a>
          <a href="https://wa.me/9984710087" target="_blank" rel="noreferrer"><MessageCircle size={14} /><span>WhatsApp Assistance</span></a>
        </div>
      </div>

      <div className="container agx-footer-bottom">
        <span>© {new Date().getFullYear()} AGX Services. All rights reserved.</span>
        <div>
          <span>Professional Digital Assistance</span>
          <Link to="/contact">Get in touch <ArrowUpRight size={13} /></Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
