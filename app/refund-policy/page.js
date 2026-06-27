import Footer from '../components/Footer' 
export default function RefundPolicy() {
  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#1D9E75', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>F</span>
          <span style={{ fontWeight: 600, color: '#111', fontSize: '16px' }}>FreelanceShield</span>
        </div>
      </nav>

      <div style={{ maxWidth: '760px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '40px' }}>

          <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111' }}>Refund Policy</h1>
          <p style={{ margin: '0 0 32px', color: '#888', fontSize: '14px' }}>Last updated: June 2026</p>

          {/* Highlight Box */}
          <div style={{ background: '#e8f5ef', border: '1px solid #1D9E75', borderRadius: '10px', padding: '16px', marginBottom: '32px' }}>
            <p style={{ margin: 0, color: '#1D9E75', fontWeight: 600, fontSize: '14px' }}>
              🛡️ Your money is always protected. Funds are held in escrow and released only after your approval.
            </p>
          </div>

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
              content: 'The 5% FreelanceShield platform fee is non-refundable in all circumstances, including disputed transactions. This fee covers payment processing costs, escrow management, and dispute resolution services.'
            },
            {
              title: '9. Contact for Refunds',
              content: 'For any refund-related queries, please contact us at support@freelanceshield.in. Please include your project ID and milestone details in your email for faster resolution.'
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '28px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111', fontWeight: 600 }}>{section.title}</h2>
              <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}

        </div>
      </div>

      {/* Footer Links */}
      <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: '13px' }}>
        <a href="/terms" style={{ color: '#1D9E75', marginRight: '16px', textDecoration: 'none' }}>Terms & Conditions</a>
        <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</a>
      </div>
<Footer/>
    </div>
  )
}