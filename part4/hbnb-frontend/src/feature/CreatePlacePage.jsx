import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants";

export default function CreatePlacePage({ isLoggedIn }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/amenities/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAvailableAmenities(data);
        }
      })
      .catch((err) => console.error("Failed to fetch amenities", err));
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const handleToggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`${API_BASE_URL}/places/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${isLoggedIn}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          amenities: selectedAmenities,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/place/${data.id}`);
      } else {
        setStatus(data.message || "Failed to create place");
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-padding h-full overflow-y-auto w-full">
      <section className="max-w-2xl mx-auto place-card place-copy p-6 md:p-8 mt-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-fg">Create a New Place</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-fg-muted">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
              placeholder="Cozy Beachfront Studio"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-fg-muted">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full"
              placeholder="Tell us about your place..."
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-fg-muted">Price ($)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full"
                placeholder="100"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-fg-muted">Latitude</span>
              <input
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                className="w-full"
                placeholder="40.7128"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-fg-muted">Longitude</span>
              <input
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                className="w-full"
                placeholder="-74.0060"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-sm font-medium text-fg-muted">Amenities</span>
            {availableAmenities.length === 0 ? (
              <p className="text-sm text-fg-muted">Loading amenities...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableAmenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity.id);
                  return (
                    <button
                      type="button"
                      key={amenity.id}
                      onClick={() => handleToggleAmenity(amenity.id)}
                      className={`amenity-pill cursor-pointer transition-colors border-2 ${
                        isSelected
                          ? "border-[var(--accent-pink)] bg-[var(--accent-pink)] text-[var(--fg-on-accent)]"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button py-3 mt-4 text-lg font-semibold disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Place"}
          </button>

          {status && (
            <p className="text-center text-red-500 mt-2">{status}</p>
          )}
        </form>
      </section>
    </main>
  );
}
