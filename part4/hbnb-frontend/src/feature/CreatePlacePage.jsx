import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants";
import { Search } from "lucide-react";

export default function CreatePlacePage({ isLoggedIn }) {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [locationQuery, setLocationQuery] = useState("");
	const [isSearchingLocation, setIsSearchingLocation] = useState(false);
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
			prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
		);
	};

	const handleSearchLocation = async () => {
		if (!locationQuery.trim()) return;
		setIsSearchingLocation(true);
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`,
			);
			const data = await response.json();
			if (data && data.length > 0) {
				setLatitude(parseFloat(data[0].lat).toFixed(6));
				setLongitude(parseFloat(data[0].lon).toFixed(6));
			} else {
				alert("Location not found. Please try a different search.");
			}
		} catch (error) {
			console.error("Error fetching location:", error);
			alert("Error fetching location. Please try again.");
		} finally {
			setIsSearchingLocation(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!latitude || !longitude) {
			setStatus("Please search for a location to set coordinates.");
			return;
		}
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
				<h1 className="text-2xl font-bold mb-6 text-center text-fg">
					Create a New Place
				</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<label className="flex flex-col gap-1">
						<span className="text-sm font-medium text-fg-muted">
							Title
						</span>
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
						<span className="text-sm font-medium text-fg-muted">
							Description
						</span>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							rows={3}
							className="w-full"
							placeholder="Tell us about your place..."
						/>
					</label>

					<div className="flex flex-col gap-1">
						<span className="text-sm font-medium text-fg-muted">
							Search Location (Auto-fill coordinates)
						</span>
						<div className="flex gap-2">
							<input
								type="text"
								value={locationQuery}
								onChange={(e) =>
									setLocationQuery(e.target.value)
								}
								className="flex-1"
								placeholder="e.g. Paris, France or 10 Rue de la Paix"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleSearchLocation();
									}
								}}
							/>
							<button
								type="button"
								onClick={handleSearchLocation}
								disabled={isSearchingLocation}
								className="primary-button px-4 flex items-center justify-center cursor-pointer disabled:opacity-60"
							>
								{isSearchingLocation ? (
									<span className="text-sm">
										Searching...
									</span>
								) : (
									<Search className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					{latitude !== "" && longitude !== "" && (
						<div className="flex flex-col gap-1 mt-2">
							<span className="text-sm font-medium text-fg-muted">
								Location Preview
							</span>
							<div className="w-full h-48 rounded-xl overflow-hidden border border-[var(--bg-separator)] bg-bg-button">
								<iframe
									width="100%"
									height="100%"
									frameBorder="0"
									scrolling="no"
									marginHeight="0"
									marginWidth="0"
									src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(longitude) - 0.01},${parseFloat(latitude) - 0.01},${parseFloat(longitude) + 0.01},${parseFloat(latitude) + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
									style={{ border: 0 }}
									title="Place Location Preview"
								></iframe>
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="flex flex-col gap-1">
							<span className="text-sm font-medium text-fg-muted">
								Price ($)
							</span>
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
					</div>

					<div className="flex flex-col gap-2 mt-2">
						<span className="text-sm font-medium text-fg-muted">
							Amenities
						</span>
						{availableAmenities.length === 0 ? (
							<p className="text-sm text-fg-muted">
								Loading amenities...
							</p>
						) : (
							<div className="flex flex-wrap gap-2">
								{availableAmenities.map((amenity) => {
									const isSelected =
										selectedAmenities.includes(amenity.id);
									return (
										<button
											type="button"
											key={amenity.id}
											onClick={() =>
												handleToggleAmenity(amenity.id)
											}
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
						<p className="text-center text-red-500 mt-2">
							{status}
						</p>
					)}
				</form>
			</section>
		</main>
	);
}
