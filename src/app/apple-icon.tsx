import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 130,
            height: 116,
            borderRadius: 20,
            border: "8px solid #2b6cb0",
            background: "#ffffff",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", height: 30, background: "#2b6cb0" }} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flex: 1,
              alignContent: "flex-start",
              gap: 10,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", width: 20, height: 20, background: "#2b6cb0" }} />
            <div style={{ display: "flex", width: 20, height: 20, background: "#2b6cb0" }} />
            <div style={{ display: "flex", width: 20, height: 20, background: "#2b6cb0" }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
