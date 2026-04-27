// FILE: src/app/cart/page.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import menuData from "@/data/menu.json";
import branches from "@/data/branches.json";

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
    selectedBranch,
    setSelectedBranch,
  } = useCart();

  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 🚨 VALIDATION BEFORE CHECKOUT
  const handleProceed = () => {
    if (!selectedBranch) {
      setToastMessage("⚠️ Please select a branch before proceeding");
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    if (cart.length === 0) {
      setToastMessage("⚠️ Your cart is empty");
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    router.push("/review");
  };

  // 🟡 SUGGESTIONS (exclude cart items)
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
      .map((bundle) => ({ ...bundle })),
  ];

  const handleAddSuggestion = (item: any) => {
    addToCart({ ...item, quantity: 1 }, { silent: true });
    setToastMessage(`${item.name} added to cart!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const branch = branches.find((b) => b.id === selectedBranch);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[80px] relative">

      {/* HEADER */}
      <div className="px-4 pt-4 pb-6 text-center">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-sm text-gray-500 mt-1">
          {cart.length} item{cart.length !== 1 && "s"} in your order
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-8">

        {/* 🟡 BRANCH SELECTION */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-2">Select Branch</h2>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm"
          >
            <option value="">-- Choose Branch --</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} - {b.location}
              </option>
            ))}
          </select>

          {branch && (
            <p className="text-xs text-gray-500 mt-2">
              📍 {branch.location} | 📞 {branch.whatsapp}
            </p>
          )}
        </div>

        {/* CART ITEMS */}
        {cart.length > 0 && (
          <div className="space-y-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border p-4 flex gap-4"
              >
                <Image
                  src={item.image || "/images/placeholder.jpg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    KES {item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-2 border rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 border rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-xs mt-2"
                  >
                    Remove
                  </button>
                </div>

                <div className="font-semibold">
                  KES {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="bg-white border rounded-xl p-5">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleProceed}
                className="w-full mt-4 py-3 bg-green-900 text-white rounded-xl font-semibold"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-3">You may also like</h2>

            {suggestions.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleAddSuggestion(item)}
                  className="px-3 py-1 bg-green-900 text-white rounded-lg text-sm"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CUSTOM ORDER */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-2">Custom Order</h2>

          <textarea
            value={customOrder}
            onChange={(e) => setCustomOrder(e.target.value)}
            className="w-full border rounded-lg p-3 min-h-[100px]"
            placeholder="Describe your special order..."
          />
        </div>

        {/* NOTES */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold mb-2">Order Notes</h2>

          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full border rounded-lg p-3 min-h-[90px]"
            placeholder="Any instructions..."
          />
        </div>
      </div>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-900 text-white px-6 py-3 rounded-xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;