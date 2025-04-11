"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Cell from "./components/cell";
import { checkWinner } from "./winCases";
import getOpponentMove from "./opponent";
import Settings from "./components/settings/settingsPopup";
import SettingsIcon from "./components/settings/settingsIcon";

export default function GameBoard() {
  const [gameState, SetGameState] = useState<string[][]>([
    ["0", "0", "0"],
    ["0", "0", "0"],
    ["0", "0", "0"],
  ]);
  const [gameWinner, setGameWinner] = useState<string | null>(null);
  const [xTurn, SetXTurn] = useState<boolean>(true);
  const [vsAI, SetVsAI] = useState<boolean>(false);
  const [showSettings, SetShowSettings] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setGameType = (gameType: string) => {
    gameType === "classic" ? SetVsAI(false) : SetVsAI(true);
    console.log(gameType);
  };

  useEffect(() => {
    const aud = new Audio("./sounds/pick.mp3");
    aud.playbackRate = 3;
    aud.volume = 1;
    audioRef.current = aud;

    return () => {
      aud.pause();
      aud.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    resetTheGame();
  }, [vsAI]);

  useEffect(() => {
    const winner = checkWinner(gameState);
    if (winner != null) {
      setGameWinner(winner);
      return;
    }

    if (!xTurn && vsAI) opponentAiMove();
  }, [xTurn, gameState]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const opponentAiMove = async () => {
    try {
      let move = await getOpponentMove(gameState);
      console.log("move", move);
      cellAction(move);
    } catch (error) {
      console.log("error", error);
      if (error instanceof Error) {
        alert(`Opponent move request failed: ${error.message}`);
      }
    }
  };

  const cellAction = (cellId: string) => {
    const [row, col] = cellId.split("_").map(Number);

    const tempGameState = gameState;
    if (tempGameState[row][col] === "0") {
      tempGameState[row][col] = xTurn ? "x" : "o";
      playSound();

      SetGameState([...tempGameState]);
      SetXTurn(!xTurn);
    }
  };
  const showGameResult = (): string => {
    if (gameWinner == null) return "";

    if (gameWinner == "draw") {
      return "Draw";
    } else return `${gameWinner} Wins`;
  };
  const DrawGameBoard = (): React.ReactNode => {
    if (typeof gameWinner == "string") return;

    return gameState.map((row, rowIndex) => {
      let rowItems = row.map((cell, itemIndex) => {
        return (
          <Cell
            key={`${rowIndex}_${itemIndex}`}
            cellId={`${rowIndex}_${itemIndex}`}
            disable={!xTurn && vsAI}
            xTurn={xTurn}
            cellAction={cellAction}
          >
            {cell === "0" ? "" : cell}
          </Cell>
        );
      });

      return rowItems;
    });
  };

  const resetTheGame = (): void => {
    SetGameState([
      ["0", "0", "0"],
      ["0", "0", "0"],
      ["0", "0", "0"],
    ]);
    setGameWinner(null);
    SetXTurn(true);
  };

  return (
    <>
      {/* <div className="flex w-full">
        <NeonText
          text="Win Streak: "
          baseColor="#fff"
          glowColor="#39FF14"
          isFlickering={false}
          lessGlow={true}
        />
      </div> */}

      <div className="flex text-green-400">
        <span className="text-5xl uppercase">{showGameResult()}</span>
      </div>
      <div className="grid grid-cols-3 grid-rows-3 ">
        <DrawGameBoard />
      </div>
      {gameWinner && (
        <button
          onClick={() => resetTheGame()}
          className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent w-full">
            Play again
          </span>
        </button>
      )}
      <Settings
        open={showSettings}
        setOpen={SetShowSettings}
        setGameType={setGameType}
      />
      <SettingsIcon onClick={() => SetShowSettings(true)} />
    </>
  );
}
