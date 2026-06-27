'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function UnifiedSettings() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingBank, setSavingBank] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Profile Form States
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  })

  // Bank Form States matching your schema exactly
  const [form, setForm] = useState({
    bank_account_holder: '',
    bank_account_number: '',
    bank_ifsc: '',
  })

  // Dynamic state hooks for operational toggle
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingBank, setIsEditingBank] = useState(false)

  // Validation Inline UI Errors State Node
  const [errors, setErrors] = useState({
    bank_account_number: '',
    bank_ifsc: '',
  })

  useEffect(() => {
    if (!session?.user?.id) return

    async function fetchUserData() {
      try {
        // Hydrate initial user account status info
        setProfile({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        })

        // Fetch bank routing details array from your existing API handler path
        const res = await fetch(`/api/bank-details?user_id=${session.user.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.bank_account_holder) {
            setForm({
              bank_account_holder: data.bank_account_holder || '',
              bank_account_number: data.bank_account_number || '',
              bank_ifsc: data.bank_ifsc || '',
            })
          }
        }
      } catch (err) {
        console.error('Failed to load credentials topology telemetry:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session])

  // Universal State Mutator Engine
  function handleProfileChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  function handleBankChange(e) {
    const { name, value } = e.target
    const finalValue = name === 'bank_ifsc' ? value.toUpperCase() : value

    setForm({ ...form, [name]: finalValue })

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  // Regex Integrity Checker Module
  function validateBankForm() {
    let isValid = true
    const newErrors = { bank_account_number: '', bank_ifsc: '' }

    const accRegex = /^\d{9,18}$/
    if (!accRegex.test(form.bank_account_number)) {
      newErrors.bank_account_number = 'Please enter a valid bank account number (9-18 digits).'
      isValid = false
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    if (!ifscRegex.test(form.bank_ifsc)) {
      newErrors.bank_ifsc = 'Please enter a valid 11-character IFSC code (e.g., SBIN0001234).'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // API Call Dispatcher: Overwrite User Info to Server DB
  async function saveProfileInfo() {
    if (!profile.name.trim()) {
      alert('Account display name field cannot be empty.')
      return
    }
    setSavingProfile(true)
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: session.user.id, name: profile.name }),
      })
      if (!res.ok) throw new Error('Database layer rejected profile meta edit payload configuration.')
      alert('Profile display metadata modified successfully!')
      setIsEditingProfile(false)
    } catch (err) {
      alert('Error updating profile settings: ' + err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  // API Call Dispatcher: Overwrite Bank Vault data row inside database
  async function saveBankDetails() {
    if (!form.bank_account_holder || !form.bank_account_number || !form.bank_ifsc) {
      alert('Please fill out all billing data configurations fields.')
      return
    }

    if (!validateBankForm()) return

    setSavingBank(true)
    try {
      const res = await fetch('/api/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          ...form,
        }),
      })

      if (!res.ok) throw new Error('Escrow database endpoint rejected vault overwrite query loop logs.')
      alert('Escrow routing payout configuration successfully saved!')
      setIsEditingBank(false)
    } catch (err) {
      alert('Error synchronizing banking arrays: ' + err.message)
    } finally {
      setSavingBank(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #d4f7e6 0%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1D9E75', fontFamily: 'sans-serif', fontWeight: 600 }}>Loading FreelanceShield Environment...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      // Pure Rich Green Gradient Backdrop Structure
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px'
    }}>
      
      {/* Floating Glassmorphism Navbar Layer (Matches dashboard theme exactly) */}
      <div style={{ padding: '16px 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
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
          {/* Logo Brand Hyperlink pointing seamlessly to Home View View */}
          <Link href="/" style={{ textDecoration: 'none' }} className="brand-logo-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="logo-box" style={{
                background: '#1D9E75', color: 'white', width: '32px', height: '32px',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: '15px',
                transition: 'all 0.2s ease'
              }}>F</span>
              <span className="brand-text" style={{ 
                fontWeight: 700, color: '#111827', fontSize: '18px', 
                letterSpacing: '-0.02em', transition: 'all 0.2s ease' 
              }}>FreelanceShield</span>
            </div>
          </Link>

          {/* Desktop Right Navigation Controls Array */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav-menu">
            <Link href="/dashboard" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Dashboard</span>
            </Link>
            
            <Link href="/settings" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item active-link">
              <span className="nav-text">Settings</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px', background: '#1D9E75', borderRadius: '2px' }} />
            </Link>

            <Link href="/create" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Create Project</span>
            </Link>
          </div>

          {/* Mobile Menu Toggler burger icon */}
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ display: 'none', cursor: 'pointer', fontSize: '20px', color: '#111827' }}
            className="mobile-menu-burger-icon"
          >
            ☰
          </div>
        </nav>

        {/* Responsive Mobile Layout Dropdown Block */}
        {isDropdownOpen && (
          <div style={{
            margin: '8px auto 0',
            maxWidth: '1200px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}>
            <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: '14px' }}>Dashboard</Link>
            <Link href="/settings" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#1D9E75', fontWeight: 700, fontSize: '14px' }}>Settings</Link>
            <Link href="/create" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: '14px' }}>Create Project</Link>
          </div>
        )}
      </div>

      {/* Settings Container Body */}
      <div style={{ maxWidth: '640px', margin: '20px auto', padding: '0 20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Account Settings</h2>
        <p style={{ margin: '0 0 32px', color: '#273142', fontSize: '14px', fontWeight: 600 }}>Update your user identity metadata configuration parameters and manage payout destination vaults.</p>

        {/* CONTAINER CONTEXT LOG CARD 1: PROFILE MANAGEMENT METADATA */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>👤 User Profile Context</h3>
            {!isEditingProfile ? (
              <button onClick={() => setIsEditingProfile(true)} style={secondaryBtnStyle}>Edit Profile</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsEditingProfile(false)} style={cancelBtnStyle}>Cancel</button>
                <button onClick={saveProfileInfo} disabled={savingProfile} style={primaryBtnStyle}>{savingProfile ? 'Saving...' : 'Save Info'}</button>
              </div>
            )}
          </div>

          <label style={labelStyle}>Freelancer Name</label>
          <input name="name" value={profile.name} onChange={handleProfileChange} disabled={!isEditingProfile} style={{ ...inputStyle, backgroundColor: isEditingProfile ? 'white' : 'rgba(255, 255, 255, 0.4)' }} />

          <label style={{ ...labelStyle, marginTop: '16px', display: 'block' }}>Account Identity Email</label>
          <input name="email" value={profile.email} disabled={true} title="Primary communication network emails cannot be altered." style={{ ...inputStyle, backgroundColor: 'rgba(0, 0, 0, 0.05)', color: '#6b7280', cursor: 'not-allowed' }} />
        </div>

        {/* CONTAINER CONTEXT LOG CARD 2: SETTLEMENT VAULT ROUTING DETAILS */}
        <div style={{ ...cardStyle, marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={sectionTitleStyle}>🏦 Escrow Payout Bank Account</h3>
            {!isEditingBank ? (
              <button onClick={() => setIsEditingBank(true)} style={secondaryBtnStyle}>Modify Vault Routing</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsEditingBank(false)} style={cancelBtnStyle}>Cancel</button>
                <button onClick={saveBankDetails} disabled={savingBank} style={primaryBtnStyle}>{savingBank ? 'Processing...' : 'Update Bank Info'}</button>
              </div>
            )}
          </div>

          <label style={labelStyle}>Account Holder Name</label>
          <input name="bank_account_holder" value={form.bank_account_holder} onChange={handleBankChange} disabled={!isEditingBank} placeholder="As written in your bank passbook" style={{ ...inputStyle, backgroundColor: isEditingBank ? 'white' : 'rgba(255, 255, 255, 0.4)' }} />

          <label style={{ ...labelStyle, marginTop: '16px', display: 'block' }}>Account Number</label>
          <input name="bank_account_number" type={isEditingBank ? "text" : "password"} value={form.bank_account_number} onChange={handleBankChange} disabled={!isEditingBank} placeholder="1234567890123" style={{ ...inputStyle, backgroundColor: isEditingBank ? 'white' : 'rgba(255, 255, 255, 0.4)', borderColor: errors.bank_account_number ? '#ff4d4f' : 'rgba(0, 0, 0, 0.08)' }} />
          {errors.bank_account_number && (
            <span style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: 500 }}>{errors.bank_account_number}</span>
          )}

          <label style={{ ...labelStyle, marginTop: '16px', display: 'block' }}>IFSC Financial Code</label>
          <input name="bank_ifsc" value={form.bank_ifsc} onChange={handleBankChange} disabled={!isEditingBank} placeholder="SBIN0001234" style={{ ...inputStyle, backgroundColor: isEditingBank ? 'white' : 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', borderColor: errors.bank_ifsc ? '#ff4d4f' : 'rgba(0, 0, 0, 0.08)' }} />
          {errors.bank_ifsc && (
            <span style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: 500 }}>{errors.bank_ifsc}</span>
          )}

          <p style={{ fontSize: '12px', color: '#374151', marginTop: '16px', background: 'rgba(255, 255, 255, 0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.06)', fontWeight: 500 }}>
            🔒 Vault security lock active: Payout vectors are fully encrypted and restricted to user settlement processes.
          </p>
        </div>

      </div>

      {/* Dynamic Glow, Brand Logo Interactions, and Hover Underline Global Injector */}
      <style jsx global>{`
        /* Dynamic Brand Click Active Glow Effect Configuration Module */
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

        /* Navbar Menu Items Transitions Setup */
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
        
        /* Interactive Hover Action: Text Shadow Glow & Bottom Underline Trigger Node */
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
        
        .active-link .nav-text {
          color: #111827 !important;
        }
        
        @media (max-width: 768px) {
          .desktop-nav-menu { display: none !important; }
          .mobile-menu-burger-icon { display: block !important; }
        }
      `}</style>
    </div>
  )
}

// Global Glassmorphic Card Styling Specs with Light Dark Borders
const cardStyle = {
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '14px',
  padding: '28px',
}

const sectionTitleStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 700,
  color: '#111827',
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
  color: '#111827',
  fontSize: '14px',
  marginTop: '4px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'all 0.15s ease',
}

const primaryBtnStyle = {
  background: '#1D9E75',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
}

const secondaryBtnStyle = {
  background: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  color: '#111827',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
}

const cancelBtnStyle = {
  background: 'rgba(0, 0, 0, 0.05)',
  border: 'none',
  color: '#4b5563',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
}