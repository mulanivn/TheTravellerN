import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { themes, packages, money, imagePath } from '../data/travelData'
import { useHeroPortalAnimation } from '../hooks/useHeroPortalAnimation'
import TiltCard3D from '../components/ui/TiltCard3D'

export default function ThemesPage() {
  const [searchParams] = useSearchParams()
  const selectedTheme = searchParams.get('theme')
  const { heroRef, videoRef, contentRef } = useHeroPortalAnimation()

  // Smooth scroll to selected theme if provided in query string
  useEffect(() => {
    if (selectedTheme && themes.some((t) => t.id === selectedTheme)) {
      const timer = setTimeout(() => {
        const target = document.getElementById(selectedTheme)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [selectedTheme])

  // Reorder themes to put selected theme first if matched
  const orderedThemes = selectedTheme && themes.some((t) => t.id === selectedTheme)
    ? [
        ...themes.filter((t) => t.id === selectedTheme),
        ...themes.filter((t) => t.id !== selectedTheme)
      ]
    : themes

  return (
    <div className="themes-page">
      {/* Hero with 3D WebGL Horizon Canvas */}
      <header ref={heroRef} className="page-hero page-hero--themes">
        <div ref={contentRef} className="container page-hero-content">
          <span className="eyebrow">TRAVEL YOUR WAY</span>
          <h1>Theme-wise journeys</h1>
          <p>Start with the kind of experience you want, then choose the destination.</p>
        </div>
      </header>

      <main id="main-content">
        <section className="section-padding">
          <div className="container">
            <div id="themeListing">
              {orderedThemes.map((theme) => {
                const matchedPackages = packages.filter((pkg) => pkg.theme === theme.id)
                return (
                  <section className="theme-block" id={theme.id} key={theme.id}>
                    <div className="theme-block-header">
                      <div>
                        <span className="eyebrow text-brand">{theme.name.toUpperCase()}</span>
                        <h2>{theme.name}</h2>
                        <p>{theme.copy}</p>
                      </div>
                      <span className="tag">{matchedPackages.length} packages</span>
                    </div>

                    <div className="row g-4">
                      {matchedPackages.map((pkg, idx) => (
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
                  </section>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
