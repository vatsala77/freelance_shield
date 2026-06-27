import Footer from '../components/Footer' // Exact relative path as components is inside app/

export default function PrivacyPolicy() {
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

          <h1 style={{ margin: '0 0 4px', fontSize: '28px', color: '#111' }}>Privacy Policy</h1>
          <p style={{ margin: '0 0 32px', color: '#888', fontSize: '14px' }}>Last updated: June 2026</p>

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
              <h2 style={{ margin: '0 0 8px', fontSize: '16px', color: '#111', fontWeight: 600 }}>{section.title}</h2>
              <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: 1.7 }}>{section.content}</p>
            </div>
          ))}

        </div>
      </div>

      {/* Footer component injected smoothly at the absolute bottom */}
      <Footer />
    </div>
  )
}