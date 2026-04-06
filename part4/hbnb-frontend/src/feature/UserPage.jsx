import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants";
import { deleteCookie } from "@/utils/cookies";
import { ChevronRight, Settings, X, Sun, Moon, LogOut } from "lucide-react";

export default function UserPage({ isLoggedIn, setLoggedIn, theme, setTheme }) {
	const [userData, setUserData] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [placeDetails, setPlaceDetails] = useState({});
	const navigate = useNavigate();
	const [showSettings, setShowSettings] = useState(false);

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
				setErrorMessage("");
			})
			.catch((error) => {
				setErrorMessage(error.message);
				setLoggedIn("");
			});
	}, [isLoggedIn, setLoggedIn]);

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

	if (!isLoggedIn) return <Navigate to="/login" />;

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
					<section className="profile-card px-6 py-6">
						<p className="profile-label">Profile</p>
						<h1>
							{userData.first_name} {userData.last_name}
						</h1>
						<p className="status-text mt-2">{userData.email}</p>
						<p className="profile-id mt-4">ID: {userData.id}</p>
					</section>

					<section className="profile-card px-6 py-6">
						<p className="profile-label">Favorites</p>
						{userData.favoris?.length ? (
							<section className="flex flex-col gap-3 mt-4">
								{userData.favoris.map((placeId) => {
									const place = placeDetails[placeId];
									return (
										<article
											key={placeId}
											onClick={() =>
												navigate(`/place/${placeId}`)
											}
											className="favorite-row px-4 py-4 cursor-pointer hover:scale-105 transition-transform flex items-center justify-between"
										>
											<div className="flex-1">
												<p className="font-semibold text-lg">
													{place?.title ||
														"Loading..."}
												</p>
												{place?.price && (
													<p className="text-sm opacity-75">
														${place.price}
													</p>
												)}
											</div>
											<ChevronRight className="w-5 h-5 opacity-50" />
										</article>
									);
								})}
							</section>
						) : (
							<p className="status-text mt-4">
								No favorites yet.
							</p>
						)}
					</section>
				</div>
			</section>

			{showSettings && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<section className="profile-card w-full max-w-md">
						<div className="flex items-center justify-between px-6 py-4 border-b border-bg-separator">
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
									className={`flex-1 py-4 px-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${theme === "light" ? "border-accent-pink bg-accent-pink/10" : "border-bg-separator"}`}
								>
									<Sun className="w-6 h-6 text-accent-pink" />
									<p className="font-semibold text-sm">
										Light
									</p>
								</button>
								<button
									onClick={() => setTheme("dark")}
									className={`flex-1 py-4 px-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${theme === "dark" ? "border-accent-pink bg-accent-pink/10" : "border-bg-separator"}`}
								>
									<Moon className="w-6 h-6 text-accent-purple" />
									<p className="font-semibold text-sm">
										Dark
									</p>
								</button>
							</div>
						</div>
					</section>
				</div>
			)}
		</main>
	);
}
