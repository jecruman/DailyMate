"use client";

import React, { useState, useEffect } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LevelSelector from "@/components/LevelSelector";
import PuzzleBoard from "@/components/PuzzleBoard";
import { PuzzleDifficulty } from "@/utils/puzzle-logic";

const Index = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<PuzzleDifficulty>(() => {
    if (typeof window !== "undefined") {
      const savedDifficulty = localStorage.getItem("dailyChessPuzzleDifficulty");
      return (savedDifficulty as PuzzleDifficulty) || "Beginner";
    }
    return "Beginner";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dailyChessPuzzleDifficulty", selectedDifficulty);
    }
  }, [selectedDifficulty]);

  const handleSelectDifficulty = (difficulty: PuzzleDifficulty) => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">Daily Chess Puzzle</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 italic">One puzzle. Every day. Forever.</p>
      </div>

      <LevelSelector
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={handleSelectDifficulty}
      />

      <PuzzleBoard difficulty={selectedDifficulty} />

      <div className="mt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;