import { useState } from "react";

export default function NearbyHospitals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function findHospitals() {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Opens Google Maps centered on user's location searching hospitals
        const url =
          "https://www.google.com/maps/search/hospitals/@" +
          lat + "," + lng + ",14z";

        window.open(url, "_blank");
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError("Location access denied. Please allow location in your browser settings.");
        } else if (err.code === 2) {
          setError("Could not detect your location. Please try again.");
        } else {
          setError("Location request timed out. Please try again.");
        }
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-1">Nearby Hospitals</h3>
      <p className="text-xs text-gray-400 font-medium mb-4">
        Uses your live location to find real hospitals near you on Google Maps.
      </p>

      <button
        onClick={findHospitals}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold
                   py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        {loading ? "Getting your location..." : "Find Hospitals Near Me"}
      </button>

      {error && (
        <p className="mt-3 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
          {error}
        </p>
      )}

      <p className="text-xs text-gray-300 font-medium mt-3 text-center">
        Opens Google Maps in a new tab
      </p>
    </div>
  );
}