import { NextApiRequest, NextApiResponse } from "next";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { StringOutputParser } from "@langchain/core/output_parsers";

type RequestBody = {
  gameState: string[][];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { gameState }: RequestBody = req.body;

    const promptTemplate = () => "hey";
    const model = new HuggingFaceInference({
      model: "distilbert-base-uncased-finetuned-sst-2-english",
      apiKey: process.env.HUGGINGFACE_API_TOKEN,
      maxTokens: 10,
      temperature: 0.5,
      cache: false,
      topK: 90,
      topP: 0.5,
    });

    const getAIMove = async (maxAttempts = 5) => {
      let attempt = 1;
      let lastResponse: string | null = null;

      while (attempt <= maxAttempts) {
        const prompt = promptTemplate();
        const response = await model.invoke(prompt);
        const suggestedMove = extractMove(response?.trim() ?? "");

        if (!suggestedMove) {
          lastResponse = suggestedMove;
          attempt++;
          continue;
        }

        const [row, col] = suggestedMove.split("_").map((x) => parseInt(x, 10));

        if (isValidMove(row, col, gameState)) {
          return suggestedMove;
        }

        lastResponse = suggestedMove;
        attempt++;
      }
    };

    const finalMove = await getAIMove();
    res.status(201).json({ move: finalMove });
  } catch (error) {
    console.error("Error in AI move:", error);
    res.status(500).json({ error: "Error in AI move" });
  }
}

const isValidMove = (
  row: number,
  col: number,
  gameState: string[][]
): boolean => {
  return (
    !isNaN(row) &&
    !isNaN(col) &&
    row >= 0 &&
    row < 3 &&
    col >= 0 &&
    col < 3 &&
    gameState[row][col] === "0"
  );
};

const extractMove = (response: string): string | null => {
  const regex = /\d_\d/;
  const match = response.match(regex);
  return match ? match[0] : null;
};
