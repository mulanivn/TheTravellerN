import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { packages, money, imagePath } from '../data/travelData'
import { useBooking } from '../context/BookingContext'
import { useHeroPortalAnimation } from '../hooks/useHeroPortalAnimation'

export default function BookingSummaryPage() {
  const navigate = useNavigate()
  const { booking, confirmBooking } = useBooking()
  const [confirmedCheck, setConfirmedCheck] = useState(false)
  const { heroRef, videoRef, contentRef } = useHeroPortalAnimation()

  const pkg = booking ? packages.find((item) => item.id === booking.packageId) : null

  const handleConfirmSubmit = (e) => {
    e.preventDefault()
    if (!confirmedCheck) return
    confirmBooking()
    navigate('/booking-confirmation')
  }

  return (
    <div className="booking-summary-page">
      {/* Hero with 3D WebGL Horizon Canvas */}
      <header ref={heroRef} className="page-hero page-hero--booking">
        <div ref={contentRef} className="container page-hero-content">
          <span className="eyebrow">ONE LAST REVIEW</span>
          <h1>Your booking summary</h1>
          <p>Check the selected package and traveller information before confirming.</p>
        </div>
      </header>

      <main id="main-content">
        <section className="section-padding section-muted">
          <div className="container">
            <div id="bookingSummary" className="summary-shell">
              {!booking || !pkg ? (
                <div className="text-center py-5">
                  <h2>No package selected yet</h2>
                  <p className="text-muted">Choose a package first so we can build your summary.</p>
                  <Link className="btn btn-brand" to="/package-details">
                    Select a package
                  </Link>
                </div>
              ) : (
                <div className="boarding-pass-card">
                  {/* Luxury Boarding Pass Header */}
                  <div className="boarding-pass-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src="/assets/images/logo.png"
                        alt="The Traveller"
                        height="36"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                      <div>
                        <div className="text-uppercase fw-bold small" style={{ letterSpacing: '0.12em' }}>
                          Official Itinerary Pass Preview
                        </div>
                        <small className="text-white-50">{pkg.destination} · Luxury Tour</small>
                      </div>
                    </div>
                    <span className="badge bg-white text-dark px-3 py-2 fw-bold">
                      RESERVATION PENDING
                    </span>
                  </div>

                  <div className="p-4 p-md-5">
                    <div className="summary-grid">
                      {/* Left Column: Selected Journey & Traveller Details */}
                      <div>
                        <span className="eyebrow text-brand">SELECTED JOURNEY</span>
                        <div className="summary-package mt-3">
                          <img
                            src={imagePath(pkg.image)}
                            alt={`${pkg.destination} landscape`}
                          />
                          <div>
                            <h2 className="h3 fw-bold">{pkg.name}</h2>
                            <p className="text-muted">
                              {pkg.destination} · {pkg.days} days
                            </p>
                            <p>{pkg.summary}</p>
                          </div>
                        </div>

                        <div className="boarding-pass-perforation my-4" />

                        <h3 className="h5 fw-bold">Traveller details</h3>
                    <dl className="summary-list">
                      <div>
                        <dt>Lead traveller</dt>
                        <dd>{booking.name}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{booking.email}</dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd>{booking.phone}</dd>
                      </div>
                      <div>
                        <dt>Start date</dt>
                        <dd>{booking.travelDate}</dd>
                      </div>
                      <div>
                        <dt>Travellers</dt>
                        <dd>{booking.travellers}</dd>
                      </div>
                      <div>
                        <dt>Room</dt>
                        <dd>{booking.roomType}</dd>
                      </div>
                      {booking.requests ? (
                        <div>
                          <dt>Requests</dt>
                          <dd>{booking.requests}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>

                  {/* Right Column: Pricing & Confirmation Form */}
                  <aside>
                    <div className="p-4 rounded-4 bg-light border">
                      <h3 className="h5 fw-bold">Price summary</h3>
                      <dl className="summary-list">
                        <div>
                          <dt>Per traveller</dt>
                          <dd>{money(booking.unitPrice)}</dd>
                        </div>
                        <div>
                          <dt>Travellers</dt>
                          <dd>× {booking.travellers}</dd>
                        </div>
                        <div>
                          <dt>Estimated total</dt>
                          <dd className="summary-total">{money(booking.total)}</dd>
                        </div>
                      </dl>
                      <p className="small text-muted mt-3 mb-0">
                        Illustrative package pricing only. Taxes, airfare and live availability can be integrated later.
                      </p>
                    </div>

                    <form
                      id="bookingConfirmForm"
                      className="mt-3"
                      onSubmit={handleConfirmSubmit}
                    >
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="confirmDetails"
                          required
                          checked={confirmedCheck}
                          onChange={(e) => setConfirmedCheck(e.target.checked)}
                        />
                        <label className="form-check-label small" htmlFor="confirmDetails">
                          I have reviewed the package and traveller details.
                        </label>
                      </div>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-brand btn-lg"
                          type="submit"
                          disabled={!confirmedCheck}
                        >
                          Confirm booking request
                        </button>
                        <Link
                          className="btn btn-outline-brand text-center"
                          to={`/package-details?package=${encodeURIComponent(pkg.id)}`}
                        >
                          Edit selection
                        </Link>
                      </div>
                    </form>
                  </aside>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        </section>
      </main>
    </div>
  )
}
