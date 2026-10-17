import React, { createContext, useContext, useState, useEffect } from 'react'
import { packages } from '../data/travelData'

const STORAGE_KEY_BOOKING = 'theTravellerBooking'
const STORAGE_KEY_CONFIRMATION = 'theTravellerConfirmation'
const STORAGE_KEY_CUSTOM_ENQUIRY = 'theTravellerCustomEnquiry'

const BookingContext = createContext(null)

function safeParse(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e)
    return null
  }
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(() => safeParse(STORAGE_KEY_BOOKING))
  const [confirmation, setConfirmation] = useState(() => safeParse(STORAGE_KEY_CONFIRMATION))
  const [customEnquiry, setCustomEnquiry] = useState(() => safeParse(STORAGE_KEY_CUSTOM_ENQUIRY))

  // Persist to localStorage whenever state changes
  const saveBooking = (data) => {
    const pkg = packages.find(p => p.id === data.packageId) || packages[0]
    const travellers = Math.max(1, Number(data.travellers) || 1)
    const bookingPayload = {
      ...data,
      packageId: pkg.id,
      packageName: pkg.name,
      travellers,
      unitPrice: pkg.price,
      total: pkg.price * travellers,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY_BOOKING, JSON.stringify(bookingPayload))
    setBooking(bookingPayload)
    return bookingPayload
  }

  const confirmBooking = () => {
    if (!booking) return null
    const code = `TRV-${Date.now().toString().slice(-7)}`
    const confirmationPayload = {
      ...booking,
      code,
      confirmedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY_CONFIRMATION, JSON.stringify(confirmationPayload))
    setConfirmation(confirmationPayload)
    return confirmationPayload
  }

  const saveCustomEnquiry = (enquiryData) => {
    const enquiryPayload = {
      ...enquiryData,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_ENQUIRY, JSON.stringify(enquiryPayload))
    setCustomEnquiry(enquiryPayload)
    return enquiryPayload
  }

  const clearBooking = () => {
    localStorage.removeItem(STORAGE_KEY_BOOKING)
    setBooking(null)
  }

  const clearConfirmation = () => {
    localStorage.removeItem(STORAGE_KEY_CONFIRMATION)
    setConfirmation(null)
  }

  return (
    <BookingContext.Provider
      value={{
        booking,
        confirmation,
        customEnquiry,
        saveBooking,
        confirmBooking,
        saveCustomEnquiry,
        clearBooking,
        clearConfirmation
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
