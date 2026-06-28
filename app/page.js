'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Footer from './components/Footer' 

export default function Home() {
  const { status } = useSession()
  const isLoggedIn = status === 'authenticated'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#111827'
    }}>

      {/* Navbar */}
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
            <Link href="/" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item active-link">
              <span className="nav-text">Home</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px', background: '#1D9E75', borderRadius: '2px' }} />
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
                  <span className="nav-text">Dashboard</span>
                </Link>
                <Link href="/settings" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
                  <span className="nav-text">Settings</span>
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
              </>
            ) : (
              <>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    background: '#1D9E75', color: 'white', border: 'none', 
                    padding: '9px 20px', borderRadius: '8px', cursor: 'pointer', 
                    fontWeight: 600, fontSize: 'clamp(13px, 3vw, 14px)', transition: 'background-color 0.2s' 
                  }}>
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ cursor: 'pointer', fontSize: '22px', color: '#111827', userSelect: 'none' }}
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
            <Link href="/" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#1D9E75', fontWeight: 700, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Home</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Dashboard</Link>
                <Link href="/settings" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Settings</Link>
                <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#e74c3c', padding: '4px 0', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)', cursor: 'pointer' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsDropdownOpen(false)} style={{ textDecoration: 'none', color: '#4b5563', fontWeight: 600, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>Sign In</Link>
              </>
            )}
          </div>
        )}
      </div>
{/* Hero Section Container with Enhanced Image Backdrop Setup */}
<section style={{ 
  maxWidth: '960px', 
  margin: '40px auto', 
  padding: '80px 40px', 
  textAlign: 'center',
  
  // 1. Image Path integration with matching fallback ambient gradients
  backgroundImage: `
    linear-gradient(135deg, rgba(212, 247, 230, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%), 
    url('/hero-bg.jpeg')
  `,
  
  // 2. Core Image alignment and background constraints mapping
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  
  // 3. Glassmorphic text separation layer standard
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '24px',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 12px 40px rgba(29, 158, 117, 0.04)'
}}>
  
  {/* RBI Badge Node */}
  <div style={{ 
    display: 'inline-block', 
    background: 'white', 
    color: '#1D9E75', 
    padding: '6px 16px', 
    borderRadius: '20px', 
    fontSize: '13px', 
    fontWeight: 600, 
    marginBottom: '24px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
    border: '1px solid rgba(29, 158, 117, 0.2)'
  }}>
    🛡️ RBI Compliant Escrow Infrastructure
  </div>

  {/* Main Header Signature Font */}
  <h1 style={{ 
    fontSize: 'clamp(32px, 7vw, 58px)', 
    fontWeight: 800, 
    color: '#111827', 
    margin: '0 0 20px', 
    lineHeight: 1.12, 
    letterSpacing: '-0.03em' 
  }}>
    Get Paid. <span style={{ color: '#1D9E75' }}>Every Single Time.</span>
  </h1>

  {/* Subtitle Description (Wrapped in glass text background for perfect contrast readability) */}
  <p style={{ 
    fontSize: 'clamp(15px, 2.5vw, 19px)', 
    color: '#111827', 
    maxWidth: '560px', 
    margin: '0 auto 36px', 
    lineHeight: 1.6, 
    letterSpacing: '-0.01em',
    fontWeight: 600,
    background: 'rgba(255, 255, 255, 0.4)',
    padding: '8px 16px',
    borderRadius: '12px',
    display: 'inline-block'
  }}>
    Client money locks securely upfront in escrow. Funds land directly in your bank account immediately after milestone approval. 2% fee. No drama.
  </p>

  {/* Action Redirect Controls Trigger Clusters */}
  <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
    <Link href={isLoggedIn ? "/dashboard" : "/login"} style={{ textDecoration: 'none' }}>
      <button style={{ 
        background: '#1D9E75', 
        color: 'white', 
        border: 'none', 
        padding: '14px 36px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 600, 
        fontSize: '16px', 
        boxShadow: '0 4px 14px rgba(29,158,117,0.3)',
        transition: 'all 0.2s'
      }}>
        {isLoggedIn ? "Go to Dashboard →" : "Get Started Now"}
      </button>
    </Link>
    
    <a href="#how" style={{ textDecoration: 'none' }}>
      <button style={{ 
        background: 'white', 
        color: '#111827', 
        border: '1px solid rgba(0, 0, 0, 0.08)', 
        padding: '14px 36px', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        fontWeight: 600, 
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        See how it works
      </button>
    </a>
  </div>

  {/* Security Verification Stamp Node */}
  <p style={{ 
    color: '#111827', 
    fontSize: '13px', 
    margin: 0, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '6px',
    fontWeight: 700
  }}>
    🔒 Powered by Razorpay Route · Secured Transaction Nodes
  </p>

</section>

      {/* How it works section */}
      <section id="how" style={{ maxWidth: '940px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.45)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: 'clamp(36px, 8vw, 60px) clamp(20px, 5vw, 40px)',
          borderRadius: '24px'
        }}>
          <p style={{ textAlign: 'center', color: '#1D9E75', fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>HOW IT WORKS</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800, color: '#111827', margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            Four Simple Steps From Project To Paycheck
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { num: '1', title: 'Create the project', desc: 'Define milestones, fixed phase splits, and expected timelines in under 2 minutes.' },
              { num: '2', title: 'Client locks budget', desc: 'Funds move into secure bank-grade escrow the exact moment the client pays.' },
              { num: '3', title: 'Submit proof of work', desc: 'Deliver deliverables and notify the client instantly via automated dashboard routing.' },
              { num: '4', title: 'Instant settlement', desc: 'Client approves the work output—funds route instantly straight to your bank account.' },
            ].map(s => (
              <div key={s.num} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.55)', 
                  borderRadius: '14px', 
                  padding: '28px 20px', 
                  border: '1px solid rgba(0, 0, 0, 0.06)',
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
                <h4 style={{ margin: '0 0 8px', color: '#111827', fontSize: 'clamp(13px, 3vw, 15px)', fontWeight: 700 }}>{s.title}</h4>
                <p style={{ margin: 0, color: '#374151', fontSize: 'clamp(12px, 2.8vw, 13px)', lineHeight: 1.55, fontWeight: 500 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section style={{ maxWidth: '940px', margin: '0 auto 40px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {[
            { val: '2%', label: 'Flat Platform Fee', sub: 'Completely transparent pricing structure. No monthly plans.' },
            { val: '0', label: 'Invoicing Losses', sub: "Eliminate unpaid invoices. The balance is funded upfront." },
            { val: '100%', label: 'Payment Protection', sub: 'Full accountability with integrated dispute resolution nodes.' },
          ].map(s => (
            <div key={s.label} style={{ 
              background: 'rgba(255, 255, 255, 0.55)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0, 0, 0, 0.08)', 
              borderRadius: '14px', 
              padding: '32px 24px', 
              textAlign: 'center' 
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 'clamp(28px, 7vw, 42px)', fontWeight: 800, color: '#1D9E75', letterSpacing: '-0.02em' }}>{s.val}</p>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#111827', fontSize: 'clamp(13px, 3vw, 15px)' }}>{s.label}</p>
              <p style={{ margin: 0, color: '#4b5563', fontSize: 'clamp(11px, 2.8vw, 12px)', lineHeight: 1.5, fontWeight: 500 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ background: '#111827', borderTop: '1px solid rgba(0, 0, 0, 0.15)', padding: 'clamp(50px, 10vw, 80px) 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 'clamp(26px, 6vw, 38px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Stop chasing invoices.</h2>
        <p style={{ color: '#9ca3af', fontSize: 'clamp(13px, 3vw, 16px)', margin: '0 0 32px', fontWeight: 500 }}>Deploy your first escrow project agreement layout in under 2 minutes.</p>
        <Link href={isLoggedIn ? "/dashboard" : "/login"} style={{ textDecoration: 'none' }}>
          <button style={{ background: '#1D9E75', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: 'clamp(14px, 3.5vw, 16px)', marginBottom: '16px', boxShadow: '0 4px 12px rgba(29,158,117,0.2)' }}>
            {isLoggedIn ? "Go to Dashboard →" : "Create Secure Contract"}
          </button>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {['No hidden setup costs', 'No software subscription', 'Cancel milestones anytime'].map(t => (
            <span key={t} style={{ color: '#9ca3af', fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 600 }}>✓ {t}</span>
          ))}
        </div>
      </section>

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
        
        .mobile-menu-burger-icon { display: none !important; }
        .mobile-dropdown-panel { display: none !important; }
        
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