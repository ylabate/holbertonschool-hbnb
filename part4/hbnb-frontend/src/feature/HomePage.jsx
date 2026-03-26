import { useState, useEffect } from "react";
import { API_BASE_URL} from "../constants.jsx";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/places/`)
      .then((response) => response.json())
      .then((data) => {
        setPlaces(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-initial justify-items-center">
          {places.map((place) => (
            <Link to={`/place/${place.id}`} className="flex-1 bg-amber-600 rounded-4xl max-w-110 h-50 w-full">
              <div
                className="w-full p-8 text-center h-full"
                key={place.id}
              >
                <h2>{place.title}</h2>
                <h3>Owner Name</h3>
                <h2>{place.price} $</h2>
                <h3 className="line-clamp-2 wrap-break-word">{place.description}</h3>
                <h3>
                  {place.latitude} {place.longitude}
                </h3>
              </div>
            </Link>
          ))}
        </div>
    </>
  )
}
