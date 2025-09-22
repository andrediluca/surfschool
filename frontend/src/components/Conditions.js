import { useEffect, useState } from "react";
import API from "../api";

export default function Conditions() {
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    API.get("conditions/").then((res) => setConditions(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sea Conditions</h2>
      {conditions.length > 0 ? (
        <div className="border p-3 rounded-lg shadow">
          <p>📅 {conditions[0].date}</p>
          <p>{conditions[0].description}</p>
          <p>Recommended level: {conditions[0].level_suitability}</p>
          {conditions[0].wave_height && <p>🌊 {conditions[0].wave_height}</p>}
          {conditions[0].water_temp && <p>🌡 {conditions[0].water_temp}</p>}
        </div>
      ) : (
        <p>No conditions posted yet.</p>
      )}
    </div>
  );
}
