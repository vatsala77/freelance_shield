'use client'
import { useState } from 'react'
import Link from 'next/link'

const projects = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    client: 'Kavya Mehta',
    amount: 145000,
    status: 'active',
    milestones: { done: 2, total: 4 },
    token: 'demo'
  },
  {
    id: '2',
    title: 'Brand Identity & Logo System',
    client: 'Nova Coffee Co.',
    amount: 65000,
    status: 'active',
    milestones: { done: 1, total: 3 },
    token: 'demo2'
  },
  {
    id: '3',
    title: 'Mobile App UI Design',
    client: 'StartupX',
    amount: 90000,
    status: 'completed',
    milestones: { done: 3, total: 3 },
    token: 'demo3'
  },
]

export default function Dashboard() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  const inEscrow = 622000
  const released = 122000

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>Dashboard</span>
          <Link href="/create">
            <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              New Project
            </button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111' }}>Your Projects</h2>
            <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Welcome back, Vatsala. Here's what's in escrow.</p>
          </div>
          <Link href="/create">
            <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              + New Project
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'In escrow', val: `₹${inEscrow.toLocaleString('en-IN')}`, sub: '4 active projects', bg: '#e8f5ef', color: '#1D9E75' },
            { label: 'Released this year', val: `₹${released.toLocaleString('en-IN')}`, sub: 'Paid out to your bank', bg: 'white', color: '#111' },
            { label: 'Avg. release time', val: '6 hrs', sub: 'From client approval', bg: 'white', color: '#111' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#888' }}>{s.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 700, color: s.color }}>{s.val}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #e5e5e5', background: filter === f ? '#111' : 'white', color: filter === f ? 'white' : '#888', cursor: 'pointer', fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', color: '#888', fontSize: '13px', alignSelf: 'center' }}>{filtered.length} total</span>
        </div>

        {/* Project List */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden' }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ padding: '20px 24px', borderBottom: i < filtered.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, color: '#111', fontSize: '15px' }}>{p.title}</span>
                    <span style={{ background: p.status === 'active' ? '#e8f5ef' : '#f0f0f0', color: p.status === 'active' ? '#1D9E75' : '#888', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>
                      {p.status === 'active' ? '● Active' : '✓ Completed'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Client · {p.client}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>₹{p.amount.toLocaleString('en-IN')}</span>
                  <Link href={`/pay/${p.token}`}>
                    <button style={{ background: 'white', border: '1px solid #e5e5e5', color: '#111', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                      View ↗
                    </button>
                  </Link>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>
                  {p.milestones.done} of {p.milestones.total} milestones
                </span>
                <div style={{ flex: 1, background: '#f0f0f0', borderRadius: '4px', height: '6px' }}>
                  <div style={{ background: '#1D9E75', height: '6px', borderRadius: '4px', width: `${(p.milestones.done / p.milestones.total) * 100}%`, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {Math.round((p.milestones.done / p.milestones.total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '32px', margin: '0 0 12px' }}>🛡️</p>
            <h3 style={{ margin: '0 0 8px', color: '#111' }}>No projects yet</h3>
            <p style={{ color: '#888', margin: '0 0 20px' }}>Create your first protected project</p>
            <Link href="/create">
              <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Create Project
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}