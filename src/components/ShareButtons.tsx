"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Share2 } from "lucide-react";
import { PuzzleDifficulty } from "@/utils/puzzle-logic";

interface ShareButtonsProps {
  difficulty: PuzzleDifficulty;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ difficulty }) => {
  const shareText = `I solved today’s #DailyChessPuzzle (${difficulty})! Can you?`;
  const appUrl = "https://mychesspuzzle.com"; // Placeholder URL, update later if needed

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(appUrl)}&title=${encodeURIComponent("Daily Chess Puzzle")}&summary=${encodeURIComponent(shareText)}`;
        break;
      case "native":
        if (navigator.share) {
          navigator.share({
            title: "Daily Chess Puzzle",
            text: shareText,
            url: appUrl,
          })
            .then(() => console.log("Successful share"))
            .catch((error) => console.log("Error sharing", error));
        } else {
          alert("Native sharing not supported on this device/browser.");
        }
        return;
      default:
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      <Button onClick={() => handleShare("twitter")} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white">
        <Twitter className="mr-2 h-4 w-4" /> Share on X
      </Button>
      <Button onClick={() => handleShare("facebook")} className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white">
        <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
      </Button>
      <Button onClick={() => handleShare("linkedin")} className="bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white">
        <Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
      </Button>
      {navigator.share && (
        <Button onClick={() => handleShare("native")} variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      )}
    </div>
  );
};

export default ShareButtons;