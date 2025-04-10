import { RequestErrorContext } from "next/dist/server/instrumentation/types";

const getOpponentMove = async (gameState: string[][]) => {
  const gameStateString = JSON.stringify(gameState);

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
    console.log("error", error);
    throw new Error(`${error}`);
  }
};

export default getOpponentMove;
