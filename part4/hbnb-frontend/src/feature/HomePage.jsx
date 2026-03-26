import { useEffect } from "react";
import { useState } from "react";
import { API_BASE_URL } from "../constants.jsx";
import { motion } from "framer-motion";
import colorFromId from "../components/RandomColor.jsx";
import { useRef } from "react";
import {
  Bookmark,
  Heart,
  MessageSquare,
  MoveDown,
  MoveUp,
  Share,
} from "lucide-react";
import { Link } from "react-router-dom";
import PlaceComment from "../components/Comments.jsx";

export default function HomePage() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo(0, 0);
    });
  }, []);
  
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE_URL}/places/`)
      .then((response) => response.json())
      .then((data) => {
        setPlaces([...data].sort(() => Math.random() - 0.5));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const containerRef = useRef(null);

  const scrollDown = () => {
    const el = containerRef.current;
    if (!el) return;
  
    const isAtBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
  
    if (isAtBottom) {
      el.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
  
    el.scrollBy({
      top: el.clientHeight,
      behavior: "smooth",
    });
  };

  const scrollUp = () => {
    containerRef.current?.scrollBy({
      top: -containerRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  const [selectedCommentPlaceId, setSelectedCommentPlaceId] = useState(null);

  const [likedPlaces, setLikedPlaces] = useState(() => {
    const saved = localStorage.getItem("likedPlaces");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("likedPlaces", JSON.stringify(likedPlaces));
  }, [likedPlaces]);

  const toggleLike = (id) => {
    setLikedPlaces((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
    >
      <div className="flex flex-col flex-initial justify-items-center">
        {places.map((place) => (
          <div key={place.id}>
            <div
              className="snap-start w-full h-[calc(100vh-90px)] leading-7 focus:outline-none relative"
              style={{ backgroundColor: colorFromId(place.id) }}
            >
              <div className="w-full p-8 text-center h-full">
                <div className="pr-16 wrap-break-word flex flex-col justify-evenly h-full">
                  <h1>{place.title}</h1>
                  <h3>{place.description}</h3>
                  <div>
                    {place.amenities.map((amenity) => (
                      <h2 key={amenity.id}>{amenity.name}</h2>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-5 right-5 h-4/6 w-14 flex flex-col justify-around">
                  <h2 className="wrap-break-word">
                    {place.price} $
                  </h2>
                  <h2>
                    {place.owner_first_name} {place.owner_last_name}
                  </h2>
                  <Heart
                    onClick={() => toggleLike(place.id)}
                    className={`animated-button tiktok-button ${likedPlaces[place.id] ? "fill-red-500 text-red-500" : ""}`}
                  ></Heart>
                  <MessageSquare
                    onClick={() => setSelectedCommentPlaceId(place.id)}
                    className="animated-button tiktok-button"
                  ></MessageSquare>

                  <Share
                    onClick={() => {
                      navigator.clipboard.writeText(place.id);
                      alert(`place id copied (${place.id})`);
                    }}
                    className={"animated-button tiktok-button"}
                  ></Share>
                  <MoveUp
                    onClick={scrollUp}
                    className="animated-button tiktok-button"
                  ></MoveUp>
                  <MoveDown
                    onClick={scrollDown}
                    className="animated-button tiktok-button"
                  ></MoveDown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`absolute top-0 w-full h-[calc(100vh-90px)] ${selectedCommentPlaceId ? "" : "hidden"}`}
      >
        <PlaceComment
          PAGE_ID={selectedCommentPlaceId}
          toggleComment={setSelectedCommentPlaceId}
        />
      </div>
    </div>
  );
}
