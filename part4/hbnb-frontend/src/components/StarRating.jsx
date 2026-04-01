export default function StarRating({ rating, size = "text-base" }) {
  const stars = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <span className={`flex gap-1 ${size}`} aria-label={`Rating ${stars} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < stars ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}
