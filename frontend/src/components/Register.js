import { useState } from "react";
import API from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("auth/register/", { username, email, password });
      setMsg("✅ Account created! You can now login.");
    } catch (err) {
      setMsg("❌ Could not register.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-4 space-y-3">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      {msg && <p>{msg}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Account
      </button>
    </form>
  );
}
