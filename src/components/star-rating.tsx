"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ stars, maxStars = 3, animated = false, size = "md" }: StarRatingProps) {
  const [visibleStars, setVisibleStars] = useState(animated ? 0 : stars);

  useEffect(() => {
    if (animated && stars > 0) {
      const delays = [0, 200, 400];
      for (let i = 0; i < stars; i++) {
        setTimeout(() => {
          setVisibleStars(i + 1);
        }, delays[i]);
      }
    }
  }, [stars, animated]);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const starSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < visibleStars;
        return (
          <Star
            key={index}
            className={`${starSize} transition-all duration-300 ${
              isFilled
                ? "fill-amber-400 text-amber-500 scale-100"
                : "text-slate-300 scale-90"
            } ${animated && isFilled ? "animate-bounce-once" : ""}`}
          />
        );
      })}
    </div>
  );
}
