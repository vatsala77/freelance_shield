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

  function getStatusInfo(status) {
    const map = {
      pending: { label: 'Not paid yet — editable', color: '#888', bg: '#f0f0f0', locked: false },
      funded: { label: 'In escrow — locked', color: '#1D9E75', bg: '#e8f5ef', locked: true },
      submitted: { label: 'Work submitted — locked', color: '#f59e0b', bg: '#fff8e1', locked: true },
      changes_requested: { label: 'Changes requested — locked', color: '#e74c3c', bg: '#fdeeee', locked: true },
      released: { label: 'Released — locked', color: '#1D9E75', bg: '#e8f5ef', locked: true },
    }
    return map[status] || map.pending
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

      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
        <Link href="/dashboard">
          <span style={{ color: '#888', fontSize: '14px', cursor: 'pointer' }}>← Back to Dashboard</span>
        </Link>
      </nav>

      <div style={{ maxWidth: '680px', margin: '32px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 4px', fontSize: '24px', color: '#111' }}>{project.title}</h2>
        <p style={{ margin: '0 0 24px', color: '#888', fontSize: '14px' }}>
          Client · {project.client_name} &nbsp;·&nbsp; <Link href={`/pay/${project.invite_token}`} style={{ color: '#1D9E75' }}>View client page →</Link>
        </p>

        <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>MILESTONES</h3>

        {project.milestones.map(m => {
          const statusInfo = getStatusInfo(m.status)
          const isEditing = editingId === m.id

          return (
            <div key={m.id} style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
              {isEditing ? (
                <div>
                  <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Title</label>
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    style={inputStyle} />

                  <label style={{ fontSize: '12px', color: '#888', fontWeight: 500, marginTop: '10px', display: 'block' }}>Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2} style={{ ...inputStyle, resize: 'vertical' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Amount (₹)</label>
                      <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Due date</label>
                      <input type="date" value={editForm.due} onChange={e => setEditForm({ ...editForm, due: e.target.value })}
                        style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <button onClick={() => setEditingId(null)}
                      style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: '#111' }}>
                      Cancel
                    </button>
                    <button onClick={saveEdit} disabled={saving}
                      style={{ flex: 1, padding: '10px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
    <span style={{ fontWeight: 500, color: '#111', fontSize: '15px' }}>{m.title}</span>
    <span style={{ background: statusInfo.bg, color: statusInfo.color, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
      {statusInfo.locked ? '🔒 ' : ''}{statusInfo.label}
    </span>
  </div>
  <p style={{ margin: '0 0 4px', color: '#888', fontSize: '13px' }}>
    Client pays ₹{(m.amount_paise / 100).toLocaleString('en-IN')}
  </p>
  {m.freelancer_payout_paise && (
    <p style={{ margin: 0, color: '#1D9E75', fontSize: '12px', fontWeight: 500 }}>
      You receive ₹{(m.freelancer_payout_paise / 100).toLocaleString('en-IN')} (after 5% platform fee)
    </p>
  )}
</div>
                  {!statusInfo.locked && (
                    <button onClick={() => startEdit(m)}
                      style={{ background: 'white', border: '1px solid #e5e5e5', color: '#111', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {showAddForm ? (
          <div style={{ background: 'white', border: '1px solid #1D9E75', borderRadius: '12px', padding: '20px', marginTop: '12px' }}>
            <h4 style={{ margin: '0 0 12px', color: '#111', fontSize: '14px' }}>New milestone</h4>

            <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Title</label>
            <input value={newMilestone.title} onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="e.g. Final QA pass"
              style={inputStyle} />

            <label style={{ fontSize: '12px', color: '#888', fontWeight: 500, marginTop: '10px', display: 'block' }}>Description</label>
            <textarea value={newMilestone.description} onChange={e => setNewMilestone({ ...newMilestone, description: e.target.value })}
              rows={2} style={{ ...inputStyle, resize: 'vertical' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Amount (₹)</label>
                <input type="number" value={newMilestone.amount} onChange={e => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>Due date</label>
                <input type="date" value={newMilestone.due} onChange={e => setNewMilestone({ ...newMilestone, due: e.target.value })}
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setShowAddForm(false)}
                style={{ flex: 1, padding: '10px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: '#111' }}>
                Cancel
              </button>
              <button onClick={addMilestone} disabled={saving}
                style={{ flex: 1, padding: '10px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                {saving ? 'Adding...' : 'Add milestone'}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)}
            style={{ width: '100%', padding: '14px', background: 'white', border: '1px dashed #1D9E75', color: '#1D9E75', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', marginTop: '8px' }}>
            + Add new milestone
          </button>
        )}

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