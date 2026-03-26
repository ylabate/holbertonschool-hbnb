import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="bg-blue-600 h-20 flex z-30 justify-between p-5 items-center">
        <Link to="/">
          <img src="/logo.png" alt="hbnb logo" />
        </Link>
        <Link to="/login">
          <User size={60} />
        </Link>
      </header>
    </>
  );
}
