import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Joyce J Charuvila & Associates — Chartered Accountants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B1F3A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        {/* Subtle grid lines decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "480px",
            height: "630px",
            background:
              "linear-gradient(135deg, rgba(27,82,131,0.18) 0%, transparent 60%)",
          }}
        />

        {/* CA Monogram circle */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#1B5283",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontFamily: "serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            CA
          </span>
        </div>

        {/* Firm name */}
        <div
          style={{
            fontFamily: "serif",
            fontSize: 56,
            fontWeight: 400,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            marginBottom: 20,
            maxWidth: 860,
          }}
        >
          JOYCE J CHARUVILA
          <br />& ASSOCIATES
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            fontFamily: "sans-serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 48,
          }}
        >
          Chartered Accountants · Kerala, India &amp; UAE
        </div>

        {/* Divider */}
        <div
          style={{
            width: 64,
            height: 2,
            background: "#1B5283",
            marginBottom: 36,
          }}
        />

        {/* Services strip */}
        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 15,
            color: "#64748b",
            fontFamily: "sans-serif",
          }}
        >
          {["Audit & Assurance", "GST & Income Tax", "UAE VAT & Corporate Tax", "Accounting"].map(
            (s) => (
              <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#1B5283", fontSize: 18 }}>·</span>
                {s}
              </span>
            )
          )}
        </div>

        {/* Domain — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 96,
            fontSize: 18,
            color: "#475569",
            fontFamily: "sans-serif",
            letterSpacing: "0.06em",
          }}
        >
          joyceca.in
        </div>
      </div>
    ),
    { ...size }
  );
}
