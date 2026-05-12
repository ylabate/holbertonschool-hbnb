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
      })
      .catch((err) => {
        console.error(err);
        setUserData(null);
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
    <main className="h-full overflow-y-auto w-full" style={backgroundStyle}>
      <section className="place-page-layout flex flex-col gap-4 p-4 place-details-container max-w-5xl mx-auto">
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

        <section className="place-details place-card place-copy p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="place-info">
              <p className="profile-label">Owner</p>
              <h2 className="text-lg text-fg">
                <Link
                  to={`/user/${place.owner_id}`}
                  className="hover:underline hover:text-accent-pink transition-colors"
                >
                  {place.owner_first_name} {place.owner_last_name}
                </Link>
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

            {place.latitude !== undefined && place.longitude !== undefined && (
              <div className="place-info mt-2">
                <p className="profile-label mb-2">Location</p>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-[var(--bg-separator)] bg-bg-button">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.01},${place.latitude - 0.01},${place.longitude + 0.01},${place.latitude + 0.01}&layer=mapnik&marker=${place.latitude},${place.longitude}`}
                    style={{ border: 0 }}
                    title="Place Location"
                  ></iframe>
                </div>
                <p className="text-xs text-fg-muted mt-1 text-right">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=15/${place.latitude}/${place.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-accent-pink"
                  >
                    View larger map
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-[var(--bg-separator)] pt-6 lg:pt-0 lg:pl-8">
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
