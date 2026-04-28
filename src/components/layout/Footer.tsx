// src/components/layout/Footer.tsx

"use client";

import React from "react";
import { getBusinessData, getBusinessWhatsAppNumber } from "@/lib/getBusinessData";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer: React.FC = () => {
  const business = getBusinessData();
  const whatsapp = getBusinessWhatsAppNumber();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* ================= BUSINESS INFO ================= */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">

          <h3 className="text-2xl font-bold text-yellow-500 mb-1">
            {business.name}
          </h3>

          <p className="text-gray-400 italic mb-3">
            {business.tagline}
          </p>

          <p className="text-gray-400 mb-1">
            Phone:
            <a
              href={`tel:${business.phone}`}
              className="hover:text-yellow-500 ml-1"
            >
              {business.phone}
            </a>
          </p>

          <p className="text-gray-400">
            Email:
            <a
              href={`mailto:${business.email}`}
              className="hover:text-yellow-500 ml-1"
            >
              {business.email}
            </a>
          </p>

        </div>

        {/* ================= QUICK LINKS ================= */}
        <div className="flex flex-col space-y-2 text-gray-300">
          <span className="font-semibold mb-1">Quick Links</span>

          <a href="/" className="hover:text-yellow-500 transition">Home</a>
          <a href="/menu" className="hover:text-yellow-500 transition">Menu</a>
          <a href="/contact" className="hover:text-yellow-500 transition">Contact</a>
          <a href="#" className="hover:text-yellow-500 transition">About Us</a>

        </div>

        {/* ================= SOCIAL ================= */}
        <div className="flex flex-col items-center md:items-end">

          <span className="font-semibold mb-2">Connect with us</span>

          <div className="flex space-x-4 mb-3">

            <a href="#" className="hover:text-yellow-500 transition">
              <FaFacebookF size={20} />
            </a>

            <a href="#" className="hover:text-yellow-500 transition">
              <FaInstagram size={20} />
            </a>

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="hover:text-yellow-500 transition"
              >
                <FaWhatsapp size={20} />
              </a>
            )}

          </div>

        </div>

      </div>

      {/* ================= DIVIDER ================= */}
      <div className="border-t border-gray-700 mt-8" />

      {/* ================= BOTTOM ================= */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm px-6 max-w-7xl mx-auto">

        <span>
          &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
        </span>

        <span className="mt-2 md:mt-0 text-xs text-gray-400">
          Powered by <span className="font-semibold text-gray-300">Builnex</span> —
          Digital Systems for Local Businesses •
          <a href="tel:0729724433" className="hover:text-yellow-500 ml-1">
            0729724433
          </a>
        </span>

      </div>

    </footer>
  );
};

export default Footer;