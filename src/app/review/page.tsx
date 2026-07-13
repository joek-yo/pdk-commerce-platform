"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { openWhatsApp } from "@/lib/whatsapp";
import { calculateTotal } from "@/lib/pricing";
import { motion } from "framer-motion";
import {
  FaWhatsapp, FaChevronLeft, FaShoppingCart, FaMapMarkerAlt,
  FaUser, FaPhone, FaStickyNote, FaTruck,
  FaMoneyBillWave, FaEdit, FaQuoteLeft, FaClock
} from "react-icons/fa";

export default function ReviewPage() {
  const {
    cart,
    customOrder,
    orderNotes,
    orderType: globalOrderType,
    deliveryLocation: globalLocation,
    scheduleTime: globalSchedule,
    setOrderType,
    setDeliveryLocation,
    setOrderNotes,
    setScheduleTime
  } = useCart();

  const [customer, setCustomer] = useState({ name: "", phone: "" });

  useEffect(() => {
    const savedInfo = sessionStorage.getItem("customer_info");
    if (savedInfo) setCustomer(JSON.parse(savedInfo));
  }, []);

  const { subtotal, delivery, total } = useMemo(() => {
    return calculateTotal(cart, globalOrderType, globalLocation);
  }, [cart, globalOrderType, globalLocation]);

  const isCertified = useMemo(() => {
    const hasInfo = customer.name.trim() !== "" && customer.phone.trim() !== "";
    const hasLocationIfRequired = globalOrderType === "delivery" ? globalLocation?.trim() !== "" : true;
    return hasInfo && hasLocationIfRequired;
  }, [customer, globalOrderType, globalLocation]);

  const handleCheckout = () => {
    if (customer.name.trim() === "" || customer.phone.trim() === "") {
      return alert("Please fill in your Name and Phone Number.");
    }
    if (globalOrderType === "delivery" && (!globalLocation || globalLocation.trim() === "")) {
      return alert("Please provide a Delivery Address to proceed.");
    }
    openWhatsApp({
      cart,
      customerName: customer.name,
      customerPhone: customer.phone,
      orderType: globalOrderType,
      deliveryLocation: globalOrderType === "delivery" ? globalLocation : "Store Pickup",
      orderNotes: orderNotes,
      scheduleTime: globalSchedule,
      customOrder: customOrder
    });
  };

  const sectionClasses = "bg-surface border-l-4 border-l-gold border-y border-r border-border p-5 rounded-xl mb-4 shadow-sm relative overflow-hidden";
  const labelClasses = "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-subtext mb-3 ml-1";
  const inputStyle = "w-full bg-surface2 border border-border p-4 rounded-lg text-foreground font-bold text-sm placeholder:text-muted focus:bg-surface focus:border-gold outline-none transition-all duration-200";

  return (
    <div className="min-h-screen bg-background text-foreground pt-12 pb-48 px-4 font-sans">
      <div className="max-w-2xl mx-auto">

        <Link href="/cart" className="inline-flex items-center gap-2 text-subtext hover:text-foreground mb-6 transition-colors font-black text-[10px] uppercase tracking-widest">
          <FaChevronLeft size={8} /> Back to Bag
        </Link>

        <header className="mb-8 px-1">
          <h1 className="text-3xl font-black tracking-tighter text-foreground leading-none">
            Final <span className="text-gold">Review</span>
          </h1>
          <p className="text-subtext font-black text-[9px] uppercase tracking-[0.2em] mt-2">Verify details before sending</p>
        </header>

        {/* DYNAMIC ORDER CONTENT */}
        <div className="mb-8 space-y-4">
          <h2 className={labelClasses}><FaShoppingCart size={10}/> Order Content</h2>

          {customOrder && customOrder.trim() !== "" && (
            <div className="bg-surface2 p-6 rounded-2xl shadow-xl relative border border-border overflow-hidden mb-4">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FaEdit className="text-subtext" size={12} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-subtext">Custom Sourcing</span>
                  </div>
                  <FaQuoteLeft className="text-border-strong" size={16} />
                </div>
                <p className="text-foreground text-base font-medium leading-relaxed italic">
                  {customOrder}
                </p>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-surface border border-border p-3 rounded-xl flex gap-4 shadow-sm relative group">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface2 flex-shrink-0 border border-border">
                    <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h3 className="font-black text-foreground text-sm leading-tight truncate uppercase tracking-tight">{item.name}</h3>
                    <p className="text-gold font-black text-[10px] mt-1">QTY: {item.quantity} × KES {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col justify-center text-right pr-2">
                    <p className="text-foreground font-black text-lg tracking-tighter leading-none">KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOGISTICS */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaTruck size={10}/> Fulfillment & Logistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className={labelClasses}><FaUser size={8}/> Full Name</label>
              <input
                className={inputStyle}
                placeholder="e.g. John Doe"
                value={customer.name}
                onChange={(e) => setCustomer({...customer, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaPhone size={8}/> Phone</label>
              <input
                className={inputStyle}
                placeholder="07XX XXX XXX"
                value={customer.phone}
                onChange={(e) => setCustomer({...customer, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <label className={labelClasses}><FaClock size={8}/> Requested Timeline / Urgency</label>
            <input
              placeholder="e.g. Today / ASAP / Within 48 hours"
              className={inputStyle}
              value={globalSchedule}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>

          <div className="space-y-3 mb-6">
            <label className={labelClasses}><FaMapMarkerAlt size={8}/> Fulfillment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setOrderType("pickup")} className={`h-12 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border cursor-pointer ${globalOrderType === "pickup" ? "bg-foreground text-background border-foreground" : "bg-surface border-border text-subtext"}`}>Pickup</button>
              <button onClick={() => setOrderType("delivery")} className={`h-12 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border cursor-pointer ${globalOrderType === "delivery" ? "bg-foreground text-background border-foreground" : "bg-surface border-border text-subtext"}`}>Delivery</button>
            </div>
          </div>

          {globalOrderType === "delivery" && (
            <div className="space-y-1 mb-6 text-foreground">
              <label className={labelClasses}><FaMapMarkerAlt size={8}/> Delivery Address</label>
              <input
                placeholder="Area or Building Name"
                className={inputStyle}
                value={globalLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
              {/* LIVE DELIVERY PREVIEW */}
              {globalLocation?.trim().length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between mt-2 px-1"
                >
                  <span className="text-[10px] font-bold text-subtext flex items-center gap-1.5">
                    <FaTruck size={9} className="text-gold" />
                    Delivery to {globalLocation}
                  </span>
                  <span className={`text-[10px] font-black ${delivery === 0 ? "text-whatsapp" : "text-foreground"}`}>
                    {delivery === 0 ? "FREE 🎉" : `KES ${delivery.toLocaleString()}`}
                  </span>
                </motion.div>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className={labelClasses}><FaStickyNote size={8}/> General Notes</label>
            <textarea
              placeholder="Budget range or specific color preferences..."
              className={`${inputStyle} h-24 resize-none`}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>
        </section>

        {/* BILLING SUMMARY */}
        <section className={sectionClasses}>
          <h2 className={labelClasses}><FaMoneyBillWave size={10}/> Billing Summary</h2>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-subtext px-1">
              <span>Items</span>
              <span className="text-foreground">KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gold px-1">
              <span className="flex items-center gap-2"><FaTruck size={10}/> Delivery Fee</span>
              <span>KES {delivery || 0}</span>
            </div>

            <div className="pt-4 border-t border-dashed border-border">
              <p className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1 px-1">Total Payable</p>
              <div className="flex justify-between items-end px-1">
                <h2 className="text-3xl font-black text-foreground tracking-tighter leading-none">
                  KES {total.toLocaleString()}
                </h2>
                <span className="bg-surface2 text-subtext text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  Tax Included
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/90 backdrop-blur-md border-t border-border z-50">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleCheckout}
              className={`w-full h-16 rounded-xl font-black text-sm uppercase tracking-widest shadow-sm flex items-center justify-center gap-3 border-2 transition-all active:scale-95 cursor-pointer ${
                isCertified
                ? "bg-whatsapp text-white border-whatsapp"
                : "bg-whatsapp/25 text-whatsapp border-transparent"
              }`}
            >
              <FaWhatsapp size={20} />
              <span>Confirm via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
