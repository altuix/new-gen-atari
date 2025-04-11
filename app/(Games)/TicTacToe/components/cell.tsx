import React, { ReactNode } from "react";
import NeonText from "./neonText";

const Cell = ({
  children,
  cellId,
  cellAction,
  disable,
  xTurn,
}: {
  children: string;
  cellId: string;
  xTurn: boolean;
  cellAction: (cellId: string) => void;
  disable: boolean;
}) => {
  return (
    <div
      className="group flex bg-white box-border size-20 border-5 border-black font-black text-5xl uppercase  items-center justify-center text-black cursor-pointer rounded-lg "
      onClick={() => !disable && cellAction(cellId)}
    >
      <span className="opacity-80">
        {children != "x" ? (
          <NeonText
            text={children}
            baseColor="#ff073a"
            glowColor="#ff073a"
            isFlickering={false}
            lessGlow={true}
          />
        ) : (
          <NeonText
            text={children}
            baseColor="#2323FF"
            glowColor="#2323FF"
            isFlickering={false}
            lessGlow={true}
          />
        )}
      </span>

      {children == "" ? (
        <span className="opacity-0 transition-opacity  group-hover:opacity-10">
          {xTurn ? "X" : "O"}
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export default Cell;
