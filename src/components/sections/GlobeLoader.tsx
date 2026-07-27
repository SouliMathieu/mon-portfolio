"use client";

import dynamic from "next/dynamic";

const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-full bg-white/5 animate-pulse"
      style={{
        width: "min(50vw, 600px)",
        aspectRatio: "1 / 1",
      }}
    />
  ),
});

export default function GlobeLoader() {
  return <Globe />;
}