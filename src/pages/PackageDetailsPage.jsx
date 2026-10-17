import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { packages, money, imagePath } from '../data/travelData'
import { useBooking } from '../context/BookingContext'
import { useHeroPortalAnimation } from '../hooks/useHeroPortalAnimation'
import ItineraryPath3D from '../components/three/ItineraryPath3D'

export default function PackageDetailsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { booking, saveBooking } = useBooking()
  const { heroRef, videoRef, contentRef } = useHeroPortalAnimation()

  // Resolve active package ID from URL query param, saved booking, or default
  const queryPackageId = searchParams.get('package')
  const initialPackageId =
    (queryPackageId && packages.some((p) => p.id === queryPackageId) && queryPackageId) ||
    (booking?.packageId && packages.some((p) => p.id === booking.packageId) && booking.packageId) ||
    packages[0].id

  const [selectedPkgId, setSelectedPkgId] = useState(initialPackageId)
  const currentPkg = packages.find((p) => p.id === selectedPkgId) || packages[0]

  // Form fields pre-populated with saved booking if available
  const [formData, setFormData] = useState({
    travelDate: booking?.travelDate || '',
    travellers: booking?.travellers || 2,
    roomType: booking?.roomType || 'Standard',
    name: booking?.name || '',
    email: booking?.email || '',
    phone: booking?.phone || '',
    requests: booking?.requests || ''
  })

  // Synchronize with URL query changes
  useEffect(() => {
    if (queryPackageId && packages.some((p) => p.id === queryPackageId)) {
      setSelectedPkgId(queryPackageId)
    }
  }, [queryPackageId])

  const handlePackageSelectChange = (e) => {
    const newId = e.target.value
    setSelectedPkgId(newId)
    setSearchParams({ package: newId })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveBooking({
      ...formData,
      packageId: currentPkg.id
    })
    navigate('/booking-summary')
  }

  return (
    <div className="package-details-page">
      {/* Hero with 3D WebGL Horizon Canvas */}
      <header ref={heroRef} className="page-hero page-hero--details">
        <div ref={contentRef} className="container page-hero-content">
          <span className="eyebrow">PACKAGE DETAILS</span>
          <h1 id="detailHeroTitle">{currentPkg.name}</h1>
          <p id="detailHeroCopy">{currentPkg.summary}</p>
        </div>
      </header>

      <main id="main-content">
        <section className="section-padding">
          <div className="container">
            <div className="row g-5">
              {/* Left Column: Itinerary and Package Overview */}
              <div className="col-lg-7">
                <div id="packageDetailContent">
                  <img
                    className="detail-cover"
                    src={imagePath(currentPkg.image)}
                    alt={`${currentPkg.destination} landscape`}
                  />
                  <span className="eyebrow text-brand">{currentPkg.tag.toUpperCase()}</span>
                  <h2 className="detail-title mt-2">{currentPkg.name}</h2>
                  <p className="detail-lead">{currentPkg.summary}</p>

                  <div className="detail-meta">
                    <span>{currentPkg.days} days</span>
                    <span>{currentPkg.destination}</span>
                    <span>{currentPkg.category}</span>
                    <span>{money(currentPkg.price)} / traveller</span>
                  </div>

                  <h3 className="h4 fw-bold mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span>Suggested Itinerary Flight Path</span>
                    <span className="small text-muted fw-normal">Interactive 3D Waypoints</span>
                  </h3>
                  <ItineraryPath3D itinerary={currentPkg.itinerary} />

                  <div className="notice-box mt-4">
                    <strong>Package note:</strong> Pricing is illustrative and excludes live airfare or inventory checks. Final commercial terms should be verified before payment integration.
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Reservation Form */}
              <div className="col-lg-5">
                <form
                  id="packageSelectionForm"
                  className="booking-card booking-card--sticky sticky-lg-top"
                  onSubmit={handleSubmit}
                >
                  <h2>Reserve this package</h2>
                  <p className="text-muted">No payment is processed in this demo.</p>

                  <div className="mb-3">
                    <label htmlFor="selectedPackage">Package</label>
                    <select
                      id="selectedPackage"
                      name="packageId"
                      className="form-select"
                      required
                      value={selectedPkgId}
                      onChange={handlePackageSelectChange}
                    >
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} — {money(pkg.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label htmlFor="travelStart">Start date</label>
                      <input
                        type="date"
                        id="travelStart"
                        name="travelDate"
                        className="form-control"
                        required
                        value={formData.travelDate}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="travellerCount">Travellers</label>
                      <input
                        type="number"
                        id="travellerCount"
                        name="travellers"
                        className="form-control"
                        min="1"
                        max="20"
                        required
                        value={formData.travellers}
                        onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="roomType">Room preference</label>
                      <select
                        id="roomType"
                        name="roomType"
                        className="form-select"
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                      >
                        <option>Standard</option>
                        <option>Deluxe</option>
                        <option>Premium</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="leadName">Lead traveller name</label>
                      <input
                        id="leadName"
                        name="name"
                        className="form-control"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="leadEmail">Email</label>
                      <input
                        type="email"
                        id="leadEmail"
                        name="email"
                        className="form-control"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="leadPhone">Phone</label>
                      <input
                        type="tel"
                        id="leadPhone"
                        name="phone"
                        className="form-control"
                        required
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="specialRequests">Special requests</label>
                      <textarea
                        id="specialRequests"
                        name="requests"
                        className="form-control"
                        rows="3"
                        placeholder="Dietary, accessibility, or milestone preferences..."
                        value={formData.requests}
                        onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                      />
                    </div>
                  </div>

                  <button className="btn btn-brand w-100 mt-4" type="submit">
                    Continue to booking summary →
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
