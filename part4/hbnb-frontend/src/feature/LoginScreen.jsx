import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants";

export default function LoginScreen({ isLoggedIn, setLoggedIn }) {
	const navigate = useNavigate();
	const [isRegistering, setIsRegistering] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState("");

	if (isLoggedIn) {
		return <Navigate to="/" />;
	}

	async function handleLogin() {
		const response = await fetch(`${API_BASE_URL}/auth/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();
		if (response.ok) {
			setLoggedIn(`Bearer ${data.access_token}`);
			navigate("/");
		} else {
			setStatus(data.message || response.statusText);
		}
	}

	async function handleRegister() {
		const response = await fetch(`${API_BASE_URL}/users/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				first_name: firstName,
				last_name: lastName,
				email,
				password,
			}),
		});

		const data = await response.json();
		if (response.ok) {
			setStatus("Registration successful! Logging in...");
			await handleLogin();
		} else {
			setStatus(
				data.message || response.statusText || "Registration failed",
			);
		}
	}

	return (
		<>
			<main className="h-full flex items-center justify-center p-8 w-full">
				<section className="login-card w-full flex flex-col items-center justify-around gap-5 px-8 py-10">
					<h1 className="login-title">
						{isRegistering ? "Register" : "Login"}
					</h1>

					{isRegistering && (
						<>
							<section className="h-15 w-72">
								<input
									type="text"
									value={firstName}
									onChange={(e) =>
										setFirstName(e.target.value)
									}
									placeholder="First Name"
									className="w-full h-full text-center"
								/>
							</section>
							<section className="h-15 w-72">
								<input
									type="text"
									value={lastName}
									onChange={(e) =>
										setLastName(e.target.value)
									}
									placeholder="Last Name"
									className="w-full h-full text-center"
								/>
							</section>
						</>
					)}

					<section className="h-15 w-72">
						<input
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="w-full h-full text-center"
						/>
					</section>
					<section className="h-15 w-72">
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full h-full text-center"
						/>
					</section>

					<button
						className="primary-button px-6 py-3 cursor-pointer"
						type="button"
						onClick={isRegistering ? handleRegister : handleLogin}
					>
						<SendHorizontal className=" w-16 h-16" />
					</button>

					<button
						className="text-sm underline cursor-pointer text-fg-muted hover:text-fg"
						type="button"
						onClick={() => {
							setIsRegistering(!isRegistering);
							setStatus("");
						}}
					>
						{isRegistering
							? "Already have an account? Login"
							: "Don't have an account? Register"}
					</button>

					<section className="status-text w-full min-h-10 text-center">
						{status}
					</section>
				</section>
			</main>
		</>
	);
}
