"use client";

import React, { useState } from "react";
import { Camera, Calendar, MapPin, X, ZoomIn, Heart } from "lucide-react";
import type { MemoryItem } from "@/db/schema";
import { soundManager } from "@/lib/sound";

interface MemoriesGalleryProps {
  memories: MemoryItem[];
}

export default function MemoriesGallery({ memories }: MemoriesGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [activePhoto, setActivePhoto] = useState<MemoryItem | null>(null);

  // Extract unique categories
  const categories = ["الكل", ...Array.from(new Set(memories.map((m) => m.category || "ذكريات")))];

  const filteredMemories =
    selectedCategory === "الكل"
      ? memories
      : memories.filter((m) => m.category === selectedCategory);

  const openLightbox = (m: MemoryItem) => {
    soundManager.playPop();
    setActivePhoto(m);
  };

  return (
    <section id="memories-gallery" className="py-20 px-4 relative z-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
          <Camera className="w-3.5 h-3.5 text-pink-400" />
          <span>ألبوم الذكريات التي لا تغيب</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          شريط ذكرياتنا الجميلة 📸
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          كل صورة هنا تحمل حكاية وضحكة ومشاعر صادقة تظل محفورة في القلب
        </p>
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30 scale-105"
                  : "bg-slate-900/80 text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          لا توجد صور في هذا التصنيف بعد.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((m) => (
            <div
              key={m.id}
              onClick={() => openLightbox(m)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/80 border border-pink-500/20 hover:border-pink-500/50 shadow-xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={m.imageUrl}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Category badge */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-pink-600/80 backdrop-blur-md text-[11px] font-bold text-white shadow">
                  {m.category}
                </span>

                {/* Zoom icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                  <span className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <ZoomIn className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Memory Details */}
              <div className="p-5 flex-1 flex flex-col justify-between text-right">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-pink-300 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {m.dateStr}
                    </span>
                    {m.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {m.location}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {m.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 border border-pink-500/30 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo */}
            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {/* Caption */}
            <div className="p-6 text-right">
              <div className="flex items-center justify-between text-xs text-pink-400 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activePhoto.dateStr}
                </span>
                {activePhoto.location && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {activePhoto.location}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{activePhoto.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{activePhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
