import React, { ReactNode } from "react";

const Cell = ({
  children,
  cellId,
  cellAction,
}: {
  children: ReactNode;
  cellId: string;
  cellAction: (cellId: string) => void;
}) => {
  return (
    <div
      className="flex bg-white box-border size-20 border-2 border-black font-black text-5xl uppercase  items-center justify-center text-black cursor-pointer"
      onClick={() => cellAction(cellId)}
    >
      {children}
    </div>
  );
};

export default Cell;
