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

  function handleForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleMilestone(id, field, value) {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
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
    if (!form.title || !form.client_name || !form.client_email) {
      alert('Please fill all required fields')
      return
    }
    if (milestones.some(m => !m.title || !m.amount)) {
      alert('Please fill all milestone titles and amounts')
      return
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
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/dashboard">
            <span style={{ color: '#888', fontSize: '14px', cursor: 'pointer' }}>Dashboard</span>
          </Link>
          <Link href="/create">
            <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              New Project
            </button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '32px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111' }}>Create a new project</h2>
        <p style={{ margin: '0 0 28px', color: '#888', fontSize: '14px' }}>Define milestones and we'll generate a secure payment link for your client.</p>

        {/* Project Details */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 600, color: '#111' }}>Project details</h3>

          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Project title *</label>
          <input name="title" value={form.title} onChange={handleForm}
            placeholder="e.g. E-commerce Website Redesign"
            style={inputStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Client name *</label>
              <input name="client_name" value={form.client_name} onChange={handleForm}
                placeholder="Kavya Mehta"
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Client email *</label>
              <input name="client_email" type="email" value={form.client_email} onChange={handleForm}
                placeholder="kavya@company.com"
                style={inputStyle} />
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Client WhatsApp number</label>
            <input name="client_phone" value={form.client_phone} onChange={handleForm}
              placeholder="+91 98765 43210"
              style={inputStyle} />
          </div>
        </div>

        {/* Milestones */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111' }}>Milestones</h3>
            <button onClick={addMilestone}
              style={{ background: 'white', border: '1px solid #e5e5e5', color: '#111', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
              + Add Milestone
            </button>
          </div>

          {milestones.map((m, index) => (
            <div key={m.id} style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#1D9E75', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: 500, fontSize: '14px', color: '#111' }}>Milestone {index + 1}</span>
                </div>
                {milestones.length > 1 && (
                  <button onClick={() => removeMilestone(m.id)}
                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>
                    ×
                  </button>
                )}
              </div>

              <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Title *</label>
              <input value={m.title} onChange={e => handleMilestone(m.id, 'title', e.target.value)}
                placeholder="e.g. Design mockups"
                style={{ ...inputStyle, fontSize: '13px' }} />

              <label style={{ fontSize: '12px', color: '#888', fontWeight: 500, marginTop: '8px', display: 'block' }}>Description</label>
              <textarea value={m.description} onChange={e => handleMilestone(m.id, 'description', e.target.value)}
                placeholder="What will be delivered?"
                rows={2}
                style={{ ...inputStyle, fontSize: '13px', resize: 'vertical' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Amount (₹) *</label>
                  <input type="number" value={m.amount} onChange={e => handleMilestone(m.id, 'amount', e.target.value)}
                    placeholder="25000"
                    style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Due date</label>
                  <input type="date" value={m.due} onChange={e => handleMilestone(m.id, 'due', e.target.value)}
                    style={{ ...inputStyle, fontSize: '13px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>Project subtotal</span>
            <span style={{ color: '#111', fontWeight: 500 }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>FreelanceShield fee (5%)</span>
            <span style={{ color: '#888' }}>₹{fee.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#111' }}>Total project amount</span>
            <span style={{ fontWeight: 700, color: '#111', fontSize: '18px' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: '16px', background: '#111', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Creating project...' : '🔗 Generate Payment Link'}
        </button>

      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #e5e5e5',
  background: 'white',
  color: '#111',
  fontSize: '14px',
  marginTop: '4px',
  boxSizing: 'border-box',
  outline: 'none',
}