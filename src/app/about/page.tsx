// src/app/about/page.tsx
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBusinessBySlug, getAbout } from "@/lib/api";
import type { AboutData, TenantBusiness } from "@/lib/api";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";

export async function generateMetadata() {
  const headersList = await headers();
  const slug = headersList.get("x-business-slug");
  if (!slug) return { title: "About Us" };
  try {
    const business = await getBusinessBySlug(slug);
    return {
      title: `About | ${business.name}`,
      description: `Learn about ${business.name} — our story, mission and team.`,
    };
  } catch {
    return { title: "About Us" };
  }
}

export default async function AboutPage() {
  const headersList = await headers();
  const businessId = headersList.get("x-business-id");
  const slug = headersList.get("x-business-slug");

  let about: AboutData | null = null;
  let business: TenantBusiness | null = null;

  if (businessId && slug) {
    try {
      [about, business] = await Promise.all([
        getAbout(businessId),
        getBusinessBySlug(slug),
      ]);
    } catch {
      notFound();
    }
  } else {
    notFound();
  }

  const whatsapp = business?.storefront?.whatsapp || "";

  return (
    <div className="bg-[#F1F5F9] min-h-screen">

      {/* ── HERO — dark, full-width, clean ─────────────────────────── */}
      <section className="bg-[#0D0D0D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813] mb-6">
                About Us
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.92] uppercase text-white">
                {about.headline || `About\n${business?.name}`}
              </h1>
            </div>
            {about.subheadline && (
              <p className="text-white/50 text-base font-medium max-w-sm leading-relaxed lg:text-right lg:pb-2">
                {about.subheadline}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      {about.stats?.length > 0 && (
        <section className="bg-[#0D0D0D] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {about.stats.map((stat, i) => (
                <div key={i} className="px-6 py-8 text-center first:pl-0 last:pr-0">
                  <div className="text-3xl sm:text-4xl font-black text-[#FDB813] tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* ── STORY ────────────────────────────────────────────────── */}
        {about.story && (
          <section className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813] block mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 uppercase mb-6">
                How It All Began
              </h2>
              <div className="space-y-4">
                {about.story.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed text-[15px]">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative">
              {about.coverImage ? (
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                  <Image
                    src={about.coverImage}
                    alt={business?.name || "About"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-[#0D0D0D] aspect-[4/3] flex items-center justify-center">
                  <span className="text-8xl font-black text-[#FDB813] tracking-tighter uppercase opacity-20">
                    {business?.name?.slice(0, 2)}
                  </span>
                </div>
              )}
            </div>

          </section>
        )}

        {/* ── MISSION + VISION ─────────────────────────────────────── */}
        {(about.mission || about.vision) && (
          <section className="grid md:grid-cols-2 gap-6">
            {about.mission && (
              <div className="bg-[#0D0D0D] text-white rounded-2xl p-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813] block mb-4">
                  Mission
                </span>
                <p className="text-lg font-bold leading-relaxed text-white/80">
                  {about.mission}
                </p>
              </div>
            )}
            {about.vision && (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813] block mb-4">
                  Vision
                </span>
                <p className="text-lg font-bold leading-relaxed text-slate-800">
                  {about.vision}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ── VALUES ───────────────────────────────────────────────── */}
        {about.values?.length > 0 && (
          <section>
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813] block mb-3">
                What We Stand For
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 uppercase">
                Our Values
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {about.values.map((value, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FDB813]/40 transition-all group"
                >
                  <div className="text-[10px] font-black text-[#FDB813] uppercase tracking-widest mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TEAM ─────────────────────────────────────────────────── */}
        {about.team?.length > 0 && (
          <section>
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FDB813] block mb-3">
                The People Behind It
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 uppercase">
                Meet The Team
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.team.map((member, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-[#0D0D0D] flex items-center justify-center">
                        <span className="text-xl font-black text-[#FDB813]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="font-black text-slate-900 uppercase tracking-tight text-sm">
                    {member.name}
                  </div>
                  <div className="text-[10px] font-bold text-[#FDB813] uppercase tracking-widest mt-1">
                    {member.role}
                  </div>
                  {member.bio && (
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="bg-[#0D0D0D] rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-3">
            Ready to Shop?
          </h2>
          <p className="text-white/40 mb-8 font-medium text-sm">
            Explore our collection or reach us directly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <button className="group px-8 py-4 bg-[#FDB813] text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all">
                Shop Now
                <FaArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-4 border border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all">
                  <FaWhatsapp size={14} />
                  WhatsApp Us
                </button>
              </a>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}