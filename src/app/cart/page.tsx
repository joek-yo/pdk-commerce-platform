"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import menuData from "@/data/menu.json";
import { 
  FaTrashAlt, FaPlus, FaMinus, FaChevronRight, FaChevronLeft, 
  FaShoppingCart, FaPenNib, FaLightbulb, FaRocket
} from "react-icons/fa";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleAddSuggestion = (item: any) => {
    addToCart({ ...item, quantity: 1 });
    setToastMessage(`${item.name} added!`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const sectionClasses = "bg-white border-l-8 border-l-[#FDB813] border-y border-r border-slate-200 p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] mb-8 relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-1";
  const inputStyle = "w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-slate-900 font-bold text-lg placeholder:text-slate-300 focus:bg-white focus:border-[#FDB813] outline-none transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pt-24 pb-40 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 px-2 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">
              My <span className="text-[#FDB813]">Bag</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="h-1 w-12 bg-[#FDB813] rounded-full"></div>
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
                 {cart.length} ITEMS
               </p>
            </div>
          </div>
        </div>

        {/* 1. CART ITEMS LIST */}
        {cart.length > 0 ? (
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-4 sm:p-6 rounded-[2.5rem] flex items-center gap-4 sm:gap-6 shadow-[0_10px_25px_rgba(0,0,0,0.04)] group">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 text-base sm:text-xl leading-tight truncate">{item.name}</h3>
                  <p className="text-[#FDB813] font-black text-xs mb-3">KES {item.price.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 rounded-xl p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white"><FaMinus size={8}/></button>
                      <span className="w-8 text-center font-black text-xs text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white"><FaPlus size={8}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"><FaTrashAlt size={14}/></button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-slate-900 text-lg sm:text-2xl tracking-tighter">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center py-20 mb-12">
            <FaShoppingCart className="mx-auto text-slate-200 mb-4" size={60} />
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Bag is empty</p>
          </div>
        )}

        {/* 2. IMMEDIATE TOTAL & QUICK CHECKOUT (The New Pop-up Section) */}
        {cart.length > 0 && (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-16 shadow-2xl shadow-slate-400/50 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] block mb-1">Quick Total</span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start text-white">
                <span className="text-sm font-bold opacity-50 uppercase">KES</span>
                <span className="text-4xl font-black tracking-tighter tabular-nums leading-none">
                  {subtotal.toLocaleString()}
                </span>
              </div>
            </div>
            <button 
              onClick={handleProceed}
              className="w-full sm:w-auto bg-[#FDB813] text-black px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <FaRocket size={14}/>
              <span>Review Now</span>
            </button>
          </div>
        )}

        {/* 3. MOST WANTED DEALS (Discovery) */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-2">
              <FaLightbulb className="text-[#FDB813]"/> Up Your Game
            </h2>
            <div className="flex gap-2">
              <button onClick={() => scrollDeals("left")} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FDB813] transition-all shadow-md">
                <FaChevronLeft size={12} />
              </button>
              <button onClick={() => scrollDeals("right")} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FDB813] transition-all shadow-md">
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
          
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory">
            {menuData.categories.flatMap(cat => cat.items).slice(0, 8).map((item) => (
              <div key={item.id} className="min-w-[200px] bg-white p-5 rounded-[2rem] border border-slate-100 shadow-xl snap-start">
                <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-4">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <h4 className="font-black text-xs text-slate-900 truncate mb-1 uppercase">{item.name}</h4>
                <p className="text-[10px] font-black text-slate-400 mb-4">KES {item.price.toLocaleString()}</p>
                <button onClick={() => handleAddSuggestion(item)} className="w-full py-3 bg-slate-50 hover:bg-[#FDB813] hover:text-black transition-all rounded-xl text-[9px] font-black uppercase tracking-widest">
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CUSTOM ORDER & NOTES (Further down for deep intent) */}
        <div className="space-y-6 mb-16">
          <section className={sectionClasses}>
            <label className={labelClasses}><FaPenNib size={10} className="text-[#FDB813]"/> Custom Sourcing Request</label>
            <textarea 
              value={customOrder} 
              onChange={(e) => setCustomOrder(e.target.value)}
              className={inputStyle + " min-h-[120px] resize-none"}
              placeholder="Tell us what product you are looking for..."
            />
          </section>

          <section className={sectionClasses}>
            <label className={labelClasses}><FaPenNib size={10} className="text-[#FDB813]"/> Order Instructions</label>
            <textarea 
              value={orderNotes} 
              onChange={(e) => setOrderNotes(e.target.value)}
              className={inputStyle + " min-h-[100px] resize-none"}
              placeholder="Delivery notes, color preferences, etc."
            />
          </section>
        </div>

        {/* 5. FINAL GRAND TOTAL & CTA */}
        <div className="mt-16 pt-12 border-t-4 border-white">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 px-4">
             <div className="text-center sm:text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] block mb-2">Final Selection</span>
                <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                  <span className="text-xl font-black text-slate-300 uppercase">KES</span>
                  <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                    {subtotal.toLocaleString()}
                  </span>
                </div>
             </div>
           </div>

           <button 
              onClick={handleProceed}
              className="w-full bg-[#FDB813] text-black py-8 rounded-[2.5rem] font-black text-2xl hover:bg-[#E5A711] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_25px_60px_rgba(253,184,19,0.5)] flex items-center justify-center gap-4 group"
            >
              <span>Review Special Order</span>
              <FaChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
           </button>
        </div>

      </div>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-[#FDB813] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-[100] animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CartPage;