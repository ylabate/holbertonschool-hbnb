import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../constants.jsx";
import { useEffect } from "react";
import { LoaderCircle, LucideChevronsDown } from "lucide-react";

export default function PlaceDetails() {
  const { PAGE_ID } = useParams();

  const [Owner, setOwner] = useState(null);
  const [PlaceDetails, setPlaceDetails] = useState(null);
  const [PlaceComments, setPlaceComments] = useState([]);

  useEffect(() => {
    if (!PAGE_ID) return;

    const loadData = async () => {
      try {
        // create delay
        const delay = new Promise((resolve) => setTimeout(resolve, 300));

        // create first fetch
        const PlacePromise = await fetch(`${API_BASE_URL}/places/${PAGE_ID}`);
        const ReviewsPromise = await fetch(
          `${API_BASE_URL}/reviews/by_place/${PAGE_ID}`,
        );

        // parse first to json
        const placeInfo = await PlacePromise.json();
        const reviewsInfo = await ReviewsPromise.json();

        // create last fetch
        const OwnerPromise = await fetch(
          `${API_BASE_URL}/users/${placeInfo.user_id}`,
        );

        // wait
        const [responseOwner] = await Promise.all([OwnerPromise, delay]);

        // parse last
        const ownerInfo = await responseOwner.json();

        // set to the usestate
        setPlaceDetails(placeInfo);
        setOwner(ownerInfo);
        setPlaceComments(reviewsInfo);

        // handle exceptions
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [PAGE_ID]);

  if (!PlaceDetails || !Owner)
    return (
      <>
        <div className="h-screen w-screen flex justify-center items-center">
          <LoaderCircle size={100} className="animate-spin" />
        </div>
      </>
    );

  return (
    <>
      <Link to={"/"} className="absolute h-screen w-screen top-0 left-0 z-10" />
      <div className="h-full w-full flex flex-col gap-10 p-5 z-20 bg-green-700 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-4xl text-center text">
        <Link to={"/"} className="absolute top-10 right-10 h-8 w-8">
          <LucideChevronsDown className="h-full w-full"></LucideChevronsDown>
        </Link>
        <div>
          <h2>{PlaceDetails.title}</h2>
          <h3>
            {Owner.first_name} {Owner.last_name}
          </h3>
          <h2>{PlaceDetails.price} $</h2>
          <h3>latitude: {PlaceDetails.latitude}</h3>
          <h3>longitude: {PlaceDetails.longitude}</h3>
          <h3>{PlaceDetails.description}</h3>
        </div>
        <div>
          {PlaceComments.map((Comment) => (
            <div key={Comment.id} className="bg-amber-300 rounded-3xl">
              <h2>{Comment.rating}</h2>
              <h2>{Comment.text}</h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
