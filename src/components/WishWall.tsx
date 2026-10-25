"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { MessageSquareHeart, Heart, Send, CheckCircle2 } from "lucide-react";
import type { WishItem } from "@/db/schema";
import { soundManager } from "@/lib/sound";

interface WishWallProps {
  friendName: string;
  wishes: WishItem[];
  onWishAdded?: () => void;
}

export default function WishWall({ friendName, wishes, onWishAdded }: WishWallProps) {
  const [authorName, setAuthorName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [localWishes, setLocalWishes] = useState<WishItem[]>(wishes);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  // Sync props
  React.useEffect(() => {
    setLocalWishes(wishes);
  }, [wishes]);

  const handleLike = async (wishId: number) => {
    if (likedIds.includes(wishId)) return;
    soundManager.playPop();

    setLikedIds((prev) => [...prev, wishId]);
    setLocalWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likesCount: (w.likesCount || 0) + 1 } : w))
    );

    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", wishId }),
      });
    } catch (e) {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          authorName,
          relationship: relationship || "صديق عزيز",
          message,
        }),
      });

      const data = await res.json();
      if (data.success && data.wish) {
        soundManager.playCelebrationFanfare();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });

        setLocalWishes((prev) => [data.wish, ...prev]);
        setAuthorName("");
        setRelationship("");
        setMessage("");
        setSuccessMsg("تم إرسال تهنئتكِ الرائعة بنجاح! شكراً لكِ 💖");
        setTimeout(() => setSuccessMsg(""), 5000);
        if (onWishAdded) onWishAdded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wish-wall" className="py-20 px-4 relative z-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-3">
          <MessageSquareHeart className="w-3.5 h-3.5 text-pink-400" />
          <span>كلمات المحبة والأمنيات</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          جدار التهاني لـ {friendName} 💌
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          شاركي في رسم الابتسامة بكلمة طيبة ودعوة من القلب
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Submit a Wish Form */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-pink-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <span>اكتبي تهنئتكِ الخاصة</span>
            <span className="text-pink-400">✨</span>
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            اتركي بصمتكِ وكلماتكِ لتسعد بها في هذا اليوم المميز
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 text-right">
                اسمكِ أو لقبكِ *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                placeholder="مثال: ريم، أختك المحبة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-pink-500 focus:outline-none text-sm text-white text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 text-right">
                صلة الصداقة / القرابة
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="مثال: صديقة الروح، رفيقة الدرب..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-pink-500 focus:outline-none text-sm text-white text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 text-right">
                رسالة التهنئة والأمنية *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="اكتبي أجمل ما يفيض به قلبكِ لها اليوم..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-pink-500 focus:outline-none text-sm text-white text-right resize-none"
              />
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "جارٍ الإرسال..." : "إرسال التهنئة الآن 💖"}</span>
            </button>
          </form>
        </div>

        {/* Right: Wishes List */}
        <div className="lg:col-span-2 space-y-4">
          {localWishes.length === 0 ? (
            <div className="bg-slate-900/50 rounded-2xl p-8 text-center text-slate-400 text-sm border border-dashed border-slate-700">
              كن أول من يكتب تهنئة ويهدي كلمات طيبة لصاحبة العيد!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localWishes.map((w) => {
                const isLiked = likedIds.includes(w.id);
                return (
                  <div
                    key={w.id}
                    className="bg-slate-900/70 border border-pink-500/20 hover:border-pink-500/40 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col justify-between transition duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-right">
                          <span className="font-bold text-white text-sm block">
                            {w.authorName}
                          </span>
                          <span className="text-[11px] text-pink-300/80">
                            {w.relationship || "صديق"}
                          </span>
                        </div>
                        <span className="text-xs">🌸</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed my-3 whitespace-pre-line text-right">
                        &ldquo;{w.message}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {w.createdAt ? new Date(w.createdAt).toLocaleDateString("ar-EG") : "اليوم"}
                      </span>

                      <button
                        onClick={() => handleLike(w.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all ${
                          isLiked
                            ? "bg-rose-500/20 text-rose-400 font-bold"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isLiked ? "fill-rose-500 text-rose-500 scale-125" : ""
                          }`}
                        />
                        <span>{w.likesCount || 0}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
