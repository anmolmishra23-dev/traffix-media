import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Traffix Media — Be Seen. Be Known.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-circle.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#6a1a23",
          color: "#fdf5ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, opacity: 0.7, textTransform: "uppercase" }}>Traffix Media</div>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, marginTop: 24, textTransform: "uppercase" }}>
            Be seen.
          </div>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase", opacity: 0.85 }}>
            Be known.
          </div>
          <div style={{ fontSize: 30, marginTop: 36, opacity: 0.75 }}>Social media · Influencer · Content marketing</div>
        </div>
        <img src={logoSrc} width={380} height={380} alt="" />
      </div>
    ),
    size,
  );
}
