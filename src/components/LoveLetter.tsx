"use client";

import React, { useState } from "react";
import { Mail, MailOpen, Heart, Feather, Sparkles } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface LoveLetterProps {
  friendName: string;
  senderName: string;
  letterTitle?: string;
  letterSender?: string;
  letterContent?: string;
  letterDate?: string;
}

export default function LoveLetter({
  friendName,
  senderName,
  letterTitle = "رسالة حب وامتنان من أعماق الوجدان 💌",
  letterSender,
  letterContent,
  letterDate = "يوم ميلادكِ السعيد",
}: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLetter = () => {
    soundManager.playPop();
    setIsOpen(!isOpen);
  };

  return (
    <section id="love-letter" className="py-20 px-4 relative z-10 max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Feather className="w-3.5 h-3.5 text-rose-400" />
          <span>كلمات من القلب إلى القلب</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          {letterTitle}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          رسالة خاصة مخصصة لكِ في يومكِ الفريد
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {!isOpen ? (
          /* Sealed Envelope View */
          <div
            onClick={toggleLetter}
            className="group cursor-pointer bg-gradient-to-b from-rose-950/70 to-slate-900/90 border-2 border-rose-500/30 hover:border-rose-400/80 rounded-3xl p-8 sm:p-12 text-center shadow-2xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-xl relative overflow-hidden"
          >
            {/* Ambient envelope glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Wax seal simulation */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-800 shadow-xl shadow-rose-900/60 border-2 border-amber-300/60 mb-6 group-hover:rotate-6 transition-transform">
              <Heart className="w-10 h-10 text-white fill-white drop-shadow" />
              <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/40" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">
              رسالة سرية موجهة إلى: <span className="text-rose-400">{friendName}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              مختومة بكل المشاعر الصادقة، اضغطي لفض الختم وقراءة الرسالة
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLetter();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform"
            >
              <Mail className="w-4 h-4" />
              <span>افتحي الرسالة الآن 💌</span>
            </button>
          </div>
        ) : (
          /* Unfolded Parchment Letter View */
          <div className="bg-[#fdfaf3] text-stone-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-amber-200/80 relative transition-all duration-700 animate-fade-in font-amiri text-lg leading-loose selection:bg-rose-200 selection:text-stone-900">
            {/* Vintage decorative corners */}
            <div className="absolute top-4 right-4 text-amber-700/40 text-2xl font-serif">❦</div>
            <div className="absolute top-4 left-4 text-amber-700/40 text-2xl font-serif">❧</div>
            <div className="absolute bottom-4 right-4 text-amber-700/40 text-2xl font-serif">❧</div>
            <div className="absolute bottom-4 left-4 text-amber-700/40 text-2xl font-serif">❦</div>

            {/* Letter Header */}
            <div className="border-b border-amber-900/15 pb-4 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-cairo text-stone-500 block">إلى الغالية:</span>
                <span className="text-xl font-bold font-cairo text-rose-800">{friendName}</span>
              </div>
              <div className="text-left text-xs font-cairo text-stone-500">
                <span>{letterDate}</span>
              </div>
            </div>

            {/* Letter Body */}
            <div className="whitespace-pre-line text-stone-800 text-lg sm:text-xl font-normal text-justify my-4">
              {letterContent}
            </div>

            {/* Letter Footer & Sign-off */}
            <div className="mt-8 pt-6 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-cairo text-stone-500 block">المُرسل:</span>
                <span className="text-base font-bold font-cairo text-rose-900">
                  {letterSender || senderName}
                </span>
              </div>

              <button
                onClick={toggleLetter}
                className="font-cairo text-xs font-medium text-stone-500 hover:text-stone-800 px-4 py-2 rounded-xl bg-stone-200/70 hover:bg-stone-300 transition-colors flex items-center gap-1.5"
              >
                <MailOpen className="w-3.5 h-3.5" />
                <span>إعادة طي الرسالة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
