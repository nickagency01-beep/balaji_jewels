import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f3d2e",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Top rule */}
        <div style={{ width: 64, height: 1, background: "#c9a84c", marginBottom: 44 }} />

        {/* Brand name */}
        <div
          style={{
            color: "#c9a84c",
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: "0.25em",
            lineHeight: 1,
          }}
        >
          BALAJI
        </div>

        {/* Sub-brand */}
        <div
          style={{
            color: "#e8d5b0",
            fontSize: 20,
            letterSpacing: "0.6em",
            marginTop: 18,
            fontWeight: 300,
          }}
        >
          FINE JEWELRY
        </div>

        {/* Bottom rule */}
        <div style={{ width: 64, height: 1, background: "#c9a84c", marginTop: 44, marginBottom: 44 }} />

        {/* Tagline */}
        <div
          style={{
            color: "#7ab89e",
            fontSize: 20,
            letterSpacing: "0.08em",
          }}
        >
          Handcrafted luxury jewelry for every moment
        </div>
      </div>
    ),
    { ...size }
  );
}
