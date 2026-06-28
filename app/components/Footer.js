'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#f9f9f9', padding: '48px 20px 24px', borderTop: '1px solid #e5e5e5' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Top Section */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>F</span>
              <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
            </div>
            <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.7, margin: '0 0 16px', maxWidth: '260px' }}>
              India's first milestone-based escrow platform for freelancers. Get paid. Every time.
            </p>
            <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
              🔒 Powered by Razorpay Route · RBI compliant
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#111', fontSize: '13px', fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
            {[
              { label: 'Home', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Create Project', href: '/create' },
              { label: 'Login', href: '/login' },
            ].map(l => (
              <Link key={l.label} href={l.href} passHref legacyBehavior>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 10px', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#1D9E75'}
                  onMouseLeave={e => e.target.style.color = '#666'}>
                  {l.label}
                </p>
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: '#111', fontSize: '13px', fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
            {[
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Refund Policy', href: '/refund-policy' },
              { label: 'Privacy Policy', href: '/privacy' },
            ].map(l => (
              <Link key={l.label} href={l.href} passHref legacyBehavior>
                <p style={{ color: '#666', fontSize: '13px', margin: '0 0 10px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#1D9E75'}
                  onMouseLeave={e => e.target.style.color = '#666'}>
                  {l.label}
                </p>
              </Link>
            ))}
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 10px' }}>support@freelanceshield.in</p>
          </div>

        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            © 2026 FreelanceShield. All rights reserved.
          </p>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            Made with ❤️ for Indian freelancers
          </p>
        </div>

      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  )
}