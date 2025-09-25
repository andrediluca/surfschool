import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { QRCodeCanvas } from "qrcode.react";

export default function BookingDetail() {
  const { id } = useParams(); // booking ID from route
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    API.get(`rentals/${id}/`)   // ✅ fetch rental by ID
      .then((res) => setBooking(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!booking) return <p>Loading booking...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Board Rental Confirmation</h2>
      <p><strong>Board:</strong> {booking.board.size} {booking.board.type}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.start_time} → {booking.end_time}</p>
      <p><strong>Reference:</strong> {booking.reference}</p>

      <div className="mt-6 flex justify-center">
        <QRCodeCanvas value={booking.reference} size={150} />
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Show this QR code at the surf school to confirm your rental.
      </p>
    </div>
  );
}
