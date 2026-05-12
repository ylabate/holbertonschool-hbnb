import { useEffect, useState } from "react";
import { Unplug } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "@/constants";

export default function Header({ isLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [userInitials, setUserInitials] = useState("ME");

  useEffect(() => {
    let ignore = false;

    if (!isLoggedIn) {
      setUserInitials("ME");
      return undefined;
    }

    fetch(`${API_BASE_URL}/users/self`, {
      headers: { Authorization: isLoggedIn },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }
        return data;
      })
      .then((data) => {
        if (ignore) return;
        const initials = `${data.first_name?.[0] || ""}${data.last_name?.[0] || ""}`
          .trim()
          .toUpperCase();
        setUserInitials(initials || "ME");
      })
      .catch(() => {
        if (!ignore) {
          setUserInitials("ME");
        }
      });

    return () => {
      ignore = true;
    };
  }, [isLoggedIn]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    if (location.pathname !== "/") {
      navigate(`/?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/?q=${encodeURIComponent(q)}`, { replace: true });
    }
  };

  return (
    <>
      <header className="app-header z-30 w-full rounded-b-3xl">
        <div className="max-w-6xl mx-auto h-20 flex items-center p-3 gap-4 w-full px-4 md:px-8">
          <section className="flex-1 flex justify-start shrink-0 min-w-fit">
            <Link className="brand-mark" to="/">
              <img
                className="logo brand-logo"
                src="/logo.png"
                alt="hbnb logo"
              />
            </Link>
          </section>
          <section className="flex flex-col items-center flex-auto min-w-0 justify-center text-center gap-1 px-2">
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full max-w-sm rounded-full px-4 py-2"
            />
          </section>
          <section className="flex-1 flex justify-end gap-2 shrink-0 min-w-fit">
            {isLoggedIn ? (
              <Link className="user-button text-sm font-semibold tracking-[0.12em]" to="/profile">
                {userInitials}
              </Link>
            ) : (
              <Link
                className="user-button login-button"
                to="/login"
                state={{
                  from: `${location.pathname}${location.search}${location.hash}`,
                }}
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
