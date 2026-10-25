"use client";

import React from "react";
import {
  Heart,
  Smile,
  Shield,
  Sparkles,
  Star,
  MessageCircle,
  Sun,
  Coffee,
  Crown,
  Flame,
} from "lucide-react";
import type { ReasonItem } from "@/db/schema";

interface ReasonsSectionProps {
  friendName: string;
  reasons: ReasonItem[];
}

// Icon helper
function getIcon(name: string) {
  switch (name?.toLowerCase()) {
    case "smile":
      return <Smile className="w-6 h-6" />;
    case "shield":
      return <Shield className="w-6 h-6" />;
    case "sparkles":
      return <Sparkles className="w-6 h-6" />;
    case "star":
      return <Star className="w-6 h-6" />;
    case "messagecircle":
      return <MessageCircle className="w-6 h-6" />;
    case "sun":
      return <Sun className="w-6 h-6" />;
    case "coffee":
      return <Coffee className="w-6 h-6" />;
    case "crown":
      return <Crown className="w-6 h-6" />;
    case "flame":
      return <Flame className="w-6 h-6" />;
    default:
      return <Heart className="w-6 h-6" />;
  }
}

export default function ReasonsSection({ friendName, reasons }: ReasonsSectionProps) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <section id="reasons-section" className="py-20 px-4 relative z-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
          <Star className="w-3.5 h-3.5 text-amber-300" />
          <span>صفات لا تتكرر في العمر</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          لماذا أنتِ استثنائية يا {friendName}؟ ✨
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          أسباب لا حصر لها تجعل وجودكِ في حياتي أعظم نعمة وهدية
        </p>
      </div>

      {/* Grid of Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((r, idx) => (
          <div
            key={r.id}
            className="group relative rounded-3xl bg-slate-900/70 border border-pink-500/20 hover:border-pink-500/60 p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
          >
            {/* Top accent badge & icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-400 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                  {getIcon(r.iconName)}
                </div>
                <span className="text-2xl font-mono font-black text-pink-500/30 group-hover:text-pink-400 transition-colors">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                {r.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {r.description}
              </p>
            </div>

            {/* Bottom mini decorative bar */}
            <div className="w-12 h-1 bg-pink-500/30 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-amber-400 rounded-full transition-all duration-500 mt-6" />
          </div>
        ))}
      </div>
    </section>
  );
}
