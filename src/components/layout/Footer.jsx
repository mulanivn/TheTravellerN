import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()

  const scrollToAnchor = (anchorId) => (e) => {
    if (location.pathname === '/') {
      const el = document.getElementById(anchorId)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-5">
            <Link className="navbar-brand text-white mb-3" to="/">
              <img
                src="/assets/images/logo.png"
                alt="The Traveller Logo"
                width="80"
                height="60"
                className="me-2"
                style={{ objectFit: 'contain' }}
              />
              <span>The Traveller</span>
            </Link>
            <p className="mt-3">
              Curated journeys for curious people. Thoughtful packages, flexible planning, and a clear booking journey across every screen.
            </p>
          </div>

          <div className="col-6 col-lg-2">
            <h2 className="footer-heading">Discover</h2>
            <Link to="/packages">Packages</Link>
            <Link to="/#destinations" onClick={scrollToAnchor('destinations')}>
              Destinations
            </Link>
            <Link to="/themes">Themes</Link>
          </div>

          <div className="col-6 col-lg-2">
            <h2 className="footer-heading">Plan</h2>
            <Link to="/package-details">Select a package</Link>
            <Link to="/booking-summary">Booking summary</Link>
            <Link to="/#custom" onClick={scrollToAnchor('custom')}>
              Custom trip
            </Link>
          </div>

          <div className="col-lg-3">
            <h2 className="footer-heading">Connect</h2>
            <p className="small">
              hello@thetraveller<br />
              +91 90000 00000
            </p>
            <div className="socials" aria-label="Social links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                ◎
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                f
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                ▶
              </a>
            </div>
          </div>
        </div>

        <hr />

        <div className="d-flex justify-content-between flex-wrap gap-2 small">
          <span>© {currentYear} The Traveller. Official website.</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </div>
    </footer>
  )
}
