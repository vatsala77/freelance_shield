"use client";

import { useState } from "react";

export default function GlobalDemoButton() {
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Floating Watch Demo Button */}
      <button
  onClick={() => setShowModal(true)}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{
    position: "fixed",

    // Position
    left: "max(16px, env(safe-area-inset-left))",
    bottom: "calc(90px + env(safe-area-inset-bottom))",

    zIndex: 99999,

    // Layout
    display: "flex",
    alignItems: "center",
    gap: "8px",

    // Glassmorphism
    background: hovered
      ? "#111827"
      : "rgba(255,255,255,0.85)",

    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",

    color: hovered ? "#fff" : "#1D9E75",

    border: hovered
      ? "1px solid #111827"
      : "1px solid rgba(29,158,117,0.3)",

    // Responsive Size
    padding: "clamp(10px,2vw,12px) clamp(14px,3vw,18px)",

    borderRadius: "999px",

    fontSize: "clamp(13px,2vw,14px)",
    fontWeight: 600,

    boxShadow: hovered
      ? "0 10px 25px rgba(0,0,0,.2)"
      : "0 8px 24px rgba(29,158,117,.15)",

    transform: hovered
      ? "translateY(-4px) scale(1.03)"
      : "translateY(0) scale(1)",

    transition: "all .25s cubic-bezier(.4,0,.2,1)",

    cursor: "pointer",

    // Prevent overflow on small devices
    maxWidth: "calc(100vw - 32px)",
    whiteSpace: "nowrap",
  }}
>
  <span style={{ fontSize: "16px" }}>
    {hovered ? "🎬" : "🎥"}
  </span>

  <span style={{ letterSpacing: "-0.01em" }}>
    Watch Demo
  </span>
</button>

      {/* Video Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "760px",
              background: "#1f2937",
              borderRadius: "16px",
              padding: "12px",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "-36px",
                right: "0",
                background: "none",
                border: "none",
                color: "#9ca3af",
                fontSize: "22px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                borderRadius: "10px",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/913ymy50YuA?autoplay=1"
                title="FreelanceShield Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}