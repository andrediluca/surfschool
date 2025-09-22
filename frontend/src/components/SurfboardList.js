import { useEffect, useState } from "react";
import API from "../api";

export default function SurfboardList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    API.get("surfboards/").then((res) => setBoards(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Surfboards</h2>
      <ul className="space-y-2">
        {boards.map((board) => (
          <li key={board.id} className="border p-3 rounded-lg shadow">
            <p>Type: {board.type}</p>
            <p>Size: {board.size}</p>
            <p>Status: {board.is_available ? "✅ Available" : "❌ Rented"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
