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
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

  const filtered = projects.filter(p => {
    const matchesStatus = filter === 'all' || p.status === filter
    const cleanQuery = searchQuery.trim().toLowerCase()
    if (!cleanQuery) return matchesStatus

    const matchesProjectTitle = p.title?.toLowerCase().includes(cleanQuery)
    const matchesClientName = p.client_name?.toLowerCase().includes(cleanQuery)
    const matchesClientEmail = p.client_email?.toLowerCase().includes(cleanQuery)
    const matchesClientPhone = p.client_phone?.toLowerCase().includes(cleanQuery)
    const matchesMilestoneTitle = p.milestones?.some(m => 
      m.title?.toLowerCase().includes(cleanQuery)
    ) || false

    return matchesStatus && (matchesProjectTitle || matchesClientName || matchesClientEmail || matchesClientPhone || matchesMilestoneTitle)
  })

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
      
      setProjects(prev => prev.filter(p => p.id !== projectId))
      alert('Project deleted successfully.')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const inEscrow = projects
    .filter(p => p.status === 'active')
    .reduce((sum, p) => {
      return sum + (p.milestones?.reduce((mSum, m) => {
        if (['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed'].includes(m.status)) {
          return mSum + (m.amount_paise / 100)
        }
        return mSum
      }, 0) || 0)
    }, 0)
  
  const released = projects
    .filter(p => p.status === 'completed' || p.status === 'active')
    .reduce((sum, p) => {
      return sum + (p.milestones?.reduce((mSum, m) => {
        if (m.status === 'released') {
          return mSum + (m.amount_paise / 100)
        }
        return mSum
      }, 0) || 0)
    }, 0)

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #d4f7e6 0%, #a7f3d0 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1D9E75', fontFamily: 'sans-serif', fontWeight: 600, fontSize: 'clamp(13px, 3vw, 15px)' }}>Loading FreelanceShield Environment...</p>
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

      <div style={{ padding: '16px 20px', zIndex: 1000 }}>
        <nav style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 32px)',
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
                justifyContent: 'center', fontWeight: 700, fontSize: 'clamp(13px, 3vw, 15px)',
                transition: 'all 0.2s ease'
              }}>F</span>
              <span className="brand-text" style={{ 
                fontWeight: 700, color: '#111827', fontSize: 'clamp(15px, 3.5vw, 18px)', 
                letterSpacing: '-0.02em', transition: 'all 0.2s ease' 
              }}>FreelanceShield</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav-menu">
            <Link href="/dashboard" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item active-link">
              <span className="nav-text">Dashboard</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px', background: '#1D9E75', borderRadius: '2px' }} />
            </Link>
            
            <Link href="/settings" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Settings</span>
            </Link>

            <Link href="/create" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Create Project</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{
                background: 'rgba(11, 15, 29, 0.06)', border: '1px solid rgba(0, 0, 0, 0.05)', color: '#111827',
                padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, fontSize: 'clamp(12px, 2.5vw, 13px)', transition: 'all 0.2s'
              }}>
              Logout
            </button>
          </div>

          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ display: 'none', cursor: 'pointer', fontSize: '20px', color: '#111827' }}
            className="mobile-menu-burger-icon"
          >
            ☰
          </div>
        </nav>

        {isDropdownOpen && (
          <div style={{
            margin: '8px auto 0',
            maxWidth: '1200px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
          }}
          className="mobile-dropdown-panel"
          >
            <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#1D9E75', fontWeight: 700, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Dashboard</Link>
            <Link href="/settings" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Settings</Link>
            <Link href="/create" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Create Project</Link>
            <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#e74c3c', padding: '4px 0', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)', cursor: 'pointer' }}>Logout</button>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '940px', margin: '20px auto', padding: '0 20px' }}>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(22px, 5.5vw, 32px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Your Projects</h2>
          <p style={{ margin: 0, color: '#273142', fontSize: 'clamp(12px, 2.8vw, 14px)', fontWeight: 600 }}>Welcome back, <strong style={{ color: '#111827' }}>{session?.user?.name || 'User'}</strong>. Track your dynamic escrow pipelines.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'In Escrow Active', val: `₹${inEscrow.toLocaleString('en-IN')}`, sub: `${projects.filter(p => p.status === 'active').length} Active Contracts`, bg: 'rgba(255, 255, 255, 0.45)', color: '#1D9E75' },
            { label: 'Released Balance', val: `₹${released.toLocaleString('en-IN')}`, sub: 'Settled to Verified Bank', bg: 'rgba(255, 255, 255, 0.55)', color: '#111827' },
            { label: 'Total Deal Pipelines', val: `${projects.length}`, sub: `${projects.filter(p => p.status === 'completed').length} Milestone Closures`, bg: 'rgba(255, 255, 255, 0.55)', color: '#111827' },
          ].map(s => (
            <div key={s.label} style={{ 
              background: s.bg, 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0, 0, 0, 0.08)', 
              borderRadius: '14px', 
              padding: 'clamp(16px, 4vw, 24px)', 
              boxShadow: '0 4px 20px rgba(29, 158, 117, 0.01)'
            }}>
              <p style={{ margin: '0 0 8px', fontSize: 'clamp(10px, 2.2vw, 11px)', color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: 'clamp(20px, 5.5vw, 30px)', fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: 'clamp(11px, 2.5vw, 13px)', color: '#4b5563', fontWeight: 500 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search contracts..." 
            style={{
              width: '100%',
              padding: 'clamp(11px, 2.8vw, 14px) clamp(14px, 3.5vw, 18px)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(4px)',
              color: '#111827',
              fontSize: 'clamp(13px, 3vw, 14px)',
              boxSizing: 'border-box',
              outline: 'none',
              fontWeight: 500
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: 'clamp(6px, 1.8vw, 8px) clamp(14px, 4vw, 20px)', borderRadius: '20px', 
                border: '1px solid rgba(0, 0, 0, 0.08)',
                background: filter === f ? '#111827' : 'rgba(255, 255, 255, 0.6)',
                color: filter === f ? 'white' : '#374151',
                cursor: 'pointer', fontSize: 'clamp(12px, 2.8vw, 13px)', fontWeight: 600,
                textTransform: 'capitalize', transition: 'all 0.15s'
              }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', color: '#111827', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 600 }}>
            Showing {filtered.length} projects
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {filtered.map((p) => {
            const totalMilestones = p.milestones?.length || 0
            const completedMilestones = p.milestones?.filter(m => m.status === 'released')?.length || 0
            const safeToDelete = !p.milestones?.some(m => 
              ['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed', 'released'].includes(m.status)
            )

            return (
              <div key={p.id} style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.08)', 
                borderRadius: '16px', 
                padding: 'clamp(16px, 4vw, 24px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#111827', fontSize: 'clamp(15px, 3.8vw, 18px)', letterSpacing: '-0.01em' }}>{p.title}</span>
                      <span style={{
                        background: p.status === 'active' ? '#e8f5ef' : '#f3f4f6',
                        color: p.status === 'active' ? '#1D9E75' : '#4b5563',
                        padding: '3px 12px', borderRadius: '20px', fontSize: 'clamp(10px, 2.2vw, 11px)', fontWeight: 700
                      }}>
                        {p.status === 'active' ? '● Active' : '✓ Completed'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#374151', fontSize: 'clamp(12px, 2.8vw, 13px)', fontWeight: 600 }}>Client Account: <strong style={{ color: '#111827' }}>{p.client_name}</strong></p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start' }} className="project-actions-wrap">
                    <span style={{ fontWeight: 800, color: '#111827', fontSize: 'clamp(15px, 3.6vw, 17px)', marginRight: '4px' }}>
                      ₹{(p.total_amount_paise / 100).toLocaleString('en-IN')}
                    </span>
                    <Link href={`/project/${p.id}`}>
                      <button style={{ background: '#1D9E75', border: 'none', color: 'white', padding: 'clamp(6px, 1.8vw, 8px) clamp(12px, 3vw, 16px)', borderRadius: '8px', cursor: 'pointer', fontSize: 'clamp(12px, 2.8vw, 13px)', fontWeight: 600 }}>
                        Manage
                      </button>
                    </Link>
                    <Link href={`/pay/${p.invite_token}`}>
                      <button style={{ background: 'white', border: '1px solid rgba(0, 0, 0, 0.08)', color: '#111827', padding: 'clamp(6px, 1.8vw, 8px) clamp(12px, 3vw, 16px)', borderRadius: '8px', cursor: 'pointer', fontSize: 'clamp(12px, 2.8vw, 13px)', fontWeight: 600 }}>
                        View Link ↗
                      </button>
                    </Link>

                    <button 
                      onClick={() => handleDeleteProject(p.id)}
                      disabled={!safeToDelete}
                      title={safeToDelete ? "Delete project agreement" : "Security Lock active."}
                      style={{ 
                        background: 'none', 
                        border: '1px solid rgba(231, 76, 60, 0.2)', 
                        color: safeToDelete ? '#e74c3c' : '#ccc', 
                        padding: 'clamp(6px, 1.8vw, 8px) clamp(10px, 2.5vw, 12px)', 
                        borderRadius: '8px', 
                        cursor: safeToDelete ? 'pointer' : 'not-allowed', 
                        fontSize: 'clamp(12px, 2.8vw, 13px)',
                        backgroundColor: safeToDelete ? 'rgba(231, 76, 60, 0.02)' : '#fafafa'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {p.milestones?.some(m => ['disputed', 'Disputed'].includes(m.status)) && (
                  <div style={{ background: '#fffbeb', color: '#b45309', padding: '10px 14px', borderRadius: '8px', fontSize: 'clamp(12px, 2.8vw, 13px)', marginBottom: '16px', fontWeight: 600, border: '1px solid #fef3c7' }}>
                    ⚠️ Ongoing Escrow Dispute Raised — Platform panel is securely auditing this contract block.
                  </div>
                )}

                {p.milestones?.some(m => m.status === 'changes_requested') && (
                  <div style={{ background: '#fdeeee', color: '#e74c3c', padding: '10px 14px', borderRadius: '8px', fontSize: 'clamp(12px, 2.8vw, 13px)', marginBottom: '16px', fontWeight: 500 }}>
                    🔄 Client requested updates — <Link href={`/pay/${p.invite_token}`} style={{ color: '#e74c3c', fontWeight: 700, textDecoration: 'underline' }}>Review Details</Link>
                  </div>
                )}

                <div style={{ background: 'rgba(255, 255, 255, 0.4)', borderRadius: '10px', padding: '6px 16px', marginBottom: '16px', border: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  {p.milestones?.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: '#111827', fontWeight: 600 }}>{m.title}</span>
                        <span style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#4b5563', marginLeft: '8px', fontWeight: 500 }}>₹{(m.amount_paise / 100).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div>
                        {m.status === 'funded' && (
                          <button onClick={() => setSubmitFor(m.id)} style={{ background: '#111827', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 600 }}>
                            Submit Work
                          </button>
                        )}
                        {m.status === 'changes_requested' && (
                          <button onClick={() => setSubmitFor(m.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 600 }}>
                            Resubmit Work
                          </button>
                        )}
                        {m.status === 'submitted' && <span style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#f59e0b', fontWeight: 600 }}>Awaiting Review</span>}
                        {m.status === 'released' && <span style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#1D9E75', fontWeight: 600 }}>✅ Released</span>}
                        {m.status === 'pending' && <span style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#6b7280', fontWeight: 500 }}>Awaiting Payment</span>}
                        {['disputed', 'Disputed'].includes(m.status) && <span style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#b45309', fontWeight: 700 }}>🛑 Under Dispute</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#374151', fontWeight: 600 }}>
                    {completedMilestones} of {totalMilestones} milestones cleared
                  </span>
                  <div style={{ flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '4px', height: '6px', minWidth: '60px' }}>
                    <div style={{
                      background: '#1D9E75', height: '6px', borderRadius: '4px',
                      width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%`,
                      transition: 'width 0.4s'
                    }} />
                  </div>
                  <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#111827', fontWeight: 700 }}>
                    {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(4px)', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <p style={{ fontSize: 'clamp(28px, 7vw, 36px)', margin: '0 0 12px' }}>🛡️</p>
            <h3 style={{ margin: '0 0 8px', color: '#111827', fontWeight: 700, fontSize: 'clamp(15px, 3.5vw, 17px)' }}>No project matches found</h3>
            <p style={{ color: '#4b5563', margin: '0 0 20px', fontSize: 'clamp(12px, 2.8vw, 14px)' }}>No contract entries match your query tracking specifications.</p>
            <button 
              onClick={() => { setSearchQuery(''); setFilter('all'); }} 
              style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 'clamp(13px, 3vw, 14px)' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {submitFor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setSubmitFor(null)}>
          <div style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: 'clamp(20px, 5vw, 28px)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ background: '#e8f5ef', color: '#1D9E75', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📤</span>
              <h3 style={{ margin: 0, color: '#111827', fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 700 }}>Submit Deliverables</h3>
            </div>
            <p style={{ margin: '0 0 16px', color: '#4b5563', fontSize: 'clamp(12px, 2.8vw, 13px)' }}>Provide sharing links or production assets urls for client confirmation.</p>
            
            <label style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#374151', fontWeight: 600 }}>Submission Proof Link *</label>
            <input value={submissionLink} onChange={e => setSubmissionLink(e.target.value)} placeholder="https://github.com/..." style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: 'clamp(13px, 3vw, 14px)', marginTop: '4px', marginBottom: '16px', boxSizing: 'border-box', background: '#f9fafb', color: '#111827', outline: 'none' }} />

            <label style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#374151', fontWeight: 600 }}>Optional Review Notes</label>
            <textarea value={submissionNote} onChange={e => setSubmissionNote(e.target.value)} placeholder="Message instructions for client review..." rows={3} style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: 'clamp(13px, 3vw, 14px)', marginTop: '4px', marginBottom: '20px', boxSizing: 'border-box', resize: 'vertical', background: '#f9fafb', color: '#111827', outline: 'none', fontFamily: 'sans-serif' }} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSubmitFor(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#4b5563', fontSize: 'clamp(13px, 3vw, 14px)' }}>Cancel</button>
              <button onClick={handleSubmitWork} style={{ flex: 1, padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: 'clamp(13px, 3vw, 14px)' }}>Submit Verification</button>
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

        .nav-item {
          transition: all 0.25s ease;
          position: relative;
        }
        .nav-text {
          color: #4b5563;
          font-size: clamp(12px, 2.8vw, 14px);
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
        
        .active-link .nav-text {
          color: #111827 !important;
        }
        
        @media (max-width: 768px) {
          .desktop-nav-menu { display: none !important; }
          .mobile-menu-burger-icon { display: block !important; }
          .mobile-dropdown-panel { display: flex !important; }
        }
      `}</style>

      <Footer />
    </div>
  )
}