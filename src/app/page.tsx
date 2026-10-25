"use client";

import React, { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Lock,
  Heart,
  Cake,
  Gift,
  Mail,
  Camera,
  MessageSquareHeart,
  Sparkles,
  ArrowUp,
  Settings,
} from "lucide-react";
import type { SiteSettings, MemoryItem, ReasonItem, TimelineItem, WishItem } from "@/db/schema";
import FloatingParticles from "@/components/FloatingParticles";
import AudioPlayerControl from "@/components/AudioPlayerControl";
import HeroSection from "@/components/HeroSection";
import CountdownTimer from "@/components/CountdownTimer";
import InteractiveCake from "@/components/InteractiveCake";
import LoveLetter from "@/components/LoveLetter";
import MemoriesGallery from "@/components/MemoriesGallery";
import ReasonsSection from "@/components/ReasonsSection";
import MilestonesTimeline from "@/components/MilestonesTimeline";
import SurpriseGift from "@/components/SurpriseGift";
import WishWall from "@/components/WishWall";
import AdminModal from "@/components/AdminModal";

export default function BirthdayPage() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [reasons, setReasons] = useState<ReasonItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch full data
  const loadBirthdayData = useCallback(async () => {
    try {
      const res = await fetch("/api/birthday-data", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setSettings(json.data.settings);
        setMemories(json.data.memories || []);
        setReasons(json.data.reasons || []);
        setTimeline(json.data.timeline || []);
        setWishes(json.data.wishes || []);
      }
    } catch (err) {
      console.error("Failed to load birthday data:", err);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadBirthdayData();

    // Scroll listener for back to top
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial soft confetti burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.3 },
      });
    }, 1200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [loadBirthdayData]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const friendName = settings?.friendName || "سارة الغالية";
  const friendNickname = settings?.friendNickname || "أميرة قلبي";
  const senderName = settings?.senderName || "أعز أصدقائك";

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Dreamy Ambient Floating Particles */}
      <FloatingParticles />

      {/* Floating Audio Player */}
      <AudioPlayerControl
        bgMusicUrl={settings?.bgMusicUrl}
        musicTitle={settings?.musicTitle}
        musicEnabled={settings?.musicEnabled ?? true}
      />

      {/* Secret Admin Button (Floating at Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-pink-300 hover:text-white border border-pink-500/40 shadow-xl shadow-slate-950/70 backdrop-blur-md transition-all duration-300 hover:scale-105"
          title="فتح لوحة التحكم السرية (تتطلب رمز سري)"
        >
          <div className="p-1 rounded-full bg-pink-500/20 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold hidden sm:inline">لوحة التحكم السرية 🔐</span>
        </button>
      </div>

      {/* Back to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 left-6 z-40 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-110"
          title="الرجوع للأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Top Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-pink-500/15 py-3 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Title */}
          <div
            onClick={scrollToTop}
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:rotate-12 transition-transform">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              عيد ميلاد {friendName} 🎉
            </span>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection("interactive-cake")}
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <Cake className="w-3.5 h-3.5" />
              <span>الشموع</span>
            </button>
            <button
              onClick={() => scrollToSection("love-letter")}
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>الرسالة</span>
            </button>
            <button
              onClick={() => scrollToSection("surprise-gift")}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>المفاجأة</span>
            </button>
            <button
              onClick={() => scrollToSection("memories-gallery")}
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>الذكريات</span>
            </button>
            <button
              onClick={() => scrollToSection("wish-wall")}
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>التهاني</span>
            </button>
          </nav>

          {/* Admin Control Panel Button in Header */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">لوحة التحكم</span>
            <Lock className="w-3 h-3 text-pink-400" />
          </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10 pt-6">
        {/* Hero Section */}
        <HeroSection
          friendName={friendName}
          friendNickname={friendNickname}
          senderName={senderName}
          heroBadge={settings?.heroBadge || "✨ يوم ميلادكِ ليس كأي يوم... إنه عيد لقلبي"}
          heroTitle={settings?.heroTitle || "كل عام وأنتِ أجمل صدفة في حياتي 🎂"}
          heroSubtitle={
            settings?.heroSubtitle ||
            "في هذا اليوم وُلدت أجمل ابتسامة وأطهر روح، دمتِ لي شمسًا تُنير عتمة الأيام، وكل عام وأنتِ بمليون خير."
          }
          heroImageUrl={settings?.heroImageUrl || "/images/birthday-hero.jpg"}
          themeColor={settings?.themeColor || "rose"}
        />

        {/* Countdown Timer */}
        <CountdownTimer
          birthdayDate={settings?.birthdayDate || "2025-10-25T00:00"}
          countdownTitle={settings?.countdownTitle}
          countdownEndMessage={settings?.countdownEndMessage}
        />

        {/* Interactive Cake with Blowable Candles */}
        <InteractiveCake
          cakeTitle={settings?.cakeTitle}
          cakeSubtitle={settings?.cakeSubtitle}
          cakeWishRevealed={settings?.cakeWishRevealed}
          candlesCount={settings?.candlesCount || 3}
        />

        {/* Heartfelt Love Letter in Wax-Sealed Vintage Envelope */}
        <LoveLetter
          friendName={friendName}
          senderName={senderName}
          letterTitle={settings?.letterTitle}
          letterSender={settings?.letterSender}
          letterContent={settings?.letterContent}
          letterDate={settings?.letterDate}
        />

        {/* Surprise Gift Box Unboxing */}
        <SurpriseGift
          giftTitle={settings?.giftTitle}
          giftSubtitle={settings?.giftSubtitle}
          giftRevealTitle={settings?.giftRevealTitle}
          giftRevealMessage={settings?.giftRevealMessage}
          giftRevealCode={settings?.giftRevealCode}
          giftImageUrl={settings?.giftImageUrl}
        />

        {/* Photo Gallery & Memories */}
        <MemoriesGallery memories={memories} />

        {/* Reasons Why You Are Special Cards */}
        <ReasonsSection friendName={friendName} reasons={reasons} />

        {/* Timeline of Milestones */}
        <MilestonesTimeline timeline={timeline} />

        {/* Wish Wall & Guestbook */}
        <WishWall
          friendName={friendName}
          wishes={wishes}
          onWishAdded={loadBirthdayData}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-12 px-4 text-center mt-20">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-pink-400">
            <Heart className="w-5 h-5 fill-pink-500 animate-pulse-soft" />
            <span className="font-bold text-sm sm:text-base">
              عيد ميلاد سعيد يا {friendName}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {settings?.footerText ||
              "صُنِع بكل حب وشغف ليكون ذكرى لا تُنسى في عيد ميلادكِ الأجمل 💕"}
          </p>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>مُهدى من: <strong className="text-slate-300">{senderName}</strong></span>
            <span>•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-pink-400/80 hover:text-pink-300 underline flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>لوحة التحكم وتعديل الموقع</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Control Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataUpdated={loadBirthdayData}
      />
    </div>
  );
}
