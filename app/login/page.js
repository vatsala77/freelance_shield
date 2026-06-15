'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
      // Supabase se signup
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      // Auto login after signup
    }

    const result = await signIn('credentials', {
      email, password, redirect: false
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  async function handleGoogle() {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
      </nav>

      {/* Card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '36px', width: '100%', maxWidth: '400px' }}>

          <h2 style={{ margin: '0 0 4px', color: '#111', fontSize: '22px', fontWeight: 700 }}>
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h2>
          <p style={{ margin: '0 0 24px', color: '#888', fontSize: '14px' }}>
            {isSignUp ? 'Start protecting your payments' : 'Sign in to your FreelanceShield account'}
          </p>

          {/* Google Button */}
          <button onClick={handleGoogle}
            style={{ width: '100%', padding: '11px', background: 'white', border: '1px solid #e5e5e5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
            <span style={{ color: '#888', fontSize: '12px' }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
          </div>

          {/* Email */}
          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', marginTop: '4px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none', color: '#111' }} />

          {/* Password */}
          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', marginTop: '4px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none', color: '#111' }} />

          {error && <p style={{ color: '#e74c3c', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '16px' }}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {/* Toggle */}
          <p style={{ textAlign: 'center', margin: 0, fontSize: '14px', color: '#888' }}>
            {isSignUp ? 'Already have account? ' : "Don't have account? "}
            <span onClick={() => { setIsSignUp(!isSignUp); setError('') }}
              style={{ color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}