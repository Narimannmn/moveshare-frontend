import { memo } from "react";

import { Star } from "lucide-react";

export interface StarRatingProps {
  rating: number;
  onRate: (value: number) => void;
  count?: number;
}

export const StarRating = memo(({ rating, onRate, count = 5 }: StarRatingProps) => (
  <div className="flex gap-2">
    {Array.from({ length: count }, (_, i) => i + 1).map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onRate(star)}
        className="text-[#FADB14] transition-transform hover:scale-110"
      >
        <Star className="size-6" fill={star <= rating ? "#FADB14" : "none"} strokeWidth={1.5} />
      </button>
    ))}
  </div>
));

StarRating.displayName = "StarRating";
