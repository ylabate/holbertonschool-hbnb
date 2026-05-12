import { Navigate, useLocation } from "react-router-dom";
import AdminPanel from "@/components/AdminPanel";

function getIsAdmin(token) {
  try {
    if (!token) return false;
    const raw = token.replace("Bearer ", "");
    const parts = raw.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    return payload.is_admin === true;
  } catch {
    return false;
  }
}

export default function AdminPage({ isLoggedIn }) {
  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  if (!getIsAdmin(isLoggedIn)) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <main className="page-padding h-full overflow-y-auto w-full">
      <section className="max-w-6xl mx-auto">
        <AdminPanel authToken={isLoggedIn} isPage />
      </section>
    </main>
  );
}
