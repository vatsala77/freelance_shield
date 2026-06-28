'use client'
import Link from 'next/link'
import Footer from '../components/Footer' 
import Image from 'next/image'
export default function PrivacyPolicy() {
  return (
    <div style={{ 
      // Pure Rich Green Gradient Backdrop Structure matching your global layout
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px',
      color: '#111827'
    }}>

      {/* Static Glassmorphism Navbar Layer (Sticky behavior removed just like Terms/Refund) */}
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
          {/* Logo Brand Hyperlink with Neon Glow Parameters on click */}
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

          {/* Clean Navbar Right Text Controls Layout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Home</span>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: 'none', position: 'relative', paddingBottom: '4px' }} className="nav-item">
              <span className="nav-text">Dashboard</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Layout Presentation Content Card */}
      <div style={{ maxWidth: '760px', margin: '20px auto', padding: '0 20px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.6)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)', 
          borderRadius: '16px', 
          padding: '40px',
          boxShadow: '0 10px 30px rgba(29, 158, 117, 0.02)'
        }}>

          <h1 style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
          <p style={{ margin: '0 0 32px', color: '#374151', fontSize: '14px', fontWeight: 600 }}>Last updated: June 2026</p>

          {/* Exact Mapping Loop of Original Content Sections */}
          {[
            {
              title: '1. Information We Collect',
              content: 'We collect information you provide directly to us when creating an account, setting up an escrow project, or initiating a transaction. This includes your name, email address, contact information, billing details, and any dynamic milestone descriptions or payment instructions.'
            },
            {
              title: '2. How We Use Your Information',
              content: 'We use the collected data to operate, maintain, and provide the core escrow features of FreelanceShield. This includes managing secure transaction pipelines, verifying user identity, delivering automated email notifications (via Resend), resolving platform disputes, and preventing malicious or fraudulent activities.'
            },
            {
              title: '3. Data Sharing & Third-Party Services',
              content: 'FreelanceShield strictly does not sell your personal data. We securely share mandatory transaction information with our primary integrated payment gateway, Razorpay Route, to execute RBI-compliant escrow funding and direct-to-bank settlement flows. Essential communication infrastructure like transaction emails are handled via Resend.'
            },
            {
              title: '4. Security Measures',
              content: 'Your security is our priority. While funds are processed through bank-grade infrastructure hosted by Razorpay, your platform information, account details, and audit logs are guarded using end-to-end industry-standard encryption protocols to maintain maximum security and integrity.'
            },
            {
              title: '5. Cookies & Tracking Technology',
              content: 'We utilize standard session cookies to keep you safely logged into your user dashboard and save lightweight layout choices. These cookies do not extract arbitrary personal information from your computer or track your third-party browsing metrics.'
            },
            {
              title: '6. Data Retention Policy',
              content: 'We preserve your essential transaction history, active user details, contract milestones, and chronological activity timelines as long as your account remains open to fulfill compliance obligations, provide automated ledger references, and safely manage potential refund dispute pipelines.'
            },
            {
              title: '7. Your Privacy Rights',
              content: 'As a user under Indian IT Act regulations, you have complete authority to view, modify, or permanently delete your stored profile details. Note that archived billing ledger documentation cannot be dynamically modified due to standard financial compliance standards.'
            },
            {
              title: '8. Changes to This Policy',
              content: 'FreelanceShield reserves the right to upgrade this dynamic Privacy Policy declaration framework at any time. If significant revisions are verified, our internal pipeline will instantly notify your recorded user profile via official email communications.'
            },
            {
              title: '9. Contact Support',
              content: 'If you have any underlying questions, operational doubts, or explicit optimization ideas regarding this legal text layout statement, feel free to coordinate directly with us at support@freelanceshield.in'
            }
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111827', fontWeight: 700 }}>{section.title}</h2>
              <p style={{ margin: 0, color: '#273142', fontSize: '14px', lineHeight: 1.7, fontWeight: 500 }}>{section.content}</p>
            </div>
          ))}

        </div>
      </div>

    

      {/* Global CSS Style Sheet Injector */}
      <style jsx global>{`
        /* Dynamic Brand Click Active Glow Effect Module */
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
        
        .footer-anchor:hover {
          color: #1D9E75 !important;
          text-decoration: underline !important;
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

      <Footer />
    </div>
  )
}