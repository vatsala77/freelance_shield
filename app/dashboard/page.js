'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer' 

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [filter, setFilter] = useState('all')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitFor, setSubmitFor] = useState(null)
  const [submissionLink, setSubmissionLink] = useState('')
  const [submissionNote, setSubmissionNote] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status !== 'authenticated') return

    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?freelancer_id=${session.user.id}`)
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [status, router])

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  async function handleSubmitWork() {
    if (!submissionLink.trim()) {
      alert('Please add a submission link')
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
      alert('Error: ' + data.error)
      return
    }

    setProjects(prev => prev.map(p => ({
      ...p,
      milestones: p.milestones?.map(m =>
        m.id === submitFor ? { ...m, status: 'submitted', submission_link: submissionLink, submission_note: submissionNote } : m
      )
    })))

    setSubmitFor(null)
    setSubmissionLink('')
    setSubmissionNote('')
  }

  // Delete Project Client Logic Handler
  async function handleDeleteProject(projectId) {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this project agreement?")
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/project-detail/${projectId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete project')
      }
      
      // Update UI state upon success
      setProjects(prev => prev.filter(p => p.id !== projectId))
      alert('Project deleted successfully.')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // Calculate escrow stats (Checking milestones to include funded, submitted, changes_requested, and disputed balances)
  const inEscrow = projects
    .filter(p => p.status === 'active')
    .reduce((sum, p) => {
      const activeMilestonesSum = p.milestones?.reduce((mSum, m) => {
        if (['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed'].includes(m.status)) {
          return mSum + (m.amount_paise / 100)
        }
        return mSum
      }, 0) || 0
      return sum + activeMilestonesSum
    }, 0)
  
  const released = projects
    .filter(p => p.status === 'completed' || p.status === 'active')
    .reduce((sum, p) => {
      const releasedMilestonesSum = p.milestones?.reduce((mSum, m) => {
        if (m.status === 'released') {
          return mSum + (m.amount_paise / 100)
        }
        return mSum
      }, 0) || 0
      return sum + releasedMilestonesSum
    }, 0)

  if (loading) {
    return (
      <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#e74c3c', fontFamily: 'sans-serif' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 40px',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            background: '#1D9E75', color: 'white', width: '32px', height: '32px',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700
          }}>F</span>
          <span style={{ fontWeight: 700, color: '#111', fontSize: '17px', letterSpacing: '-0.01em' }}>FreelanceShield</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Dashboard</span>
          <Link href="/create">
            <button style={{
              background: '#1D9E75', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px'
            }}>
              New Project
            </button>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              background: 'white', border: '1px solid #e5e5e5', color: '#111',
              padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px'
            }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '940px', margin: '40px auto', padding: '0 20px' }}>

        {/* Header Title Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '32px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Your Projects</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Welcome back, <strong style={{ color: '#111' }}>{session?.user?.name || 'User'}</strong>. Track your dynamic escrow pipelines.</p>
          </div>
          <Link href="/create">
            <button style={{
              background: '#1D9E75', color: 'white', border: 'none',
              padding: '12px 24px', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px', boxShadow: '0 2px 6px rgba(29,158,117,0.15)'
            }}>
              + Create Agreement
            </button>
          </Link>
        </div>

        {/* Metric Cards Structure */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'In Escrow Active', val: `₹${inEscrow.toLocaleString('en-IN')}`, sub: `${projects.filter(p => p.status === 'active').length} Active Contracts`, bg: '#e8f5ef', color: '#1D9E75' },
            { label: 'Released Balance', val: `₹${released.toLocaleString('en-IN')}`, sub: 'Settled to Verified Bank', bg: 'white', color: '#111' },
            { label: 'Total Deal Pipelines', val: `${projects.length}`, sub: `${projects.filter(p => p.status === 'completed').length} Milestone Closures`, bg: 'white', color: '#111' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.01)' }}>
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', fontWeight: 500 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '8px 20px', borderRadius: '20px', border: '1px solid #e5e5e5',
                background: filter === f ? '#111' : 'white',
                color: filter === f ? 'white' : '#666',
                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                textTransform: 'capitalize', transition: 'all 0.15s'
              }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', color: '#666', fontSize: '13px', fontWeight: 500 }}>Showing {filtered.length} projects</span>
        </div>

        {/* Separated Project Cards Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {filtered.map((p) => {
            const totalMilestones = p.milestones?.length || 0
            const completedMilestones = p.milestones?.filter(m => m.status === 'released')?.length || 0
            
            // SECURITY CHECK: If any milestone is funded, submitted, requested changes, or disputed -> Deletion is strictly BLOCKED
            const safeToDelete = !p.milestones?.some(m => 
              ['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed', 'released'].includes(m.status)
            )

            return (
              <div key={p.id} style={{ 
                background: 'white', 
                border: '1px solid #e5e5e5', 
                borderRadius: '14px', 
                padding: '28px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.015)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: '#111', fontSize: '18px', letterSpacing: '-0.01em' }}>{p.title}</span>
                      <span style={{
                        background: p.status === 'active' ? '#e8f5ef' : '#f3f4f6',
                        color: p.status === 'active' ? '#1D9E75' : '#4b5563',
                        padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
                      }}>
                        {p.status === 'active' ? '● Active' : '✓ Completed'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px', fontWeight: 500 }}>Client Account: <strong style={{ color: '#111' }}>{p.client_name}</strong></p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, color: '#111', fontSize: '18px', marginRight: '4px', letterSpacing: '-0.01em' }}>
                      ₹{(p.total_amount_paise / 100).toLocaleString('en-IN')}
                    </span>
                    <Link href={`/project/${p.id}`}>
                      <button style={{ background: '#1D9E75', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        Manage
                      </button>
                    </Link>
                    <Link href={`/pay/${p.invite_token}`}>
                      <button style={{ background: 'white', border: '1px solid #e5e7eb', color: '#111', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        View Link ↗
                      </button>
                    </Link>

                    {/* Dynamic Delete Conditional Node Action */}
                    <button 
                      onClick={() => handleDeleteProject(p.id)}
                      disabled={!safeToDelete}
                      title={safeToDelete ? "Delete this empty project agreement" : "Security Lock: Ongoing escrow funding or active dispute logs exist."}
                      style={{ 
                        background: 'none', 
                        border: '1px solid #e5e7eb', 
                        color: safeToDelete ? '#e74c3c' : '#ccc', 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        cursor: safeToDelete ? 'pointer' : 'not-allowed', 
                        fontSize: '13px', 
                        fontWeight: 500,
                        backgroundColor: safeToDelete ? 'transparent' : '#fafafa'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {p.milestones?.some(m => ['disputed', 'Disputed'].includes(m.status)) && (
                  <div style={{ background: '#fffbeb', color: '#b45309', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, border: '1px solid #fef3c7' }}>
                    ⚠️ Ongoing Escrow Dispute Raised — Our platform panel is securely auditing this block.
                  </div>
                )}

                {p.milestones?.some(m => m.status === 'changes_requested') && (
                  <div style={{ background: '#fdeeee', color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                    🔄 Client requested updates — <Link href={`/pay/${p.invite_token}`} style={{ color: '#e74c3c', fontWeight: 700, textDecoration: 'underline' }}>Review Details</Link>
                  </div>
                )}

                {/* Sub-Milestones Internal Tracking Rows */}
                <div style={{ background: '#fafafa', borderRadius: '10px', padding: '8px 16px', marginBottom: '16px', border: '1px solid #f3f4f6' }}>
                  {p.milestones?.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ fontSize: '14px', color: '#111', fontWeight: 600 }}>{m.title}</span>
                        <span style={{ fontSize: '13px', color: '#666', marginLeft: '8px', fontWeight: 500 }}>₹{(m.amount_paise / 100).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div>
                        {m.status === 'funded' && (
                          <button onClick={() => setSubmitFor(m.id)} style={{ background: '#111', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                            Submit Work
                          </button>
                        )}
                        {m.status === 'changes_requested' && (
                          <button onClick={() => setSubmitFor(m.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                            Resubmit Work
                          </button>
                        )}
                        {m.status === 'submitted' && <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600 }}>Awaiting Review</span>}
                        {m.status === 'released' && <span style={{ fontSize: '13px', color: '#1D9E75', fontWeight: 600 }}>✅ Released</span>}
                        {m.status === 'pending' && <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>Awaiting Payment</span>}
                        {['disputed', 'Disputed'].includes(m.status) && <span style={{ fontSize: '13px', color: '#b45309', fontWeight: 700 }}>🛑 Under Dispute</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Progress Bar Segment */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>
                    {completedMilestones} of {totalMilestones} milestones cleared
                  </span>
                  <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                      background: '#1D9E75', height: '6px', borderRadius: '4px',
                      width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%`,
                      transition: 'width 0.4s'
                    }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#111', fontWeight: 600 }}>
                    {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty Fallback Block */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '36px', margin: '0 0 12px' }}>🛡️</p>
            <h3 style={{ margin: '0 0 8px', color: '#111', fontWeight: 700 }}>No projects found</h3>
            <p style={{ color: '#666', margin: '0 0 20px', fontSize: '14px' }}>Deploy a brand new protected project milestone framework to begin.</p>
            <Link href="/create">
              <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Create First Project
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Pop-up Modal Box Layer for Deliverables Submission */}
      {submitFor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSubmitFor(null)}>
          <div style={{ background: 'white', borderRadius: '16px', width: '420px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#e8f5ef', color: '#1D9E75', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📤</span>
              <h3 style={{ margin: 0, color: '#111', fontSize: '18px', fontWeight: 700 }}>Submit Work Progress</h3>
            </div>
            <p style={{ margin: '0 0 16px', color: '#666', fontSize: '13px' }}>Provide verification assets or sharing URLs (Drive, GitHub, Figma).</p>
            
            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Submission Proof Link *</label>
            <input value={submissionLink} onChange={e => setSubmissionLink(e.target.value)} placeholder="https://github.com/..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', marginTop: '4px', marginBottom: '16px', boxSizing: 'border-box', background: '#f9f9f9', color: '#111', outline: 'none' }} />

            <label style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Optional Notes</label>
            <textarea value={submissionNote} onChange={e => setSubmissionNote(e.target.value)} placeholder="Message instructions for client review..." rows={3} style={{ width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '14px', marginTop: '4px', marginBottom: '20px', boxSizing: 'border-box', resize: 'vertical', background: '#f9f9f9', color: '#111', outline: 'none', fontFamily: 'sans-serif' }} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSubmitFor(null)} style={{ flex: 1, padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#111', fontSize: '14px' }}>Cancel</button>
              <button onClick={handleSubmitWork} style={{ flex: 1, padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}