'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseUrl = 'https://hxtwdfjpnrkzxtayjczh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dHdkZmpucmt6eHR5YWpjemhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Mzg5NzIsImV4cCI6MjA5NjUxNDk3Mn0.ykAl7tM1gPclpJrGtspr4p_tryfS-g6aVSbWJ2appXk '

const supabase = createClient(supabaseUrl, supabaseKey)



export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  async function handleAuth() {
    setLoading(true)
    setError('')
    
    let result
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password })
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '40px', width: '400px' }}>
        
        <h2 style={{ color: '#1D9E75', margin: '0 0 8px', fontSize: '24px' }}>FreelanceShield 🛡️</h2>
        <p style={{ color: '#aaa', margin: '0 0 32px', fontSize: '14px' }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#1a1a1a', color: 'white', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }}
        />

        {error && <p style={{ color: '#E24B4A', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#1D9E75', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginBottom: '16px' }}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Login'}
        </button>

        <p
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ color: '#1D9E75', textAlign: 'center', cursor: 'pointer', fontSize: '14px', margin: 0 }}
        >
          {isSignUp ? 'Already have account? Login' : "Don't have account? Sign Up"}
        </p>

      </div>
    </div>
  )
}