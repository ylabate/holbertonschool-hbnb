import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "@/App.css";
import Header from "@/components/Header";
import HomePage from "@/feature/HomePage";
import UserPage from "@/feature/UserPage";
import LoginScreen from "@/feature/LoginScreen";
import PlacePage from "@/feature/PlacePage";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants";
import { getCookie, setCookie, deleteCookie } from "@/utils/cookies";

const TOKEN_STORAGE_KEY = "hbnb_token";
const BEARER_PREFIX = "Bearer ";

function normalizeToken(rawToken) {
  if (!rawToken) return "";
  return rawToken.startsWith(BEARER_PREFIX)
    ? rawToken
    : `${BEARER_PREFIX}${rawToken}`;
}

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState("");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [theme, setTheme] = useState(() => getCookie("theme") || "light");
  const location = useLocation();

  // Theme Management
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    setCookie("theme", theme);
  }, [theme]);

  useEffect(() => {
    let ignore = false;

    async function bootstrapAuth() {
      const storedToken = getCookie(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        if (!ignore) setIsAuthReady(true);
        return;
      }

      const normalizedToken = normalizeToken(storedToken);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/protected`, {
          headers: { Authorization: normalizedToken },
        });

        if (ignore) return;

        if (response.ok) {
          setLoggedIn(normalizedToken);
        } else {
          deleteCookie(TOKEN_STORAGE_KEY);
          setLoggedIn("");
        }
      } catch {
        if (ignore) return;
        setLoggedIn(normalizedToken);
      } finally {
        if (!ignore) setIsAuthReady(true);
      }
    }

    bootstrapAuth();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    if (isLoggedIn) {
      setCookie(TOKEN_STORAGE_KEY, isLoggedIn);
    } else {
      deleteCookie(TOKEN_STORAGE_KEY);
    }
  }, [isLoggedIn, isAuthReady]);

  if (!isAuthReady) {
    return <main className="flex justify-center"></main>;
  }

  return (
    <main className="flex justify-center">
      <section className="flex flex-col h-screen w-full">
        <Header isLoggedIn={isLoggedIn} />
        <section className="flex-1 overflow-y-auto relative bg-color">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
            <Route path="/place" element={<Navigate to="/" replace />} />
            <Route
              path="/place/:id"
              element={
                <PlacePage isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
              }
            />
            <Route
              path="/login"
              element={
                <LoginScreen
                  isLoggedIn={isLoggedIn}
                  setLoggedIn={setLoggedIn}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <UserPage
                  isLoggedIn={isLoggedIn}
                  setLoggedIn={setLoggedIn}
                  theme={theme}
                  setTheme={setTheme}
                />
              }
            />
          </Routes>
        </section>
      </section>
    </main>
  );
}
