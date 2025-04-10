import { OpenAI } from "openai"; // ChatCompletion tipini ekledik
import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

interface RequestBody {
  gameState: string[][];
}
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 5000,
});

export async function POST(request: NextRequest): Promise<Response> {
  const { gameState }: RequestBody = await request.json();
  const GAME_STATE: string[][] = gameState;

  console.log("GAME_STATE", GAME_STATE);

  const promptTemplate = (attempt: number, invalidMoves: string[]): string => `
  
You are playing Tic-Tac-Toe as O on a 3x3 grid (rows and columns: 0-2). 
'X' is your opponent, 'O' is you, '0' is empty. 
Your move MUST be an empty cell ('0') with coordinates 'row_column' (e.g., '0_1').
Do NOT suggest occupied cells ('X' or 'O') or invalid coordinates (outside 0-2).
Follow these steps strictly:
1. List all empty cells ('0') from the board.
2. Check if placing 'O' in any empty cell wins (three 'O's in a row, column, or diagonal).
3. If no win, check if 'X' can win next turn and block it by picking that empty cell.
4. Otherwise, pick the center (1_1) if empty, then corners (0_0, 0_2, 2_0, 2_2) if empty.

Current board: ${JSON.stringify(GAME_STATE)}
Respond with coordinates like 'row_column' only. No other text.
 ${
   attempt > 1
     ? `Previous invalid move: ${invalidMoves.join(",")}. Do NOT repeat these.`
     : ""
 }
  `;

  async function getAIMove(maxAttempts: number = 5): Promise<string | null> {
    let attempt: number = 1;
    let lastResponse: string | null = null;
    let invalidMoves: string[] = [];

    while (attempt <= maxAttempts) {
      const prompt: string = promptTemplate(
        attempt,

        invalidMoves
      );
      console.log("prompt", prompt);

      try {
        // response’u ChatCompletion tipiyle tanımladık
        const response = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 10,
        });

        // choices[0]’ın varlığını kontrol ediyoruz
        const suggestedMove = response?.choices?.[0]?.message?.content;
        console.log("suggestedMove", suggestedMove);
        console.log("response", response);

        console.log(`Attempt ${attempt}: Suggested move - ${suggestedMove}`);

        if (!suggestedMove) {
          lastResponse = suggestedMove;
          attempt++;
          continue;
        }

        const [row, col]: number[] = suggestedMove.split("_").map(Number);

        if (isValidMove(row, col, GAME_STATE)) {
          return suggestedMove;
        }
        invalidMoves.push(suggestedMove);
        lastResponse = suggestedMove;
        attempt++;
      } catch (error) {
        console.error("Error in AI move:", error);
        return null;
      }
    }
    return null;
  }

  let finalMove: string | null = null;
  try {
    finalMove = await getAIMove();
  } catch (error) {
    console.error("Error in AI move:", error);
    return NextResponse.json(
      { message: "Error in AI move:", error },
      { status: 401 }
    );
  }

  if (finalMove === null) {
    return NextResponse.json(
      { message: "No valid move found" },
      { status: 401 }
    );
  }

  return new Response(JSON.stringify(finalMove), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

function isValidRow(row: number): boolean {
  return row >= 0 && row < 3;
}

function isValidCol(col: number): boolean {
  return col >= 0 && col < 3;
}

function isCellEmpty(gameState: string[][], row: number, col: number): boolean {
  return gameState[row][col] === "0";
}

function isValidMove(row: number, col: number, gameState: string[][]): boolean {
  if (!isValidRow(row)) return false;
  if (!isValidCol(col)) return false;
  if (!isCellEmpty(gameState, row, col)) return false;
  return true;
}

function extractMove(response: string): string | null {
  const regex: RegExp = /\d_\d/;
  const match: RegExpMatchArray | null = response.match(regex);
  return match ? match[0] : null;
}
