export const checkWinner = (gameState: string[][]): string | null => {
  const winCombinations = [
    // horizontal
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // vertical
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // diagonal
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  // combos
  for (let combo of winCombinations) {
    const [[r1, c1], [r2, c2], [r3, c3]] = combo;
    const value = gameState[r1][c1];
    if (
      value !== "0" &&
      value === gameState[r2][c2] &&
      value === gameState[r3][c3]
    ) {
      return value; // "X" or "O" win
    }
  }

  if (gameState.flat().every((cell) => cell !== "0")) return "draw";

  // game on going
  return null;
};
