import { Chess } from "chess.js";
import puzzlesData from "@/data/puzzles.json";

export type PuzzleDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Master";

export interface Puzzle {
  id: number;
  difficulty: PuzzleDifficulty;
  fen: string;
  solution: string[]; // Array of moves in SAN or UCI
  title: string;
}

/**
 * Gets today's puzzle for a given difficulty level.
 * The puzzle is selected based on the day of the year modulo the number of puzzles for that difficulty.
 */
export const getDailyPuzzle = (difficulty: PuzzleDifficulty): Puzzle | null => {
  const filteredPuzzles = puzzlesData.filter(p => p.difficulty === difficulty);
  if (filteredPuzzles.length === 0) {
    return null;
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const puzzleIndex = dayOfYear % filteredPuzzles.length;
  return filteredPuzzles[puzzleIndex];
};

/**
 * Validates a sequence of moves against the puzzle's solution.
 * Returns true if the moves match the solution, false otherwise.
 */
export const validateMoves = (initialFen: string, userMoves: string[], solution: string[]): boolean => {
  if (userMoves.length === 0) {
    return false;
  }

  const game = new Chess(initialFen);
  const tempSolution = [...solution]; // Create a mutable copy

  for (let i = 0; i < userMoves.length; i++) {
    const userMove = userMoves[i];
    const expectedMove = tempSolution[i];

    if (!expectedMove) {
      // User made more moves than in the solution
      return false;
    }

    // Try to make the user's move
    try {
      const moveResult = game.move(userMove);
      if (!moveResult) {
        // Invalid move according to chess.js
        return false;
      }
    } catch (e) {
      // Move was illegal or malformed
      return false;
    }

    // Check if the user's move matches the expected solution move
    // We compare the SAN representation for simplicity, but UCI could also be used.
    // Note: chess.js move() returns the move in object format, which includes SAN.
    // If solution is in SAN, we compare game.history({ verbose: true })[i].san
    // If solution is in UCI, we compare game.history({ verbose: true })[i].from + game.history({ verbose: true })[i].to
    const history = game.history({ verbose: true });
    const lastMove = history[history.length - 1];

    if (lastMove.san !== expectedMove && (lastMove.from + lastMove.to) !== expectedMove) {
      return false;
    }
  }

  // All user moves match the solution and the number of moves is the same
  return userMoves.length === solution.length;
};