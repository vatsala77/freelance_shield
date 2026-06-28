'use client'
import { useState } from 'react'
import Link from 'next/link'
import Footer from '../components/Footer' 
import Image from 'next/image'
export default function RefundPolicy() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div style={{ 
      // Pure Rich Green Gradient Backdrop Structure matching your global layout
      background: 'linear-gradient(180deg, #d4f7e6 0%, #bbf7d0 50%, #a7f3d0 100%)', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '40px',
      color: '#111827'
    }}>

      {/* Static Glassmorphism Navbar Layer (Sticky behavior removed) */}
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

          {/* Clean Navbar Right Text Controls Options Link Array */}
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

          <h1 style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Refund Policy</h1>
          <p style={{ margin: '0 0 32px', color: '#374151', fontSize: '14px', fontWeight: 600 }}>Last updated: June 2026</p>

          {/* Highlight Info Glassmorphic Box with Discrete Clean Green Border */}
          <div style={{ 
            background: 'rgba(232, 245, 239, 0.6)', 
            border: '1px solid rgba(29, 158, 117, 0.3)', 
            borderRadius: '10px', 
            padding: '16px', 
            marginBottom: '32px' 
          }}>
            <p style={{ margin: 0, color: '#1D9E75', fontWeight: 700, fontSize: '14px', lineHeight: '1.5' }}>
              🛡️ Your money is always protected. Funds are held in escrow and released only after your approval.
            </p>
          </div>

          {/* Exact Mapping Loop of Original Content Sections Text Arrays */}
          {[
            {
              title: '1. Escrow Protection',
              content: 'All client payments on FreelanceShield are held in a secure Razorpay escrow account. Funds are never directly transferred to the freelancer until the client explicitly approves the submitted work. This ensures complete protection for clients.'
            },
            {
              title: '2. Eligible Refund Scenarios',
              content: 'You are eligible for a full refund in the following cases: (a) Freelancer fails to submit work within the agreed deadline, (b) Freelancer is unresponsive for more than 7 days after payment, (c) Freelancer abandons the project without delivering any work, (d) A dispute is raised and reviewed in the client\'s favor by FreelanceShield.'
            },
            {
              title: '3. Non-Refundable Scenarios',
              content: 'Refunds will NOT be processed in the following cases: (a) Client has already approved and released a milestone payment, (b) Work has been delivered as per the agreed scope and client is dissatisfied with quality only, (c) Client changes project requirements after work has begun, (d) The 5% platform fee is non-refundable in all cases.'
            },
            {
              title: '4. How to Request a Refund',
              content: 'To request a refund, click the "Raise a Dispute" button on the payment page for the specific milestone. Provide a clear reason for the refund request. Our team will review your request within 24-48 business hours and contact both parties for resolution.'
            },
            {
              title: '5. Refund Timeline',
              content: 'Once a refund is approved by FreelanceShield, the amount will be credited back to your original payment method within 5-7 business days. UPI refunds typically process within 1-3 business days. Card refunds may take up to 7 business days depending on your bank.'
            },
            {
              title: '6. Partial Refunds',
              content: 'In cases where some milestones have been completed and approved, only the unapproved/pending milestone amounts are eligible for refund. Approved and released milestones cannot be reversed.'
            },
            {
              title: '7. Dispute-Based Refunds',
              content: 'When a dispute is raised, FreelanceShield will review evidence from both parties. If the dispute is resolved in the client\'s favor, the full escrow amount for that milestone will be refunded. If resolved in the freelancer\'s favor, the funds will be released to the freelancer.'
            },
            {
              title: '8. Platform Fee',
              content: 'The 5% FreelanceShield platform fee is non-refundable in all circumstances, including disputed transactions. This fee covers payment processing, escrow management, dispute resolution support, and platform maintenance.'
            },
            {
              title: '9. Contact for Refunds',
              content: 'For any refund-related queries, please contact us at support@freelanceshield.in. Please include your project ID and milestone details in your email for faster resolution.'
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111827', fontWeight: 700 }}>{section.title}</h2>
              <p style={{ margin: 0, color: '#273142', fontSize: '14px', lineHeight: 1.7, fontWeight: 500 }}>{section.content}</p>
            </div>
          ))}

        </div>
      </div>

      {/* Glassmorphic Wrapped Footer Link Panel Container Node */}
     
      {/* Global CSS Style Sheet Enhancements Injector */}
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

        /* Navbar Options Interactive States */
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