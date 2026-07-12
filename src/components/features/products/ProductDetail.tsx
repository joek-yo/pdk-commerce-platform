"use client";

import React, { useState, useEffect } from "react";
import {
  FaShoppingCart, FaTruck, FaShieldAlt, FaBolt,
  FaBoxOpen, FaPlus, FaMinus, FaWhatsapp, FaShareAlt,
  FaArrowLeft, FaStar
} from "react-icons/fa";
import { getBusinessData } from "@/lib/getBusinessData";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import menuData from "@/data/menu.json";
import RelatedProducts from "@/components/features/products/RelatedProducts";
import RecentlyViewed from "@/components/features/products/RecentlyViewed";

const ProductDetail = ({ product }: { product: any }) => {
  const business = getBusinessData() as any;
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(product.image);
  const [showBagToast, setShowBagToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const displayQty = quantity || 1;

  const freeThreshold = menuData.deliverySettings?.freeDeliveryThreshold || 10000;
  const isFreeDelivery = product.price * displayQty >= freeThreshold;

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = product.discountPercent ||
    (hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);

  const maxStock = 20;
  const stockPercent = product.stock ? Math.min((product.stock / maxStock) * 100, 100) : 100;
  const stockColor = product.stock <= 3 ? "bg-red-500" : product.stock <= 8 ? "bg-gold" : "bg-whatsapp";

  useEffect(() => {
    setActiveImg(product.image);
    const handleScroll = () => setIsSticky(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product]);

  const handleIncrease = () => {
    const maxQty = product.stock || 99;
    if (cartItem) {
      if (cartItem.quantity < maxQty) updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }, { silent: true });
    }
  };

  const handleDecrease = () => {
    if (!cartItem) return;
    if (cartItem.quantity <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, cartItem.quantity - 1);
  };

  const handleAddToBag = () => {
    if (!cartItem) {
      addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }, { silent: true });
    }
    setShowBagToast(true);
    setTimeout(() => setShowBagToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!cartItem) {
      addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }, { silent: true });
    }
    router.push("/cart");
  };

  const handleWhatsAppInquiry = () => {
    const phone = business.whatsapp || business.phone || "";
    const clean = phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hi! I'm interested in *${product.name}* (KES ${product.price.toLocaleString()}). Is it available?`
    );
    window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${msg}`, "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32 pt-4">
      <div className="max-w-6xl mx-auto px-4">

        {/* BREADCRUMB + BACK TO SHOP */}
        <div className="flex items-center justify-between mb-6">
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-foreground transition-colors">Shop</Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-subtext">{product.category}</span>
              </>
            )}
            <span>/</span>
            <span className="text-foreground truncate max-w-[120px]">{product.name}</span>
          </nav>

          <button
            onClick={() => router.push("/menu")}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted hover:text-foreground transition-all cursor-pointer"
          >
            <FaArrowLeft size={8} />
            <span>Back to Shop</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

          {/* ZONE A: GALLERY */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-xl bg-surface2 border border-border overflow-hidden">
              <img
                src={activeImg}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />

              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 bg-gold text-black text-[10px] font-black px-2.5 py-1 rounded-md">
                  -{discountPercent}%
                </div>
              )}

              {product.stock <= 5 && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-surface/90 backdrop-blur px-3 py-1.5 rounded-full border border-red-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] font-black text-red-400 uppercase tracking-tighter">
                    Only {product.stock} Left
                  </span>
                </div>
              )}

              <button
                onClick={handleShare}
                className="absolute bottom-4 right-4 w-9 h-9 bg-surface/90 backdrop-blur rounded-full flex items-center justify-center text-subtext hover:text-foreground border border-border shadow-sm cursor-pointer transition-all hover:scale-110"
              >
                <FaShareAlt size={12} />
              </button>
            </div>

            <div className="flex gap-3 justify-center">
              {[product.image, ...(product.extraImages || [])].slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 rounded-lg border-2 transition-all overflow-hidden cursor-pointer ${activeImg === img ? "border-gold bg-surface scale-110" : "border-transparent opacity-50"}`}
                >
                  <img src={img} alt="angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ZONE B: INFO & ACTION */}
          <div className="flex flex-col justify-center space-y-4">

            <div className="flex items-center gap-3">
              <span className="bg-gold/10 text-gold border border-gold/30 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {product.category || "Premium Gear"}
              </span>
              {product.trending && (
                <div className="flex items-center gap-1.5 text-orange-400 font-black text-[9px] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                  Trending
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-[0.9]">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2 text-xs text-subtext">
                <span className="flex items-center gap-0.5 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={11} className={i < Math.round(product.rating) ? "" : "opacity-25"} />
                  ))}
                </span>
                <span>{product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-foreground tracking-tighter italic">
                KES {product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted line-through font-bold">
                  KES {product.oldPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                  You save KES {(product.oldPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-subtext font-medium leading-relaxed max-w-md text-sm">
              {product.description}
            </p>

            {product.stock !== undefined && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted">
                    Stock Level
                  </span>
                  <span className={`text-[9px] font-black uppercase ${product.stock <= 3 ? "text-red-400" : product.stock <= 8 ? "text-gold" : "text-whatsapp"}`}>
                    {product.stock <= 3 ? "Critical" : product.stock <= 8 ? "Low Stock" : "In Stock"} · {product.stock} units
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${stockColor}`}
                  />
                </div>
              </div>
            )}

            {product.whatsInTheBox && (
              <div className="bg-surface border border-border p-4 rounded-xl">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 mb-3">
                  <FaBoxOpen className="text-gold" /> In the Box
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.whatsInTheBox.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-subtext">
                      <div className="w-1 h-1 rounded-full bg-gold" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.variants && (
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Configuration</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: string) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-2.5 rounded-lg border-2 text-[10px] font-black uppercase transition-all cursor-pointer ${selectedVariant === v ? "border-gold bg-gold text-black scale-105" : "border-border text-muted hover:border-border-strong bg-surface"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY SELECTOR */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-surface2 border border-border-strong rounded-lg p-0.5">
                  <button
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center text-subtext hover:text-foreground cursor-pointer transition-colors"
                  >
                    <FaMinus size={9} />
                  </button>
                  <span className="w-8 text-center font-black text-sm text-foreground">
                    {displayQty}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="w-8 h-8 flex items-center justify-center text-subtext hover:text-foreground cursor-pointer transition-colors"
                  >
                    <FaPlus size={9} />
                  </button>
                </div>
                <span className="text-[10px] text-muted font-bold">
                  Total: <span className="text-foreground font-black">KES {(product.price * displayQty).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToBag}
                className="h-14 bg-transparent border-2 border-border-strong text-foreground rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-gold hover:text-gold transition-all active:scale-95 cursor-pointer"
              >
                <FaShoppingCart /> {cartItem ? "In Your Bag ✓" : "Add to Bag"}
              </button>

              <button
                onClick={handleBuyNow}
                className="h-14 bg-gold text-black rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 cursor-pointer"
              >
                <FaBolt /> Buy It Now
              </button>
            </div>

            {/* WHATSAPP */}
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full h-11 border-2 border-whatsapp text-whatsapp rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-whatsapp hover:text-black transition-all active:scale-95 cursor-pointer text-[10px]"
            >
              <FaWhatsapp size={14} /> Ask About This Item
            </button>

            {/* TRUST */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface2 flex items-center justify-center text-gold">
                  <FaTruck size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-foreground leading-none mb-1">Swift Ship</span>
                  <span className="text-[9px] text-muted uppercase tracking-tighter">{business?.location} based</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface2 flex items-center justify-center text-gold">
                  <FaShieldAlt size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-foreground leading-none mb-1">Authentic</span>
                  <span className="text-[9px] text-muted uppercase tracking-tighter">Verified Gear</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.category && (
          <RelatedProducts
            currentProductId={product.id}
            currentCategory={product.category}
            maxItems={4}
          />
        )}

        <RecentlyViewed currentProductId={product.id} />

      </div>

      {/* STICKY MOBILE BAR */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-t border-border p-4 flex items-center justify-between z-[100] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-surface2 rounded-lg overflow-hidden">
                <img src={product.image} className="w-full h-full object-cover" alt="thumb" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-muted uppercase tracking-widest">
                  {displayQty} × KES {product.price.toLocaleString()}
                </span>
                <span className="font-black text-sm text-foreground italic">
                  KES {(product.price * displayQty).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface2 border border-border-strong rounded-lg p-0.5">
                <button
                  onClick={handleDecrease}
                  className="w-7 h-7 flex items-center justify-center text-subtext hover:text-foreground cursor-pointer transition-colors"
                >
                  <FaMinus size={8} />
                </button>
                <span className="w-6 text-center font-black text-xs text-foreground">
                  {displayQty}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-7 h-7 flex items-center justify-center text-subtext hover:text-foreground cursor-pointer transition-colors"
                >
                  <FaPlus size={8} />
                </button>
              </div>
              <button
                onClick={handleBuyNow}
                className="bg-gold text-black h-11 px-5 rounded-lg font-black text-[10px] uppercase tracking-widest active:scale-95 cursor-pointer"
              >
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BAG TOAST */}
      <AnimatePresence>
        {showBagToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-surface text-foreground px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl z-[100] border border-border-strong flex items-center gap-3"
          >
            <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
              <FaShoppingCart size={10} className="text-black" />
            </div>
            Item Added to Bag
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE TOAST */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-surface border border-border-strong text-foreground px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl z-[100] flex items-center gap-3"
          >
            <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
              <FaShareAlt size={9} className="text-black" />
            </div>
            Link Copied!
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;
