import { Heart } from "lucide-react";
import StarRating from "@/components/StarRating";

export default function ReviewCard({ review, isLiked, onToggleLike, showLike = true }) {
  return (
    <article className="comment-card text-center flex gap-3 justify-evenly items-center min-h-30 px-4 py-4">
      <section className="flex flex-col items-center gap-1">
        <StarRating rating={review.rating} />
      </section>
      <section className="flex flex-col text-left flex-1 px-2">
        <h2 className="font-semibold text-base">
          {review.user_first_name} {review.user_last_name}
        </h2>
        <h3 className="wrap-break-word status-text text-sm">{review.text}</h3>
      </section>
      {showLike && (
        <Heart
          onClick={() => onToggleLike?.(review.id)}
          className={`animated-button h-10 w-10 cursor-pointer ${isLiked ? "like-active" : ""}`}
        />
      )}
    </article>
  );
}
