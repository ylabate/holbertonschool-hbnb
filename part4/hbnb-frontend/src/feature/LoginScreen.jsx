import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants";

export default function LoginScreen({ isLoggedIn, setLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Corrected 'statue' to 'status'

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

  return (
    <>
      <main className="h-full flex items-center justify-center p-8 w-full">
        <section className="login-card w-full flex flex-col items-center justify-around gap-5 px-8 py-10">
          <h1 className="login-title">Login</h1>
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
            onClick={handleLogin}
          >
            <SendHorizontal className=" w-16 h-16" />
          </button>
          <section className="status-text w-full min-h-10 text-center">
            {status}
          </section>
        </section>
      </main>
    </>
  );
}
