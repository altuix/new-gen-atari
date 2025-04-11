import { Metadata } from "next";
import React, { ReactNode } from "react";
import { Tilt_Neon } from "next/font/google";
import "./game.css";
import NeonText from "./TicTacToe/components/neonText";

const tiltNeon = Tilt_Neon({
  variable: "--font-tilt-neon",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tic Tac Toe",
  description: "Created by altuix",
};

export default function GamesLayout({ children }: { children: ReactNode }) {
  return (
    <div className={tiltNeon.variable}>
      <div className="tiltNeon grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-row  justify-center items-center  text-5xl">
          <NeonText
            text="Tic"
            baseColor="#fff"
            glowColor="#39FF14"
            isFlickering={false}
          />
          <NeonText
            text="Tac"
            baseColor="#fff"
            glowColor="#39FF14"
            isFlickering={false}
          />
          <NeonText
            text="To"
            baseColor="#fff"
            glowColor="#39FF14"
            isFlickering={false}
          >
            <span>
              <NeonText
                text="e"
                baseColor="#fff"
                glowColor="#39FF14"
                isFlickering={true}
              />
            </span>
          </NeonText>
        </div>

        <main className="flex flex-col gap-[32px]  row-start-2 sm:items-center h-full max-w-[240px] justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
