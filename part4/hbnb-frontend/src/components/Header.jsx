import { CircleUserRound, Unplug, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ isLoggedIn }) {
	return (
		<>
			<header className="app-header z-30 w-full rounded-b-3xl">
				<div className="max-w-6xl mx-auto h-20 flex items-center p-3 gap-4 w-full px-4 md:px-8">
					<section className="flex-1 flex justify-start">
						<Link className="brand-mark" to="/">
							<img
								className="logo brand-logo"
								src="/logo.png"
								alt="hbnb logo"
							/>
						</Link>
					</section>
					<section className="flex flex-col items-center flex-none text-center gap-1">
						<h1 className="text-lg font-bold tracking-wide text-center">
							HBNB Infinite
						</h1>
					</section>
					<section className="flex-1 flex justify-end gap-2">
						{isLoggedIn && (
							<Link className="user-button" to="/create-place">
								<Plus size={30} />
							</Link>
						)}
						{isLoggedIn ? (
							<Link className="user-button" to="/profile">
								<CircleUserRound size={30} />
							</Link>
						) : (
							<Link
								className="user-button login-button"
								to="/login"
							>
								<Unplug size={30} />
							</Link>
						)}
					</section>
				</div>
			</header>
		</>
	);
}
