'use client'
import { useState } from 'react'

export default function FeedbackWidget() {
  const [hovered, setHovered] = useState(false)
  const formUrl = "https://forms.gle/efBpEnV4RZvQfJec6"

  return (
    <a 
      href={formUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        // Absolute Fixed Positioning Screen Layer
        position: 'fixed',
        bottom: '24px',
        left: '24px', // Left me chahiye toh 'left: 24px' kar sakti ho
        zIndex: 99999, // Taaki har modal aur layout ke upar dikhe
        
        // Flexbox structure
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        
        // Premium Glassmorphic Layout Styles
        background: hovered ? '#111827' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: hovered ? '#ffffff' : '#1D9E75',
        border: hovered ? '1px solid #111827' : '1px solid rgba(29, 158, 117, 0.3)',
        padding: '12px 18px',
        borderRadius: '30px',
        fontWeight: 600,
        fontSize: '14px',
        textDecoration: 'none',
        boxShadow: hovered 
          ? '0 10px 25px rgba(0, 0, 0, 0.2)' 
          : '0 8px 24px rgba(29, 158, 117, 0.15)',
        
        // Micro-interactions smooth transition transitions
        transform: hovered ? 'translateY(-4px) scale(1.03)' : 'translateY(0) scale(1)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }}
    >
      {/* Dynamic Visual Indicator Icon */}
      <span style={{ fontSize: '16px' }}>{hovered ? '✍️' : '💬'}</span>
      
      {/* Label Node Text */}
      <span style={{ letterSpacing: '-0.01em' }}>Give Feedback</span>
    </a>
  )
}