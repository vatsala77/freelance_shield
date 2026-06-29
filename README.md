# FreelanceShield 🛡️

> India's first milestone-based escrow platform for freelancers. Get paid. Every time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-1D9E75?style=for-the-badge&logo=vercel)](https://youtu.be/913ymy50YuA)


---


## 🚨 The Problem

**8 crore Indian freelancers. Average wait: 47 days to get paid for work already delivered.**

- Client pays partial advance → takes the work → disappears
- No legal recourse, no protection, no Indian solution exists
- Deals happen on WhatsApp, payments on UPI, everything runs on blind trust
- When that trust breaks — the freelancer loses everything

---

## ✅ The Solution

FreelanceShield is a **trust platform** — not just a payment tool.

```
Freelancer creates project with milestones
              ↓
Client pays upfront — money locks in Razorpay escrow
              ↓
Freelancer delivers work + submits proof
              ↓
Client approves → money releases instantly
              ↓
If client ghosts → dispute raised → admin reviews → refund processed
```

---

## 🌐 Live Demo

🔗 **[https://freelance-shield-sable.vercel.app/](https://freelance-shield-sable.vercel.app/)**

| Role | Flow |
|------|------|
| **Freelancer** | Sign up → Create project → Share payment link → Submit work → Get paid |
| **Client** | Open link → Pay via UPI/Card → Review work → Approve & release |

---
## 🎥 Watch Demo

<p align="center">
  <a href="https://youtu.be/913ymy50YuA" target="_blank">
    <img
      src="https://img.youtube.com/vi/913ymy50YuA/maxresdefault.jpg"
      alt="FreelanceShield Demo"
      width="800"
    />
  </a>
</p>

<p align="center">
  <strong>▶ Click the thumbnail to watch the 2-minute product walkthrough.</strong>
</p>

## ✨ Features

### 🔐 Auth & Onboarding
- Email + Password signup/login via NextAuth + Supabase
- Bank details onboarding for Razorpay linked account
- Session-based freelancer/client view switching on pay page

### 📋 Freelancer Dashboard
- Real-time project list with milestone progress bars
- Project detail page with payment link copy + WhatsApp share
- Work submission with proof link per milestone
- Search and filter projects by status

### 💳 Client Payment Page
- No login required — just open the payment link
- Secure Razorpay checkout (UPI, Cards, Netbanking, EMI)
- Approve & Release button
- Request Changes option
- Raise Dispute with admin email notification
- Live activity feed (real-time updates)
- PDF receipt download
- "How it works" protection guide

### 🛡️ Trust & Compliance
- RBI-compliant escrow via Razorpay Route
- Terms & Conditions page
- Refund Policy page
- Dispute email notification to admin via Resend
- Email notifications on payment received and work submitted

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend + Backend** | Next.js 16 (App Router, API Routes) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | NextAuth.js + Supabase Auth |
| **Payments** | Razorpay Route (Escrow) |
| **Email** | Resend |
| **PDF** | jsPDF + html2canvas |
| **Deployment** | Vercel |

---

## 🗄️ Database Schema

**Milestone Status Flow:**

```
pending → funded → submitted → approved → released
                      ↓
              changes_requested
                      ↓
                   disputed
```

**Core Tables:**
- `profiles` — Freelancer accounts + Razorpay linked account
- `projects` — Project details + unique invite_token
- `milestones` — Full milestone lifecycle
- `platform_fees` — Fee tracking per milestone
- `disputes` — Dispute records
- `notifications` — Email/notification logs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Razorpay account (Route enabled)
- Resend account

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/freelanceshield.git
cd freelanceshield
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_key_secret
RESEND_API_KEY=re_xxxx
ADMIN_EMAIL=your@email.com
```

### Database Setup

Run `schema_v2.sql` in Supabase SQL Editor.

### Run Dev Server

```bash
npm run dev
```

---

## 💰 Pricing

| Fee | Amount |
|-----|--------|
| 🎉 FreelanceShield Platform Fee | **₹0 — Beta Period** |
| Razorpay Gateway (UPI, Debit, Credit, Netbanking) | 2% + 18% GST |
| Razorpay Gateway (EMI, Amex, BNPL) | 3% + 18% GST |

> Zero platform fee during beta. Only standard Razorpay gateway charges apply.

---

## 🗺️ Roadmap

### ✅ Live Now
- Milestone-based escrow flow
- Dispute resolution + admin email alerts
- PDF receipt download
- Work submission + approval flow
- Email notifications

### 🔜 Coming Soon
- 📄 PDF Work Agreement auto-generation
- ⏰ 7-day auto-reminder (Vercel Cron)
- 🤖 AI milestone auto-generator
- 📊 Freelancer expense dashboard
- ⭐ Client trust score
- 💎 Pro plan — ₹99-199/month
- 💸 2% platform fee post-beta

---

## 👩‍💻 About the Builder

Built by **Vatsala Sahu** — 3rd year B.Tech CSE, AKTU 🎓

- 🏅 AWS Certified Cloud Practitioner
- 🏅 AWS Certified Data Engineer – Associate
- 🚀 Solo founder — idea sourced from Razorpay's own Fix My Itch initiative
- ⚡ Razorpay Route approved same day of application

📧 vatsalasahu77@gmail.com

---
