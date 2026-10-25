"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Wind, Flame, RotateCcw, Heart } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface InteractiveCakeProps {
  cakeTitle?: string;
  cakeSubtitle?: string;
  cakeWishRevealed?: string;
  candlesCount?: number;
}

export default function InteractiveCake({
  cakeTitle = "تمني أمنية واطفئي الشموع! 🎂",
  cakeSubtitle = "أغمضي عينيكِ، تمني أمنية من أعماق قلبك، ثم اضغطي على الشموع لإطفائها!",
  cakeWishRevealed = "عسى كل أمانيكِ وطموحاتكِ تتحقق، وتكون أيامكِ القادمة سكر وفرح! ✨❤️",
  candlesCount = 3,
}: InteractiveCakeProps) {
  const totalCandles = Math.max(1, Math.min(candlesCount || 3, 7));
  const [litCandles, setLitCandles] = useState<boolean[]>(
    Array.from({ length: totalCandles }).map(() => true)
  );
  const [wishMade, setWishMade] = useState(false);

  // Update lit candles if prop count changes
  React.useEffect(() => {
    setLitCandles(Array.from({ length: totalCandles }).map(() => true));
    setWishMade(false);
  }, [totalCandles]);

  const extinguishCandle = (index: number) => {
    if (!litCandles[index]) return;
    soundManager.playBlowCandle();

    const newLit = [...litCandles];
    newLit[index] = false;
    setLitCandles(newLit);

    // If all are extinguished
    if (newLit.every((c) => !c)) {
      triggerWishFulfilled();
    }
  };

  const blowAllCandles = () => {
    soundManager.playBlowCandle();
    setLitCandles(Array.from({ length: totalCandles }).map(() => false));
    triggerWishFulfilled();
  };

  const triggerWishFulfilled = () => {
    setWishMade(true);
    soundManager.playCelebrationFanfare();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#f43f5e", "#ec4899", "#fbbf24", "#e879f9", "#ffffff"],
    });
  };

  const relightCandles = () => {
    soundManager.playPop();
    setLitCandles(Array.from({ length: totalCandles }).map(() => true));
    setWishMade(false);
  };

  const allExtinguished = litCandles.every((c) => !c);

  return (
    <section id="interactive-cake" className="py-20 px-4 relative z-10 max-w-4xl mx-auto">
      <div className="bg-gradient-to-b from-slate-900/90 to-pink-950/40 border border-pink-500/30 rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>لحظة الأمنية المميزة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            {cakeTitle}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {cakeSubtitle}
          </p>
        </div>

        {/* 3D-styled Interactive Cake Visual */}
        <div className="relative my-8 flex flex-col items-center justify-center min-h-[220px]">
          {/* Candles Row */}
          <div className="flex items-end justify-center gap-4 sm:gap-6 z-20 mb-[-6px]">
            {litCandles.map((isLit, i) => (
              <div
                key={i}
                onClick={() => extinguishCandle(i)}
                className="group cursor-pointer flex flex-col items-center select-none"
                title={isLit ? "اضغطي لإطفاء الشمعة" : "شمعة مطفأة"}
              >
                {/* Flame or smoke */}
                <div className="h-9 flex items-center justify-center">
                  {isLit ? (
                    <div className="relative animate-flame">
                      {/* Inner bright yellow */}
                      <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_#f59e0b] group-hover:scale-125 transition-transform" />
                      {/* Candle glow halo */}
                      <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-sm" />
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs font-mono animate-fade-in flex flex-col items-center">
                      <span className="text-[10px] opacity-60">💨</span>
                      <span className="w-1 h-3 bg-slate-600 rounded-full mt-1"></span>
                    </div>
                  )}
                </div>

                {/* Candle Stick */}
                <div
                  className={`w-4 sm:w-5 h-16 sm:h-20 rounded-t-md shadow-md border-x border-t transition-colors ${
                    i % 2 === 0
                      ? "bg-gradient-to-b from-pink-300 to-rose-400 border-pink-200"
                      : "bg-gradient-to-b from-amber-200 to-yellow-400 border-amber-100"
                  }`}
                >
                  {/* Candle stripes pattern */}
                  <div className="w-full h-full opacity-30 flex flex-col justify-around py-1">
                    <div className="w-full h-1 bg-white" />
                    <div className="w-full h-1 bg-white" />
                    <div className="w-full h-1 bg-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Layer of Cake */}
          <div className="w-56 sm:w-72 h-14 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 rounded-t-3xl border-b-4 border-rose-300 shadow-md relative z-10 flex items-center justify-around px-4">
            {/* Frosting drips */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-around">
              <span className="w-5 h-4 bg-pink-100 rounded-b-full"></span>
              <span className="w-6 h-5 bg-pink-100 rounded-b-full"></span>
              <span className="w-5 h-4 bg-pink-100 rounded-b-full"></span>
              <span className="w-7 h-6 bg-pink-100 rounded-b-full"></span>
              <span className="w-5 h-4 bg-pink-100 rounded-b-full"></span>
            </div>
            {/* Berries / Cherries */}
            <span className="text-sm">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-sm">🍓</span>
            <span className="text-xs">✨</span>
            <span className="text-sm">🍓</span>
          </div>

          {/* Middle / Bottom Layer of Cake */}
          <div className="w-72 sm:w-96 h-20 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 rounded-b-2xl border-t-2 border-rose-300 shadow-xl relative flex items-center justify-center">
            <span className="font-kufi text-xs sm:text-sm font-bold text-white drop-shadow tracking-wider px-3 py-1 bg-pink-600/60 rounded-full border border-pink-300/40">
              سنة حلوة يا قمر 💖
            </span>
          </div>

          {/* Golden Cake Stand */}
          <div className="w-80 sm:w-[420px] h-3 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 rounded-full shadow-lg mt-1" />
          <div className="w-28 sm:w-36 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-b-lg shadow-md" />
        </div>

        {/* Buttons / Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          {!allExtinguished ? (
            <button
              onClick={blowAllCandles}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition duration-300 border border-pink-400/40 hover:scale-105 active:scale-95"
            >
              <Wind className="w-4 h-4" />
              <span>انفخي وأطفئي كل الشموع دفعة واحدة 💨</span>
            </button>
          ) : (
            <button
              onClick={relightCandles}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm shadow-lg border border-amber-500/40 transition duration-300 hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>أعيدي إشعال الشموع 🕯️</span>
            </button>
          )}
        </div>

        {/* Revealed Secret Wish Card */}
        {wishMade && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/80 via-slate-900/90 to-pink-950/80 border-2 border-pink-400/50 shadow-2xl animate-fade-in text-center relative max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-500/20 text-pink-300 mb-3 animate-bounce">
              <Heart className="w-6 h-6 fill-pink-400 text-pink-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-300 mb-2">
              ✨ أمنيتكِ مجابة ومباركة إن شاء الله! ✨
            </h3>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
              {cakeWishRevealed}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
