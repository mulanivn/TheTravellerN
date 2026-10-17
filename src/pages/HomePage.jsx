import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { packages, destinations, themes, partners, money, imagePath } from '../data/travelData'
import { useBooking } from '../context/BookingContext'
import { useHeroPortalAnimation } from '../hooks/useHeroPortalAnimation'
import TiltCard3D from '../components/ui/TiltCard3D'

export default function HomePage() {
  const { saveCustomEnquiry } = useBooking()
  const { heroRef, videoRef, contentRef } = useHeroPortalAnimation()

  // Search Panel State
  const [searchDest, setSearchDest] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [searchDuration, setSearchDuration] = useState('all')
  const [searchBudget, setSearchBudget] = useState('all')
  const [searchMsg, setSearchMsg] = useState('')

  // Featured Packages Filter Category State
  const [activeCategory, setActiveCategory] = useState('all')
  const [appliedSearch, setAppliedSearch] = useState({
    dest: '',
    type: 'all',
    duration: 'all',
    budget: 'all'
  })

  // Custom Trip Form State
  const [customForm, setCustomForm] = useState({
    name: '',
    email: '',
    phone: '',
    travellers: '1–2',
    destination: '',
    date: '',
    notes: ''
  })
  const [customMsg, setCustomMsg] = useState('')

  // Handle Floating Search Execution
  const handleSearch = () => {
    if (searchType === 'custom') {
      setSearchMsg('Custom trips are planned through the enquiry form below.')
      document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setAppliedSearch({
      dest: searchDest.trim().toLowerCase(),
      type: searchType,
      duration: searchDuration,
      budget: searchBudget
    })

    if (searchType !== 'all') {
      setActiveCategory(searchType)
    }

    // Calculate match count
    const matches = packages.slice(0, 6).filter((pkg) => {
      const textMatch = !searchDest || `${pkg.name} ${pkg.destination}`.toLowerCase().includes(searchDest.toLowerCase())
      const typeMatch = searchType === 'all' || pkg.category === searchType
      const durationMatch = searchDuration === 'all' || pkg.duration === searchDuration
      const budgetMatch =
        searchBudget === 'all' ||
        (searchBudget === 'budget' && pkg.price < 30000) ||
        (searchBudget === 'mid' && pkg.price >= 30000 && pkg.price <= 75000) ||
        (searchBudget === 'premium' && pkg.price > 75000)

      return textMatch && typeMatch && durationMatch && budgetMatch
    })

    setSearchMsg(
      matches.length
        ? `${matches.length} matching package${matches.length === 1 ? '' : 's'} found. Showing featured trips below.`
        : 'No matching featured package found for this combination. Showing all packages.'
    )

    document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Filter featured packages (top 6 from original static app)
  const displayedPackages = packages.slice(0, 6).filter((pkg) => {
    const categoryMatch = activeCategory === 'all' || pkg.category === activeCategory
    const searchMatch = !appliedSearch.dest || `${pkg.name} ${pkg.destination}`.toLowerCase().includes(appliedSearch.dest)
    const durationMatch = appliedSearch.duration === 'all' || pkg.duration === appliedSearch.duration
    const budgetMatch =
      appliedSearch.budget === 'all' ||
      (appliedSearch.budget === 'budget' && pkg.price < 30000) ||
      (appliedSearch.budget === 'mid' && pkg.price >= 30000 && pkg.price <= 75000) ||
      (appliedSearch.budget === 'premium' && pkg.price > 75000)

    return categoryMatch && searchMatch && durationMatch && budgetMatch
  })

  // Handle Custom Trip Form Submit
  const handleCustomSubmit = (e) => {
    e.preventDefault()
    saveCustomEnquiry(customForm)
    setCustomMsg('Thanks — your trip preferences have been saved in this browser.')
    setCustomForm({
      name: '',
      email: '',
      phone: '',
      travellers: '1–2',
      destination: '',
      date: '',
      notes: ''
    })
    setTimeout(() => setCustomMsg(''), 6000)
  }

  return (
    <div className="home-page">
      {/* Hero Section (3D WebGL Horizon & Globe Canvas shines directly through) */}
      <header id="home" ref={heroRef} className="hero-section hero-home">
        <div ref={contentRef} className="container hero-content">
          <div className="row">
            <div className="col-xl-8 col-lg-10">
              <span className="eyebrow">
                <span aria-hidden="true">≈</span> JOURNEYS BEYOND EXPECTATIONS
              </span>
              <h1>
                Find your next <span>Blue Horizon.</span>
              </h1>
              <p className="lead">
                Curated tour packages, meaningful experiences, and effortless planning — all in one place.
              </p>
              <div className="hero-actions d-flex flex-wrap gap-3 mt-4">
                <Link className="btn btn-brand btn-lg" to="/packages">
                  Explore Packages <span aria-hidden="true">→</span>
                </Link>
                <a className="btn btn-outline-light btn-lg" href="#custom">
                  Build a Custom Trip
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-bottom container" aria-label="Highlights">
          <div className="hero-stat">
            <strong>100+</strong>
            <span>Curated experiences</span>
          </div>
          <div className="hero-stat">
            <strong>24/7</strong>
            <span>Inquiry assistance</span>
          </div>
          <div className="hero-stat">
            <strong>1</strong>
            <span>Journey, your way</span>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Floating Search Panel */}
        <section className="search-panel-wrap" aria-labelledby="trip-search-title">
          <div className="container">
            <div className="search-panel shadow-lg">
              <h2 id="trip-search-title" className="visually-hidden">
                Find a tour package
              </h2>
              <div className="row g-3 align-items-end">
                <div className="col-lg-3">
                  <label htmlFor="searchDestination">Where to?</label>
                  <input
                    id="searchDestination"
                    className="form-control"
                    placeholder="Destination"
                    autoComplete="off"
                    value={searchDest}
                    onChange={(e) => setSearchDest(e.target.value)}
                  />
                </div>
                <div className="col-lg-2">
                  <label htmlFor="searchType">Tour type</label>
                  <select
                    id="searchType"
                    className="form-select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="all">All tours</option>
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                    <option value="group">Group</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <label htmlFor="searchDuration">Duration</label>
                  <select
                    id="searchDuration"
                    className="form-select"
                    value={searchDuration}
                    onChange={(e) => setSearchDuration(e.target.value)}
                  >
                    <option value="all">Any duration</option>
                    <option value="short">1–4 days</option>
                    <option value="medium">5–8 days</option>
                    <option value="long">9+ days</option>
                  </select>
                </div>
                <div className="col-lg-2">
                  <label htmlFor="searchBudget">Budget</label>
                  <select
                    id="searchBudget"
                    className="form-select"
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                  >
                    <option value="all">Any budget</option>
                    <option value="budget">Under ₹30k</option>
                    <option value="mid">₹30k–₹75k</option>
                    <option value="premium">₹75k+</option>
                  </select>
                </div>
                <div className="col-lg-3">
                  <button
                    id="searchBtn"
                    className="btn btn-brand w-100"
                    type="button"
                    onClick={handleSearch}
                  >
                    ⌕ Find Packages
                  </button>
                </div>
              </div>
              {searchMsg && (
                <div id="searchMessage" className="small text-muted mt-3" aria-live="polite">
                  {searchMsg}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Popular Destinations Grid (4 cards) */}
        <section id="destinations" className="section-padding">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow text-brand">EXPLORE THE WORLD</span>
                <h2>Popular destinations</h2>
              </div>
              <Link to="/packages" className="text-link">
                View packages ↗
              </Link>
            </div>
            <div className="row g-4" id="destinationGrid">
              {destinations.map((dest, idx) => (
                <div className="col-md-6 col-xl-3" key={dest.name}>
                  <TiltCard3D staggerIndex={idx}>
                    <article className="destination-card">
                      <img
                        src={imagePath(dest.image)}
                        alt={`${dest.name} travel scene`}
                        loading="lazy"
                      />
                      <div className="card-body">
                        <h3>{dest.name}</h3>
                        <p className="text-muted">{dest.copy}</p>
                        <Link
                          className="text-link"
                          to={`/package-details?package=${encodeURIComponent(dest.packageId)}`}
                        >
                          Explore destination →
                        </Link>
                      </div>
                    </article>
                  </TiltCard3D>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tour Packages Grid (top 6 packages with category filters) */}
        <section id="packages" className="section-padding section-muted">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow text-brand">CURATED FOR YOU</span>
                <h2>Featured tour packages</h2>
                <p className="section-copy">
                  Browse thoughtfully planned holidays for every kind of traveller.
                </p>
              </div>
              <div
                className="package-filters btn-group flex-wrap"
                role="group"
                aria-label="Package filters"
              >
                {['all', 'domestic', 'international', 'group'].map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-outline-brand ${activeCategory === cat ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="row g-4" id="packageGrid">
              {displayedPackages.map((pkg, idx) => (
                <div className="col-md-6 col-xl-4 package-item" key={pkg.id}>
                  <TiltCard3D staggerIndex={idx}>
                    <article className="package-card">
                      <img
                        src={imagePath(pkg.image)}
                        alt={`${pkg.destination} travel landscape`}
                        loading="lazy"
                      />
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                          <span className="tag">{pkg.tag}</span>
                          <span className="package-meta">{pkg.days} days</span>
                        </div>
                        <h3>{pkg.name}</h3>
                        <p className="package-meta mb-3">
                          {pkg.destination} · {pkg.category}
                        </p>
                        <p>{pkg.summary}</p>
                        <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
                          <span className="price">{money(pkg.price)}</span>
                          <Link
                            className="btn btn-outline-brand btn-sm"
                            to={`/package-details?package=${encodeURIComponent(pkg.id)}`}
                            aria-label={`View ${pkg.name} details`}
                          >
                            View trip
                          </Link>
                        </div>
                      </div>
                    </article>
                  </TiltCard3D>
                </div>
              ))}
            </div>

            {displayedPackages.length === 0 && (
              <div id="noResults" className="empty-state">
                No packages match your filters. Try another search.
              </div>
            )}
          </div>
        </section>

        {/* Travel Themes Grid (4 cards) */}
        <section id="themes" className="section-padding">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow text-brand">TRAVEL YOUR WAY</span>
                <h2>Choose your travel theme</h2>
              </div>
            </div>
            <div className="row g-4" id="themeGrid">
              {themes.map((theme, idx) => (
                <div className="col-md-6 col-xl-3" key={theme.id}>
                  <TiltCard3D staggerIndex={idx}>
                    <Link
                      className={`theme-card theme-card--${theme.id}`}
                      to={`/themes?theme=${theme.id}`}
                      style={{ display: 'flex', height: '100%' }}
                    >
                      <div>
                        <h3>{theme.name}</h3>
                        <p>{theme.copy}</p>
                      </div>
                    </Link>
                  </TiltCard3D>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Offer Banner */}
        <section id="offers" className="section-padding offer-section">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-7">
                <span className="eyebrow">LIMITED-TIME CONCEPT</span>
                <h2>Make room for more memories.</h2>
                <p>
                  Discover seasonal experiences and thoughtfully bundled itineraries. Offers displayed here are illustrative until connected to verified live pricing.
                </p>
                <a href="#custom" className="btn btn-light mt-2">
                  Request an offer →
                </a>
              </div>
              <div className="col-lg-5">
                <div className="offer-card glass-panel-dark">
                  <div className="offer-icon" aria-hidden="true">
                    ✦
                  </div>
                  <h3>Early planning benefits</h3>
                  <p>Tell us your dates and preferences to receive a tailored proposal.</p>
                  <span className="small text-white-50">No payment required.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Itinerary Form (#custom) */}
        <section id="custom" className="section-padding">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <span className="eyebrow text-brand">YOUR JOURNEY, YOUR RULES</span>
                <h2>Need a custom itinerary?</h2>
                <p>
                  Share your travel style, preferred destinations, and approximate budget. We can turn your inputs into a personalized package proposal.
                </p>
                <div className="feature-list">
                  <div>
                    <span aria-hidden="true">●</span>
                    <span>Flexible destinations and dates</span>
                  </div>
                  <div>
                    <span aria-hidden="true">●</span>
                    <span>Stay, transport, and sightseeing preferences</span>
                  </div>
                  <div>
                    <span aria-hidden="true">●</span>
                    <span>One inquiry for your entire journey</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <form id="customTripForm" className="custom-form" onSubmit={handleCustomSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name">Full name</label>
                      <input
                        id="name"
                        name="name"
                        className="form-control"
                        required
                        value={customForm.name}
                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        required
                        value={customForm.email}
                        onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="form-control"
                        required
                        value={customForm.phone}
                        onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="travellers">Travellers</label>
                      <select
                        id="travellers"
                        name="travellers"
                        className="form-select"
                        value={customForm.travellers}
                        onChange={(e) => setCustomForm({ ...customForm, travellers: e.target.value })}
                      >
                        <option>1–2</option>
                        <option>3–5</option>
                        <option>6–10</option>
                        <option>10+</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="preferredDestination">Preferred destination</label>
                      <input
                        id="preferredDestination"
                        name="destination"
                        className="form-control"
                        placeholder="e.g. Kerala, Bali"
                        value={customForm.destination}
                        onChange={(e) => setCustomForm({ ...customForm, destination: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="travelDate">Approximate travel date</label>
                      <input
                        id="travelDate"
                        name="date"
                        type="date"
                        className="form-control"
                        value={customForm.date}
                        onChange={(e) => setCustomForm({ ...customForm, date: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="tripNotes">Tell us about your trip</label>
                      <textarea
                        id="tripNotes"
                        name="notes"
                        className="form-control"
                        rows="4"
                        placeholder="Budget, interests, accommodation, special requests..."
                        value={customForm.notes}
                        onChange={(e) => setCustomForm({ ...customForm, notes: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <button className="btn btn-brand" type="submit">
                        Submit Enquiry →
                      </button>
                      {customMsg && (
                        <div id="formMessage" className="small mt-3 text-success fw-semibold" aria-live="polite">
                          ✓ {customMsg}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Partners Grid */}
        <section id="partners" className="section-padding section-muted">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow text-brand">INDUSTRY REFERENCE</span>
                <h2>Explore travel industry resources</h2>
                <p className="section-copy">
                  These external links are provided for reference and discovery. The Traveller is an independent brand.
                </p>
              </div>
            </div>
            <div className="row g-3" id="partnerGrid">
              {partners.map((partner) => (
                <div className="col-md-6 col-xl-3" key={partner.name}>
                  <a
                    className="partner-card"
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      <strong>{partner.name}</strong>
                      <span>{partner.copy}</span>
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Info Cards */}
        <section className="section-padding">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="info-card card-3d">
                  <div className="info-icon" aria-hidden="true">
                    ✓
                  </div>
                  <h3>Clear package details</h3>
                  <p>Present inclusions, exclusions, itinerary, and pricing assumptions clearly.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-card card-3d">
                  <div className="info-icon" aria-hidden="true">
                    ◉
                  </div>
                  <h3>Human support</h3>
                  <p>Design the inquiry journey around helpful consultant conversations.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-card card-3d">
                  <div className="info-icon" aria-hidden="true">
                    ▣
                  </div>
                  <h3>Built for every screen</h3>
                  <p>Responsive components for mobile, tablet, and desktop visitors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
