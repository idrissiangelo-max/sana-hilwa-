"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Gift, Sparkles, Copy, Check, RotateCcw, Award } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface SurpriseGiftProps {
  giftTitle?: string;
  giftSubtitle?: string;
  giftRevealTitle?: string;
  giftRevealMessage?: string;
  giftRevealCode?: string;
  giftImageUrl?: string;
}

export default function SurpriseGift({
  giftTitle = "صندوق المفاجأة الخاصة بكِ 🎁",
  giftSubtitle = "لقد خبأت لكِ مفاجأة مميزة، اضغطي لفتح الصندوق وفك الشريط الذهبي!",
  giftRevealTitle = "هديتي لكِ: باقة لحظات استثنائية وقسيمة دلال لا تنتهي! ✨",
  giftRevealMessage = "يوم كامل من اختياراتكِ المفضلة + عشاء فاخر في مطعمكِ المفضل + رحلة تسوق خاصة + هدية تذكارية صُنعت بحب!",
  giftRevealCode = "SARAH-QUEEN-2025",
  giftImageUrl = "/images/gift-box.jpg",
}: SurpriseGiftProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openGift = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundManager.playCelebrationFanfare();

    confetti({
      particleCount: 160,
      spread: 110,
      origin: { y: 0.65 },
      colors: ["#fbbf24", "#f43f5e", "#ec4899", "#8b5cf6", "#10b981"],
    });
  };

  const recloseGift = () => {
    soundManager.playPop();
    setIsOpen(false);
  };

  const copyCode = () => {
    if (!giftRevealCode) return;
    navigator.clipboard.writeText(giftRevealCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="surprise-gift" className="py-20 px-4 relative z-10 max-w-4xl mx-auto">
      <div className="bg-gradient-to-b from-amber-950/30 via-slate-900/90 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>مفاجأة خاصة جداً</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
            {giftTitle}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            {giftSubtitle}
          </p>
        </div>

        {/* Gift Box Unopened or Opened */}
        {!isOpen ? (
          <div className="my-10 flex flex-col items-center">
            <div
              onClick={openGift}
              className="group cursor-pointer relative transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* Glowing Halo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/40 via-rose-500/30 to-pink-500/40 rounded-3xl blur-2xl group-hover:opacity-100 opacity-60 transition duration-500 animate-pulse-soft" />

              {/* 3D Box Illustration */}
              <div className="relative w-48 sm:w-60 h-48 sm:h-60 rounded-3xl bg-gradient-to-tr from-pink-700 via-rose-600 to-pink-500 border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Golden Ribbon Cross */}
                <div className="absolute inset-y-0 w-8 sm:w-10 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
                <div className="absolute inset-x-0 h-8 sm:h-10 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-md" />

                {/* Satin Bow on Top */}
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-xl border-2 border-amber-100 group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-8 h-8 text-amber-950 animate-sparkle" />
                </div>
              </div>

              {/* Tap hint button */}
              <div className="mt-6">
                <button
                  onClick={openGift}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 group-hover:shadow-amber-500/40 group-hover:scale-105 transition duration-300 flex items-center gap-2 mx-auto"
                >
                  <Gift className="w-4 h-4 text-slate-950" />
                  <span>انقري لفك الشريط واكتشاف الهدية! ✨</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Gift Revealed Card */
          <div className="my-6 max-w-2xl mx-auto bg-slate-950/80 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-fade-in relative">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/20 text-amber-300 mb-4 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-amber-300 mb-3">
              {giftRevealTitle}
            </h3>

            {/* Gift image if available */}
            {giftImageUrl && (
              <div className="my-4 max-w-md mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-lg aspect-video">
                <img
                  src={giftImageUrl}
                  alt="هدية عيد الميلاد"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed my-4 max-w-lg mx-auto">
              {giftRevealMessage}
            </p>

            {/* Gift Secret Code / Voucher */}
            {giftRevealCode && (
              <div className="my-6 p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md mx-auto">
                <div className="text-right">
                  <span className="text-[11px] text-amber-400 font-bold block">رمز القسيمة التذكارية:</span>
                  <span className="text-lg font-mono font-black text-white tracking-wider">
                    {giftRevealCode}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ الرمز</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              onClick={recloseGift}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تغليف الهدية</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
