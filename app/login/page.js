'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (isSignUp) {
      // Supabase Signup Engine Trigger
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
     if (!res.ok) {
    if (
        data.error ===
        "Account already exists. Please sign in to continue."
    ) {
        setError(
            "Account already exists. Please sign in to continue."
        )

        setIsSignUp(false)
    } else {
        setError(data.error)
    }

    setLoading(false)
    return
}
      // Auto login sequences execute seamlessly post configuration validation
    }

    const result = await signIn('credentials', {
      email, password, redirect: false
    })

    if (result?.error) {
    setError(
        "No account found or the password is incorrect."
    )

    setLoading(false)
    return
} else {
      router.push('/dashboard')
    }
  }

  async function handleGoogle() {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div style={{ 
      // Pure Rich Green Gradient Backdrop Ecosystem matching image_807057.png perfectly
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#111827'
    }}>

      {/* Floating Glassmorphism Navbar Layer (Symmetrically matched to image_806c3f.png Specs) */}
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
          {/* Logo Brand Hyperlink pointing seamlessly to Home View with Active Glow Feedback */}
          <Link href="/" style={{ textDecoration: 'none' }} className="brand-logo-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
  className="logo-box"
  style={{
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }}
>
  <Image
    src="/logo.png"
    alt="FreelanceShield Logo"
    width={36}
    height={36}
    priority
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }}
  />
</div>
              <span className="brand-text" style={{ 
                fontWeight: 700, color: '#111827', fontSize: '18px', 
                letterSpacing: '-0.02em', transition: 'all 0.2s ease' 
              }}>FreelanceShield</span>
            </div>
          </Link>

          {/* Clean Light Navbar Option Text Controls Link Array */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Home</span>
            </Link>
           
          </div>
        </nav>
      </div>

      {/* Floating Authentication Card Wrapper Sheet */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.65)', 
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.08)', 
          borderRadius: '16px', 
          padding: '36px', 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(29, 158, 117, 0.03)'
        }}>

          <h2 style={{ margin: '0 0 4px', color: '#111827', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>
          <p style={{ margin: '0 0 24px', color: '#374151', fontSize: '14px', fontWeight: 500 }}>
            {isSignUp ? 'Start protecting your payments framework' : 'Sign in to your FreelanceShield account'}
          </p>

          {/* OAuth Google Interface Access Button Trigger */}
          <button onClick={handleGoogle}
            style={{ 
              width: '100%', padding: '11px', background: 'white', 
              border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '8px', 
              cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#111827', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              gap: '8px', marginBottom: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              transition: 'background-color 0.2s'
            }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
            </svg>
            Continue with Google
          </button>

          {/* Subtle Visual Split Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0, 0, 0, 0.08)' }} />
            <span style={{ color: '#4b5563', fontSize: '12px', fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0, 0, 0, 0.08)' }} />
          </div>

          {/* Email Parsing Input Segment Field */}
          <label style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle} />

          {/* Password Cryptography Input Segment Field */}
          <label style={{ fontSize: '12px', color: '#374151', fontWeight: 600, display: 'block', marginTop: '14px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle} />

          {error && <p style={{ color: '#ff4d4f', fontSize: '13px', margin: '12px 0 0', fontWeight: 500 }}>⚠️ {error}</p>}

          {/* Form Processing Submit Button */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ 
              width: '100%', padding: '14px', background: '#111827', color: 'white', 
              border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, 
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, 
              marginTop: '24px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {/* Dynamic Switch View Component Anchor Node Toggle */}
          <p style={{ textAlign: 'center', margin: 0, fontSize: '14px', color: '#4b5563', fontWeight: 500 }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => { setIsSignUp(!isSignUp); setError('') }}
              style={{ color: '#1D9E75', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>

        </div>
      </div>

      {/* Global CSS Style Transitions Injector Node Block */}
      <style jsx global>{`
        /* Dynamic Brand Click Active Glow Effect Module matching image_8a6541.png specs */
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

        /* Navbar Menu Items Transitions Setup */
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
      `}</style>

    </div>
  )
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
  transition: 'border-color 0.2s'
}