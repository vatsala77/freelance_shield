'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Footer from '../components/Footer'

export default function CreateProject() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [hasBankDetails, setHasBankDetails] = useState(true)
  const [checkingBank, setCheckingBank] = useState(true)
  
  // States for dynamic real-time error indicator logs
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const [form, setForm] = useState({
    title: '',
    client_name: '',
    client_email: '',
    client_phone: '',
  })
  const [milestones, setMilestones] = useState([
    { id: 1, title: '', description: '', amount: '', due: '' }
  ])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/bank-details?user_id=${session.user.id}`)
      .then(r => r.json())
      .then(data => {
        setHasBankDetails(!!data.bank_details_added)
        setCheckingBank(false)
      })
      .catch(() => setCheckingBank(false))
  }, [session])

  // Real-time email verification parser engine
  function validateEmailFormat(emailVal) {
    if (!emailVal) {
      setEmailError('')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailVal.includes('@')) {
      setEmailError('⚠️ Email address must contain an "@" symbol')
    } else if (!emailRegex.test(emailVal)) {
      setEmailError('⚠️ Invalid email format (e.g. example@domain.com)')
    } else {
      setEmailError('') // Clear validation error state
    }
  }

  // Real-time phone configuration validation engine
  function validatePhoneFormat(phoneVal) {
    if (!phoneVal) {
      setPhoneError('')
      return
    }
    // Check constraint for exact 10 Indian standard digits
    if (phoneVal.length < 10) {
      setPhoneError('⚠️ Enter valid phone number')
    } else {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(phoneVal)) {
        setPhoneError('⚠️ Indian mobile number must start with 6, 7, 8, or 9')
      } else {
        setPhoneError('') // Clear validation error state
      }
    }
  }

  // Refined structural form tracking handler
  function handleForm(e) {
    if (e.target.name === 'client_phone') {
      // Strips text characters completely and locks maximum type length to 10
      const onlyNums = e.target.value.replace(/\D/g, '')
      if (onlyNums.length <= 10) {
        setForm({ ...form, client_phone: onlyNums })
        // Execute dynamic verification checks while typing
        validatePhoneFormat(onlyNums)
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
      
      // Monitor live indicators if target changes on the email field
      if (e.target.name === 'client_email') {
        validateEmailFormat(e.target.value)
      }
    }
  }

  // Airtight state mutator for milestones supporting live input filters
  function handleMilestone(id, field, value) {
    let finalValue = value

    // If the targeted field is amount, explicitly drop alphabets, decimals, or negative markers
    if (field === 'amount') {
      finalValue = value.replace(/\D/g, '')
    }

    setMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: finalValue } : m))
  }

  function addMilestone() {
    setMilestones(prev => [...prev, { id: Date.now(), title: '', description: '', amount: '', due: '' }])
  }

  function removeMilestone(id) {
    if (milestones.length === 1) return
    setMilestones(prev => prev.filter(m => m.id !== id))
  }

  const total = milestones.reduce((a, m) => a + (Number(m.amount) || 0), 0)
  const fee = Math.round(total * 0.05)

  async function handleSubmit() {
    // 1. Structural missing presence checks
    if (!form.title || !form.client_name || !form.client_email) {
      alert('Please fill all required fields (*)')
      return
    }

    // 2. Strict UI state runtime blocks against existing error fields
    if (emailError) {
      alert(`❌ Error: Please resolve email validation conflict first:\n${emailError}`)
      return
    }

    if (phoneError) {
      alert(`❌ Error: Please resolve phone validation conflict first:\n${phoneError}`)
      return
    }

    // 3. Final structural backup email validation filter
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.client_email)) {
      alert('❌ Error: Please enter a valid client email address.')
      return
    }

    // 4. Final WhatsApp phone validation length and index prefix checks
    if (form.client_phone.trim()) {
      if (form.client_phone.length !== 10) {
        alert('❌ Error: Enter valid phone number')
        return
      }
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(form.client_phone)) {
        alert('❌ Error: Standard Indian phone numbers must start with a digit from 6 to 9.')
        return
      }
    }

    // 5. Check baseline parameters inside active milestone records
    if (milestones.some(m => !m.title || !m.amount)) {
      alert('Please fill all milestone titles and amounts')
      return
    }

    // 6. Security Validation Lock: Enforce Minimum ₹500 Per Escrow Contract Node
    for (let i = 0; i < milestones.length; i++) {
      if (Number(milestones[i].amount) < 500) {
        alert(`❌ Amount Error: Milestone ${i + 1} ("${milestones[i].title || `Milestone ${i+1}`}") budget allocation must be at least ₹500 to process gateway contracts.`)
        return
      }
    }

    // 7. Chronological incremental date timeline sequence verification engine
    for (let i = 0; i < milestones.length; i++) {
      const currentMilestone = milestones[i]
      if (currentMilestone.due && i > 0) {
        const currentDate = new Date(currentMilestone.due)
        const prevMilestone = milestones[i - 1]
        
        if (prevMilestone.due) {
          const prevDate = new Date(prevMilestone.due)
          if (currentDate <= prevDate) {
            alert(`📅 Timeline Chronology Error:\nMilestone ${i + 1} ("${currentMilestone.title || `Milestone ${i+1}`}") due date must be scheduled after Milestone ${i} ("${prevMilestone.title || `Milestone ${i}`}") target date!`)
            return
          }
        }
      }
    }

    setLoading(true)

    const freelancer_id = session?.user?.id
    if (!freelancer_id) {
      alert('Session expired, please login again')
      router.push('/login')
      return
    }

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, milestones, freelancer_id }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert('Error: ' + data.error)
      setLoading(false)
      return
    }

    setLoading(false)
    const link = `${window.location.origin}/pay/${data.invite_token}`
    alert(`Project created! Payment link:\n${link}`)
    router.push('/dashboard')
  }

  if (checkingBank) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #d4f7e6 0%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1D9E75', fontFamily: 'sans-serif', fontWeight: 600 }}>Loading...</p>
      </div>
    )
  }

  if (!hasBankDetails) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px', padding: '32px', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(29,158,117,0.02)' }}>
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🏦</p>
          <h3 style={{ margin: '0 0 8px', color: '#111827', fontWeight: 700 }}>Add your bank details first</h3>
          <p style={{ color: '#4b5563', margin: '0 0 20px', fontSize: '14px', fontWeight: 500 }}>
            We need your bank details to release payments when a client approves a milestone.
          </p>
          <button onClick={() => router.push('/settings/bank-details')}
            style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Add bank details
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px'
    }}>

      {/* Floating Glassmorphism Navbar Layer */}
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
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-nav-menu">
            <Link href="/dashboard" style={{ textDecoration: 'none' }} className="nav-item">
              <span className="nav-text">Dashboard</span>
            </Link>
            <Link href="/create" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item active-link">
              <span className="nav-text" style={{ color: '#111827' }}>New Project</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px', background: '#1D9E75', borderRadius: '2px' }} />
            </Link>
          </div>
        </nav>
      </div>

      <div style={{ maxWidth: '680px', margin: '20px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 6px', fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Create a new project</h2>
        <p style={{ margin: '0 0 28px', color: '#273142', fontSize: '14px', fontWeight: 600 }}>Define milestones and we'll generate a secure payment link for your client.</p>

        {/* Form Context Info Container Block */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#111827' }}>Project details</h3>

          <label style={labelStyle}>Project title *</label>
          <input name="title" value={form.title} onChange={handleForm}
            placeholder="e.g. E-commerce Website Redesign"
            style={inputStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
            <div>
              <label style={labelStyle}>Client name *</label>
              <input name="client_name" value={form.client_name} onChange={handleForm}
                placeholder="Kavya Mehta"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Client email *</label>
              <input name="client_email" type="email" value={form.client_email} onChange={handleForm}
                onBlur={(e) => validateEmailFormat(e.target.value)}
                placeholder="kavya@company.com"
                style={{
                  ...inputStyle,
                  border: emailError ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.08)',
                  backgroundColor: emailError ? '#fff5f5' : 'white'
                }} />
              {emailError && (
                <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0', fontWeight: 500 }}>
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <label style={labelStyle}>Client WhatsApp number</label>
            <input name="client_phone" value={form.client_phone} onChange={handleForm}
              onBlur={(e) => validatePhoneFormat(e.target.value)}
              placeholder="e.g. 9876543210 (Max 10 digits)"
              style={{
                ...inputStyle,
                border: phoneError ? '1px solid #e74c3c' : '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: phoneError ? '#fff5f5' : 'white'
              }} />
            {phoneError && (
              <p style={{ color: '#e74c3c', fontSize: '12px', margin: '5px 0 0', fontWeight: 500 }}>
                {phoneError}
              </p>
            )}
          </div>
        </div>

        {/* Milestones Setup Pipeline Wrapper */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>Milestones</h3>
            <button onClick={addMilestone}
              style={{ background: 'white', border: '1px solid rgba(0, 0, 0, 0.08)', color: '#111827', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              + Add Milestone
            </button>
          </div>

          {milestones.map((m, index) => (
            <div key={m.id} style={{ background: 'rgba(255, 255, 255, 0.4)', border: '1px solid rgba(0, 0, 0, 0.06)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#1D9E75', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>Milestone {index + 1}</span>
                </div>
                {milestones.length > 1 && (
                  <button onClick={() => removeMilestone(m.id)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '20px', fontWeight: 500, lineHeight: 1 }}>
                    ×
                  </button>
                )}
              </div>

              <label style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>Title *</label>
              <input value={m.title} onChange={e => handleMilestone(m.id, 'title', e.target.value)}
                placeholder="e.g. Design mockups"
                style={{ ...inputStyle, fontSize: '13px' }} />

              <label style={{ fontSize: '12px', color: '#374151', fontWeight: 600, marginTop: '8px', display: 'block' }}>Description</label>
              <textarea value={m.description} onChange={e => handleMilestone(m.id, 'description', e.target.value)}
                placeholder="What will be delivered?"
                rows={2}
                style={{ ...inputStyle, fontSize: '13px', resize: 'vertical', fontFamily: 'sans-serif' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>Amount (₹) *</label>
                  <input type="text" value={m.amount} onChange={e => handleMilestone(m.id, 'amount', e.target.value)}
                    placeholder="Min 500"
                    style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>Due date</label>
                  <input type="date" value={m.due} onChange={e => handleMilestone(m.id, 'due', e.target.value)}
                    min={index > 0 ? milestones[index - 1].due : ''}
                    style={{ ...inputStyle, fontSize: '13px', color: '#111827' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Ledger Financial Summary */}
      <div style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
  {/* Project Subtotal */}
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
    <span style={{ color: '#374151', fontSize: '14px', fontWeight: 500 }}>Project subtotal</span>
    <span style={{ color: '#111827', fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
  </div>
  
  {/* FreelanceShield Fee & Razorpay Note */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
    {/* Left Side: Column Layout for Text and Note */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ color: '#374151', fontSize: '14px', fontWeight: 500 }}>
        FreelanceShield fee (0%) <strong style={{ color: '#1D9E75' }}>Beta-Free</strong>
      </span>
      {/* Razorpay Note right underneath */}
      <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 400 }}>
        *Razorpay platform fees applied
      </span>
    </div>
    
    {/* Right Side: Amount */}
    <span style={{ color: '#4b5563', fontWeight: 500 }}>₹{fee.toLocaleString('en-IN')}</span>
  </div>
  
  {/* Total Amount */}
  <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ fontWeight: 700, color: '#111827' }}>Total project amount</span>
    <span style={{ fontWeight: 800, color: '#111827', fontSize: '18px' }}>₹{total.toLocaleString('en-IN')}</span>
  </div>
</div>

        {/* Submit Action Interface Link Generator Button */}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '16px', background: '#111827', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {loading ? 'Creating project...' : '🔗 Generate Payment Link'}
        </button>

      </div>

      {/* Global CSS Injector Module */}
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
        
        @media (max-width: 768px) {
          .desktop-nav-menu { display: none !important; }
        }
      `}</style>
      <Footer />
    </div>
  )
}

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '16px'
}

const labelStyle = {
  fontSize: '13px',
  color: '#374151',
  fontWeight: 600
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
}