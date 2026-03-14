import React, { useState } from "react";
import { Truck, Star } from "lucide-react";

export default function HeroProductCard({
  product = {
    name: "Laptop",
    price: 120,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    rating: 4.8,
    badge: "Popular",
    delivery: "Delivered in 24 hrs",
    durations: [1, 3, 7],
  },
  onRent,
}) {
  const [selectedDuration, setSelectedDuration] = useState(product.durations[0]);

  return (
    <div
      className="relative bg-white rounded-2xl shadow-soft hover:shadow-lg transition transform hover:-translate-y-2 hover:scale-105 p-6 w-72 flex flex-col items-center"
      style={{ minHeight: 340 }}
    >
      {/* Badge */}
      <span className="absolute top-4 left-4 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        {product.badge}
      </span>
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 rounded-xl object-cover mb-4 mt-6"
      />
      {/* Product Name */}
      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        <Star size={16} className="text-yellow-400" />
        <span className="text-sm text-gray-500">{product.rating}</span>
      </div>
      {/* Price */}
      <div className="text-accent font-bold text-xl mb-2">₹{product.price}/day</div>
      {/* Delivery Tag */}
      <div className="flex items-center gap-2 bg-accent/10 text-accent text-xs font-medium px-3 py-1 rounded-full mb-3">
        <Truck size={14} />
        {product.delivery}
      </div>
      {/* Rental Duration Selector */}
      <div className="mb-4 w-full">
        <div className="text-xs font-medium text-gray-500 mb-2">Rent for:</div>
        <div className="flex gap-2 justify-center">
          {product.durations.map((d) => (
            <button
              key={d}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition border ${
                selectedDuration === d
                  ? "bg-accent text-white border-accent shadow"
                  : "bg-white text-accent border-accent/30 hover:bg-accent/10"
              }`}
              onClick={() => setSelectedDuration(d)}
            >
              {d} Day{d > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>
      {/* Rent Button */}
      <button
        className="rk-btn rk-btn-primary w-full mt-2 shadow-soft hover:shadow-lg transition font-semibold"
        onClick={() => onRent && onRent(product, selectedDuration)}
      >
        Rent
      </button>
    </div>
  );
}
