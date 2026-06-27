'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Footer from './components/Footer' // Exact relative path based on your app/ folder structure

export default function Home() {
  const { status } = useSession()
  const isLoggedIn = status === 'authenticated'

  return (
    <div style={{ 
      background: '#fcfcfc', // Clean crisp background for financial tech feel
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#111'
    }}>

      {/* Navbar */}
      <nav style={{ 
        background: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 40px', 
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>F</span>
          <span style={{ fontWeight: 700, color: '#111', fontSize: '18px', letterSpacing: '-0.02em' }}>FreelanceShield</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isLoggedIn ? (
            <Link href="/dashboard">
              <button style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
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
      <section style={{ maxWidth: '850px', margin: '0 auto', padding: '100px 20px 80px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', 
          background: '#e8f5ef', 
          color: '#1D9E75', 
          padding: '6px 16px', 
          borderRadius: '20px', 
          fontSize: '13px', 
          fontWeight: 600, 
          marginBottom: '24px',
          border: '1px solid rgba(29, 158, 117, 0.2)'
        }}>
          🛡️ RBI Compliant Escrow Infrastructure
        </div>
        <h1 style={{ fontSize: '58px', fontWeight: 800, color: '#111', margin: '0 0 20px', lineHeight: 1.12, letterSpacing: '-0.03em' }}>
          Get Paid. <span style={{ color: '#1D9E75' }}>Every Single Time.</span>
        </h1>
        <p style={{ fontSize: '19px', color: '#4b5563', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          Client money locks securely upfront in escrow. Funds land directly in your bank account immediately after milestone approval. 2% fee. No drama.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '14px 36px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px', boxShadow: '0 4px 12px rgba(29,158,117,0.15)' }}>
              {isLoggedIn ? "Go to Dashboard →" : "Get Started Now"}
            </button>
          </Link>
          <a href="#how">
            <button style={{ background: 'white', color: '#111', border: '1px solid #d1d5db', padding: '14px 36px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px' }}>
              See how it works
            </button>
          </a>
        </div>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          🔒 Powered by Razorpay Route · Secured Transaction Nodes
        </p>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: 'white', padding: '90px 20px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#1D9E75', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>HOW IT WORKS</p>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, color: '#111', margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            Four Simple Steps From Project To Paycheck
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { num: '1', title: 'Create the project', desc: 'Define milestones, fixed phase splits, and expected timelines in under 2 minutes.' },
              { num: '2', title: 'Client locks budget', desc: 'Funds move into secure bank-grade escrow the exact moment the client pays.' },
              { num: '3', title: 'Submit proof of work', desc: 'Deliver deliverables and notify the client instantly via automated dashboard routing.' },
              { num: '4', title: 'Instant settlement', desc: 'Client approves the work output—funds route instantly straight to your bank account.' },
            ].map(s => (
              <div key={s.num} 
                style={{ 
                  background: '#f9fafb', 
                  borderRadius: '12px', 
                  padding: '28px 20px', 
                  border: '1px solid #e5e7eb',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.03)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, marginBottom: '16px' }}>
                  {s.num}
                </div>
                <h4 style={{ margin: '0 0 8px', color: '#111', fontSize: '15px', fontWeight: 700 }}>{s.title}</h4>
                <p style={{ margin: 0, color: '#4b5563', fontSize: '13px', lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '90px 20px' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { val: '2%', label: 'Flat Platform Fee', sub: 'Completely transparent pricing structure. No monthly plans.' },
            { val: '0', label: 'Invoicing Losses', sub: "Eliminate unpaid invoices. The balance is funded upfront." },
            { val: '100%', label: 'Payment Protection', sub: 'Full accountability with integrated dispute resolution nodes.' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px 24px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px', fontSize: '42px', fontWeight: 800, color: '#1D9E75', letterSpacing: '-0.02em' }}>{s.val}</p>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#111', fontSize: '15px' }}>{s.label}</p>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '12px', lineHeight: 1.5 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section style={{ background: '#111', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '38px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Stop chasing invoices.</h2>
        <p style={{ color: '#9ca3af', fontSize: '16px', margin: '0 0 32px' }}>Deploy your first escrow project agreement layout in under 2 minutes.</p>
        <Link href={isLoggedIn ? "/dashboard" : "/login"}>
          <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '16px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(29,158,117,0.2)' }}>
            {isLoggedIn ? "Go to Dashboard →" : "Create Secure Contract"}
          </button>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {['No hidden setup costs', 'No software subscription', 'Cancel milestones anytime'].map(t => (
            <span key={t} style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>✓ {t}</span>
          ))}
        </div>
      </section>

      {/* Clean Light Footer Component */}
      <Footer />
    </div>
  )
}