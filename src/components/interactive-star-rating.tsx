"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface InteractiveStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

export function InteractiveStarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showCount = false,
  count = 0,
}: InteractiveStarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = sizeClasses[size];

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={`${starSize} transition-colors ${
                value <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-slate-300 dark:text-slate-600"
              }`}
            />
          </button>
        ))}
      </div>
      {showCount && count > 0 && (
        <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}
