'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PayPage() {
  const { token } = useParams()
  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paying, setPaying] = useState(false)
  const [toast, setToast] = useState('')
  const [activity, setActivity] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    if (!token) return
    fetch(`/api/pay/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setProject(data.project)
        setMilestones(data.milestones)
        setActivity([
          { id: 1, text: `Payment link shared with ${data.project.client_name}`, time: 'Earlier', color: '#888' },
          { id: 2, text: `Project created by freelancer`, time: 'Earlier', color: '#888' },
        ])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load project'); setLoading(false) })
  }, [token])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function addActivity(text, color = '#1D9E75') {
    setActivity(prev => [{ id: Date.now(), text, time: 'Just now', color }, ...prev])
  }

  const inEscrow = milestones.filter(m => ['funded', 'submitted', 'approved'].includes(m.status)).reduce((a, m) => a + (m.amount_paise / 100), 0)
  const released = milestones.filter(m => m.status === 'released').reduce((a, m) => a + (m.amount_paise / 100), 0)
  const releasedCount = milestones.filter(m => m.status === 'released').length

  async function handlePay(milestone) {
    setPaying(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { showToast('Failed to load Razorpay'); setPaying(false); return }

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestone.id, project_id: project.id })
      })
      const order = await res.json()
      if (order.error) { showToast('Error: ' + order.error); setPaying(false); return }

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'FreelanceShield',
        description: `Milestone: ${milestone.title}`,
        order_id: order.order_id,
        prefill: { name: project.client_name, email: project.client_email },
        theme: { color: '#1D9E75' },
        handler: function () {
          setMilestones(prev => prev.map(m =>
            m.id === milestone.id ? { ...m, status: 'funded' } : m
          ))
          addActivity(`${project.client_name} paid ₹${(milestone.amount_paise / 100).toLocaleString('en-IN')} into escrow for "${milestone.title}"`)
          showToast(`✅ ₹${(milestone.amount_paise / 100).toLocaleString('en-IN')} locked in escrow!`)
        },
        modal: { ondismiss: () => setPaying(false) }
      })
      rzp.open()
    } catch (err) {
      showToast('Something went wrong')
    } finally {
      setPaying(false)
    }
  }

  function handleApprove(milestone) {
    setMilestones(prev => prev.map(m =>
      m.id === milestone.id ? { ...m, status: 'released' } : m
    ))
    addActivity(`You approved "${milestone.title}" — ₹${(milestone.amount_paise / 100).toLocaleString('en-IN')} released to freelancer`)
    showToast(`🎉 ₹${(milestone.amount_paise / 100).toLocaleString('en-IN')} released to freelancer!`)
  }

  function getStatusBadge(status) {
    const map = {
      pending: { label: 'Awaiting payment', color: '#888', bg: '#f0f0f0' },
      funded: { label: 'In escrow', color: '#1D9E75', bg: '#e8f5ef' },
      submitted: { label: 'Work submitted', color: '#f59e0b', bg: '#fff8e1' },
      released: { label: 'Released', color: '#1D9E75', bg: '#e8f5ef' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
        {s.label}
      </span>
    )
  }

  function getProgressWidth(status) {
    const map = { pending: '5%', funded: '33%', submitted: '66%', released: '100%' }
    return map[status] || '0%'
  }

  if (loading) return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading project...</p>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#e74c3c' }}>Error: {error}</p>
    </div>
  )

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1D9E75', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 999, fontWeight: 500, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111' }}>FreelanceShield</span>
        </div>
        <span style={{ color: '#888', fontSize: '14px' }}>🔒 Secure payment</span>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

        <div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #e5e5e5' }}>
            <p style={{ color: '#1D9E75', fontSize: '12px', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase' }}>PAYMENT REQUEST</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#111' }}>{project.title}</h2>
                <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>For <strong style={{ color: '#111' }}>{project.client_name}</strong> · {project.client_email}</p>
              </div>
              <button onClick={() => setShowReceipt(true)}
                style={{ background: 'white', border: '1px solid #e5e5e5', color: '#111', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                ⬇ Download receipt
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
              {[
                { label: 'TOTAL', val: `₹${(project.total_amount_paise / 100).toLocaleString('en-IN')}`, color: '#111' },
                { label: 'IN ESCROW', val: `₹${inEscrow.toLocaleString('en-IN')}`, color: '#1D9E75' },
                { label: 'RELEASED', val: `₹${released.toLocaleString('en-IN')} · ${releasedCount}/${milestones.length}`, color: '#111' },
              ].map(s => (
                <div key={s.label} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#888', fontWeight: 600 }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>MILESTONES</h3>

          {milestones.map((m, index) => (
            <div key={m.id} style={{ background: 'white', border: `1px solid ${m.status === 'submitted' ? '#f59e0b' : m.status === 'released' ? '#1D9E75' : '#e5e5e5'}`, borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ background: '#f0f0f0', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#111' }}>{m.position}</span>
                    <span style={{ fontWeight: 500, color: '#111' }}>{m.title}</span>
                    {getStatusBadge(m.status)}
                  </div>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>
                    {m.due_date && `📅 Due ${new Date(m.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · `}
                    <strong style={{ color: '#111' }}>₹{(m.amount_paise / 100).toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                {m.status === 'pending' && (index === 0 || milestones[index - 1].status === 'released') && (
                  <button onClick={() => handlePay(m)} disabled={paying}
                    style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                    Pay ₹{(m.amount_paise / 100).toLocaleString('en-IN')}
                  </button>
                )}
                {m.status === 'funded' && <span style={{ color: '#1D9E75', fontSize: '13px', fontWeight: 500 }}>⏳ Awaiting submission</span>}
                {m.status === 'submitted' && (
                  <button onClick={() => handleApprove(m)}
                    style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                    ✅ Approve & Release
                  </button>
                )}
                {m.status === 'released' && <span style={{ color: '#1D9E75', fontSize: '13px', fontWeight: 500 }}>✅ Released</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '6px' }}>
                <span>Locked</span><span>Submitted</span><span>Released</span>
              </div>
              <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '6px' }}>
                <div style={{ background: '#1D9E75', height: '6px', borderRadius: '4px', width: getProgressWidth(m.status), transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e5e5', position: 'sticky', top: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#111' }}>🟢 Live activity</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {activity.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: a.color, marginTop: '4px', flexShrink: 0 }} />
                    {i < activity.length - 1 && <div style={{ width: '1px', background: '#e5e5e5', flex: 1, marginTop: '4px' }} />}
                  </div>
                  <div style={{ paddingBottom: '8px' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#111' }}>{a.text}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}