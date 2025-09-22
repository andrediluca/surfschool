export default function Landing() {
  return (
    <div className="text-center p-6">
      <h1 className="text-4xl font-bold mb-4">🏄 Welcome to Surf School</h1>
      <p className="text-lg mb-6">
        Learn to surf, rent top-quality boards, and join our community.
      </p>
      <div className="space-x-4">
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </a>
        <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded">
          Sign Up
        </a>
      </div>
    </div>
  );
}
