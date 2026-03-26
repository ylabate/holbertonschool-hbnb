import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import Header from "./components/Header.jsx";
import HomePage from "./feature/HomePage.jsx";
import PlaceDetails from "./components/Comments.jsx";
import LoginScreen from "./components/LoginScreen.jsx";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="flex-1 overflow-y-auto relative">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/comments/:PAGE_ID" element={<PlaceDetails />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex justify-center">
          {/* <div className="w-120"><iframe src="https://www.tiktok.com/" frameborder="0"></iframe></div> */}
          <div className="flex flex-col h-screen w-full max-w-120">
            <Header />
            <AnimatedRoutes />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}
