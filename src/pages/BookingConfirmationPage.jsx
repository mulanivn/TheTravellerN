import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { useHeroPortalAnimation } from '../hooks/useHeroPortalAnimation'
import CelebrationSparkles3D from '../components/three/CelebrationSparkles3D'

export default function BookingConfirmationPage() {
  const { confirmation } = useBooking()
  const { heroRef, videoRef, contentRef } = useHeroPortalAnimation()
  const [flipped, setFlipped] = useState(false)

  // Trigger 180-degree 3D card flip entrance
  useEffect(() => {
    if (confirmation) {
      const timer = setTimeout(() => {
        setFlipped(true)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [confirmation])

  return (
    <div className="booking-confirmation-page">
      {/* Hero with 3D WebGL Horizon Canvas */}
      <header ref={heroRef} className="page-hero page-hero--confirmation">
        <div ref={contentRef} className="container page-hero-content">
          <span className="eyebrow">BOOKING RECEIVED</span>
          <h1>Adventure is officially on the horizon.</h1>
          <p>Your selection has been saved and is ready for the next fulfilment step.</p>
        </div>
      </header>

      <main id="main-content">
        <section className="section-padding position-relative overflow-hidden">
          {/* Celebratory 3D Particle Backdrop */}
          {confirmation && <CelebrationSparkles3D />}

          <div className="container position-relative" style={{ zIndex: 1 }}>
            {!confirmation ? (
              <div id="confirmationPanel" className="confirmation-card text-center mx-auto">
                <div
                  className="success-mark"
                  aria-hidden="true"
                  style={{ background: '#fef3c7', color: '#b45309' }}
                >
                  i
                </div>
                <h2>No confirmed booking yet</h2>
                <p className="text-muted mb-4">
                  Complete the package selection and booking summary first.
                </p>
                <Link className="btn btn-brand" to="/package-details">
                  Start booking
                </Link>
              </div>
            ) : (
              <div className="boarding-pass-flip-container">
                <div className={`boarding-pass-flipper ${flipped ? 'flipped' : ''}`}>
                  {/* Front Side: Pre-Flip Verification Envelope */}
                  <div className="boarding-pass-front">
                    <div className="boarding-pass-card text-center p-5">
                      <div className="spinner-border text-info mb-4" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h3 className="h4 fw-bold">Generating Official Boarding Pass...</h3>
                      <p className="text-muted mb-0">Encoding travel reservation details</p>
                    </div>
                  </div>

                  {/* Back Side: Confirmed 3D Luxury Boarding Pass */}
                  <div className="boarding-pass-back">
                    <div id="confirmationPanel" className="boarding-pass-card text-center mx-auto">
                      {/* Luxury Top Header */}
                      <div className="boarding-pass-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src="/assets/images/logo.png"
                            alt="The Traveller"
                            height="34"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                          <span className="text-uppercase fw-bold small" style={{ letterSpacing: '0.1em' }}>
                            Official Booking Confirmation
                          </span>
                        </div>
                        <span className="badge bg-success px-3 py-2 fw-semibold">
                          CONFIRMED REQUEST
                        </span>
                      </div>

                      <div className="p-4 p-md-5">
                        <div className="success-mark" aria-hidden="true">
                          ✓
                        </div>
                        <span className="eyebrow text-brand">SUCCESS</span>
                        <h2 className="mt-2">Booking request received</h2>
                        <p className="text-muted">
                          Thanks, <strong>{confirmation.name}</strong>. Your{' '}
                          <strong>{confirmation.packageName}</strong> request has been recorded.
                        </p>

                        <div className="my-3">
                          <small className="text-muted d-block text-uppercase" style={{ letterSpacing: '0.08em' }}>
                            Booking Reference Code
                          </small>
                          <div className="booking-code fs-4 px-4 py-2" aria-label="Booking reference">
                            {confirmation.code}
                          </div>
                        </div>

                        <p className="mb-4">
                          <strong>Travel date:</strong> {confirmation.travelDate} ·{' '}
                          <strong>Travellers:</strong> {confirmation.travellers}
                          {confirmation.roomType && ` · ${confirmation.roomType} Room`}
                        </p>

                        {/* Perforated Divider & Barcode */}
                        <div className="boarding-pass-perforation my-4" />

                        <div className="my-3">
                          <div className="boarding-pass-barcode" aria-hidden="true">
                            <span style={{ width: 3 }} />
                            <span style={{ width: 1 }} />
                            <span style={{ width: 4 }} />
                            <span style={{ width: 2 }} />
                            <span style={{ width: 1 }} />
                            <span style={{ width: 3 }} />
                            <span style={{ width: 5 }} />
                            <span style={{ width: 2 }} />
                            <span style={{ width: 4 }} />
                            <span style={{ width: 1 }} />
                            <span style={{ width: 3 }} />
                            <span style={{ width: 2 }} />
                            <span style={{ width: 5 }} />
                            <span style={{ width: 1 }} />
                            <span style={{ width: 4 }} />
                            <span style={{ width: 2 }} />
                            <span style={{ width: 3 }} />
                          </div>
                          <small className="text-muted font-monospace">{confirmation.code}-VERIFIED</small>
                        </div>

                        <p className="small text-muted mt-3 mb-4">
                          This static demo stores the booking only in your browser. Connect a backend, inventory system, email service, and payment provider before production use.
                        </p>

                        <div className="d-flex flex-wrap justify-content-center gap-3">
                          <Link className="btn btn-brand px-4" to="/">
                            Back to home
                          </Link>
                          <Link className="btn btn-outline-brand px-4" to="/packages">
                            Explore more trips
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
