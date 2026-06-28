'use client'
import React from 'react';

export default function FreelanceShieldHeroIllustration({ width = "100%", height = "auto" }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 800 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0px 20px 40px rgba(29, 158, 117, 0.05))' }}
    >
      {/* Dynamic Background Glow Layer */}
      <circle cx="400" cy="250" r="180" fill="url(#ambientBgGlow)" opacity="0.25" />

      {/* Grid Pattern Mesh */}
      <path d="M100 150H700M100 250H700M110 360H690M250 80V440M450 80V440" stroke="rgba(29, 158, 117, 0.06)" strokeWidth="4" strokeDasharray="10 10" />

      {/* Card Node 1: Left Milestone Vault */}
      <g transform="translate(80, 140)">
        <rect width="240" height="130" rx="16" fill="white" fillOpacity="0.7" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        <rect x="16" y="16" width="36" height="32" rx="6" fill="#f59e0b" opacity="0.1" />
        <text x="24" y="38" fill="#f59e0b" fontSize="16" fontWeight="bold">📤</text>
        <text x="68" y="32" fill="#111827" fontSize="15" fontWeight="700">Milestone Phase 1</text>
        <text x="68" y="52" fill="#4b5563" fontSize="12" fontWeight="600">Awaiting Asset Audit</text>
        <rect x="16" y="90" width="160" height="8" rx="4" fill="rgba(0,0,0,0.05)" />
        <rect x="16" y="90" width="105" height="8" rx="4" fill="#f59e0b" />
        <text x="16" y="122" fill="#111827" fontSize="16" fontWeight="800">₹45,000</text>
      </g>

      {/* Card Node 2: Central Escrow Shield */}
      <g transform="translate(360, 80)">
        <rect width="240" height="150" rx="16" fill="white" fillOpacity="0.7" stroke="rgba(29, 158, 117, 0.2)" strokeWidth="1.5" />
        <rect x="16" y="16" width="36" height="32" rx="6" fill="#1D9E75" opacity="0.1" />
        <text x="24" y="38" fill="#1D9E75" fontSize="16" fontWeight="bold">🛡️</text>
        <text x="68" y="32" fill="#111827" fontSize="15" fontWeight="700">Escrow Security</text>
        <text x="68" y="52" fill="#1D9E75" fontSize="12" fontWeight="700">RBI Compliant</text>
        <text x="16" y="100" fill="#4b5563" fontSize="13" fontWeight="500">Funds locked safely inside banking node pipeline.</text>
      </g>

      {/* Card Node 3: Released Settlement Node */}
      <g transform="translate(220, 290)">
        <rect width="240" height="130" rx="16" fill="white" fillOpacity="0.85" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
        <rect x="16" y="16" width="36" height="32" rx="6" fill="#1D9E75" opacity="0.1" />
        <text x="24" y="38" fill="#1D9E75" fontSize="16" fontWeight="bold">✓</text>
        <text x="68" y="32" fill="#111827" fontSize="15" fontWeight="700">Milestone Released</text>
        <text x="16" y="74" fill="#111827" fontSize="24" fontWeight="800">₹85,000</text>
        <text x="16" y="104" fill="#1D9E75" fontSize="11" fontWeight="600">Dispatched straight to bank account</text>
      </g>

      {/* Network Spline Paths connecting cards */}
      <path d="M200 270 C 200 320, 180 350, 220 350" stroke="#1D9E75" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
      <path d="M480 230 C 480 320, 480 350, 460 350" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />

      <defs>
        <radialGradient id="ambientBgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1D9E75" stopOpacity="1" />
          <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}