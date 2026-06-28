'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ProjectManage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', amount: '', due: '' })
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', amount: '', due: '' })

  useEffect(() => {
    if (!id) return
    fetch(`/api/project-detail/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setLoading(false); return }
        setProject(data)
        setLoading(false)
      })
      .catch(() => { setError('Failed to load project'); setLoading(false) })
  }, [id])

  function startEdit(m) {
    setEditingId(m.id)
    setEditForm({
      title: m.title,
      description: m.description || '',
      amount: m.amount_paise / 100,
      due: m.due_date || '',
    })
  }

  async function saveEdit() {
    if (!editForm.title || !editForm.amount) {
      alert('Please fill title and amount')
      return
    }

    setSaving(true)
    const res = await fetch('/api/update-milestone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        milestone_id: editingId,
        title: editForm.title,
        description: editForm.description,
        amount: editForm.amount,
        due_date: editForm.due || null,
      }),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      alert('Error: ' + data.error)
      return
    }

    setProject(prev => ({
      ...prev,
      milestones: prev.milestones.map(m =>
        m.id === editingId
          ? { ...m, title: editForm.title, description: editForm.description, amount_paise: Math.round(editForm.amount * 100), due_date: editForm.due }
          : m
      )
    }))
    setEditingId(null)
  }

  async function addMilestone() {
    if (!newMilestone.title || !newMilestone.amount) {
      alert('Please fill title and amount')
      return
    }

    setSaving(true)
    const res = await fetch('/api/add-milestone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: id,
        title: newMilestone.title,
        description: newMilestone.description,
        amount: newMilestone.amount,
        due_date: newMilestone.due || null,
      }),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      alert('Error: ' + data.error)
      return
    }

    const refreshed = await fetch(`/api/project-detail/${id}`).then(r => r.json())
    setProject(refreshed)
    setNewMilestone({ title: '', description: '', amount: '', due: '' })
    setShowAddForm(false)
  }

  async function handleDeleteMilestone(milestoneId) {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this milestone phase?")
    if (!confirmDelete) return

    setSaving(true)
    try {
      const res = await fetch(`/api/delete-milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete milestone')
      }

      setProject(prev => ({
        ...prev,
        milestones: prev.milestones.filter(m => m.id !== milestoneId)
      }))
      alert('Milestone deleted successfully.')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  function getStatusInfo(status) {
    const map = {
      pending: { label: 'Not paid yet — editable', color: '#4b5563', bg: 'rgba(0, 0, 0, 0.05)', locked: false },
      funded: { label: 'In escrow — locked', color: '#1D9E75', bg: '#e8f5ef', locked: true },
      submitted: { label: 'Work submitted — locked', color: '#d97706', bg: '#fef3c7', locked: true },
      changes_requested: { label: 'Changes requested — locked', color: '#dc2626', bg: '#fee2e2', locked: true },
      released: { label: 'Released — locked', color: '#1D9E75', bg: '#e8f5ef', locked: true },
      disputed: { label: '🛑 Under Dispute — locked', color: '#b45309', bg: '#fef3c7', locked: true },
      Disputed: { label: '🛑 Under Dispute — locked', color: '#b45309', bg: '#fef3c7', locked: true }
    }
    return map[status] || { label: status + ' — locked', color: '#111827', bg: 'rgba(0,0,0,0.05)', locked: true }
  }

  if (loading) return (
    <div style={{ background: 'linear-gradient(135deg, #d4f7e6 0%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#1D9E75', fontFamily: 'sans-serif', fontWeight: 600 }}>Loading project context...</p>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#dc2626', fontFamily: 'sans-serif', fontWeight: 600 }}>Error: {error}</p>
    </div>
  )

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px',
      color: '#111827'
    }}>

      {/* Static Glassmorphism Navbar Layer (No Sticky Freeze) */}
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

      {/* Primary Container Box */}
      <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>{project.title}</h2>
        <p style={{ margin: '0 0 32px', color: '#374151', fontSize: 'clamp(12px, 2.5vw, 14px)', fontWeight: 600 }}>
          Client Account Name: <strong style={{ color: '#111827' }}>{project.client_name}</strong> &nbsp;·&nbsp; <Link href={`/pay/${project.invite_token}`} style={{ color: '#1D9E75', fontWeight: 700, textDecoration: 'underline' }}>View dynamic client link →</Link>
        </p>

        <h3 style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MILESTONES STACK</h3>

        {/* Milestones Dynamic Array */}
        {project.milestones.map(m => {
          const statusInfo = getStatusInfo(m.status)
          const isEditing = editingId === m.id
          const canDelete = m.status === 'pending'

          return (
            <div key={m.id} style={cardStyle}>
              {isEditing ? (
                <div>
                  <label style={labelStyle}>Milestone Phase Title</label>
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={inputStyle} />

                  <label style={{ ...labelStyle, marginTop: '12px', display: 'block' }}>Description Log</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'sans-serif' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <label style={labelStyle}>Amount Split (₹)</label>
                      <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Due Target Date</label>
                      <input type="date" value={editForm.due} onChange={e => setEditForm({ ...editForm, due: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button onClick={() => setEditingId(null)} style={cancelBtnStyle}>Cancel</button>
                    <button onClick={saveEdit} disabled={saving} style={primaryBtnStyle}>{saving ? 'Saving updates...' : 'Save Changes'}</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }} className="milestone-manage-row">
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#111827', fontSize: 'clamp(15px, 3.5vw, 18px)', letterSpacing: '-0.01em' }}>{m.title}</span>
                      <span style={{ background: statusInfo.bg, color: statusInfo.color, padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', border: '1px solid rgba(0,0,0,0.03)' }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px', color: '#374151', fontSize: '14px', fontWeight: 500 }}>
                      Client Escrow Budget: <strong style={{ color: '#111827' }}>₹{(m.amount_paise / 100).toLocaleString('en-IN')}</strong>
                    </p>
                  
                  </div>

                  {/* Controls Action Slots Interface */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!statusInfo.locked && (
                      <button onClick={() => startEdit(m)} style={secondaryBtnStyle}>
                        Edit
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleDeleteMilestone(m.id)}
                      disabled={!canDelete || saving}
                      title={canDelete ? "Delete this phase milestone" : "Locked: Cannot delete milestone once funded, submitted, or disputed."}
                      style={{ 
                        background: 'none', 
                        border: '1px solid rgba(231, 76, 60, 0.15)', 
                        color: canDelete ? '#e74c3c' : '#ccc', 
                        padding: '8px 14px', 
                        borderRadius: '8px', 
                        cursor: canDelete ? 'pointer' : 'not-allowed', 
                        fontSize: '13px',
                        backgroundColor: canDelete ? 'rgba(231, 76, 60, 0.02)' : 'rgba(0,0,0,0.02)'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add Milestone Block Form Structure */}
        {showAddForm ? (
          <div style={{ ...cardStyle, border: '1px solid #1D9E75', background: 'rgba(255, 255, 255, 0.85)' }}>
            <h4 style={{ margin: '0 0 14px', color: '#111827', fontSize: '15px', fontWeight: 700 }}>New Pipeline Milestone</h4>

            <label style={labelStyle}>Milestone Title</label>
            <input value={newMilestone.title} onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })} placeholder="e.g. Final Design Deliverables" style={inputStyle} />

            <label style={{ ...labelStyle, marginTop: '12px', display: 'block' }}>Scope / Description</label>
            <textarea value={newMilestone.description} onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })} placeholder="Describe details of this development milestone..." rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'sans-serif' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={labelStyle}>Budget (₹)</label>
                <input type="number" value={newMilestone.amount} onChange={e => setNewMilestone({ ...newMilestone, amount: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Due Target Date</label>
                <input type="date" value={newMilestone.due} onChange={e => setNewMilestone({ ...newMilestone, due: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setShowAddForm(false)} style={cancelBtnStyle}>Cancel</button>
              <button onClick={addMilestone} disabled={saving} style={primaryBtnStyle}>{saving ? 'Adding node...' : 'Add Milestone to Escrow'}</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(4px)', border: '1px dashed #1D9E75', color: '#1D9E75', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', marginTop: '12px', transition: 'all 0.2s' }}>
            + Add New Milestone Phase
          </button>
        )}

      </div>

      {/* Global Embedded Stylesheet Transitions Block */}
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

        @media (max-width: 640px) {
          .nav-brand-text { font-size: 16px !important; }
          .milestone-manage-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .milestone-manage-row > div:last-child {
            width: 100%;
            display: flex;
            gap: 8px;
            margin-top: 4px;
          }
          .milestone-manage-row button {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}

// Custom Glassmorphic Blueprint Objects Styling Schema Matrix
const cardStyle = {
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '16px',
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
}

const primaryBtnStyle = {
  flex: 1,
  padding: '12px',
  background: '#1D9E75',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
}

const secondaryBtnStyle = {
  background: 'white',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  color: '#111827',
  padding: '8px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
}

const cancelBtnStyle = {
  flex: 1,
  padding: '12px',
  background: 'rgba(0, 0, 0, 0.05)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  color: '#4b5563',
  fontSize: '14px',
}