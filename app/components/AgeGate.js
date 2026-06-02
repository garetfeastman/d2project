'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AgeGate({ children }) {
  const [verified, setVerified] = useState(null) // null = loading, true/false = result
  const [birthdate, setBirthdate] = useState('')
  const [status, setStatus] = useState('idle') // idle | denied | scanning
  const [scanText, setScanText] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('shd_age_cleared')
    setVerified(stored === 'true')
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!birthdate) return

    setStatus('scanning')

    const lines = [
      'CONTACTING ISAC NETWORK...',
      'VERIFYING AGENT CREDENTIALS...',
      'CROSS-REFERENCING SHD DATABASE...',
      'RUNNING BIOMETRIC CHECK...',
    ]
    let i = 0
    const interval = setInterval(() => {
      setScanText(lines[i])
      i++
      if (i >= lines.length) {
        clearInterval(interval)

        const dob = new Date(birthdate)
        const now = new Date()
        let age = now.getFullYear() - dob.getFullYear()
        const m = now.getMonth() - dob.getMonth()
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--

        if (age >= 18) {
          setScanText('CLEARANCE GRANTED')
          setTimeout(() => {
            localStorage.setItem('shd_age_cleared', 'true')
            setVerified(true)
          }, 800)
        } else {
          setScanText('ACCESS DENIED')
          setTimeout(() => setStatus('denied'), 600)
        }
      }
    }, 500)
  }

  // Still checking localStorage
  if (verified === null) return null

  // Already verified — render the app
  if (verified === true) return children

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: '#040c14' }}>
      {/* Background image ghosted */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.12,
      }} />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      }} />

      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Header bar */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <div className="h-px flex-1" style={{ background: '#f97316' }} />
          <span className="text-xs font-bold tracking-[0.3em]" style={{ color: '#f97316', fontFamily: 'var(--font-heading)' }}>SHD NETWORK</span>
          <div className="h-px flex-1" style={{ background: '#f97316' }} />
        </div>

        {/* Main panel */}
        <div className="p-8" style={{
          background: 'rgba(10, 20, 35, 0.95)',
          border: '1px solid rgba(249, 115, 22, 0.4)',
          boxShadow: '0 0 40px rgba(249,115,22,0.1), inset 0 0 40px rgba(0,0,0,0.4)',
        }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image src="/SHDlogo.png" alt="SHD" width={64} height={64} className="mb-4 opacity-90" />
            <h1 className="text-3xl tracking-[0.2em] mb-1" style={{ fontFamily: 'var(--font-logo)', color: '#ffffff' }}>
              <span style={{ color: '#ffffff' }}>DIVISION</span><span style={{ color: '#f97316' }}>HUB</span>
            </h1>
            <p className="text-xs tracking-[0.25em] font-bold" style={{ color: '#f97316', fontFamily: 'var(--font-heading)' }}>
              AGENT CLEARANCE REQUIRED
            </p>
          </div>

          {status === 'denied' ? (
            <div className="text-center py-4">
              <p className="text-2xl font-black tracking-widest mb-3" style={{ color: '#ef4444', fontFamily: 'var(--font-logo)' }}>
                ACCESS DENIED
              </p>
              <p className="text-sm font-bold mb-1" style={{ color: '#94a3b8', fontFamily: 'var(--font-heading)' }}>
                INSUFFICIENT CLEARANCE LEVEL
              </p>
              <p className="text-xs" style={{ color: '#536471' }}>
                You must be 18 or older to access the SHD network.
              </p>
            </div>
          ) : status === 'scanning' ? (
            <div className="text-center py-6">
              <div className="flex justify-center gap-1 mb-5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{
                    background: '#f97316',
                    animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <p className="text-sm font-black tracking-widest" style={{ color: '#f97316', fontFamily: 'var(--font-heading)' }}>
                {scanText}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-[0.2em] mb-2" style={{ color: '#94a3b8', fontFamily: 'var(--font-heading)' }}>
                  DATE OF BIRTH — AGENT VERIFICATION
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={e => setBirthdate(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm font-bold outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(249,115,22,0.3)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                    colorScheme: 'dark',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.8)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(249,115,22,0.3)'}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-black tracking-[0.2em] transition-all"
                style={{
                  background: '#f97316',
                  color: '#ffffff',
                  fontFamily: 'var(--font-logo)',
                  letterSpacing: '0.25em',
                }}
                onMouseEnter={e => e.target.style.background = '#ea6c0a'}
                onMouseLeave={e => e.target.style.background = '#f97316'}
              >
                REQUEST CLEARANCE
              </button>

              <p className="text-center text-xs" style={{ color: '#536471' }}>
                You must be 18 or older to access this site.
              </p>
            </form>
          )}
        </div>

        {/* Footer bar */}
        <div className="flex items-center gap-2 mt-1 px-1">
          <div className="h-px flex-1" style={{ background: 'rgba(249,115,22,0.3)' }} />
          <span className="text-xs tracking-[0.2em]" style={{ color: '#536471', fontFamily: 'var(--font-heading)' }}>
            STRATEGIC HOMELAND DIVISION
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(249,115,22,0.3)' }} />
        </div>

      </div>
    </div>
  )
}
