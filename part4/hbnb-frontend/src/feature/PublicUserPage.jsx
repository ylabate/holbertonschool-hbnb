import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function PublicUserPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPlaces, setUserPlaces] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    // Fetch user details
    fetch(`${API_BASE_URL}/users/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "User not found");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => {
        setError(err.message);
      });

    // Fetch user's places
    fetch(`${API_BASE_URL}/places/by_owner/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUserPlaces(data);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

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

  if (!userData) {
    return (
      <main className="page-padding h-full flex items-center justify-center text-center">
        <h2>Loading profile...</h2>
      </main>
    );
  }

  return (
    <main className="page-padding h-full overflow-y-auto w-full">
      <section className="profile-layout flex flex-col gap-4 max-w-2xl mx-auto mt-4">
        <header className="flex items-center gap-4 mb-4">
          <Link
            to="/"
            className="icon-chip p-3 hover:scale-110 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-bold">Host Profile</h2>
        </header>

        <section className="profile-card px-6 py-8 flex flex-col items-center text-center gap-2">
          <div className="w-20 h-20 bg-accent-pink/20 text-accent-pink rounded-full flex items-center justify-center text-3xl font-bold mb-2">
            {userData.first_name?.[0] || "?"}
            {userData.last_name?.[0] || ""}
          </div>
          <h1 className="text-2xl">
            {userData.first_name} {userData.last_name}
          </h1>
        </section>

        <section className="profile-card px-6 py-6 mt-4">
          <p className="profile-label mb-4">
            Places hosted by {userData.first_name}
          </p>
          {userPlaces.length > 0 ? (
            <div className="flex flex-col gap-4">
              {userPlaces.map((place) => (
                <article
                  key={place.id}
                  onClick={() => navigate(`/place/${place.id}`)}
                  className="favorite-row px-4 py-4 cursor-pointer hover:scale-105 transition-transform flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{place.title}</p>
                    <p className="text-sm opacity-75">${place.price} / night</p>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </article>
              ))}
            </div>
          ) : (
            <p className="status-text">
              This host hasn't created any places yet.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
