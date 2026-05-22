import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fff8df",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Arial",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "999px",
            background: "#ffe680",
            top: "-160px",
            left: "-120px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "480px",
            height: "480px",
            borderRadius: "999px",
            background: "#ffd6e7",
            right: "-120px",
            top: "-80px",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              fontWeight: 700,
              marginBottom: "34px",
            }}
          >
            Toollane
          </div>

          <div
            style={{
              fontSize: "82px",
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-3px",
              maxWidth: "900px",
            }}
          >
            Fast Online Tools for Everyday Tasks
          </div>

          <div
            style={{
              fontSize: "30px",
              color: "#555",
              marginTop: "34px",
              maxWidth: "820px",
              lineHeight: 1.35,
            }}
          >
            Free calculators, converters and utility tools built for speed and simplicity.
          </div>
        </div>
      </div>
    ),
    size
  );
}