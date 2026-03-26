import { useState } from "react";
import { API_BASE_URL } from "../constants.jsx";
import { useEffect } from "react";
import NewComment from "./NewComment.jsx";
import { Heart } from "lucide-react";

export default function PlaceComment({ PAGE_ID, toggleComment }) {
  const [PlaceComments, setPlaceComments] = useState([]);

  useEffect(() => {
    if (!PAGE_ID) return;

    fetch(`${API_BASE_URL}/reviews/by_place/${PAGE_ID}`)
      .then((response) => response.json())
      .then((data) => {
        setPlaceComments(data);
      });
  }, [PAGE_ID]);

  const [likedComment, setLikedComment] = useState(() => {
    const saved = localStorage.getItem("likedComment");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("likedComment", JSON.stringify(likedComment));
  }, [likedComment]);

  const toggleLike = (id) => {
    setLikedComment((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  
  return (
    <>
      <div
        onClick={() => toggleComment(null)}
        className="z-30 absolute left-0 top-0 w-full h-50"
      ></div>
      <div className="h-full w-full flex justify-center items-center relative z-10">
        <div className="z-30 w-full min-h-[calc(100vh-280px)] absolute top-50 grid grid-cols-1 gap-5 p-4 bg-green-700 rounded-t-4xl">
          <br />
          {PlaceComments.map((Comment) => (
            <div
              key={Comment.id}
              className="bg-amber-300 rounded-3xl text-center flex gap-1 justify-evenly items-center min-h-30"
            >
              <h2>{Comment.rating}</h2>
              <div className="flex flex-col">
                <h2>{Comment.user_first_name} {Comment.user_last_name}</h2>
                <h3 className="wrap-break-word max-w-70">{Comment.text}</h3>
              </div>
              <Heart onClick={() => toggleLike(Comment.id)} className={`animated-button h-12 w-12 ${likedComment[Comment.id] ? "fill-red-500 text-red-500" : ""}`}></Heart>
            </div>
          ))}
          <NewComment />
        </div>
      </div>
    </>
  );
}
