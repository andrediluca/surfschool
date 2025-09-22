import { useEffect, useState } from "react";
import API from "../api";

export default function Conditions() {
  const [condition, setCondition] = useState(null);

  useEffect(() => {
    API.get("conditions/")
      .then((res) => {
        if (res.data.length > 0) {
          // show the latest condition (last one in list)
          setCondition(res.data[res.data.length - 1]);
        }
      })
      .catch((err) => console.error("Error fetching conditions:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌊 Sea Conditions</h1>

      {condition ? (
        <div className="border p-4 rounded-lg shadow bg-white">
          <p className="text-gray-700">📅 {condition.date}</p>
          <p className="mt-2">{condition.description}</p>
          <p className="mt-2 font-semibold">
            Recommended level: {condition.level_suitability}
          </p>
          {condition.wave_height && (
            <p className="mt-1">🌊 Wave height: {condition.wave_height} m</p>
          )}
          {condition.water_temp && (
            <p className="mt-1">🌡 Water temp: {condition.water_temp} °C</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">No conditions posted yet.</p>
      )}
    </div>
  );
}
