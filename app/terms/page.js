 // Added correct relative path
import Footer from '../components/Footer' 
export default function Terms() {
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

          <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111' }}>Terms & Conditions</h1>
          <p style={{ margin: '0 0 32px', color: '#888', fontSize: '14px' }}>Last updated: June 2026</p>

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
              <h2 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111', fontWeight: 600 }}>{section.title}</h2>
              <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}

        </div>
      </div>
<Footer/>
    
    </div>
  )
}