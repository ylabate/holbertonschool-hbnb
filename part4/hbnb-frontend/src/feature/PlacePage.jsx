import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "@/constants";
import PlaceCommentsList from "@/components/PlaceCommentsList";
import NewComment from "@/components/NewComment";
import colorFromId from "@/components/RandomColor";
import { ArrowLeft } from "lucide-react";

export default function PlacePage({ isLoggedIn }) {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchPlace = useCallback(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/places/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Place not found");
        }
        return response.json();
      })
      .then((data) => {
        setPlace(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  useEffect(() => {
    fetchPlace();
  }, [fetchPlace]);

  useEffect(() => {
    if (!id || !isLoggedIn) {
      setUserData(null);
      setIsLiked(false);
      return;
    }

    fetch(`${API_BASE_URL}/users/self`, {
      headers: { Authorization: `${isLoggedIn}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load profile");
        return data;
      })
      .then((data) => {
        const favorisList = Array.isArray(data.favoris) ? data.favoris : [];
        setUserData({ ...data, favoris: favorisList });
        setIsLiked(favorisList.includes(id));
      })
      .catch((err) => {
        console.error(err);
        setUserData(null);
        setIsLiked(false);
      });
  }, [isLoggedIn, id]);

  const handleCommentSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (error) {
    return (
      <main className="page-padding h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="status-text">{error}</p>
        <Link to="/" className="primary-button mt-6 py-2 px-4">
          Back to Home
        </Link>
      </main>
    );
  }

  if (!place) {
    return (
      <main className="page-padding h-full flex items-center justify-center">
        <h2 className="text-xl">Loading place...</h2>
      </main>
    );
  }

  const backgroundStyle = colorFromId(place.id);

  return (
    <main className="h-full overflow-y-auto" style={backgroundStyle}>
      <section className="place-page-layout flex flex-col gap-4 p-4 place-details-container">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="icon-chip p-3 hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold truncate px-4">{place.title}</h1>
          <div className="w-11"></div>
        </header>

        <section className="place-details place-card place-copy p-6 flex flex-col gap-4">
          <div className="place-info">
            <p className="profile-label">Owner</p>
            <h2 className="text-lg text-fg">
              {place.owner_first_name} {place.owner_last_name}
            </h2>
          </div>

          <div className="place-info">
            <p className="profile-label">Description</p>
            <p className="status-text text-fg">{place.description}</p>
          </div>

          <div className="place-info">
            <p className="profile-label">Price per night</p>
            <p className="text-lg font-semibold text-fg">${place.price}</p>
          </div>

          {place.amenities?.length > 0 && (
            <div className="place-info">
              <p className="profile-label mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {place.amenities.map((amenity) => (
                  <span className="amenity-pill" key={amenity.id}>
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="border-separator my-2" />

          <div>
            <h2 className="text-xl font-bold mb-4 text-fg">Comments</h2>

            {isLoggedIn && userData ? (
              <div className="mb-8">
                <NewComment
                  placeId={id}
                  authToken={isLoggedIn}
                  userId={userData.id}
                  onSuccess={handleCommentSuccess}
                />
              </div>
            ) : (
              <p className="status-text text-center py-4 text-fg">
                Log in to leave a comment.
              </p>
            )}

            <div className="comments-container">
              <PlaceCommentsList
                key={refreshTrigger}
                placeId={id}
                userId={userData?.id}
                authToken={isLoggedIn}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
