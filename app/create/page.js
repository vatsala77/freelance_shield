'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

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
      <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </div>
    )
  }

  if (!hasBankDetails) {
    return (
      <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '32px', maxWidth: '400px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🏦</p>
          <h3 style={{ margin: '0 0 8px', color: '#111' }}>Add your bank details first</h3>
          <p style={{ color: '#888', margin: '0 0 20px', fontSize: '14px' }}>
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
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Navbar Layout Structure */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 700, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <span style={{ color: '#666', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Dashboard</span>
          </Link>
          <Link href="/create">
            <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              New Project
            </button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '32px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Create a new project</h2>
        <p style={{ margin: '0 0 28px', color: '#666', fontSize: '14px' }}>Define milestones and we'll generate a secure payment link for your client.</p>

        {/* Form Context Info Container Block */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#111' }}>Project details</h3>

          <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Project title *</label>
          <input name="title" value={form.title} onChange={handleForm}
            placeholder="e.g. E-commerce Website Redesign"
            style={inputStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Client name *</label>
              <input name="client_name" value={form.client_name} onChange={handleForm}
                placeholder="Kavya Mehta"
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Client email *</label>
              <input name="client_email" type="email" value={form.client_email} onChange={handleForm}
                onBlur={(e) => validateEmailFormat(e.target.value)}
                placeholder="kavya@company.com"
                style={{
                  ...inputStyle,
                  border: emailError ? '1px solid #e74c3c' : '1px solid #d1d5db',
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
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Client WhatsApp number</label>
            <input name="client_phone" value={form.client_phone} onChange={handleForm}
              onBlur={(e) => validatePhoneFormat(e.target.value)}
              placeholder="e.g. 9876543210 (Max 10 digits)"
              style={{
                ...inputStyle,
                border: phoneError ? '1px solid #e74c3c' : '1px solid #d1d5db',
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
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111' }}>Milestones</h3>
            <button onClick={addMilestone}
              style={{ background: 'white', border: '1px solid #d1d5db', color: '#111', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              + Add Milestone
            </button>
          </div>

          {milestones.map((m, index) => (
            <div key={m.id} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#1D9E75', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>Milestone {index + 1}</span>
                </div>
                {milestones.length > 1 && (
                  <button onClick={() => removeMilestone(m.id)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '20px', fontWeight: 500, lineHeight: 1 }}>
                    ×
                  </button>
                )}
              </div>

              <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Title *</label>
              <input value={m.title} onChange={e => handleMilestone(m.id, 'title', e.target.value)}
                placeholder="e.g. Design mockups"
                style={{ ...inputStyle, fontSize: '13px' }} />

              <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginTop: '8px', display: 'block' }}>Description</label>
              <textarea value={m.description} onChange={e => handleMilestone(m.id, 'description', e.target.value)}
                placeholder="What will be delivered?"
                rows={2}
                style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Amount (₹) *</label>
                  {/* Changed type to text to cleanly manage custom character regex filters */}
                  <input type="text" value={m.amount} onChange={e => handleMilestone(m.id, 'amount', e.target.value)}
                    placeholder="Min 500"
                    style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Due date</label>
                  <input type="date" value={m.due} onChange={e => handleMilestone(m.id, 'due', e.target.value)}
                    min={index > 0 ? milestones[index - 1].due : ''}
                    style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Ledger Financial Summary */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>Project subtotal</span>
            <span style={{ color: '#111', fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>FreelanceShield fee (5%)</span>
            <span style={{ color: '#666', fontWeight: 500 }}>₹{fee.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, color: '#111' }}>Total project amount</span>
            <span style={{ fontWeight: 800, color: '#111', fontSize: '18px' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Submit Action Interface Link Generator Button */}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '16px', background: '#111', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {loading ? 'Creating project...' : '🔗 Generate Payment Link'}
        </button>

      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#111',
  fontSize: '14px',
  marginTop: '4px',
  boxSizing: 'border-box',
  outline: 'none',
}