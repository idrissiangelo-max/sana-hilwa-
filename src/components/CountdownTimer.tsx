"use client";

import React, { useState, useEffect } from "react";
import { Clock, Sparkles } from "lucide-react";

interface CountdownTimerProps {
  birthdayDate: string;
  countdownTitle?: string;
  countdownEndMessage?: string;
}

export default function CountdownTimer({
  birthdayDate,
  countdownTitle = "العد التنازلي للحظة المنتظرة ⏳",
  countdownEndMessage = "حان الوقت للاحتفال! اليوم عيدكِ يا أروع من في الكون 🎉💖",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(birthdayDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (isNaN(target)) {
        return;
      }

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate]);

  return (
    <section className="py-12 px-4 relative z-10 max-w-4xl mx-auto">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-pink-400 text-xs sm:text-sm font-semibold mb-2">
          <Clock className="w-4 h-4 text-pink-400" />
          <span>{countdownTitle}</span>
        </div>

        {timeLeft.isPast ? (
          <div className="py-6 px-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-500/20 text-pink-400 mb-3 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              {countdownEndMessage}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto mt-4">
            {[
              { label: "أيام", value: timeLeft.days },
              { label: "ساعات", value: timeLeft.hours },
              { label: "دقائق", value: timeLeft.minutes },
              { label: "ثوانٍ", value: timeLeft.seconds },
            ].map((unit, i) => (
              <div
                key={i}
                className="bg-slate-950/70 border border-pink-500/25 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                <span className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200 font-mono">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[11px] sm:text-xs text-pink-300/80 font-medium mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
