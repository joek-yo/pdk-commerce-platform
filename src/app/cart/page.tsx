"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import menuData from "@/data/menu.json";
import ProductCard from "@/components/home/ProductCard";
import { 
  FaTrashAlt, FaPlus, FaMinus, FaChevronRight, FaChevronLeft, 
  FaShoppingCart, FaPenNib, FaLightbulb, FaArrowLeft, FaTruck
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    customOrder,
    setCustomOrder,
  } = useCart();

  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [suggestedDeals, setSuggestedDeals] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const shippingThreshold = menuData.deliverySettings?.freeDeliveryThreshold || 10000;
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - subtotal;

  useEffect(() => {
    const allItems = menuData.categories.flatMap(cat => cat.items);
    const filteredItems = allItems.filter(
      (item) => !cart.some((cartItem) => cartItem.id === item.id)
    );
    const shuffled = [...filteredItems].sort(() => 0.5 - Math.random()).slice(0, 8);
    setSuggestedDeals(shuffled);
  }, [cart.length]); 

  const handleProceed = () => {
    if (cart.length === 0 && !customOrder) {
      setToastMessage("⚠️ Your cart is empty");
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    router.push("/review");
  };

  const scrollDeals = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const sectionClasses = "bg-white border-l-4 border-l-[#FDB813] border-y border-r border-slate-200 p-4 rounded-xl shadow-sm mb-4 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500 mb-2 ml-1";
  const inputStyle = "w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-900 font-bold text-sm placeholder:text-slate-300 focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pt-12 pb-32 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-6 flex justify-between items-end px-1">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
              My <span className="text-[#FDB813]">Bag</span>
            </h1>
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] mt-1">
              {cart.length} items
            </p>
          </div>
          <button 
            onClick={() => router.push("/menu")}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
          >
            <FaArrowLeft size={8}/>
            <span>Back to Shop</span>
          </button>
        </div>

        {/* PROGRESS BAR */}
        {cart.length > 0 && (
          <div className="bg-white border border-slate-200 p-4 rounded-xl mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2">
                 <FaTruck className={remaining <= 0 ? "text-green-500" : "text-[#FDB813]"} size={12} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {remaining > 0 
                      ? `Add KES ${remaining.toLocaleString()} for Free Delivery` 
                      : "Free Delivery Unlocked!"}
                 </span>
               </div>
               <span className="text-[10px] font-black text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 className="h-full bg-[#FDB813]"
               />
            </div>
          </div>
        )}

        {/* CART ITEMS LIST */}
        {cart.length > 0 ? (
          <div className="space-y-3 mb-8">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-3 rounded-xl flex gap-4 shadow-sm relative group">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                  <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">Unit:</span>
                    <p className="text-[#FDB813] font-black text-xs">KES {item.price.toLocaleString()}</p>
                  </div>
                  <p className="mt-2 text-slate-900 font-black text-lg tracking-tighter">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between border-l border-slate-100 pl-3 py-1">
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FaTrashAlt size={12}/>
                  </button>

                  <div className="flex items-center bg-slate-900 rounded-lg p-0.5 shadow-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><FaMinus size={8}/></button>
                    <span className="w-6 text-center font-black text-[10px] text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><FaPlus size={8}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl text-center py-12 mb-8">
            <FaShoppingCart className="mx-auto text-slate-200 mb-3" size={32} />
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empty Bag</h2>
          </div>
        )}

        {/* RECOMMENDED ITEMS */}
        {suggestedDeals.length > 0 && (
          <div className="mb-10 relative">
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 flex items-center gap-2">
                <FaLightbulb className="text-[#FDB813]"/> Recommended
              </h2>
            </div>

            <div className="relative group/nav">
              <button 
                onClick={() => scrollDeals("left")}
                className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-xl opacity-0 group-hover/nav:opacity-100 pointer-events-none group-hover/nav:pointer-events-auto transition-all duration-300 hover:bg-[#FDB813] hover:text-black active:scale-90 cursor-pointer border-2 border-white"
              >
                <FaChevronLeft size={12} />
              </button>

              <button 
                onClick={() => scrollDeals("right")}
                className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-xl opacity-0 group-hover/nav:opacity-100 pointer-events-none group-hover/nav:pointer-events-auto transition-all duration-300 hover:bg-[#FDB813] hover:text-black active:scale-90 cursor-pointer border-2 border-white"
              >
                <FaChevronRight size={12} />
              </button>

              <div 
                ref={scrollRef} 
                className="flex gap-3 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar { display: none; }
                `}</style>

                {suggestedDeals.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex-none w-[calc(50%-6px)] sm:w-[calc((100%-24px)/3)] snap-start"
                  >
                    <ProductCard {...item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM SOURCING SECTION */}
        <div className="mb-12">
          <section className={sectionClasses}>
            <label className={labelClasses}><FaPenNib size={9}/> Custom Sourcing</label>
            <textarea 
              value={customOrder} 
              onChange={(e) => setCustomOrder(e.target.value)}
              className={inputStyle + " min-h-[60px] resize-none"}
              placeholder="Searching for something specific?"
            />
          </section>
        </div>

        {/* STICKY CHECKOUT BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Total Payable</span>
                {remaining <= 0 && (
                  <span className="bg-green-100 text-green-600 text-[7px] font-black px-1.5 py-0.5 rounded uppercase">Free Delivery</span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-slate-400">KES</span>
                <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">
                  {subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button 
              onClick={handleProceed}
              className="flex-1 max-w-[240px] bg-[#FDB813] text-black h-14 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-100 active:scale-95 cursor-pointer"
            >
              <span>Review & Checkout</span>
              <FaChevronRight size={10}/>
            </button>
          </div>
        </div>

      </div>

      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-[#FDB813] px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl z-[100]">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;