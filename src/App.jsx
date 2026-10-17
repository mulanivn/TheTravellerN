import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SmoothScrollProvider } from './components/scroll/SmoothScrollProvider'
import HorizonScene3D from './components/three/HorizonScene3D'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ChatbotEmbed from './components/layout/ChatbotEmbed'

// Phase 3 & 4 Full Page Views
import HomePage from './pages/HomePage'
import PackagesPage from './pages/PackagesPage'
import ThemesPage from './pages/ThemesPage'
import PackageDetailsPage from './pages/PackageDetailsPage'
import BookingSummaryPage from './pages/BookingSummaryPage'
import BookingConfirmationPage from './pages/BookingConfirmationPage'

export default function App() {
  return (
    <SmoothScrollProvider>
      {/* 3D WebGL Background Scene */}
      <HorizonScene3D />

      <div className="d-flex flex-column min-vh-100 position-relative" style={{ zIndex: 1 }}>
        <Navbar />

        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/themes" element={<ThemesPage />} />
            <Route path="/package-details" element={<PackageDetailsPage />} />
            <Route path="/booking-summary" element={<BookingSummaryPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>

        <Footer />
        <ChatbotEmbed />
      </div>
    </SmoothScrollProvider>
  )
}
