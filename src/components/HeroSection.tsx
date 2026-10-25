"use client";

import React from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Gift, Cake, Mail, PartyPopper } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface HeroSectionProps {
  friendName: string;
  friendNickname: string;
  senderName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  themeColor?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export default function HeroSection({
  friendName,
  friendNickname,
  senderName,
  heroBadge,
  heroTitle,
  heroSubtitle,
  heroImageUrl,
  onNavigateSection,
}: HeroSectionProps) {
  const triggerConfetti = () => {
    soundManager.playCelebrationFanfare();

    // Multidirectional confetti cannons
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#ec4899", "#f43f5e", "#fbbf24", "#a855f7", "#38bdf8", "#ffffff"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Radiant ambient glow rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-gradient-to-tr from-pink-600/20 via-rose-500/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full z-10 text-center">
        {/* Celebration badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.8 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg shadow-pink-500/10 mb-6 animate-pulse-soft">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{heroBadge}</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        </div>

        {/* Recipient Special Title */}
        <div className="mb-4">
          <span className="block text-amber-400 font-semibold tracking-wider text-sm sm:text-base uppercase mb-1">
            عيد ميلاد سعيد يا
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
              {friendName}
            </span>
          </h1>
          {friendNickname && (
            <p className="mt-2 text-rose-300/90 font-medium text-base sm:text-lg">
              ✨ &ldquo;{friendNickname}&rdquo; ✨
            </p>
          )}
        </div>

        {/* Central visual card / photo */}
        <div className="relative my-8 inline-block max-w-[280px] sm:max-w-[340px] group">
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500"></div>
          <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 aspect-square">
            <img
              src={heroImageUrl || "/images/birthday-hero.jpg"}
              alt={friendName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-right">
              <span className="text-xs text-pink-300 font-medium">مُهدى بحب لا ينتهي</span>
              <p className="text-sm font-bold text-white drop-shadow">من: {senderName}</p>
            </div>
          </div>

          {/* Floating decorative badges */}
          <div className="absolute -top-3 -right-3 bg-pink-600 text-white p-2.5 rounded-2xl shadow-lg border border-pink-300/40 animate-float">
            <Cake className="w-5 h-5" />
          </div>
          <div className="absolute -bottom-3 -left-3 bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-lg border border-amber-300/60 animate-float-reverse">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        {/* Main celebratory message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 max-w-2xl mx-auto leading-relaxed">
          {heroTitle}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light mb-8">
          {heroSubtitle}
        </p>

        {/* Interactive CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={triggerConfetti}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition duration-300 border border-white/20"
          >
            <PartyPopper className="w-5 h-5" />
            <span>أطلقي الاحتفال 🎉</span>
          </button>

          <button
            onClick={() => scrollTo("interactive-cake")}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-pink-300 hover:text-white font-semibold text-sm border border-pink-500/30 hover:border-pink-400 backdrop-blur-md shadow-lg transition duration-300"
          >
            <Cake className="w-4 h-4 text-pink-400" />
            <span>اطفئي الشموع 🎂</span>
          </button>

          <button
            onClick={() => scrollTo("surprise-gift")}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 hover:text-white font-semibold text-sm border border-amber-500/30 hover:border-amber-400 backdrop-blur-md shadow-lg transition duration-300"
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span>صندوق المفاجأة 🎁</span>
          </button>

          <button
            onClick={() => scrollTo("love-letter")}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-rose-300 hover:text-white font-semibold text-sm border border-rose-500/30 hover:border-rose-400 backdrop-blur-md shadow-lg transition duration-300"
          >
            <Mail className="w-4 h-4 text-rose-400" />
            <span>رسالتي لكِ 💌</span>
          </button>
        </div>
      </div>
    </section>
  );
}
