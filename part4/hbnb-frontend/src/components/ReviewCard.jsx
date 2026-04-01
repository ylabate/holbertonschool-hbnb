import { useState } from "react";
import { Heart, Edit2, Trash2, X, Check } from "lucide-react";
import StarRating from "@/components/StarRating";
import { API_BASE_URL } from "@/constants";

export default function ReviewCard({
  review,
  isLiked,
  onToggleLike,
  showLike = true,
  currentUserId = null,
  authToken = null,
  onSuccess = () => {},
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text);
  const [editRating, setEditRating] = useState(review.rating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId && review.user_id === currentUserId;

  const handleUpdate = async () => {
    if (!authToken) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: "PUT",
        headers: {
          Authorization: `${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editText,
          rating: editRating,
        }),
      });

      if (!response.ok) throw new Error("Failed to update review");

      setIsEditing(false);
      onSuccess();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !authToken ||
      !window.confirm("Are you sure you want to delete this review?")
    )
      return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete review");
      onSuccess();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="comment-card flex flex-col gap-3 p-4">
      <section className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-base">
            {review.user_first_name} {review.user_last_name}
          </h2>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <select
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="p-1 text-sm rounded border border-bg-separator bg-bg-panel"
                disabled={isSubmitting}
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v} ★
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <StarRating rating={review.rating} />
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOwner && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-bg-panel-highlight rounded-full transition-colors text-fg-muted hover:text-accent-pink"
                title="Edit review"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-bg-panel-highlight rounded-full transition-colors text-fg-muted hover:text-red-500"
                title="Delete review"
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {showLike && !isEditing && (
            <Heart
              onClick={() => onToggleLike?.(review.id)}
              className={`animated-button h-8 w-8 cursor-pointer ${isLiked ? "like-active" : ""}`}
            />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-bg-separator bg-bg-panel text-sm focus:border-accent-pink outline-none"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(review.text);
                  setEditRating(review.rating);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bg-button text-sm font-medium hover:bg-bg-panel-highlight transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-pink text-fg-on-accent text-sm font-medium hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                <Check className="w-4 h-4" />{" "}
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="wrap-break-word status-text text-sm leading-relaxed">
            {review.text}
          </p>
        )}
      </section>
    </article>
  );
}
