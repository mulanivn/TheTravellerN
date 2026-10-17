import React, { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  // Monitor scroll for fixed navbar .scrolled state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile navigation on route change
  useEffect(() => {
    setNavOpen(false)
  }, [location])

  const handlePlanMyTrip = (e) => {
    if (location.pathname === '/') {
      const el = document.getElementById('custom')
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Top Utility Bar */}
      <div className="topbar">
        <div className="container d-flex justify-content-between flex-wrap gap-2">
          <span>
            <span aria-hidden="true" className="me-1">◉</span> Travel assistance: +91 90000 00000
          </span>
          <span>
            <span aria-hidden="true" className="me-1">✉</span> hello@thetraveller
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top main-nav ${
          scrolled ? 'scrolled' : ''
        }`}
        id="mainNav"
        aria-label="Primary navigation"
      >
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <img
              src="/assets/images/logo.png"
              alt="The Traveller Logo"
              width="90"
              height="70"
              className="me-2"
              style={{ objectFit: 'contain' }}
            />
            <span>The Traveller</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navMenu"
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
            onClick={() => setNavOpen(!navOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navMenu">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/"
                  end
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/packages"
                >
                  Tour Packages
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/themes"
                >
                  Travel Themes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/package-details"
                >
                  Package Details
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/booking-summary"
                >
                  Booking Summary
                </NavLink>
              </li>
              <li className="nav-item ms-lg-2">
                <Link
                  className="btn navbtn-brand btn-sm px-3"
                  to="/#custom"
                  onClick={handlePlanMyTrip}
                >
                  Plan My Trip
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}
