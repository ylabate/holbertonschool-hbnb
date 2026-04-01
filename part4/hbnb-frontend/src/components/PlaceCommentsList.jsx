import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants";
import ReviewCard from "@/components/ReviewCard";
import { getCookie, setCookie } from "@/utils/cookies";

export default function PlaceCommentsList({ placeId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!placeId) return;

    fetch(`${API_BASE_URL}/reviews/by_place/${placeId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [placeId]);

  const [likedComments, setLikedComments] = useState(() => {
    const saved = getCookie("likedComment");
    if (!saved) return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setCookie("likedComment", JSON.stringify(likedComments));
  }, [likedComments]);

  const toggleLike = (id) => {
    setLikedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="flex flex-col gap-5">
      {comments.length === 0 ? (
        <article className="comments-empty text-center py-8 px-4">
          <p>No comments yet.</p>
        </article>
      ) : (
        comments.map((comment) => (
          <ReviewCard
            key={comment.id}
            review={comment}
            isLiked={likedComments[comment.id]}
            onToggleLike={toggleLike}
          />
        ))
      )}
    </section>
  );
}
