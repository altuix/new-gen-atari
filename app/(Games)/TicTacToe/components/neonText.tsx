"use client";

import React, { ReactNode, use, useState } from "react";

function NeonText({
  children = "",
  text,
  isFlickering,
  baseColor = "#fff",
  glowColor = "#0fa",
  lessGlow = false,
}: {
  children?: ReactNode;
  text?: string;
  isFlickering: boolean;
  baseColor?: string;
  glowColor?: string;
  lessGlow?: boolean;
}) {
  return (
    <>
      <h1
        className={` neonText ${isFlickering ? "flickering" : "static"} ${
          lessGlow ? "lessGlow" : ""
        }`}
        style={{
          "--neon-base": baseColor,
          "--neon-glow": glowColor,
        }}
      >
        {text}
      </h1>
      {children}
    </>
  );
}

export default NeonText;
