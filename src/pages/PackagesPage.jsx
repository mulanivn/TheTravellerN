import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { packages, money, imagePath } from '../data/travelData'
import { useHeroPortalAnimation } from '../hooks/useHeroPortalAnimation'
import TiltCard3D from '../components/ui/TiltCard3D'

export default function PackagesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [theme, setTheme] = useState('all')
  const { heroRef, videoRef, contentRef } = useHeroPortalAnimation()

  const filteredPackages = packages.filter((pkg) => {
    const query = search.trim().toLowerCase()
    const nameDest = `${pkg.name} ${pkg.destination}`.toLowerCase()
    const queryMatch = !query || nameDest.includes(query)
    const categoryMatch = category === 'all' || pkg.category === category
    const themeMatch = theme === 'all' || pkg.theme === theme

    return queryMatch && categoryMatch && themeMatch
  })

  return (
    <div className="packages-page">
      {/* Hero with 3D WebGL Horizon Canvas */}
      <header ref={heroRef} className="page-hero page-hero--packages">
        <div ref={contentRef} className="container page-hero-content">
          <span className="eyebrow">CURATED JOURNEYS</span>
          <h1>Explore all tour packages</h1>
          <p>Find a route that fits your pace, budget, and travel style.</p>
        </div>
      </header>

      <main id="main-content">
        <section className="section-padding section-muted">
          <div className="container">
            {/* 3-Column Filter Toolbar */}
            <div className="filter-toolbar mb-4">
              <div>
                <label htmlFor="packageSearch">Search packages</label>
                <input
                  className="form-control"
                  id="packageSearch"
                  placeholder="Destination or package name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="packageCategory">Category</label>
                <select
                  id="packageCategory"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                  <option value="group">Group</option>
                </select>
              </div>
              <div>
                <label htmlFor="packageTheme">Theme</label>
                <select
                  id="packageTheme"
                  className="form-select"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="all">All themes</option>
                  <option value="family">Family</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="adventure">Adventure</option>
                  <option value="senior">Senior-friendly</option>
                </select>
              </div>
            </div>

            {/* All 8 Packages Grid */}
            <div className="row g-4" id="allPackageGrid">
              {filteredPackages.map((pkg, idx) => (
                <div
                  className="col-md-6 col-xl-4 package-item"
                  key={pkg.id}
                  data-category={pkg.category}
                  data-theme={pkg.theme}
                >
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

            {/* Empty State */}
            {filteredPackages.length === 0 && (
              <p className="empty-state" id="allPackageEmpty">
                No packages match your search.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
