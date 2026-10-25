"use client";

import React from "react";
import { Compass, Sparkles, HeartHandshake, Cake, Milestone } from "lucide-react";
import type { TimelineItem } from "@/db/schema";

interface MilestonesTimelineProps {
  timeline: TimelineItem[];
}

export default function MilestonesTimeline({ timeline }: MilestonesTimelineProps) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <section id="milestones-timeline" className="py-20 px-4 relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
          <Milestone className="w-3.5 h-3.5 text-amber-400" />
          <span>حكايتنا عبر الأيام</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          محطات رحلتنا معاً 🛤️
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          أهم اللحظات التي صنعت هذه الصداقة الاستثنائية
        </p>
      </div>

      {/* Timeline items */}
      <div className="relative border-r-2 border-pink-500/30 pr-6 sm:pr-8 mr-4 sm:mr-8 space-y-10">
        {timeline.map((item, idx) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot with pulsing ring */}
            <div className="absolute -right-[31px] sm:-right-[39px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-pink-500 flex items-center justify-center group-hover:bg-pink-500 transition-colors">
              <span className="w-2 h-2 rounded-full bg-amber-300 group-hover:bg-white animate-ping" />
            </div>

            {/* Content card */}
            <div className="bg-slate-900/70 border border-pink-500/20 hover:border-pink-500/50 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:translate-x-[-4px]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 text-xs font-bold mb-2">
                <span>{item.dateOrYear}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
