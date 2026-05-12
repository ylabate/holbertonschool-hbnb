import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants";
import { deleteCookie } from "@/utils/cookies";
import {
  Shield,
  ChevronRight,
  Settings,
  X,
  Sun,
  Moon,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Check,
} from "lucide-react";

export default function UserPage({ isLoggedIn, setLoggedIn, theme, setTheme }) {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [placeDetails, setPlaceDetails] = useState({});
  const [myPlaces, setMyPlaces] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const isAdmin = (() => {
    try {
      if (!isLoggedIn) return false;
      const token = isLoggedIn.replace("Bearer ", "");
      const parts = token.split(".");
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return payload.is_admin === true;
    } catch (e) {
      return false;
    }
  })();

  useEffect(() => {
    if (!isLoggedIn) return;

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
        setUserData(data);
        setEditFirstName(data.first_name || "");
        setEditLastName(data.last_name || "");
        setEditEmail(data.email || "");
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLoggedIn("");
      });
  }, [isLoggedIn, setLoggedIn]);

  useEffect(() => {
    if (!userData?.id) return;
    fetch(`${API_BASE_URL}/places/by_owner/${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMyPlaces(data);
        }
      })
      .catch((err) => console.error(err));
  }, [userData?.id]);

  useEffect(() => {
    const favorisList = Array.isArray(userData?.favoris)
      ? userData.favoris
      : [];
    if (favorisList.length === 0) {
      setPlaceDetails({});
      return;
    }

    Promise.all(
      favorisList.map((placeId) =>
        fetch(`${API_BASE_URL}/places/${placeId}`)
          .then((res) => res.json())
          .then((data) => ({ id: placeId, details: data }))
          .catch(() => ({ id: placeId, details: null })),
      ),
    ).then((results) => {
      const detailsMap = {};
      results.forEach((res) => {
        detailsMap[res.id] = res.details;
      });
      setPlaceDetails(detailsMap);
    });
  }, [userData?.favoris]);

  const handleLogout = () => {
    deleteCookie("hbnb_token");
    setLoggedIn("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: editFirstName,
        last_name: editLastName,
      };

      if (isAdmin) {
        if (editEmail) payload.email = editEmail;
        if (editPassword) payload.password = editPassword;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${isLoggedIn}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setUserData((prev) => ({
          ...prev,
          first_name: editFirstName,
          last_name: editLastName,
          email: editEmail || prev.email,
        }));
        setIsEditingProfile(false);
        setEditPassword("");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePlace = async (placeId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
        method: "DELETE",
        headers: { Authorization: `${isLoggedIn}` },
      });
      if (response.ok) {
        setMyPlaces((prev) => prev.filter((p) => p.id !== placeId));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete place");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  if (errorMessage) {
    return (
      <main className="page-padding h-full flex items-center justify-center text-center">
        <h2>{errorMessage}</h2>
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
      <section className="profile-layout flex flex-col gap-4 max-w-5xl mx-auto">
        <section className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">My Profile</h2>
          <section className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="icon-chip p-3"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="icon-chip p-3"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </section>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8">
            <section className="profile-card px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <p className="profile-label">Profile</p>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="icon-chip p-2 hover:scale-110 transition-transform"
                  title="Edit Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {isEditingProfile ? (
                <form
                  onSubmit={handleUpdateProfile}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full text-sm"
                    required
                  />
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full text-sm"
                    required
                  />
                  {isAdmin && (
                    <>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email (Admin only)"
                        className="w-full text-sm"
                      />
                      <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="New Password (Optional, Admin only)"
                        className="w-full text-sm"
                      />
                    </>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="primary-button py-2 flex-1 flex justify-center items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditFirstName(userData.first_name || "");
                        setEditLastName(userData.last_name || "");
                        setEditEmail(userData.email || "");
                        setEditPassword("");
                      }}
                      className="px-4 py-2 border border-[var(--bg-separator)] rounded-full hover:bg-bg-button flex justify-center items-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent-pink/20 text-accent-pink rounded-full flex items-center justify-center text-2xl font-bold">
                      {userData.first_name?.[0] || "?"}
                      {userData.last_name?.[0] || ""}
                    </div>
                    <div>
                      <h1 className="text-xl">
                        {userData.first_name} {userData.last_name}
                      </h1>
                      <p className="status-text text-sm">{userData.email}</p>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="profile-card px-6 py-6">
              <div className="flex items-center justify-between">
                <p className="profile-label">My Places</p>
                <button
                  onClick={() => navigate("/create-place")}
                  className="icon-chip p-2 hover:scale-110 transition-transform"
                  title="Create a new place"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {myPlaces.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                  {myPlaces.map((place) => (
                    <article
                      key={place.id}
                      onClick={() => navigate(`/place/${place.id}`)}
                      className="favorite-row px-4 py-4 cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate">
                          {place.title}
                        </p>
                        <p className="text-sm opacity-75">${place.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-place/${place.id}`);
                          }}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                          title="Edit place"
                        >
                          <Edit3 className="w-5 h-5 text-accent-blue" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePlace(place.id, e)}
                          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                          title="Delete place"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                        <ChevronRight className="w-5 h-5 opacity-50 ml-1" />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="status-text mt-4">
                  You haven't created any places yet.
                </p>
              )}
            </section>
          </div>

          <section className="profile-card px-6 py-6">
            <p className="profile-label">Favorites</p>
            {userData.favoris?.length ? (
              <section className="flex flex-col gap-3 mt-4">
                {userData.favoris.map((placeId) => {
                  const place = placeDetails[placeId];
                  return (
                    <article
                      key={placeId}
                      onClick={() => navigate(`/place/${placeId}`)}
                      className="favorite-row px-4 py-4 cursor-pointer hover:scale-105 transition-transform flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-lg">
                          {place?.title || "Loading..."}
                        </p>
                        {place?.price && (
                          <p className="text-sm opacity-75">${place.price}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-50" />
                    </article>
                  );
                })}
              </section>
            ) : (
              <p className="status-text mt-4">No favorites yet.</p>
            )}
          </section>
        </div>
      </section>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <section className="profile-card w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--bg-separator)]">
              <h2 className="text-xl font-bold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 bg-bg-button rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              <p className="text-sm font-semibold text-fg-muted">
                Choose your preferred theme
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 py-4 px-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    theme === "light"
                      ? "border-[var(--accent-pink)] bg-[color:color-mix(in_srgb,var(--accent-pink)_16%,transparent)]"
                      : "border-[var(--bg-separator)]"
                  }`}
                >
                  <Sun className="w-6 h-6 text-accent-pink" />
                  <p className="font-semibold text-sm">Light</p>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 py-4 px-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    theme === "dark"
                      ? "border-[var(--accent-pink)] bg-[color:color-mix(in_srgb,var(--accent-pink)_16%,transparent)]"
                      : "border-[var(--bg-separator)]"
                  }`}
                >
                  <Moon className="w-6 h-6 text-accent-purple" />
                  <p className="font-semibold text-sm">Dark</p>
                </button>
              </div>
              {isAdmin ? (
                <div className="pt-2 border-t border-[var(--bg-separator)] flex flex-col gap-3">
                  <p className="text-sm font-semibold text-fg-muted">
                    Administration
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettings(false);
                      navigate("/admin");
                    }}
                    className="primary-button py-3 px-4 flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Open admin panel
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
