'use client'
import Link from 'next/link'
import Footer from '../components/Footer' 
import Image from 'next/image';

export default function Terms() {
  return (
    <div style={{ 
      // Pure Rich Green Gradient Backdrop Structure
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px',
      color: '#111827'
    }}>

      {/* Static Glassmorphism Navbar Layer (Sticky styles completely removed) */}
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

      {/* Main Legal Asset Presentation Sheet */}
      <div style={{ maxWidth: '760px', margin: '20px auto', padding: '0 20px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.6)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)', 
          borderRadius: '16px', 
          padding: '40px',
          boxShadow: '0 10px 30px rgba(29, 158, 117, 0.02)'
        }}>

          <h1 style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Terms & Conditions</h1>
          <p style={{ margin: '0 0 32px', color: '#374151', fontSize: '14px', fontWeight: 600 }}>Last updated: June 2026</p>

          {/* Original Content Sections Loop */}
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing or using FreelanceShield, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform. FreelanceShield is a milestone-based escrow payment platform designed for Indian freelancers and their clients.'
            },
            {
              title: '2. Platform Description',
              content: 'FreelanceShield facilitates secure payments between freelancers and clients using milestone-based escrow. Payments are processed through Razorpay Route, an RBI-regulated payment gateway. FreelanceShield acts as an intermediary platform and does not hold funds directly.'
            },
            {
              title: '3. User Responsibilities',
              content: 'Freelancers are responsible for delivering work as agreed in the project milestones. Clients are responsible for reviewing and approving work within the specified timeframe. Both parties agree to use the platform in good faith and not to engage in fraudulent activities.'
            },
            {
              title: '4. Escrow & Payments',
              content: 'Client payments are held in escrow via Razorpay Route until milestone approval. Funds are released to the freelancer only after explicit client approval. FreelanceShield charges a platform fee of 5% per transaction. This fee is non-refundable once a milestone is approved and released.'
            },
            {
              title: '5. Auto-Release Policy',
              content: 'If a client does not respond to a submitted milestone within 7 days, the funds may be automatically released to the freelancer. This policy protects freelancers from payment delays caused by unresponsive clients.'
            },
            {
              title: '6. Dispute Resolution',
              content: 'Either party may raise a dispute through the platform. FreelanceShield will review disputes within 24-48 hours and may request evidence from both parties. FreelanceShield\'s decision in dispute resolution is final. Refunds are subject to dispute review outcomes.'
            },
            {
              title: '7. Prohibited Activities',
              content: 'Users may not use FreelanceShield for illegal transactions, money laundering, or fraudulent activities. Any attempt to bypass the escrow system by conducting direct payments after initiating a project on our platform is strictly prohibited.'
            },
            {
              title: '8. Platform Fee',
              content: 'FreelanceShield charges a 5% platform fee on each milestone transaction. This fee covers payment processing, escrow management, dispute resolution support, and platform maintenance. The fee is automatically deducted at the time of milestone release.'
            },
            {
              title: '9. Limitation of Liability',
              content: 'FreelanceShield is not liable for disputes arising from the quality of work delivered. Our liability is limited to the escrow amount held on the platform at the time of any claim. We are not responsible for delays caused by banking or payment gateway systems.'
            },
            {
              title: '10. Governing Law',
              content: 'These Terms are governed by the laws of India. Any disputes arising from the use of FreelanceShield shall be subject to the exclusive jurisdiction of the courts in India. These Terms comply with the Information Technology Act, 2000 and applicable RBI guidelines.'
            },
            {
              title: '11. Changes to Terms',
              content: 'FreelanceShield reserves the right to modify these Terms at any time. Users will be notified of significant changes via email. Continued use of the platform after changes constitutes acceptance of the new Terms.'
            },
            {
              title: '12. Contact',
              content: 'For any questions regarding these Terms, please contact us at support@freelanceshield.in'
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111827', fontWeight: 700 }}>{section.title}</h2>
              <p style={{ margin: 0, color: '#273142', fontSize: '14px', lineHeight: 1.7, fontWeight: 500 }}>{section.content}</p>
            </div>
          ))}

        </div>
      </div>

      {/* Glassmorphic Wrapped Bottom Links Panel */}
   

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