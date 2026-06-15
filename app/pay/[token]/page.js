'use client'
import { useState } from 'react'

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

const initialMilestones = [
  { id: 'ms-1', num: 1, title: 'Design mockups & wireframes', amount: 35000, due: 'May 18, 2026', status: 'pending' },
  { id: 'ms-2', num: 2, title: 'Frontend development', amount: 50000, due: 'Jun 02, 2026', status: 'locked' },
  { id: 'ms-3', num: 3, title: 'Backend integration & launch', amount: 60000, due: 'Jun 20, 2026', status: 'locked' },
]

const initialActivity = [
  { id: 1, text: 'Payment link shared with Kavya Mehta', time: '1 min ago', color: '#888' },
  { id: 2, text: 'Project created by Aarav Kapoor', time: '2 min ago', color: '#888' },
]

export default function PayPage() {
  const [milestones, setMilestones] = useState(initialMilestones)
  const [activity, setActivity] = useState(initialActivity)
  const [paying, setPaying] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [toast, setToast] = useState('')

  const project = {
    title: 'E-commerce Website Redesign',
    freelancer: 'Aarav Kapoor',
    client: 'Kavya Mehta',
    total: 145000,
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function addActivity(text, color = '#1D9E75') {
    setActivity(prev => [{ id: Date.now(), text, time: 'Just now', color }, ...prev])
  }

  const inEscrow = milestones.filter(m => ['funded', 'submitted', 'approved'].includes(m.status)).reduce((a, m) => a + m.amount, 0)
  const released = milestones.filter(m => m.status === 'released').reduce((a, m) => a + m.amount, 0)
  const releasedCount = milestones.filter(m => m.status === 'released').length

  async function handlePay(milestone) {
    setPaying(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { showToast('Failed to load Razorpay'); setPaying(false); return }

      const rzp = new window.Razorpay({
        key: 'rzp_test_Szd7RfZpWYTsAg',
        amount: milestone.amount * 100,
        currency: 'INR',
        name: 'FreelanceShield',
        description: `Milestone ${milestone.num}: ${milestone.title}`,
        prefill: { name: project.client, email: 'client@example.com' },
        theme: { color: '#1D9E75' },
        handler: function () {
          setMilestones(prev => prev.map(m => {
            if (m.id === milestone.id) return { ...m, status: 'funded' }
            const idx = prev.findIndex(x => x.id === milestone.id)
            if (prev.indexOf(m) === idx + 1) return { ...m, status: 'pending' }
            return m
          }))
          addActivity(`${project.client} paid ₹${milestone.amount.toLocaleString('en-IN')} into escrow for "${milestone.title}"`)
          showToast(`✅ ₹${milestone.amount.toLocaleString('en-IN')} locked in escrow!`)

          // Auto simulate work submission after 3 seconds
          setTimeout(() => {
            setMilestones(prev => prev.map(m =>
              m.id === milestone.id ? { ...m, status: 'submitted' } : m
            ))
            addActivity(`${project.freelancer} submitted work for "${milestone.title}" — awaiting your approval`, '#f59e0b')
            showToast('📤 Freelancer submitted work — review and approve!')
          }, 3000)
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
    addActivity(`You approved "${milestone.title}" — ₹${milestone.amount.toLocaleString('en-IN')} released to ${project.freelancer}`)
    showToast(`🎉 ₹${milestone.amount.toLocaleString('en-IN')} released to freelancer!`)
  }

  function getStatusBadge(status) {
    const map = {
      pending: { label: 'Awaiting payment', color: '#888', bg: '#1a1a1a' },
      locked: { label: 'Locked', color: '#888', bg: '#1a1a1a' },
      funded: { label: 'In escrow', color: '#1D9E75', bg: '#0d2e1f' },
      submitted: { label: 'Work submitted', color: '#f59e0b', bg: '#2a1f00' },
      released: { label: 'Released to freelancer', color: '#1D9E75', bg: '#0d2e1f' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
        {s.label}
      </span>
    )
  }

  function getProgressWidth(status) {
    const map = { pending: '5%', locked: '0%', funded: '33%', submitted: '66%', released: '100%' }
    return map[status] || '0%'
  }

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1D9E75', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 999, fontWeight: 500, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111' }}>FreelanceShield</span>
        </div>
        <span style={{ color: '#888', fontSize: '14px' }}>🔒 Secure payment</span>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>

        {/* Left Side */}
        <div>

          {/* Project Header */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', border: '1px solid #e5e5e5' }}>
            <p style={{ color: '#1D9E75', fontSize: '12px', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAYMENT REQUEST</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#111' }}>{project.title}</h2>
                <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>From <strong style={{ color: '#111' }}>{project.freelancer}</strong> · For <strong style={{ color: '#111' }}>{project.client}</strong></p>
              </div>
              <button
                onClick={() => setShowReceipt(true)}
                style={{ background: 'white', border: '1px solid #e5e5e5', color: '#111', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⬇ Download receipt
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
              {[
                { label: 'TOTAL', val: `₹${project.total.toLocaleString('en-IN')}`, color: '#111' },
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

          {/* Milestones */}
          <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MILESTONES</h3>

          {milestones.map((m, index) => (
            <div key={m.id} style={{ background: 'white', border: `1px solid ${m.status === 'submitted' ? '#f59e0b' : m.status === 'released' ? '#1D9E75' : '#e5e5e5'}`, borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ background: '#f0f0f0', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#111' }}>{m.num}</span>
                    <span style={{ fontWeight: 500, color: '#111' }}>{m.title}</span>
                    {getStatusBadge(m.status)}
                  </div>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>📅 Due {m.due} · <strong style={{ color: '#111' }}>₹{m.amount.toLocaleString('en-IN')}</strong></p>
                </div>

                {/* Action Button */}
                {m.status === 'pending' && (index === 0 || milestones[index - 1].status === 'released') && (
                  <button onClick={() => handlePay(m)} disabled={paying}
                    style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
                    Pay ₹{m.amount.toLocaleString('en-IN')}
                  </button>
                )}

                {m.status === 'funded' && (
                  <span style={{ color: '#1D9E75', fontSize: '13px', fontWeight: 500 }}>⏳ Awaiting submission</span>
                )}

                {m.status === 'submitted' && (
                  <button onClick={() => handleApprove(m)}
                    style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ✅ Approve & Release
                  </button>
                )}

                {m.status === 'released' && (
                  <span style={{ color: '#1D9E75', fontSize: '13px', fontWeight: 500 }}>✅ Released</span>
                )}

                {m.status === 'locked' && (
                  <span style={{ color: '#888', fontSize: '13px' }}>🔒 Pay previous first</span>
                )}
              </div>

              {/* Progress Rail */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '6px' }}>
                <span>Locked</span><span>Submitted</span><span>Released</span>
              </div>
              <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '6px' }}>
                <div style={{ background: '#1D9E75', height: '6px', borderRadius: '4px', width: getProgressWidth(m.status), transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right Side — Live Activity */}
        <div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e5e5', position: 'sticky', top: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🟢 Live activity
            </h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {activity.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: a.color, marginTop: '4px', flexShrink: 0 }} />
                    {i < activity.length - 1 && <div style={{ width: '1px', background: '#e5e5e5', flex: 1, marginTop: '4px' }} />}
                  </div>
                  <div style={{ paddingBottom: '8px' }}>
                    <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#111', lineHeight: 1.4 }}>{a.text}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowReceipt(false)}>
          <div style={{ background: 'white', borderRadius: '16px', width: '500px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>

            {/* Receipt Header */}
            <div style={{ background: '#1D9E75', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'white', fontSize: '20px' }}>FreelanceShield</h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Escrow Payment Receipt</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px', color: 'white', fontSize: '13px', fontWeight: 600 }}>Receipt #FS-2026-001</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Issued {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Receipt Body */}
            <div style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>PROJECT</p>
              <h3 style={{ margin: '0 0 16px', color: '#111' }}>{project.title}</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888' }}>Freelancer</p>
                  <p style={{ margin: 0, fontWeight: 500, color: '#111' }}>{project.freelancer}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888' }}>Client</p>
                  <p style={{ margin: 0, fontWeight: 500, color: '#111' }}>{project.client}</p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'TOTAL PROJECT', val: `Rs. ${project.total.toLocaleString('en-IN')}`, color: '#111' },
                  { label: 'IN ESCROW', val: `Rs. ${inEscrow.toLocaleString('en-IN')}`, color: '#1D9E75' },
                  { label: 'RELEASED', val: `Rs. ${released.toLocaleString('en-IN')}`, color: '#111' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#888', fontWeight: 600 }}>{s.label}</p>
                    <p style={{ margin: 0, fontWeight: 700, color: s.color, fontSize: '15px' }}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Milestones Table */}
              <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#111' }}>Milestones</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                    {['#', 'Milestone', 'Due', 'Status', 'Amount'].map(h => (
                      <th key={h} style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {milestones.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 8px', fontSize: '13px', color: '#888' }}>{m.num}</td>
                      <td style={{ padding: '10px 8px', fontSize: '13px', color: '#111' }}>{m.title}</td>
                      <td style={{ padding: '10px 8px', fontSize: '12px', color: '#888' }}>{m.due}</td>
                      <td style={{ padding: '10px 8px', fontSize: '12px', color: m.status === 'released' ? '#1D9E75' : '#888' }}>
                        {m.status === 'released' ? 'Released' : m.status === 'submitted' ? 'Work submitted' : m.status === 'funded' ? 'In escrow' : 'Awaiting payment'}
                      </td>
                      <td style={{ padding: '10px 8px', fontSize: '13px', fontWeight: 600, color: '#111' }}>Rs. {m.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Activity */}
              <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#111' }}>Activity timeline</p>
              {activity.slice(0, 5).map(a => (
                <div key={a.id} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#111' }}>{a.text}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{a.time}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowReceipt(false)}
                style={{ width: '100%', padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginTop: '16px' }}>
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}