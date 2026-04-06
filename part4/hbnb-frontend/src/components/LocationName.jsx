import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

// Global cache to prevent redundant API calls for the same coordinates
const locationCache = {};

export default function LocationName({ latitude, longitude }) {
	const [locationName, setLocationName] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (latitude === undefined || longitude === undefined) {
			setLoading(false);
			return;
		}

		// Use a coarse key to group nearby coordinates slightly if needed,
		// or just exact precision. Nominatim takes exact.
		const cacheKey = `${latitude},${longitude}`;

		if (locationCache[cacheKey]) {
			setLocationName(locationCache[cacheKey]);
			setLoading(false);
			return;
		}

		let isMounted = true;

		const fetchLocation = async () => {
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
				);
				const data = await response.json();

				if (isMounted) {
					let name = "Unknown location";
					if (data && data.address) {
						const city =
							data.address.city ||
							data.address.town ||
							data.address.village ||
							data.address.county ||
							data.address.state;

						if (city) {
							name = city;
							if (data.address.country) {
								name += `, ${data.address.country}`;
							}
						} else if (data.address.country) {
							name = data.address.country;
						}
					}

					locationCache[cacheKey] = name;
					setLocationName(name);
					setLoading(false);
				}
			} catch (error) {
				if (isMounted) {
					console.error("Failed to reverse geocode:", error);
					setLocationName("Location unavailable");
					setLoading(false);
				}
			}
		};

		// Add a slight delay to avoid hitting Nominatim's rate limits too hard if multiple cards render
		const delay = Math.random() * 500 + 200;
		const timer = setTimeout(fetchLocation, delay);

		return () => {
			isMounted = false;
			clearTimeout(timer);
		};
	}, [latitude, longitude]);

	if (loading) {
		return (
			<span className="flex items-center justify-center gap-1 text-sm text-fg-muted mt-2">
				<MapPin className="w-4 h-4 animate-pulse" /> Locating...
			</span>
		);
	}

	return (
		<span className="flex items-center justify-center gap-1 text-sm font-medium text-fg-muted mt-2">
			<MapPin className="w-4 h-4" /> {locationName}
		</span>
	);
}
