import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import HomePage from "./feature/HomePage.jsx";
import PlaceDetails from "./components/PlaceDetails.jsx";
import LoginScreen from "./components/LoginScreen.js";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
        <Header />

        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginScreen />} />

            <Route path="/place/:PAGE_ID" element={<PlaceDetails />} />
          </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}
