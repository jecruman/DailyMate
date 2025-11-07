"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PuzzleDifficulty } from "@/utils/puzzle-logic";

interface LevelSelectorProps {
  selectedDifficulty: PuzzleDifficulty;
  onSelectDifficulty: (difficulty: PuzzleDifficulty) => void;
}

const difficulties: PuzzleDifficulty[] = ["Beginner", "Intermediate", "Advanced", "Master"];

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedDifficulty, onSelectDifficulty }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty}
          variant={selectedDifficulty === difficulty ? "default" : "outline"}
          onClick={() => onSelectDifficulty(difficulty)}
          className="min-w-[120px]"
        >
          {difficulty}
        </Button>
      ))}
    </div>
  );
};

export default LevelSelector;