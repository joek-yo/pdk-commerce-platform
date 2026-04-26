"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { getBusinessData } from "@/lib/getBusinessData";

const ContactSection: React.FC = () => {
  const business = getBusinessData();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Format the message for WhatsApp
    const text = `*New Website Inquiry*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Message:* ${formData.message}`;
    
    // 2. Clean the phone number and create the URL
    const cleanPhone = business.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

    // 3. Show the success message in the UI
    setSubmitted(true);

    // 4. Redirect to WhatsApp after a short delay so the user sees the "Thank you" message
    setTimeout(() => {
      window.location.href = whatsappUrl;
      
      // 5. Clear the form fields
      setFormData({ name: "", email: "", message: "" });
    }, 1000); 

    // Optional: Hide the success banner after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactOptions = [
    {
      icon: <FaPhoneAlt size={22} />,
      title: "Call Us",
      info: business.phone,
      link: `tel:${business.phone}`,
      bg: "bg-green-700 hover:bg-green-800",
    },
    {
      icon: <FaEnvelope size={22} />,
      title: "Email Us",
      info: business.email,
      link: `mailto:${business.email}`,
      bg: "bg-gray-800 hover:bg-gray-900",
    },
    {
      icon: <FaWhatsapp size={22} />,
      title: "WhatsApp Chat",
      info: business.phone,
      link: `https://wa.me/${business.phone.replace(/[^0-9]/g, '')}`,
      bg: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-black text-center mb-12 text-gray-800"
      >
        Get in Touch
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
      >
        {contactOptions.map((card, idx) => (
          <motion.a
            key={idx}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1 } },
            }}
            className={`flex flex-col items-center p-8 rounded-3xl shadow-xl text-white transition-all transform hover:-translate-y-2 ${card.bg}`}
          >
            <div className="mb-4 p-3 bg-white/20 rounded-full">{card.icon}</div>
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-center font-medium opacity-90">{card.info}</p>
          </motion.a>
        ))}
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-[2rem] p-8 md:p-12 border border-gray-100 flex flex-col gap-6"
      >
        {submitted && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-green-50 text-green-700 p-4 rounded-xl font-bold text-center border border-green-100"
          >
            Redirecting to WhatsApp... Thank you!
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
        </div>
        <textarea
          name="message"
          rows={5}
          placeholder="How can we help you?"
          required
          value={formData.message}
          onChange={handleChange}
          className="p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition"
        ></textarea>
        <button
          type="submit"
          disabled={submitted}
          className={`bg-green-900 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${submitted ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaWhatsapp className="text-xl" />
          {submitted ? "Sending..." : "Send via WhatsApp"}
        </button>
      </motion.form>
    </section>
  );
};

export default ContactSection;