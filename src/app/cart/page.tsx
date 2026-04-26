"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import menuData from "@/data/menu.json";

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    customOrder,
    setCustomOrder,
    orderNotes,
    setOrderNotes,
    addToCart,
  } = useCart();

  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProceed = () => router.push("/review");

  // --- DYNAMIC BEST SELLERS / SUGGESTIONS (exclude items already in cart) ---
  const suggestions = [
    ...menuData.categories.flatMap((category) =>
      category.items
        .filter(
          (item) =>
            item.bestSelling &&
            item.available &&
            !cart.some((c) => c.id === item.id)
        )
        .map((item) => ({ ...item }))
    ),
    ...menuData.bundles
      .filter(
        (bundle) =>
          bundle.bestSelling &&
          bundle.available &&
          !cart.some((c) => c.id === bundle.id)
      )
      .map((bundle) => ({ ...bundle }))
  ];

  // ⭐ Add suggestion silently without triggering MiniCartDrawer
  const handleAddSuggestion = (item: any) => {
    // Updated: pass options object as second argument
    addToCart({ ...item, quantity: 1 }, { silent: true });
    setToastMessage(`${item.name} added to cart!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[80px] relative">
      {/* HEADER */}
      <div className="px-4 pt-4 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Cart</h1>
        <p className="text-sm text-gray-500 mt-1">
          {cart.length} item{cart.length !== 1 && "s"} in your order
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-8">
        {/* CART ITEMS */}
        {cart.length > 0 && (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border p-4 flex gap-4 transition hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                      IMG
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    KES {item.price.toLocaleString()}
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-semibold transition hover:bg-green-900 hover:text-white hover:border-green-900 active:scale-95"
                    >
                      −
                    </button>
                    <span className="font-medium min-w-[24px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-semibold transition hover:bg-green-900 hover:text-white hover:border-green-900 active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 mt-2 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-sm sm:text-base">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {/* SUBTOTAL */}
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-3 rounded-xl bg-green-900 text-white font-semibold transition hover:bg-green-700 active:scale-95"
              >
                Review Cart Order
              </button>
            </div>
          </div>
        )}

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="bg-white border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-sm sm:text-base">You may also like</h2>
            <div className="space-y-3">
              {suggestions.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddSuggestion(item)}
                    className="px-3 py-1.5 text-sm bg-green-900 text-white rounded-lg transition hover:bg-green-700 active:scale-95"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM ORDER CTA */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <h2 className="font-semibold text-sm sm:text-base mb-2">
            Need Something Not on the Menu?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Request cakes, catering, bulk meals, or any special order.
          </p>
          <Link href="/custom-order">
            <button className="px-6 py-3 bg-green-900 text-white rounded-lg text-sm font-medium transition hover:bg-green-700 active:scale-95">
              🎂 Request Custom Order
            </button>
          </Link>
        </div>

        {/* CUSTOM ORDER DETAILS */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-sm sm:text-base mb-2">Custom Order Details</h2>
          <textarea
            value={customOrder}
            onChange={(e) => setCustomOrder(e.target.value)}
            placeholder="Example: 5kg vanilla birthday cake with strawberry filling."
            className="w-full border rounded-lg p-3 text-sm min-h-[110px] focus:outline-none focus:ring-2 focus:ring-green-800"
          />
        </div>

        {/* ORDER NOTES */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-sm sm:text-base mb-2">Order Notes</h2>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Example: No onions, extra spicy."
            className="w-full border rounded-lg p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-green-800"
          />
        </div>

        {/* REVIEW CUSTOM ORDER BUTTON */}
        {customOrder.trim() && (
          <div className="bg-white border rounded-xl p-5">
            <button
              onClick={handleProceed}
              className="w-full py-3 rounded-xl bg-green-900 text-white font-semibold transition hover:bg-green-700 active:scale-95"
            >
              Review Custom Order
            </button>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-900 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-up z-50">
          {toastMessage}
        </div>
      )}

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;