'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
export default function BankDetails() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    bank_account_holder: '',
    bank_account_number: '',
    bank_ifsc: '',
  })
  // Validation errors state
  const [errors, setErrors] = useState({
    bank_account_number: '',
    bank_ifsc: '',
  })

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/bank-details?user_id=${session.user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.bank_account_holder) {
          setForm({
            bank_account_holder: data.bank_account_holder || '',
            bank_account_number: data.bank_account_number || '',
            bank_ifsc: data.bank_ifsc || '',
          })
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [session])

  function handleChange(e) {
    const { name, value } = e.target
    
    // Auto uppercase for IFSC input dynamically
    const finalValue = name === 'bank_ifsc' ? value.toUpperCase() : value

    setForm({ ...form, [name]: finalValue })
    
    // Clear error dynamically as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  function validateForm() {
    let isValid = true
    const newErrors = { bank_account_number: '', bank_ifsc: '' }

    // Account Number Check: Minimum 9 and maximum 18 digits (digits only)
    const accRegex = /^\d{9,18}$/
    if (!accRegex.test(form.bank_account_number)) {
      newErrors.bank_account_number = 'Please enter a valid bank account number (9-18 digits).'
      isValid = false
    }

    // IFSC Code Check: Standard Indian Financial System Code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    if (!ifscRegex.test(form.bank_ifsc)) {
      newErrors.bank_ifsc = 'Please enter a valid 11-character IFSC code (e.g., SBIN0001234).'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleSubmit() {
    if (!form.bank_account_holder || !form.bank_account_number || !form.bank_ifsc) {
      alert('Please fill all fields')
      return
    }

    // Run Regex Validations
    if (!validateForm()) {
      return
    }

    setLoading(true)

    const res = await fetch('/api/bank-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        ...form
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      alert('Error: ' + data.error)
      return
    }

    alert('Bank details saved!')
    router.push('/create')
  }

  if (fetching) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #d4f7e6 0%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1D9E75', fontFamily: 'sans-serif', fontWeight: 600 }}>Loading banking parameters...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px',
      color: '#111827'
    }}>

      {/* Static Glassmorphism Navbar Layer (Matches Project UI Matrix Specs) */}
      <div style={{ padding: '16px 20px', zIndex: 1000 }}>
        <nav style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 32px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 8px 32px rgba(29, 158, 117, 0.08)',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo Brand Anchor Node */}
          <Link href="/" style={{ textDecoration: 'none' }} className="brand-logo-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <div
  className="logo-box"
  style={{
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }}
>
  <Image
    src="/logo.png"
    alt="FreelanceShield Logo"
    width={36}
    height={36}
    priority
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }}
  />
</div>
              <span className="brand-text nav-brand-text" style={{ 
                fontWeight: 700, color: '#111827', fontSize: '18px', 
                letterSpacing: '-0.02em', transition: 'all 0.2s ease' 
              }}>FreelanceShield</span>
            </div>
          </Link>
          
          <Link href="/dashboard" style={{ textDecoration: 'none' }} className="nav-item">
            <span className="nav-text">← Back to Dashboard</span>
          </Link>
        </nav>
      </div>

      {/* Core Banking Presentational Wrapper Box */}
      <div style={{ maxWidth: '520px', margin: '20px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Bank details</h2>
        <p style={{ margin: '0 0 28px', color: '#273142', fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: 600, lineHeight: 1.4 }}>
          Add these details so that when the client approves the milestone, the funds can be released directly into your account.
        </p>

        {/* Translucent Glassmorphic Form Card Section Area */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.6)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)', 
          borderRadius: '20px', 
          padding: '32px',
          boxShadow: '0 10px 30px rgba(29, 158, 117, 0.02)'
        }}>

          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏦</div>

          <label style={labelStyle}>Account holder name *</label>
          <input
            name="bank_account_holder"
            value={form.bank_account_holder}
            onChange={handleChange}
            placeholder="As written in your bank passbook"
            style={inputStyle}
          />

          <label style={{ ...labelStyle, marginTop: '16px', display: 'block' }}>Account number *</label>
          <input
            name="bank_account_number"
            value={form.bank_account_number}
            onChange={handleChange}
            placeholder="1234567890123"
            style={{ ...inputStyle, borderColor: errors.bank_account_number ? '#ff4d4f' : 'rgba(0, 0, 0, 0.08)' }}
          />
          {errors.bank_account_number && (
            <span style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: 500 }}>⚠️ {errors.bank_account_number}</span>
          )}

          <label style={{ ...labelStyle, marginTop: '16px', display: 'block' }}>IFSC code *</label>
          <input
            name="bank_ifsc"
            value={form.bank_ifsc}
            onChange={handleChange}
            placeholder="SBIN0001234"
            style={{ ...inputStyle, textTransform: 'uppercase', borderColor: errors.bank_ifsc ? '#ff4d4f' : 'rgba(0, 0, 0, 0.08)' }}
          />
          {errors.bank_ifsc && (
            <span style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: 500 }}>⚠️ {errors.bank_ifsc}</span>
          )}

          {/* Secure Information Stamp Node */}
          <p style={{ fontSize: '12px', color: '#1D9E75', marginTop: '20px', background: 'rgba(29, 158, 117, 0.06)', padding: '12px 14px', borderRadius: '10px', fontWeight: 600, border: '1px solid rgba(29, 158, 117, 0.15)', lineHeight: 1.4 }}>
            🔒 Your bank details are encrypted and securely stored. They are only processed via regulated transaction network loops for payouts.
          </p>

          <button onClick={handleSubmit} disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              background: '#111827', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontSize: '15px', 
              fontWeight: 600, 
              cursor: loading ? 'not-allowed' : 'pointer', 
              opacity: loading ? 0.7 : 1, 
              marginTop: '24px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              transition: 'all 0.2s ease'
            }}
            className="submit-bank-btn"
          >
            {loading ? 'Saving Routing Data...' : 'Secure Payout Pipeline'}
          </button>
        </div>
      </div>

      {/* Global CSS Transition Sheets Injector */}
      <style jsx global>{`
        .brand-logo-container:active .logo-box {
          transform: scale(0.95);
          box-shadow: 0 0 20px rgba(29, 158, 117, 0.9), 0 0 30px rgba(29, 158, 117, 0.5);
          background: #111827 !important;
        }
        .brand-logo-container:active .brand-text {
          color: #1D9E75 !important;
          text-shadow: 0 0 15px rgba(29, 158, 117, 0.6);
        }
        .brand-logo-container:hover .brand-text {
          color: #1D9E75;
        }

        .nav-item {
          transition: all 0.25s ease;
          position: relative;
        }
        .nav-text {
          color: #4b5563;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .nav-item:hover .nav-text {
          color: #1D9E75 !important;
          text-shadow: 0 0 10px rgba(29, 158, 117, 0.4);
        }
        .nav-item:hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(29, 158, 117, 0.6);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(29, 158, 117, 0.5);
        }

        .submit-bank-btn:hover {
          background: #1D9E75 !important;
          box-shadow: 0 6px 20px rgba(29, 158, 117, 0.25) !important;
        }

        @media (max-width: 640px) {
          .nav-brand-text { font-size: 16px !important; }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  fontSize: '12px',
  color: '#374151',
  fontWeight: 600,
  marginBottom: '4px',
  display: 'inline-block',
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  background: 'white',
  color: '#111827',
  fontSize: '14px',
  marginTop: '4px',
  boxSizing: 'border-box',
  outline: 'none',
  fontWeight: 500,
  transition: 'border-color 0.2s',
}