'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { status } = useSession()
  const isLoggedIn = status === 'authenticated'

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>F</span>
          <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <Link href="/dashboard">
              <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#e8f5ef', color: '#1D9E75', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, marginBottom: '24px' }}>
          🛡️ Built for Indian freelancers
        </div>
        <h1 style={{ fontSize: '56px', fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.1 }}>
          Get Paid. <span style={{ color: '#1D9E75' }}>Every Time.</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#888', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Client money locks upfront. Releases only when you approve the work. 2% fee. No drama.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px' }}>
              {isLoggedIn ? "Go to Dashboard →" : "Get Started →"}
            </button>
          </Link>
          <a href="#how">
            <button style={{ background: 'white', color: '#111', border: '1px solid #e5e5e5', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '16px' }}>
              See how it works
            </button>
          </a>
        </div>
        <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
          🔒 Powered by Razorpay Route · RBI compliant escrow
        </p>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: 'white', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>HOW IT WORKS</p>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 700, color: '#111', margin: '0 0 48px' }}>
            Four simple steps from project to paycheck — no chasing, no invoices.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { num: '1', title: 'Create the project', desc: 'Define milestones, amounts, and timelines in 2 minutes.' },
              { num: '2', title: 'Client pays into escrow', desc: 'Funds are locked the moment the client clicks pay.' },
              { num: '3', title: 'Submit your work', desc: 'Deliver each milestone and notify the client instantly.' },
              { num: '4', title: 'Approve & release', desc: 'Client approves — money lands in your bank in hours.' },
            ].map(s => (
              <div key={s.num} style={{ background: '#f9f9f9', borderRadius: '12px', padding: '24px' }}>
                <div style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '16px' }}>
                  {s.num}
                </div>
                <h4 style={{ margin: '0 0 8px', color: '#111', fontSize: '15px' }}>{s.title}</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '13px', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { val: '2%', label: 'Only fee', sub: 'No hidden charges. Ever.' },
            { val: '0', label: 'Ghosting', sub: "Money's already in escrow." },
            { val: '100%', label: 'Payment protection', sub: 'RBI-compliant escrow account.' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: '40px', fontWeight: 700, color: '#1D9E75' }}>{s.val}</p>
              <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#111', fontSize: '15px' }}>{s.label}</p>
              <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{ background: '#111', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 700, margin: '0 0 12px' }}>Stop chasing invoices.</h2>
        <p style={{ color: '#888', fontSize: '16px', margin: '0 0 32px' }}>Set up your first escrow project in under 2 minutes.</p>
        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
          <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px', marginBottom: '16px' }}>
            {isLoggedIn ? "Go to Dashboard →" : "Get Started →"}
          </button>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {['No setup fees', 'No subscription', 'Cancel anytime'].map(t => (
            <span key={t} style={{ color: '#888', fontSize: '13px' }}>✓ {t}</span>
          ))}
        </div>
      </section>

    </div>
  )
}