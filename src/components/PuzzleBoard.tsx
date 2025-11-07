"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Puzzle, validateMoves, getDailyPuzzle, PuzzleDifficulty } from "@/utils/puzzle-logic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ShareButtons from "./ShareButtons";

interface PuzzleBoardProps {
  difficulty: PuzzleDifficulty;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ difficulty }) => {
  const { toast } = useToast();
  const [game, setGame] = useState<Chess | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");

  const loadPuzzle = useCallback(() => {
    const puzzle = getDailyPuzzle(difficulty);
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      setGame(new Chess(puzzle.fen));
      setUserMoves([]);
      setIsSolved(false);
      // Determine board orientation based on whose turn it is
      setBoardOrientation(new Chess(puzzle.fen).turn() === 'w' ? 'white' : 'black');
    } else {
      toast({
        title: "No puzzle found",
        description: `Could not find a puzzle for ${difficulty} difficulty.`,
        variant: "destructive",
      });
    }
  }, [difficulty, toast]);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!game || isSolved) return false;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen for simplicity in puzzles
    });

    if (move === null) return false; // Illegal move

    const updatedUserMoves = [...userMoves, move.san];
    setUserMoves(updatedUserMoves);

    const isCorrect = validateMoves(currentPuzzle!.fen, updatedUserMoves, currentPuzzle!.solution);

    if (isCorrect) {
      setIsSolved(true);
      toast({
        title: "✅ Correct!",
        description: "You solved the puzzle!",
        className: "bg-green-500 text-white",
      });
    } else if (updatedUserMoves.length === currentPuzzle!.solution.length) {
      // User made all moves but they are incorrect
      toast({
        title: "❌ Wrong, try again.",
        description: "Your sequence of moves is incorrect. Reset and try again!",
        variant: "destructive",
      });
      // Optionally, reset the board or allow them to continue
      // For now, we'll let them reset manually.
    } else {
      // Partial correct move, continue
      toast({
        title: "Good move!",
        description: "Keep going!",
      });
    }

    setGame(new Chess(game.fen())); // Update game state to reflect the move
    return true;
  };

  const handleReset = () => {
    if (currentPuzzle) {
      setGame(new Chess(currentPuzzle.fen));
      setUserMoves([]);
      setIsSolved(false);
    }
  };

  if (!currentPuzzle || !game) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Loading Puzzle...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p>Please wait.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold mb-2">{currentPuzzle.title}</CardTitle>
        <p className="text-center text-sm text-muted-foreground">Difficulty: {currentPuzzle.difficulty}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-square">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation={boardOrientation}
            arePiecesDraggable={!isSolved}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
        <div className="mt-4 text-center">
          {isSolved ? (
            <>
              <p className="text-lg font-semibold text-green-600">✅ Correct! Come back tomorrow!</p>
              <ShareButtons difficulty={difficulty} />
            </>
          ) : (
            <Button onClick={handleReset} variant="secondary" className="w-full">
              Reset Puzzle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PuzzleBoard;