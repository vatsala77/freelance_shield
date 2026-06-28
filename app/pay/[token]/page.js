'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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
  const { data: session } = useSession()
  const [project, setProject] = useState(null)
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paying, setPaying] = useState(false)
  const [toast, setToast] = useState('')
  const [activity, setActivity] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [requestChangeFor, setRequestChangeFor] = useState(null)
  const [changeNote, setChangeNote] = useState('')
  const [submitFor, setSubmitFor] = useState(null)
  const [submissionLink, setSubmissionLink] = useState('')
  const [submissionNote, setSubmissionNote] = useState('')
  const [showDispute, setShowDispute] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeMilestone, setDisputeMilestone] = useState(null)
  
  const isFreelancer = session?.user?.id === project?.freelancer_id

  useEffect(() => {
    if (!token) return
    fetch(`/api/pay/${token}`)
      .then(r => r.json())
      .then(async data => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setProject(data.project)
        setMilestones(data.milestones)

        const actRes = await fetch(`/api/activity?project_id=${data.project.id}`)
        const actData = await actRes.json()

        if (actData.length > 0) {
          setActivity(actData.map(a => ({
            id: a.id,
            text: a.text,
            color: a.color,
            time: new Date(a.created_at).toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })
          })))
        } else {
          setActivity([
            { id: 1, text: `Project created by freelancer`, time: 'Earlier', color: '#888' },
          ])
        }
        setLoading(false)
      })
      .catch(() => { setError('Failed to load project'); setLoading(false) })
  }, [token])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function addActivity(text, color = '#1D9E75') {
    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: project.id, text, color }),
    })
    setActivity(prev => [{ id: Date.now(), text, time: 'Just now', color }, ...prev])
  }

  const inEscrow = milestones.filter(m => ['funded', 'submitted', 'changes_requested'].includes(m.status)).reduce((a, m) => a + (m.amount_paise / 100), 0)
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
        handler: async function () {
          await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ milestone_id: milestone.id }),
          })

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

  async function handleApprove(milestone) {
    const res = await fetch('/api/approve-milestone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone_id: milestone.id }),
    })

    const data = await res.json()
    if (!res.ok) {
      showToast('Error: ' + data.error)
      return
    }

    setMilestones(prev => prev.map(m =>
      m.id === milestone.id ? { ...m, status: 'released' } : m
    ))
    addActivity(`You approved "${milestone.title}" — ₹${(milestone.amount_paise / 100).toLocaleString('en-IN')} released to freelancer`)
    showToast(`🎉 ₹${(milestone.amount_paise / 100).toLocaleString('en-IN')} released to freelancer!`)
  }

  async function handleDispute() {
    if (!disputeReason.trim()) {
      showToast('Please write a reason for the dispute')
      return
    }

    const res = await fetch('/api/raise-dispute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        milestone_id: disputeMilestone.id,
        project_id: project.id,
        reason: disputeReason,
      })
    })

    const data = await res.json()
    if (!res.ok) {
      showToast('Error: ' + data.error)
      return
    }

    setMilestones(prev => prev.map(m =>
      m.id === disputeMilestone.id ? { ...m, status: 'disputed' } : m
    ))
    addActivity(`⚠️ Client raised a dispute: "${disputeReason}"`, '#e74c3c')
    showToast('Dispute submitted — our team will review within 24 hours')
    setShowDispute(false)
    setDisputeReason('')
    setDisputeMilestone(null)
  }

  async function downloadReceipt() {
    const element = document.getElementById('receipt-content')

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const pageHeight = 297
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 10

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= (pageHeight - 20)

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    pdf.save(`FreelanceShield-Receipt-${project.title.replace(/\s+/g, '-')}.pdf`)
  }

  async function handleRequestChanges() {
    if (!changeNote.trim()) {
      showToast('Please write what needs to change')
      return
    }

    const res = await fetch('/api/request-changes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone_id: requestChangeFor, note: changeNote }),
    })

    const data = await res.json()
    if (!res.ok) {
      showToast('Error: ' + data.error)
      return
    }

    setMilestones(prev => prev.map(m =>
      m.id === requestChangeFor ? { ...m, status: 'changes_requested', change_request_note: changeNote } : m
    ))
    addActivity(`Client requested changes: "${changeNote}"`, '#e74c3c')
    showToast('Changes requested — freelancer notified')
    setRequestChangeFor(null)
    setChangeNote('')
  }

  async function handleSubmitWork() {
    if (!submissionLink.trim()) {
      showToast('Please add a submission link')
      return
    }

    const res = await fetch('/api/submit-work', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        milestone_id: submitFor, 
        submission_link: submissionLink,
        submission_note: submissionNote 
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      showToast('Error: ' + data.error)
      return
    }

    setMilestones(prev => prev.map(m =>
      m.id === submitFor ? { ...m, status: 'submitted', submission_link: submissionLink, submission_note: submissionNote, change_request_note: null } : m
    ))
    addActivity(`Freelancer submitted work — awaiting client review`, '#f59e0b')
    showToast('✅ Work submitted — client notified')
    setSubmitFor(null)
    setSubmissionLink('')
    setSubmissionNote('')
  }

  function getStatusBadge(status) {
    const map = {
      pending: { label: 'Awaiting payment', color: '#4b5563', bg: '#f3f4f6' },
      funded: { label: 'In escrow', color: '#1D9E75', bg: '#e8f5ef' },
      submitted: { label: 'Work submitted', color: '#f59e0b', bg: '#fff8e1' },
      changes_requested: { label: 'Changes requested', color: '#e74c3c', bg: '#fdeeee' },
      released: { label: 'Released', color: '#1D9E75', bg: '#e8f5ef' },
      disputed: { label: 'Disputed', color: '#e74c3c', bg: '#fdeeee' },
    }
    const s = map[status] || map.pending
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
        {s.label}
      </span>
    )
  }

  function getProgressWidth(status) {
    const map = { pending: '5%', funded: '33%', submitted: '66%', changes_requested: '50%', released: '100%', disputed: '100%' }
    return map[status] || '0%'
  }

  if (loading) return (
    <div style={{ background: 'linear-gradient(135deg, #d4f7e6 0%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#1D9E75', fontFamily: 'sans-serif', fontWeight: 600 }}>Loading project...</p>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#e74c3c', fontWeight: 600 }}>Error: {error}</p>
    </div>
  )

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px'
    }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1D9E75', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 999, fontWeight: 500, fontSize: '14px' }}>
          {toast}
        </div>
      )}

      {/* Static Glassmorphism Navbar Layer (CRITICAL FIX: Sticky behavior removed so it stays at the top of the page) */}
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }} className="nav-item">
              <span className="nav-text">Dashboard</span>
            </Link>
            <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: 600 }}>🔒 Secure payment</span>
          </div>
        </nav>
      </div>

      {/* Main Layout Area Workspace Split Area */}
      <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '0 20px' }} className="main-split-grid">
        
        {/* Left Side Panel View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Project Details Core Overview Card */}
          <div style={cardStyle}>
            <p style={{ color: '#1D9E75', fontSize: '12px', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase' }}>PAYMENT REQUEST</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#111' }}>{project.title}</h2>
                <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>For <strong style={{ color: '#111' }}>{project.client_name}</strong> · {project.client_email}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {isFreelancer && (
                  <button
                    onClick={() => {
                      const message = `Hi ${project.client_name}! Here's your secure payment link for "${project.title}": ${window.location.href}`
                      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
                    }}
                    style={{ background: '#25D366', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📱 Share on WhatsApp
                  </button>
                )}
                <button onClick={() => setShowReceipt(true)}
                  style={{ background: 'white', border: '1px solid rgba(0, 0, 0, 0.08)', color: '#111', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  ⬇ Download receipt
                </button>
              </div>
            </div>

            {/* Parameter Metric Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '20px' }}>
              {[
                { label: 'TOTAL', val: `₹${(project.total_amount_paise / 100).toLocaleString('en-IN')}`, color: '#111' },
                { label: 'IN ESCROW', val: `₹${inEscrow.toLocaleString('en-IN')}`, color: '#1D9E75' },
                { label: 'RELEASED', val: `₹${released.toLocaleString('en-IN')} · ${releasedCount}/${milestones.length}`, color: '#111' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255, 255, 255, 0.4)', borderRadius: '10px', padding: '16px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#888', fontWeight: 600 }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ margin: '12px 0 4px', fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>MILESTONES</h3>

          {/* Milestone Loop Matrix */}
          {milestones.map((m, index) => (
            <div key={m.id} style={{ 
              background: 'rgba(255, 255, 255, 0.6)', 
              backdropFilter: 'blur(10px)',
              border: `1px solid ${m.status === 'submitted' ? '#f59e0b' : m.status === 'changes_requested' ? '#e74c3c' : m.status === 'released' ? '#1D9E75' : 'rgba(0, 0, 0, 0.08)'}`, 
              borderRadius: '16px', 
              padding: '24px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(0,0,0,0.06)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#111' }}>{m.position}</span>
                    <span style={{ fontWeight: 500, color: '#111' }}>{m.title}</span>
                    {getStatusBadge(m.status)}
                  </div>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>
                    {m.due_date && `📅 Due ${new Date(m.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · `}
                    <strong style={{ color: '#111' }}>₹{(m.amount_paise / 100).toLocaleString('en-IN')}</strong>
                  </p>
                  {isFreelancer && m.freelancer_payout_paise && (
                    <p style={{ margin: '4px 0 0', color: '#1D9E75', fontSize: '12px', fontWeight: 500 }}>
                      You'll receive ₹{(m.freelancer_payout_paise / 100).toLocaleString('en-IN')} (after 5% platform fee)
                    </p>
                  )}
                  {m.status === 'changes_requested' && m.change_request_note && (
                    <p style={{ margin: '8px 0 0', color: '#e74c3c', fontSize: '13px', background: '#fdeeee', padding: '8px 12px', borderRadius: '6px' }}>
                      💬 {m.change_request_note}
                    </p>
                  )}
                  {m.status === 'submitted' && m.submission_link && (
                    <p style={{ margin: '8px 0 0', fontSize: '13px' }}>
                      🔗 <a href={m.submission_link} target="_blank" rel="noopener noreferrer" style={{ color: '#1D9E75' }}>{m.submission_link}</a>
                    </p>
                  )}
                </div>

                {/* State Trigger Action Arrays */}
                <div className="action-button-slot">
                  {m.status === 'pending' && (index === 0 || milestones[index - 1].status === 'released') && (
                    isFreelancer ? (
                      <span style={{ color: '#888', fontSize: '13px' }}>⏳ Awaiting client payment</span>
                    ) : (
                      <button onClick={() => handlePay(m)} disabled={paying}
                        style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                        Pay ₹{(m.amount_paise / 100).toLocaleString('en-IN')}
                      </button>
                    )
                  )}

                  {m.status === 'funded' && (
                    isFreelancer ? (
                      <button onClick={() => setSubmitFor(m.id)}
                        style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                        Submit Work
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        <span style={{ color: '#1D9E75', fontSize: '13px', fontWeight: 500 }}>⏳ Awaiting submission</span>
                        <span onClick={() => { setDisputeMilestone(m); setShowDispute(true) }}
                          style={{ color: '#e74c3c', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                          ⚠️ Raise a dispute
                        </span>
                      </div>
                    )
                  )}

                  {m.status === 'submitted' && !isFreelancer && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setRequestChangeFor(m.id)}
                        style={{ background: 'white', border: '1px solid #e5e5e5', color: '#111', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                        Request Changes
                      </button>
                      <button onClick={() => handleApprove(m)}
                        style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                        ✅ Approve & Release
                      </button>
                    </div>
                  )}

                  {m.status === 'submitted' && isFreelancer && (
                    <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 500 }}>📤 Awaiting client review</span>
                  )}

                  {m.status === 'changes_requested' && (
                    isFreelancer ? (
                      <button onClick={() => setSubmitFor(m.id)}
                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                        Resubmit Work
                      </button>
                    ) : (
                      <span style={{ color: '#e74c3c', fontSize: '13px', fontWeight: 500 }}>🔄 Waiting on freelancer</span>
                    )
                  )}

                  {m.status === 'released' && <span style={{ color: '#1D9E75', fontSize: '13px', fontWeight: 500 }}>✅ Released</span>}
                  {m.status === 'disputed' && <span style={{ color: '#e74c3c', fontSize: '13px', fontWeight: 500 }}>Disputed</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#4b5563', marginBottom: '6px', fontWeight: 500 }}>
                <span>Locked</span><span>Submitted</span><span>Released</span>
              </div>
              <div style={{ background: '#f0f0f0', borderRadius: '4px', height: '6px' }}>
                <div style={{ background: '#1D9E75', height: '6px', borderRadius: '4px', width: getProgressWidth(m.status), transition: 'width 0.5s ease' }} />
              </div>
            </div>
          ))}

          {/* How are you protected? */}
          {!isFreelancer && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#111' }}>
                🛡️ How are you protected?
              </h3>
              {[
                { num: '1', title: 'Money locks upfront', desc: 'Client pays into secure Razorpay escrow — money does NOT go to freelancer yet.' },
                { num: '2', title: 'Freelancer delivers work', desc: 'Work is submitted with proof — you get notified to review.' },
                { num: '3', title: 'You approve & release', desc: 'Only after your approval does the money transfer to freelancer.' },
                { num: '4', title: 'Ghosting? Get a refund', desc: 'If freelancer disappears, raise a dispute and get a full refund.' },
              ].map(s => (
                <div key={s.num} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#1D9E75', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                    {s.num}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#111', fontSize: '14px' }}>{s.title}</p>
                    <p style={{ margin: 0, color: '#374151', fontSize: '13px', fontWeight: 500, lineHeight: '1.4' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Sidebar Panel (Scrollable and layout bounded height node) */}
        <div className="sidebar-activity-slot">
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.08)', 
            borderRadius: '16px', 
            padding: '24px', 
            position: 'sticky', 
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 140px)', 
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#111827' }}>🟢 Live activity</h3>
            
            <div 
              className="smooth-scroll-box"
              style={{ 
                overflowY: 'auto', 
                paddingRight: '4px',
                flex: 1,
                WebkitOverflowScrolling: 'touch' 
              }}
            >
              {activity.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: a.color, marginTop: '4px', flexShrink: 0, boxShadow: `0 0 8px ${a.color}` }} />
                    {i < activity.length - 1 && <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)', flex: 1, marginTop: '4px' }} />}
                  </div>
                  <div style={{ paddingBottom: '4px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '13px', color: '#111827', fontWeight: 500, lineHeight: '1.4' }}>{a.text}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#4b5563', fontWeight: 600 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NEW UPDATED DIV FOR THE TERMS AND CONDITION REFUND POLICY */}
      <div style={{ maxWidth: '1000px', margin: '24px auto 0', padding: '0 20px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '14px',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <a href="/terms" style={{ color: '#4b5563', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }} className="footer-anchor">Terms & Conditions</a>
          <a href="/refund-policy" style={{ color: '#4b5563', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }} className="footer-anchor">Refund Policy</a>
        </div>
      </div>

      {/* CONTAINER MODAL WINDOW: REVISIONS NOTES DISPATCH INTERFACE */}
      {requestChangeFor && (
        <div style={modalOverlayStyle} onClick={() => setRequestChangeFor(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#fdeeee', color: '#e74c3c', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔄</span>
              <h3 style={{ margin: 0, color: '#111', fontSize: '18px' }}>Request changes</h3>
            </div>
            <p style={{ margin: '0 0 16px', color: '#888', fontSize: '13px' }}>Specify changes you want.</p>
            
            <textarea 
              value={changeNote} 
              onChange={e => setChangeNote(e.target.value)}
              placeholder="e.g. Logo color match nahi kar raha brand guide se..."
              rows={4}
              style={textareaStyle} 
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setRequestChangeFor(null)} style={cancelModalBtnStyle}>Cancel</button>
              <button onClick={handleRequestChanges} style={submitDarkModalBtnStyle}>Send request</button>
            </div>
          </div>
        </div>
      )}

      {/* CONTAINER MODAL WINDOW: TASK DELIVERY PROOF SUBMISSION INTERFACE */}
      {submitFor && (
        <div style={modalOverlayStyle} onClick={() => setSubmitFor(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#e8f5ef', color: '#1D9E75', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📤</span>
              <h3 style={{ margin: 0, color: '#111', fontSize: '18px' }}>Submit work</h3>
            </div>
            <p style={{ margin: '0 0 16px', color: '#888', fontSize: '13px' }}>Apna kaam ka link share karo (Drive, GitHub, Figma, etc).</p>
            
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Submission link *</label>
            <input value={submissionLink} onChange={e => setSubmissionLink(e.target.value)} placeholder="https://drive.google.com/..." style={modalInputStyle} />

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 500, display: 'block', marginTop: '14px' }}>Note (optional)</label>
            <textarea value={submissionNote} onChange={e => setSubmissionNote(e.target.value)} placeholder="Kuch bhi bolna ho client ko..." rows={3} style={textareaStyle} />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setSubmitFor(null)} style={cancelModalBtnStyle}>Cancel</button>
              <button onClick={handleSubmitWork} style={{ ...submitGreenModalBtnStyle }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* CONTAINER MODAL WINDOW: FORMAL MEDIATION ESCROW DISPUTE FILE INTERFACE */}
      {showDispute && (
        <div style={modalOverlayStyle} onClick={() => setShowDispute(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#fdeeee', color: '#e74c3c', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚠️</span>
              <h3 style={{ margin: 0, color: '#111', fontSize: '18px' }}>Raise a Dispute</h3>
            </div>
            <p style={{ margin: '0 0 6px', color: '#888', fontSize: '13px' }}>Milestone: <strong style={{ color: '#111' }}>{disputeMilestone?.title}</strong></p>
            <p style={{ margin: '0 0 16px', color: '#888', fontSize: '13px' }}>After raising a dispute, our team will review the case and process the refund. Please note that this action is irreversible.</p>

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Reason *</label>
            <textarea value={disputeReason} onChange={e => setDisputeReason(e.target.value)} placeholder="e.g. Freelancer has not responded for more than 7 days..." rows={4} style={textareaStyle} />

            <div style={{ background: '#fff8e1', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#b45309', fontWeight: 600, lineHeight: '1.4' }}>
                ⏱️ The refund process may take 5-7 business days. The amount will be transferred directly to your bank account from the Razorpay escrow.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowDispute(false); setDisputeReason('') }} style={cancelModalBtnStyle}>Cancel</button>
              <button onClick={handleDispute} style={{ ...submitDarkModalBtnStyle, background: '#e74c3c' }}>Submit Dispute</button>
            </div>
          </div>
        </div>
      )}

      {/* CONTAINER MODAL WINDOW: DYNAMIC RECEIPT EXPORT WRAPPER */}
      {showReceipt && (
        <div style={modalOverlayStyle} onClick={() => setShowReceipt(false)}>
          <div style={{ background: 'white', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '16px', width: '500px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>

            <div id="receipt-content">
              <div style={{ background: '#1D9E75', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', color: 'white', fontSize: '20px' }}>FreelanceShield</h2>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Escrow Payment Receipt</p>
                </div>
                <div style={{ textDecoration: 'none', textAlign: 'right' }}>
                  <p style={{ margin: '0 0 4px', color: 'white', fontSize: '13px', fontWeight: 600 }}>Receipt #{project.id.slice(0, 8).toUpperCase()}</p>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>PROJECT</p>
                <h3 style={{ margin: '0 0 16px', color: '#111' }}>{project.title}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888' }}>Freelancer</p>
                    <p style={{ margin: 0, fontWeight: 500, color: '#111' }}>{session?.user?.name || 'Freelancer'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888' }}>Client</p>
                    <p style={{ margin: 0, fontWeight: 500, color: '#111' }}>{project.client_name}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'TOTAL PROJECT', val: `Rs. ${(project.total_amount_paise / 100).toLocaleString('en-IN')}`, color: '#111827' },
                    { label: 'IN ESCROW', val: `Rs. ${inEscrow.toLocaleString('en-IN')}`, color: '#1D9E75' },
                    { label: 'RELEASED', val: `Rs. ${released.toLocaleString('en-IN')}`, color: '#111827' },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#f9f9f9', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#888', fontWeight: 600 }}>{s.label}</p>
                      <p style={{ margin: 0, fontWeight: 700, color: s.color, fontSize: '15px' }}>{s.val}</p>
                    </div>
                  ))}
                </div>

                <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#111' }}>Milestones</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                      {['#', 'Milestone', 'Status', 'Amount'].map(h => (
                        <th key={h} style={{ padding: '8px', textAlign: 'left', fontSize: '11px', color: '#888', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {milestones.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 8px', fontSize: '13px', color: '#888' }}>{m.position}</td>
                        <td style={{ padding: '10px 8px', fontSize: '13px', color: '#111' }}>{m.title}</td>
                        <td style={{ padding: '10px 8px', fontSize: '12px', color: m.status === 'released' ? '#1D9E75' : '#888' }}>
                          {m.status === 'released' ? 'Released' : m.status === 'submitted' ? 'Work submitted' : m.status === 'funded' ? 'In escrow' : m.status === 'changes_requested' ? 'Changes requested' : 'Awaiting payment'}
                        </td>
                        <td style={{ padding: '10px 8px', fontSize: '13px', fontWeight: 600, color: '#111' }}>Rs. {(m.amount_paise / 100).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#111' }}>Activity timeline</p>
                {activity.slice(0, 6).map(a => (
                  <div key={a.id} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.color, marginTop: '5px', flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#111' }}>{a.text}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{a.time}</p>
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #e5e5e5', marginTop: '20px', paddingTop: '12px' }}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>
                    Powered by Razorpay Route. Funds held in an RBI-regulated escrow account.
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#1D9E75' }}>
                    freelanceshield.in &nbsp;·&nbsp; support@freelanceshield.in
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: '0 24px 24px' }}>
              <button onClick={downloadReceipt} style={{ width: '100%', padding: '12px', background: '#111', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginBottom: '8px' }}>
                ⬇ Download as PDF
              </button>
              <button onClick={() => setShowReceipt(false)} style={{ width: '100%', padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

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
        
        .footer-anchor:hover {
          color: #1D9E75 !important;
          text-decoration: underline !important;
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

        .main-split-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .smooth-scroll-box::-webkit-scrollbar {
          width: 5px;
        }
        .smooth-scroll-box::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
        }
        .smooth-scroll-box::-webkit-scrollbar-thumb {
          background: rgba(29, 158, 117, 0.3);
          border-radius: 10px;
        }
        .smooth-scroll-box::-webkit-scrollbar-thumb:hover {
          background: rgba(29, 158, 117, 0.5);
        }

        @media (max-width: 820px) {
          .main-split-grid {
            grid-template-columns: 1fr;
          }
          .sidebar-activity-slot {
            margin-top: 12px;
          }
        }
        @media (max-width: 520px) {
          .action-button-slot {
            width: 100%;
            margin-top: 8px;
          }
          .action-button-slot button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '16px',
  padding: '24px',
}

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 20px'
}

const modalContentStyle = {
  background: 'white',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '16px',
  width: '420px',
  padding: '28px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
}

const textareaStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  fontSize: '14px',
  marginTop: '6px',
  marginBottom: '20px',
  boxSizing: 'border-box',
  resize: 'vertical',
  background: '#f9fafb',
  color: '#111827',
  outline: 'none',
  fontWeight: 500,
  fontFamily: 'sans-serif'
}

const modalInputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  fontSize: '14px',
  marginTop: '4px',
  marginBottom: '16px',
  boxSizing: 'border-box',
  background: '#f9fafb',
  color: '#111827',
  outline: 'none',
  fontWeight: 500
}

const cancelModalBtnStyle = {
  flex: 1,
  padding: '12px',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  color: '#4b5563',
  fontSize: '14px'
}

const submitDarkModalBtnStyle = {
  flex: 1,
  padding: '12px',
  background: '#111827',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
}

const submitGreenModalBtnStyle = {
  flex: 1,
  padding: '12px',
  background: '#1D9E75',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  boxShadow: '0 4px 12px rgba(29,158,117,0.15)'
}