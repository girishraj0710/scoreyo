"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Star } from "lucide-react";
import { InteractiveStarRating } from "./interactive-star-rating";
import { getHeadersWithCsrf } from "@/lib/csrf-client";

interface RatingModalProps {
  deckId: number;
  deckTitle: string;
  existingRating?: {
    rating: number;
    reviewText?: string;
  };
  onClose: () => void;
  onSuccess: (rating: number, reviewText?: string) => void;
}

export function RatingModal({
  deckId,
  deckTitle,
  existingRating,
  onClose,
  onSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [reviewText, setReviewText] = useState(existingRating?.reviewText || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/flashcards/rate/${deckId}`, {
        method: "POST",
        headers: getHeadersWithCsrf(),
        body: JSON.stringify({
          rating,
          reviewText: reviewText.trim() || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(rating, reviewText.trim());
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit rating");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            Rate This Deck
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Deck Title */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {deckTitle}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Your Rating
            </label>
            <div className="flex justify-center">
              <InteractiveStarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Review Text (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Write a Review (Optional)
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Share your thoughts about this deck..."
              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A4B]/30 focus:border-[#F26A4B]"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
              {reviewText.length}/500
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 px-4 py-3 bg-[#F26A4B] hover:bg-[#E76F51] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  {existingRating ? "Update Rating" : "Submit Rating"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
