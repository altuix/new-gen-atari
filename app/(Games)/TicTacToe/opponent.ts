import { RequestErrorContext } from "next/dist/server/instrumentation/types";

const getOpponentMove = async (gameState: string[][]) => {
  const gameStateString = JSON.stringify(gameState);
  console.log("gameState", gameStateString);

  try {
    const response = await fetch("/api/OpenAi", {
      method: "POST",
      body: JSON.stringify({ gameState }),
      headers: {},
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    reportError({ message });
  }
};

export default getOpponentMove;
