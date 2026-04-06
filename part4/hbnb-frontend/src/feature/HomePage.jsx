import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, MoveDown, MoveUp, Share } from "lucide-react";
import { API_BASE_URL } from "@/constants";
import colorFromId from "@/components/RandomColor";
import PlaceComment from "@/components/Comments";

const VIEWPORT_BUFFER = 3;
const LOOP_SHUFFLE_THRESHOLD = 4;
const LOOP_PREPEND_THRESHOLD = 3;

export default function HomePage({ isLoggedIn }) {
	const containerRef = useRef(null);

	useEffect(() => {
		window.history.scrollRestoration = "manual";
		requestAnimationFrame(() => {
			containerRef.current?.scrollTo(0, 0);
		});
	}, []);

	const [allPlaces, setAllPlaces] = useState([]);
	const [loopedDeck, setLoopedDeck] = useState([]);
	const initialOffsetRef = useRef(0);
	const hasPositionedRef = useRef(false);
	const cardRefs = useRef({});
	const appendLockRef = useRef(false);
	const prependLockRef = useRef(false);
	const [isDeckReady, setDeckReady] = useState(false);

	const [selectedCommentPlaceId, setSelectedCommentPlaceId] = useState(null);
	const [visibleWindow, setVisibleWindow] = useState({ start: 0, end: 0 });
	const [activeIndex, setActiveIndex] = useState(0);
	const [activeLayerStyle, setActiveLayerStyle] = useState(null);
	const [fadingLayerStyle, setFadingLayerStyle] = useState(null);
	const [isLayerFadingOut, setIsLayerFadingOut] = useState(false);

	const [currentUserId, setCurrentUserId] = useState(null);
	const [likedPlaces, setLikedPlaces] = useState({});
	const [viewportHeight, setViewportHeight] = useState(1);
	const [cardWidth, setCardWidth] = useState(null);
	const currentPlace = loopedDeck[activeIndex];

	const recalcWindow = useCallback(() => {
		const el = containerRef.current;
		if (!el || loopedDeck.length === 0) return;

		const cardHeight = el.clientHeight || 1;
		const currentIndex = Math.round(el.scrollTop / cardHeight);
		const windowStart = Math.max(currentIndex - VIEWPORT_BUFFER, 0);
		const windowEnd = Math.min(
			currentIndex + VIEWPORT_BUFFER,
			loopedDeck.length - 1,
		);

		setVisibleWindow({ start: windowStart, end: windowEnd });
		setActiveIndex(currentIndex);
	}, [loopedDeck.length]);

	const shuffleDeck = useCallback((places) => {
		const copy = [...places];
		for (let i = copy.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}, []);

	useEffect(() => {
		setDeckReady(false);

		fetch(`${API_BASE_URL}/places/`)
			.then((response) => response.json())
			.then((data) => {
				setAllPlaces(data);

				if (!data.length) {
					setLoopedDeck([]);
					hasPositionedRef.current = true;
					setDeckReady(true);
					return;
				}

				const previousDeck = shuffleDeck(data);
				const currentDeck = shuffleDeck(data);
				const nextDeck = shuffleDeck(data);
				initialOffsetRef.current = previousDeck.length;
				hasPositionedRef.current = false;
				setLoopedDeck([...previousDeck, ...currentDeck, ...nextDeck]);
			})
			.catch((error) => {
				console.error(error);
				setDeckReady(false);
			});
	}, [shuffleDeck]);

	useEffect(() => {
		const updateDimensions = () => {
			const measuredHeight =
				containerRef.current?.clientHeight ||
				(typeof window !== "undefined" && window.innerHeight
					? window.innerHeight
					: 1);
			setViewportHeight(measuredHeight);
		};

		updateDimensions();
		if (typeof window !== "undefined") {
			window.addEventListener("resize", updateDimensions);
			return () => {
				window.removeEventListener("resize", updateDimensions);
			};
		}
		return undefined;
	}, []);

	useEffect(() => {
		if (!currentPlace?.id) {
			setCardWidth(null);
			return;
		}

		const node = cardRefs.current[currentPlace.id];
		if (!node) {
			setCardWidth(null);
			return;
		}

		const updateWidth = () => {
			const { width } = node.getBoundingClientRect();
			setCardWidth((prev) =>
				typeof prev === "number" && Math.abs(prev - width) < 0.5
					? prev
					: width,
			);
		};

		let resizeObserver;

		if (typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					const nextWidth = entry.contentRect.width;
					setCardWidth((prev) =>
						typeof prev === "number" &&
						Math.abs(prev - nextWidth) < 0.5
							? prev
							: nextWidth,
					);
				}
			});
			resizeObserver.observe(node);
		} else {
			updateWidth();
			window.addEventListener("resize", updateWidth);
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			} else {
				window.removeEventListener("resize", updateWidth);
			}
		};
	}, [currentPlace?.id]);

	useEffect(() => {
		if (loopedDeck.length === 0 || allPlaces.length === 0) return;

		const totalRendered = visibleWindow.end + 1;
		const nearEnd =
			totalRendered + LOOP_SHUFFLE_THRESHOLD >= loopedDeck.length;

		if (nearEnd && !appendLockRef.current) {
			appendLockRef.current = true;
			const nextDeck = shuffleDeck(allPlaces);
			setLoopedDeck((prev) => [...prev, ...nextDeck]);
			requestAnimationFrame(() => {
				appendLockRef.current = false;
			});
		}
	}, [visibleWindow.end, loopedDeck.length, allPlaces, shuffleDeck]);

	useEffect(() => {
		if (loopedDeck.length === 0 || allPlaces.length === 0) return;

		const nearStart = visibleWindow.start <= LOOP_PREPEND_THRESHOLD;

		if (nearStart && !prependLockRef.current) {
			prependLockRef.current = true;
			const newDeck = shuffleDeck(allPlaces);
			const vh =
				containerRef.current?.clientHeight ||
				(typeof window !== "undefined" && window.innerHeight
					? window.innerHeight
					: 1);
			const insertedHeight = vh * newDeck.length;

			setLoopedDeck((prev) => [...newDeck, ...prev]);
			requestAnimationFrame(() => {
				if (containerRef.current) {
					containerRef.current.scrollTop += insertedHeight;
				}
				prependLockRef.current = false;
				recalcWindow();
			});
		}
	}, [
		visibleWindow.start,
		loopedDeck.length,
		allPlaces,
		shuffleDeck,
		recalcWindow,
	]);

	useEffect(() => {
		if (!loopedDeck.length) return;

		if (!containerRef.current) return;

		const vh =
			containerRef.current.clientHeight ||
			(typeof window !== "undefined" && window.innerHeight
				? window.innerHeight
				: 1);

		if (!hasPositionedRef.current) {
			containerRef.current.scrollTop = initialOffsetRef.current * vh;
			hasPositionedRef.current = true;
			setDeckReady(true);
		}
		recalcWindow();
	}, [loopedDeck.length, recalcWindow]);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		recalcWindow();

		const handleScroll = () => {
			if (selectedCommentPlaceId) {
				setSelectedCommentPlaceId(null);
			}
			recalcWindow();
		};

		el.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", handleScroll);
		};
	}, [recalcWindow, selectedCommentPlaceId]);

	useEffect(() => {
		if (loopedDeck.length === 0) return;

		const nextStyle = colorFromId(loopedDeck[activeIndex]?.id);
		if (!nextStyle) return;

		setActiveLayerStyle((previousStyle) => {
			if (previousStyle) {
				setFadingLayerStyle(previousStyle);
			}
			return nextStyle;
		});

		setIsLayerFadingOut(false);
		const rafId = requestAnimationFrame(() => {
			setIsLayerFadingOut(true);
		});
		const timeoutId = setTimeout(() => {
			setFadingLayerStyle(null);
		}, 450);

		return () => {
			cancelAnimationFrame(rafId);
			clearTimeout(timeoutId);
		};
	}, [activeIndex, loopedDeck]);

	const scrollByViewport = (delta) => {
		if (!containerRef.current) return;
		containerRef.current?.scrollBy({
			top: containerRef.current.clientHeight * delta,
			behavior: "smooth",
		});
	};

	const scrollDown = useCallback(() => scrollByViewport(1), []);
	const scrollUp = useCallback(() => scrollByViewport(-1), []);

	useEffect(() => {
		if (!isLoggedIn) {
			setCurrentUserId(null);
			setLikedPlaces({});
			return;
		}

		fetch(`${API_BASE_URL}/users/self`, {
			headers: { Authorization: `${isLoggedIn}` },
		})
			.then(async (response) => {
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.message || "Unable to load favorites");
				}
				const favorisMap = (data.favoris || []).reduce((acc, favId) => {
					acc[favId] = true;
					return acc;
				}, {});
				setCurrentUserId(data.id);
				setLikedPlaces(favorisMap);
			})
			.catch(() => {
				setCurrentUserId(null);
				setLikedPlaces({});
			});
	}, [isLoggedIn]);

	const toggleLike = (placeId) => {
		if (!isLoggedIn || !currentUserId) {
			alert("You must be logged in to favorite places.");
			return;
		}

		const isCurrentlyLiked = !!likedPlaces[placeId];
		const method = isCurrentlyLiked ? "DELETE" : "POST";

		fetch(`${API_BASE_URL}/users/${currentUserId}/${placeId}`, {
			method,
			headers: { Authorization: `${isLoggedIn}` },
		})
			.then(async (response) => {
				if (!response.ok) {
					const data = await response.json();
					throw new Error(
						data.message || "Unable to update favorites",
					);
				}
			})
			.then(() => {
				setLikedPlaces((prev) => {
					const next = { ...prev };
					if (isCurrentlyLiked) {
						delete next[placeId];
					} else {
						next[placeId] = true;
					}
					return next;
				});
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	const renderedPlaces = useMemo(() => {
		if (loopedDeck.length === 0) return [];
		const items = [];
		for (let i = visibleWindow.start; i <= visibleWindow.end; i += 1) {
			const place = loopedDeck[i];
			if (!place) continue;
			items.push({ place, index: i });
		}
		return items;
	}, [loopedDeck, visibleWindow]);

	const virtualHeight = useMemo(() => {
		const renderedCount = loopedDeck.length > 0 ? loopedDeck.length : 1;
		const safeViewport = viewportHeight > 0 ? viewportHeight : 1;
		return renderedCount * safeViewport;
	}, [loopedDeck.length, viewportHeight]);

	const cardHeight = viewportHeight;
	const overlayHeight =
		viewportHeight > 120
			? `${Math.max(150, viewportHeight - 120)}px`
			: "calc(100vh - 160px)";

	return (
		<main
			ref={containerRef}
			className="h-full w-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative flex flex-col items-center"
		>
			{!isDeckReady || renderedPlaces.length === 0 ? (
				<section className="h-full w-full flex items-center justify-center">
					<p className="status-text text-base">
						{isDeckReady
							? "No places available yet. Please check back soon."
							: "Loading places..."}
					</p>
				</section>
			) : (
				<section
					className="w-full max-w-[420px] relative"
					style={{ height: virtualHeight }}
				>
					{renderedPlaces.map(({ place, index }) => (
						<div
							key={`${place.id}-${index}`}
							className="absolute inset-x-0 w-full"
							style={{
								height: cardHeight,
								transform: `translateY(${index * cardHeight}px)`,
							}}
						>
							<section
								className="place-card snap-start w-full h-full leading-7 focus:outline-none relative"
								ref={(el) => {
									if (el) {
										cardRefs.current[place.id] = el;
									} else {
										delete cardRefs.current[place.id];
									}
								}}
								style={colorFromId(place.id)}
							>
								<section className="place-surface w-full p-6 text-center h-full">
									<section className="place-copy pl-6 pr-24 py-8 md:pr-6 wrap-break-word flex flex-col justify-evenly h-full">
										<section>
											<h1>{place.title}</h1>
											<br />
											<h2 className="text-center text-base">
												{place.owner_first_name}{" "}
												{place.owner_last_name}
											</h2>
										</section>
										<h3>{place.description}</h3>
										<h2 className="wrap-break-word text-center text-base">
											{place.price} $
										</h2>
										<section className="flex flex-wrap justify-center gap-2">
											{place.amenities.map((amenity) => (
												<span
													className="amenity-pill"
													key={amenity.id}
												>
													{amenity.name}
												</span>
											))}
										</section>
										<section className="flex justify-center mt-6">
											<Link
												to={`/place/${place.id}`}
												className="details-button primary-button px-5 py-2 inline-flex items-center gap-2"
											>
												View Details
											</Link>
										</section>
									</section>
								</section>
							</section>
						</div>
					))}
				</section>
			)}

			{currentPlace ? (
				<>
					{fadingLayerStyle ? (
						<section
							className={`action-column-layer action-column-layer-fade fixed bottom-5 z-40 h-130 w-22 right-3 md:right-auto md:left-[calc(50%+220px)] ${isLayerFadingOut ? "action-column-layer-hidden" : ""}`}
							style={fadingLayerStyle}
							aria-hidden="true"
						/>
					) : null}
					<section
						className="action-column-layer fixed bottom-5 z-[41] h-130 w-22 right-3 md:right-auto md:left-[calc(50%+220px)]"
						style={activeLayerStyle || colorFromId(currentPlace.id)}
						aria-hidden="true"
					/>
					<aside className="action-column fixed bottom-5 z-50 h-130 w-22 flex flex-col justify-between items-center py-3 right-3 md:right-auto md:left-[calc(50%+220px)]">
						{" "}
						<Heart
							onClick={() => toggleLike(currentPlace.id)}
							className={`animated-button icon-chip tiktok-button p-2 ${likedPlaces[currentPlace.id] ? "like-active" : ""}`}
						/>
						<MessageSquare
							onClick={() =>
								setSelectedCommentPlaceId((prev) =>
									prev === currentPlace.id
										? null
										: currentPlace.id,
								)
							}
							className="animated-button icon-chip tiktok-button p-2"
						/>
						<Share
							onClick={() => {
								navigator.clipboard.writeText(
									`${window.location.origin}/place/${currentPlace.id}`,
								);
								alert(`place url copied`);
							}}
							className="animated-button icon-chip tiktok-button p-2"
						/>
						<MoveUp
							onClick={scrollUp}
							className="animated-button icon-chip tiktok-button p-2"
						/>
						<MoveDown
							onClick={scrollDown}
							className="animated-button icon-chip tiktok-button p-2"
						/>
					</aside>
				</>
			) : null}

			<section
				className={`absolute top-0 w-full h-[calc(100vh-90px)] ${selectedCommentPlaceId ? "" : "hidden"}`}
			>
				<PlaceComment
					PAGE_ID={selectedCommentPlaceId}
					toggleComment={setSelectedCommentPlaceId}
					overlayWidth={
						cardWidth ? `${Math.max(320, cardWidth)}px` : "32rem"
					}
					overlayHeight={overlayHeight}
					canSubmitComment={Boolean(isLoggedIn)}
					authToken={isLoggedIn}
					userId={currentUserId || ""}
				/>
			</section>
		</main>
	);
}
