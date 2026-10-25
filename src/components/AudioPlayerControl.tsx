"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface AudioPlayerControlProps {
  bgMusicUrl?: string;
  musicTitle?: string;
  musicEnabled?: boolean;
}

export default function AudioPlayerControl({
  bgMusicUrl,
  musicTitle = "لحن الذكريات والمشاعر الهادئة 🎵",
  musicEnabled = true,
}: AudioPlayerControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useSynthesizer, setUseSynthesizer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // If music is disabled in settings, stop
    if (!musicEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      soundManager.stopGentleAmbience();
      setIsPlaying(false);
    }
  }, [musicEnabled]);

  const toggleMusic = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      soundManager.stopGentleAmbience();
      setIsPlaying(false);
    } else {
      if (bgMusicUrl && !useSynthesizer) {
        if (!audioRef.current) {
          audioRef.current = new Audio(bgMusicUrl);
          audioRef.current.loop = true;
          audioRef.current.volume = 0.4;
          audioRef.current.addEventListener("error", () => {
            // Fallback to synthesizer if audio url fails
            setUseSynthesizer(true);
            soundManager.startGentleAmbience();
            setIsPlaying(true);
          });
        }
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked or URL blocked -> fallback to internal synth
            setUseSynthesizer(true);
            soundManager.startGentleAmbience();
            setIsPlaying(true);
          });
      } else {
        soundManager.startGentleAmbience();
        setIsPlaying(true);
      }
    }
  };

  if (!musicEnabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleMusic}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl backdrop-blur-md transition-all duration-300 border ${
          isPlaying
            ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400 shadow-pink-500/25 scale-105"
            : "bg-slate-900/80 text-pink-300 border-pink-500/30 hover:border-pink-400 shadow-slate-950/60"
        }`}
        title={isPlaying ? "إيقاف الموسيقى مؤقتاً" : "تشغيل الموسيقى الاحتفالية الهادئة"}
      >
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <>
              <span className="absolute -inset-1 rounded-full bg-pink-400/40 animate-ping opacity-75"></span>
              <Volume2 className="w-5 h-5 relative z-10" />
            </>
          ) : (
            <VolumeX className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          )}
        </div>
        <div className="text-right text-xs font-medium max-w-[130px] truncate hidden sm:block">
          <span className="block font-bold">{isPlaying ? "الموسيقى تعمل" : "تشغيل الموسيقى"}</span>
          <span className="text-[10px] opacity-80 truncate block">{musicTitle}</span>
        </div>
      </button>
    </div>
  );
}
