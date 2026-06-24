'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function BankDetails() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({
    bank_account_holder: '',
    bank_account_number: '',
    bank_ifsc: '',
  })
  // Validation errors state
  const [errors, setErrors] = useState({
    bank_account_number: '',
    bank_ifsc: '',
  })

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/bank-details?user_id=${session.user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.bank_account_holder) {
          setForm({
            bank_account_holder: data.bank_account_holder || '',
            bank_account_number: data.bank_account_number || '',
            bank_ifsc: data.bank_ifsc || '',
          })
        }
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [session])

  function handleChange(e) {
    const { name, value } = e.target
    
    // Auto uppercase for IFSC input dynamically
    const finalValue = name === 'bank_ifsc' ? value.toUpperCase() : value

    setForm({ ...form, [name]: finalValue })
    
    // Clear error dynamically as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  function validateForm() {
    let isValid = true
    const newErrors = { bank_account_number: '', bank_ifsc: '' }

    // Account Number Check: Minimum 9 and maximum 18 digits (digits only)
    const accRegex = /^\d{9,18}$/
    if (!accRegex.test(form.bank_account_number)) {
      newErrors.bank_account_number = 'Please enter a valid bank account number (9-18 digits).'
      isValid = false
    }

    // IFSC Code Check: Standard Indian Financial System Code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
    if (!ifscRegex.test(form.bank_ifsc)) {
      newErrors.bank_ifsc = 'Please enter a valid 11-character IFSC code (e.g., SBIN0001234).'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleSubmit() {
    if (!form.bank_account_holder || !form.bank_account_number || !form.bank_ifsc) {
      alert('Please fill all fields')
      return
    }

    // Run Regex Validations
    if (!validateForm()) {
      return
    }

    setLoading(true)

    const res = await fetch('/api/bank-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        ...form
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      alert('Error: ' + data.error)
      return
    }

    alert('Bank details saved!')
    router.push('/create')
  }

  if (fetching) {
    return (
      <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888' }}>Loading...</p>
      </div>
    )
  }

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

      <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px' }}>

        <h2 style={{ margin: '0 0 4px', fontSize: '24px', color: '#111' }}>Bank details</h2>
        <p style={{ margin: '0 0 24px', color: '#888', fontSize: '14px' }}>
          Add these details so that when the client approves the milestone, the funds can be released directly into your account.
        </p>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px' }}>

          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Account holder name *</label>
          <input
            name="bank_account_holder"
            value={form.bank_account_holder}
            onChange={handleChange}
            placeholder="As written in your bank passbook"
            style={inputStyle}
          />

          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500, marginTop: '14px', display: 'block' }}>Account number *</label>
          <input
            name="bank_account_number"
            value={form.bank_account_number}
            onChange={handleChange}
            placeholder="1234567890123"
            style={{ ...inputStyle, borderColor: errors.bank_account_number ? '#ff4d4f' : '#e5e5e5' }}
          />
          {errors.bank_account_number && (
            <span style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.bank_account_number}</span>
          )}

          <label style={{ fontSize: '13px', color: '#555', fontWeight: 500, marginTop: '14px', display: 'block' }}>IFSC code *</label>
          <input
            name="bank_ifsc"
            value={form.bank_ifsc}
            onChange={handleChange}
            placeholder="SBIN0001234"
            style={{ ...inputStyle, textTransform: 'uppercase', borderColor: errors.bank_ifsc ? '#ff4d4f' : '#e5e5e5' }}
          />
          {errors.bank_ifsc && (
            <span style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.bank_ifsc}</span>
          )}

          <p style={{ fontSize: '12px', color: '#888', marginTop: '16px', background: '#f9f9f9', padding: '10px 12px', borderRadius: '8px' }}>
            🔒 Your bank details are encrypted and securely stored. They are only used for payouts.
          </p>

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px', background: '#111', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '20px' }}>
            {loading ? 'Saving...' : 'Save bank details'}
          </button>
        </div>
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