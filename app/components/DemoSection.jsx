"use client";

import { useState } from "react";

export default function DemoSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto 70px",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(29,158,117,.15)",
            borderRadius: "28px",
            padding: "48px 24px",
            textAlign: "center",
            boxShadow: "0 18px 45px rgba(29,158,117,.08)",
          }}
        >
          <p
            style={{
              color: "#1D9E75",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            PRODUCT DEMO
          </p>

          <h2
            style={{
              fontSize: "clamp(30px,5vw,44px)",
              color: "#111827",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            See FreelanceShield in Action
          </h2>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto 38px",
              color: "#4b5563",
              lineHeight: 1.7,
              fontSize: "16px",
            }}
          >
            Watch a quick 2-minute walkthrough showing how projects are created,
            clients lock money securely in escrow, and milestone payments are
            released.
          </p>

          {/* Thumbnail */}

          <div
            onClick={() => setShowModal(true)}
            style={{
              position: "relative",
              cursor: "pointer",
              maxWidth: "900px",
              margin: "0 auto",
              overflow: "hidden",
              borderRadius: "22px",
              boxShadow: "0 20px 50px rgba(0,0,0,.18)",
              transition: ".3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-6px) scale(1.01)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src="https://img.youtube.com/vi/913ymy50YuA/maxresdefault.jpg"
              alt="Demo"
              style={{
                width: "100%",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,.25)",
              }}
            />

            {/* Play Button */}

            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",

                width: "95px",
                height: "95px",

                borderRadius: "50%",

                background: "#1D9E75",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "white",

                fontSize: "42px",

                boxShadow: "0 10px 35px rgba(29,158,117,.5)",
              }}
            >
              ▶
            </div>

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "22px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,.82), transparent)",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                Watch 2-Minute Demo
              </h3>

              <p
                style={{
                  color: "#e5e7eb",
                  marginTop: "8px",
                  marginBottom: 0,
                  fontSize: "14px",
                }}
              >
                Click anywhere to play.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.8)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "900px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "-42px",
                right: 0,
                background: "none",
                border: "none",
                color: "white",
                fontSize: "28px",
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
                borderRadius: "18px",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/913ymy50YuA?autoplay=1"
                title="Demo"
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