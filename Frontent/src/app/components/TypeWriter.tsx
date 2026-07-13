import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  infinite?: boolean;
  deleteSpeed?: number;
  deleteDelay?: number;
}

export function Typewriter({ 
  text, 
  speed = 50, 
  delay = 0,
  infinite = false,
  deleteSpeed = 30,
  deleteDelay = 2000
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase
      if (charIndex < text.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(text.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
      } else if (infinite && charIndex === text.length) {
        // Start deleting after typing completes
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, deleteDelay);
      }
    } else {
      // Deleting phase
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setCharIndex(charIndex - 1);
          setDisplayedText(text.substring(0, charIndex - 1));
        }, deleteSpeed);
      } else {
        // Restart typing
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setCharIndex(0);
        }, 500);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay, infinite, deleteSpeed, deleteDelay, isDeleting, charIndex]);

  return (
    <span>
      {displayedText}
      <span className="animate-pulse font-bold text-[#00f2fe]">|</span>
    </span>
  );
}
