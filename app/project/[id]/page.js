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

  // New Safe Delete Milestone Client Action Handler
  async function handleDeleteMilestone(milestoneId) {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this milestone phase?")
    if (!confirmDelete) return

    setSaving(true)
    try {
      // NOTE: Make sure to point this to your exact milestone deletion api route path
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

  // Enhanced Status Engine Matrix
  function getStatusInfo(status) {
    const map = {
      pending: { label: 'Not paid yet — editable', color: '#6b7280', bg: '#f3f4f6', locked: false },
      funded: { label: 'In escrow — locked', color: '#1D9E75', bg: '#e8f5ef', locked: true },
      submitted: { label: 'Work submitted — locked', color: '#d97706', bg: '#fef3c7', locked: true },
      changes_requested: { label: 'Changes requested — locked', color: '#dc2626', bg: '#fee2e2', locked: true },
      released: { label: 'Released — locked', color: '#1D9E75', bg: '#e8f5ef', locked: true },
      disputed: { label: '🛑 Under Dispute — locked', color: '#b45309', bg: '#fef3c7', locked: true },
      Disputed: { label: '🛑 Under Dispute — locked', color: '#b45309', bg: '#fef3c7', locked: true }
    }
    return map[status] || { label: status + ' — locked', color: '#111', bg: '#f0f0f0', locked: true }
  }

  if (loading) return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Loading project context...</p>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#e74c3c', fontFamily: 'sans-serif' }}>Error: {error}</p>
    </div>
  )

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 700, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#666', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>← Back to Dashboard</span>
        </Link>
      </nav>

      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>{project.title}</h2>
        <p style={{ margin: '0 0 32px', color: '#666', fontSize: '14px', fontWeight: 500 }}>
          Client Account Name: <strong style={{ color: '#111' }}>{project.client_name}</strong> &nbsp;·&nbsp; <Link href={`/pay/${project.invite_token}`} style={{ color: '#1D9E75', fontWeight: 600 }}>View dynamic client link →</Link>
        </p>

        <h3 style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>MILESTONES STACK</h3>

        {project.milestones.map(m => {
          const statusInfo = getStatusInfo(m.status)
          const isEditing = editingId === m.id
          const canDelete = m.status === 'pending' // Security Constraint

          return (
            <div key={m.id} style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '14px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
              {isEditing ? (
                <div>
                  <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Milestone Phase Title</label>
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={inputStyle} />

                  <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginTop: '12px', display: 'block' }}>Description Log</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Amount Split (₹)</label>
                      <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Due Target Date</label>
                      <input type="date" value={editForm.due} onChange={e => setEditForm({ ...editForm, due: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#111' }}>Cancel</button>
                    <button onClick={saveEdit} disabled={saving} style={{ flex: 1, padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{saving ? 'Saving updates...' : 'Save Changes'}</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#111', fontSize: '16px', letterSpacing: '-0.01em' }}>{m.title}</span>
                      <span style={{ background: statusInfo.bg, color: statusInfo.color, padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 4px', color: '#4b5563', fontSize: '14px', fontWeight: 500 }}>
                      Client Escrow Budget: <strong style={{ color: '#111' }}>₹{(m.amount_paise / 100).toLocaleString('en-IN')}</strong>
                    </p>
                    {m.freelancer_payout_paise && (
                      <p style={{ margin: 0, color: '#1D9E75', fontSize: '12px', fontWeight: 600 }}>
                        Your Net Settlement: ₹{(m.freelancer_payout_paise / 100).toLocaleString('en-IN')} (after platform fee)
                      </p>
                    )}
                  </div>

                  {/* Operational Controls Interface */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {!statusInfo.locked && (
                      <button onClick={() => startEdit(m)} style={{ background: 'white', border: '1px solid #d1d5db', color: '#111', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        Edit
                      </button>
                    )}
                    
                    {/* Delete Milestone Element Trigger */}
                    <button 
                      onClick={() => handleDeleteMilestone(m.id)}
                      disabled={!canDelete || saving}
                      title={canDelete ? "Delete this phase milestone" : "Locked: Cannot delete milestone once funded, submitted, or disputed."}
                      style={{ 
                        background: 'none', 
                        border: '1px solid #e5e7eb', 
                        color: canDelete ? '#e74c3c' : '#ccc', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        cursor: canDelete ? 'pointer' : 'not-allowed', 
                        fontSize: '13px',
                        backgroundColor: canDelete ? 'transparent' : '#fbcfa'
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

        {/* Add Milestone Block */}
        {showAddForm ? (
          <div style={{ background: 'white', border: '1px solid #1D9E75', borderRadius: '14px', padding: '24px', marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 14px', color: '#111', fontSize: '15px', fontWeight: 700 }}>New Pipeline Milestone</h4>

            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Milestone Title</label>
            <input value={newMilestone.title} onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })} placeholder="e.g. Final Design Deliverables" style={inputStyle} />

            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, marginTop: '12px', display: 'block' }}>Scope / Description</label>
            <textarea value={newMilestone.description} onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })} placeholder="Describe details of this development milestone..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Budget (₹)</label>
                <input type="number" value={newMilestone.amount} onChange={e => setNewMilestone({ ...newMilestone, amount: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Due Target Date</label>
                <input type="date" value={newMilestone.due} onChange={e => setNewMilestone({ ...newMilestone, due: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#111' }}>Cancel</button>
              <button onClick={addMilestone} disabled={saving} style={{ flex: 1, padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{saving ? 'Adding node...' : 'Add Milestone to Escrow'}</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} style={{ width: '100%', padding: '16px', background: 'white', border: '1px dashed #1D9E75', color: '#1D9E75', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', marginTop: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' }}>
            + Add New Milestone Phase
          </button>
        )}

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