import { useState, useCallback, useEffect } from "react";
import { API_BASE_URL } from "@/constants";
import { getCookie, setCookie } from "@/utils/cookies";
import NewComment from "@/components/NewComment";
import ReviewCard from "@/components/ReviewCard";
import { RefreshCcw } from "lucide-react";

export default function PlaceComment({
  PAGE_ID,
  toggleComment,
  overlayWidth = "34rem",
  overlayHeight = "calc(100vh - 122px)",
  canSubmitComment = false,
  authToken = "",
  userId = "",
}) {
  const [placeComments, setPlaceComments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshComments = useCallback(() => {
    if (!PAGE_ID) return;
    setIsRefreshing(true);
    fetch(`${API_BASE_URL}/reviews/by_place/${PAGE_ID}`)
      .then((response) => response.json())
      .then((data) => {
        setPlaceComments(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [PAGE_ID]);

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

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
    <>
      <section
        onClick={() => toggleComment(null)}
        className="comments-backdrop z-20 fixed inset-0 w-full h-full"
        aria-hidden="true"
        data-overlay="comments-backdrop"
      ></section>

      <section
        className="comments-sheet z-30 w-full fixed left-1/2 -translate-x-1/2 bottom-2 grid grid-cols-1 gap-5 p-4 overflow-y-auto"
        style={{
          width: `min(calc(100% - 1.25rem), ${overlayWidth})`,
          maxWidth: `min(calc(100% - 1.25rem), ${overlayWidth})`,
          height: overlayHeight,
        }}
        data-overlay="comments-sheet"
      >
        <section className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            type="button"
            onClick={refreshComments}
            className="icon-chip px-3 py-2 flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="text-sm">
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </section>

        {placeComments.length === 0 ? (
          <article className="comments-empty text-center py-8 px-4">
            No comments yet.
          </article>
        ) : (
          placeComments.map((comment) => (
            <ReviewCard
              key={comment.id}
              review={comment}
              isLiked={likedComments[comment.id]}
              onToggleLike={toggleLike}
            />
          ))
        )}

        {canSubmitComment && authToken && userId ? (
          <NewComment
            placeId={PAGE_ID}
            authToken={authToken}
            userId={userId}
            onSuccess={refreshComments}
          />
        ) : (
          <p className="status-text text-center py-4">
            Log in to leave a comment.
          </p>
        )}
      </section>
    </>
  );
}
