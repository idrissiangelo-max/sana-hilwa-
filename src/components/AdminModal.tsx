"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  Settings,
  Image as ImageIcon,
  Heart,
  Gift,
  Cake,
  Mail,
  Clock,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Sliders,
  Sparkles,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import type { SiteSettings, MemoryItem, ReasonItem, TimelineItem, WishItem } from "@/db/schema";
import { soundManager } from "@/lib/sound";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export default function AdminModal({ isOpen, onClose, onDataUpdated }: AdminModalProps) {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "cake_letter" | "gift" | "memories" | "reasons" | "timeline" | "wishes" | "reset"
  >("general");

  // Admin Data
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [reasons, setReasons] = useState<ReasonItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sub-forms states
  const [editingMemory, setEditingMemory] = useState<Partial<MemoryItem> | null>(null);
  const [editingReason, setEditingReason] = useState<Partial<ReasonItem> | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Partial<TimelineItem> | null>(null);

  // Try auto-login if pin is already saved in session
  useEffect(() => {
    const savedPin = sessionStorage.getItem("birthday_admin_pin");
    if (savedPin && !isAuthenticated) {
      setPin(savedPin);
      verifyPin(savedPin);
    }
  }, [isOpen]);

  const verifyPin = async (pinToTest?: string) => {
    const code = pinToTest || pin;
    if (!code) {
      setAuthError("الرجاء إدخال الرمز السري");
      return;
    }

    setLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("birthday_admin_pin", code);
        setSettings(data.data.settings);
        setMemories(data.data.memories || []);
        setReasons(data.data.reasons || []);
        setTimeline(data.data.timeline || []);
        setWishes(data.data.wishes || []);
      } else {
        setAuthError(data.error || "الرمز السري غير صحيح");
      }
    } catch (err) {
      setAuthError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          settings,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: "تم حفظ التعديلات بنجاح وستظهر مباشرة على الموقع!" });
        // If pin changed, update local pin & storage
        if (settings.secretPin) {
          setPin(settings.secretPin);
          sessionStorage.setItem("birthday_admin_pin", settings.secretPin);
        }
        onDataUpdated();
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ type: "error", text: data.error || "فشل حفظ التعديلات" });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "خطأ في الشبكة أو الخادم" });
    } finally {
      setLoading(false);
    }
  };

  // Memory CRUD
  const handleSaveMemory = async () => {
    if (!editingMemory || !editingMemory.title || !editingMemory.imageUrl) {
      alert("العنوان ورابط الصورة مطلوبان");
      return;
    }
    setLoading(true);
    try {
      const isNew = !editingMemory.id;
      const res = await fetch("/api/admin/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          action: isNew ? "create" : "update",
          id: editingMemory.id,
          data: editingMemory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh list
        const refRes = await fetch("/api/admin/memories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin, action: "list" }),
        });
        const refData = await refRes.json();
        setMemories(refData.data || []);
        setEditingMemory(null);
        onDataUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة/الذكرى؟")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "delete", id }),
      });
      setMemories((prev) => prev.filter((m) => m.id !== id));
      onDataUpdated();
    } finally {
      setLoading(false);
    }
  };

  // Reasons CRUD
  const handleSaveReason = async () => {
    if (!editingReason || !editingReason.title || !editingReason.description) {
      alert("العنوان والوصف مطلوبان");
      return;
    }
    setLoading(true);
    try {
      const isNew = !editingReason.id;
      await fetch("/api/admin/reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          action: isNew ? "create" : "update",
          id: editingReason.id,
          data: editingReason,
        }),
      });
      const refRes = await fetch("/api/admin/reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "list" }),
      });
      const refData = await refRes.json();
      setReasons(refData.data || []);
      setEditingReason(null);
      onDataUpdated();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReason = async (id: number) => {
    if (!confirm("هل تريد حذف هذا السبب؟")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "delete", id }),
      });
      setReasons((prev) => prev.filter((r) => r.id !== id));
      onDataUpdated();
    } finally {
      setLoading(false);
    }
  };

  // Timeline CRUD
  const handleSaveMilestone = async () => {
    if (!editingMilestone || !editingMilestone.title || !editingMilestone.dateOrYear) {
      alert("العنوان والتاريخ مطلوبان");
      return;
    }
    setLoading(true);
    try {
      const isNew = !editingMilestone.id;
      await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          action: isNew ? "create" : "update",
          id: editingMilestone.id,
          data: editingMilestone,
        }),
      });
      const refRes = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "list" }),
      });
      const refData = await refRes.json();
      setTimeline(refData.data || []);
      setEditingMilestone(null);
      onDataUpdated();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMilestone = async (id: number) => {
    if (!confirm("هل تريد حذف هذه المحطة؟")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "delete", id }),
      });
      setTimeline((prev) => prev.filter((t) => t.id !== id));
      onDataUpdated();
    } finally {
      setLoading(false);
    }
  };

  // Wishes CRUD
  const handleDeleteWish = async (id: number) => {
    if (!confirm("هل تريد حذف هذه التهنئة؟")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, action: "delete", id }),
      });
      setWishes((prev) => prev.filter((w) => w.id !== id));
      onDataUpdated();
    } finally {
      setLoading(false);
    }
  };

  // Reset to rich sample data
  const handleResetDemo = async () => {
    if (
      !confirm(
        "تنبيه هام: هل أنت متأكد من رغبتك في استعادة البيانات والتهاني والذكريات الافتراضية كاملة؟ سيتم استبدال التعديلات بالنسخة النموذجية الجميلة."
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        alert("تمت استعادة البيانات الافتراضية بنجاح!");
        verifyPin(pin);
        onDataUpdated();
      } else {
        alert(data.error || "فشل الاستعادة");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-right">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-pink-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                لوحة التحكم السرية للموقع 🔐
              </h2>
              <p className="text-xs text-slate-400">
                {isAuthenticated
                  ? "تحكم كامل في جميع نصوص وصور وأقسام الموقع"
                  : "يرجى إدخال الرمز السري للوصول إلى لوحة التحكم"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Authenticated: PIN Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto">
            <div className="w-20 h-20 rounded-full bg-pink-500/10 border-2 border-pink-500/40 flex items-center justify-center text-pink-400 mb-6 shadow-xl shadow-pink-500/10">
              <KeyRound className="w-10 h-10 animate-bounce" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 text-center">أدخل الرمز السري</h3>
            <p className="text-xs text-slate-400 mb-6 text-center">
              الرمز السري الافتراضي للموقع هو: <span className="text-pink-400 font-mono font-bold">2024</span>
              <br />
              (يمكنك تغييره لاحقاً من داخل لوحة التحكم)
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                verifyPin();
              }}
              className="w-full space-y-4"
            >
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل الرمز هنا (مثال: 2024)"
                autoFocus
                className="w-full text-center text-xl tracking-widest px-4 py-3.5 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-pink-500 focus:outline-none text-white font-mono"
              />

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition duration-300 disabled:opacity-50"
              >
                {loading ? "جارٍ التحقق..." : "فتح لوحة التحكم 🚀"}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated: Control Panel Tabs */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-950/70 border-b md:border-b-0 md:border-l border-slate-800 p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1.5 flex-shrink-0">
              {[
                { id: "general", label: "الرئيسية والرمز السري", icon: Settings },
                { id: "hero", label: "الواجهة والعد التنازلي", icon: Clock },
                { id: "cake_letter", label: "الكعكة والرسالة", icon: Cake },
                { id: "gift", label: "صندوق المفاجأة", icon: Gift },
                { id: "memories", label: "معرض الصور والذكريات", icon: ImageIcon },
                { id: "reasons", label: "أسباب التميز", icon: Sparkles },
                { id: "timeline", label: "محطات الرحلة", icon: Sliders },
                { id: "wishes", label: "إدارة التهاني", icon: Heart },
                { id: "reset", label: "إعادة ضبط المصنع", icon: RotateCcw },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-right ${
                      active
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/30 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60">
              {/* Feedback Alert */}
              {statusMessage && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm flex items-center gap-2.5 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-300"
                      : "bg-red-950/80 border border-red-500/50 text-red-300"
                  }`}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* TAB 1: General & Secret PIN */}
              {activeTab === "general" && settings && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">الإعدادات العامة والرمز السري</h3>
                    <p className="text-xs text-slate-400">
                      يمكنك هنا تعديل أسماء الأشخاص، تاريخ عيد الميلاد، والرمز السري لهذه اللوحة
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Change PIN */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 sm:col-span-2">
                      <label className="block text-xs font-bold text-amber-300 mb-1">
                        🔑 الرمز السري الجديد للوحة التحكم (احفظه جيداً)
                      </label>
                      <input
                        type="text"
                        value={settings.secretPin || ""}
                        onChange={(e) => setSettings({ ...settings, secretPin: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-sm font-mono text-white"
                        placeholder="مثال: 2025 أو رمز سري مخصص"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        يمكنك تغييره إلى أي رمز أو كلمة مرور ترغب بها.
                      </span>
                    </div>

                    {/* Friend's Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        اسم صديقتك (صاحبة العيد) *
                      </label>
                      <input
                        type="text"
                        value={settings.friendName || ""}
                        onChange={(e) => setSettings({ ...settings, friendName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    {/* Friend's Nickname */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        اللقب / الوصف المحبب
                      </label>
                      <input
                        type="text"
                        value={settings.friendNickname || ""}
                        onChange={(e) => setSettings({ ...settings, friendNickname: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    {/* Sender Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        اسمك (المُهدي / صاحب الموقع)
                      </label>
                      <input
                        type="text"
                        value={settings.senderName || ""}
                        onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    {/* Birthday Date */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        تاريخ وساعة عيد الميلاد (للعد التنازلي)
                      </label>
                      <input
                        type="datetime-local"
                        value={settings.birthdayDate ? settings.birthdayDate.slice(0, 16) : ""}
                        onChange={(e) => setSettings({ ...settings, birthdayDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    {/* Music Title */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        عنوان الموسيقى الاحتفالية
                      </label>
                      <input
                        type="text"
                        value={settings.musicTitle || ""}
                        onChange={(e) => setSettings({ ...settings, musicTitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    {/* Background Music URL */}
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        رابط الموسيقى الخلفية (MP3 أو OGG)
                      </label>
                      <input
                        type="text"
                        value={settings.bgMusicUrl || ""}
                        onChange={(e) => setSettings({ ...settings, bgMusicUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white text-left font-mono"
                      />
                    </div>

                    {/* Footer Text */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        نص التذييل (Footer)
                      </label>
                      <input
                        type="text"
                        value={settings.footerText || ""}
                        onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ الإعدادات العامة</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Hero & Countdown */}
              {activeTab === "hero" && settings && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">الواجهة الرئيسية والعد التنازلي</h3>
                    <p className="text-xs text-slate-400">
                      تعديل النصوص الكبيرة والصورة الرئيسية للواجهة
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        شارة الاحتفال العلوية (Hero Badge)
                      </label>
                      <input
                        type="text"
                        value={settings.heroBadge || ""}
                        onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        العنوان الرئيسي (Hero Title)
                      </label>
                      <input
                        type="text"
                        value={settings.heroTitle || ""}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        الوصف الفرعي المعبر
                      </label>
                      <textarea
                        rows={3}
                        value={settings.heroSubtitle || ""}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        رابط صورة الواجهة (يمكنك استخدام رابط مباشر أو صورة من المعرض)
                      </label>
                      <input
                        type="text"
                        value={settings.heroImageUrl || ""}
                        onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white text-left font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          عنوان قسم العد التنازلي
                        </label>
                        <input
                          type="text"
                          value={settings.countdownTitle || ""}
                          onChange={(e) => setSettings({ ...settings, countdownTitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          رسالة وصول موعد عيد الميلاد
                        </label>
                        <input
                          type="text"
                          value={settings.countdownEndMessage || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, countdownEndMessage: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-pink-500 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ قسم الواجهة</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Cake & Letter */}
              {activeTab === "cake_letter" && settings && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">كعكة الشموع والرسالة الخاصة</h3>
                    <p className="text-xs text-slate-400">
                      تعديل عدد الشموع، أمنية الكعكة عند الإطفاء، ونص الرسالة العاطفية
                    </p>
                  </div>

                  {/* Cake Settings */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-pink-500/20 space-y-4">
                    <h4 className="text-sm font-bold text-pink-300 flex items-center gap-2">
                      <Cake className="w-4 h-4" />
                      <span>إعدادات كعكة عيد الميلاد التفاعلية</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          عنوان الكعكة
                        </label>
                        <input
                          type="text"
                          value={settings.cakeTitle || ""}
                          onChange={(e) => setSettings({ ...settings, cakeTitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-pink-500 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          عدد الشموع على الكعكة (1 إلى 7)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={7}
                          value={settings.candlesCount || 3}
                          onChange={(e) =>
                            setSettings({ ...settings, candlesCount: parseInt(e.target.value) || 3 })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-pink-500 text-sm text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          الأمنية التي تنكشف عند إطفاء جميع الشموع ✨
                        </label>
                        <textarea
                          rows={2}
                          value={settings.cakeWishRevealed || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, cakeWishRevealed: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-pink-500 text-sm text-white resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Love Letter Settings */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-4">
                    <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>إعدادات الرسالة الخاصة والظرف الشمعي</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          عنوان الرسالة
                        </label>
                        <input
                          type="text"
                          value={settings.letterTitle || ""}
                          onChange={(e) => setSettings({ ...settings, letterTitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-500 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          توقيع المُرسل في نهاية الرسالة
                        </label>
                        <input
                          type="text"
                          value={settings.letterSender || ""}
                          onChange={(e) => setSettings({ ...settings, letterSender: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-500 text-sm text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          نص الرسالة الكامل والمؤثر (اكتب ما في قلبك)
                        </label>
                        <textarea
                          rows={6}
                          value={settings.letterContent || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, letterContent: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-500 text-sm text-white leading-relaxed resize-y"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ الكعكة والرسالة</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Gift Box */}
              {activeTab === "gift" && settings && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">صندوق المفاجأة والهدية التذكارية</h3>
                    <p className="text-xs text-slate-400">
                      تعديل تفاصيل الهدية التي تظهر عند فتح الصندوق الذهبي
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          عنوان قسم الصندوق (قبل الفتح)
                        </label>
                        <input
                          type="text"
                          value={settings.giftTitle || ""}
                          onChange={(e) => setSettings({ ...settings, giftTitle: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          عنوان المفاجأة (بعد الفتح)
                        </label>
                        <input
                          type="text"
                          value={settings.giftRevealTitle || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, giftRevealTitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        تفاصيل الهدية أو القسيمة المميزة
                      </label>
                      <textarea
                        rows={3}
                        value={settings.giftRevealMessage || ""}
                        onChange={(e) =>
                          setSettings({ ...settings, giftRevealMessage: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 text-sm text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          رمز القسيمة التذكاري (Gift Code)
                        </label>
                        <input
                          type="text"
                          value={settings.giftRevealCode || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, giftRevealCode: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          رابط صورة الهدية المرفقة
                        </label>
                        <input
                          type="text"
                          value={settings.giftImageUrl || ""}
                          onChange={(e) =>
                            setSettings({ ...settings, giftImageUrl: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 text-sm text-white text-left font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ قسم الهدية</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: Memories Gallery CRUD */}
              {activeTab === "memories" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">معرض الصور والذكريات ({memories.length})</h3>
                      <p className="text-xs text-slate-400">
                        أضف صور ذكرياتكم معاً مع العناوين والتواريخ
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setEditingMemory({
                          title: "",
                          imageUrl: "",
                          dateStr: "لحظة مميزة",
                          category: "ضحكات وعفوية",
                          description: "",
                          location: "معاً",
                          orderNum: memories.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة صورة جديدة</span>
                    </button>
                  </div>

                  {/* Add / Edit Form Modal */}
                  {editingMemory && (
                    <div className="p-5 rounded-2xl bg-slate-950 border-2 border-pink-500/40 space-y-4">
                      <h4 className="text-sm font-bold text-pink-300">
                        {editingMemory.id ? "تعديل الذكرى" : "إضافة ذكرى جديدة"}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">عنوان الصورة *</label>
                          <input
                            type="text"
                            value={editingMemory.title || ""}
                            onChange={(e) =>
                              setEditingMemory({ ...editingMemory, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            رابط الصورة (URL) *
                          </label>
                          <input
                            type="text"
                            value={editingMemory.imageUrl || ""}
                            onChange={(e) =>
                              setEditingMemory({ ...editingMemory, imageUrl: e.target.value })
                            }
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white text-left font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">التاريخ أو المناسبة</label>
                          <input
                            type="text"
                            value={editingMemory.dateStr || ""}
                            onChange={(e) =>
                              setEditingMemory({ ...editingMemory, dateStr: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">التصنيف</label>
                          <input
                            type="text"
                            value={editingMemory.category || ""}
                            onChange={(e) =>
                              setEditingMemory({ ...editingMemory, category: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-slate-300 mb-1">
                            وصف الذكرى وقصتها
                          </label>
                          <textarea
                            rows={2}
                            value={editingMemory.description || ""}
                            onChange={(e) =>
                              setEditingMemory({ ...editingMemory, description: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingMemory(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={handleSaveMemory}
                          className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white shadow"
                        >
                          حفظ الذكرى
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of existing memories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {memories.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={m.imageUrl}
                            alt={m.title}
                            className="w-14 h-14 rounded-xl object-cover border border-white/10"
                          />
                          <div className="text-right">
                            <h5 className="font-bold text-white text-sm truncate max-w-[150px]">
                              {m.title}
                            </h5>
                            <span className="text-[11px] text-pink-400 block">{m.dateStr}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingMemory(m)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="تعديل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMemory(m.id)}
                            className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Reasons */}
              {activeTab === "reasons" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">أسباب التميز ({reasons.length})</h3>
                      <p className="text-xs text-slate-400">
                        البطاقات التي تبرز ما يجعلها شخصاً فريداً ومميزاً في حياتك
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setEditingReason({
                          title: "",
                          description: "",
                          iconName: "Heart",
                          color: "pink",
                          orderNum: reasons.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة ميزة جديدة</span>
                    </button>
                  </div>

                  {editingReason && (
                    <div className="p-5 rounded-2xl bg-slate-950 border-2 border-pink-500/40 space-y-4">
                      <h4 className="text-sm font-bold text-pink-300">
                        {editingReason.id ? "تعديل الميزة" : "إضافة ميزة جديدة"}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">عنوان الميزة *</label>
                          <input
                            type="text"
                            value={editingReason.title || ""}
                            onChange={(e) =>
                              setEditingReason({ ...editingReason, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">الأيقونة</label>
                          <select
                            value={editingReason.iconName || "Heart"}
                            onChange={(e) =>
                              setEditingReason({ ...editingReason, iconName: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          >
                            <option value="Heart">قلب (Heart)</option>
                            <option value="Smile">ابتسامة (Smile)</option>
                            <option value="Sparkles">بريق (Sparkles)</option>
                            <option value="Star">نجمة (Star)</option>
                            <option value="Shield">سند وحماية (Shield)</option>
                            <option value="MessageCircle">أحاديث (Message)</option>
                            <option value="Crown">تاج (Crown)</option>
                            <option value="Coffee">قهوة (Coffee)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-slate-300 mb-1">وصف الميزة *</label>
                          <textarea
                            rows={3}
                            value={editingReason.description || ""}
                            onChange={(e) =>
                              setEditingReason({ ...editingReason, description: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingReason(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={handleSaveReason}
                          className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white shadow"
                        >
                          حفظ الميزة
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reasons.map((r, i) => (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-mono text-pink-400 block mb-1">
                            #{String(i + 1).padStart(2, "0")} • {r.iconName}
                          </span>
                          <h5 className="font-bold text-white text-sm mb-1">{r.title}</h5>
                          <p className="text-xs text-slate-400 line-clamp-2">{r.description}</p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => setEditingReason(r)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReason(r.id)}
                            className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: Timeline */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">محطات الرحلة ({timeline.length})</h3>
                      <p className="text-xs text-slate-400">
                        الخط الزمني للصداقة وأهم المحطات المشتركة
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setEditingMilestone({
                          dateOrYear: "السنة الماضية",
                          title: "",
                          description: "",
                          orderNum: timeline.length + 1,
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة محطة جديدة</span>
                    </button>
                  </div>

                  {editingMilestone && (
                    <div className="p-5 rounded-2xl bg-slate-950 border-2 border-pink-500/40 space-y-4">
                      <h4 className="text-sm font-bold text-pink-300">
                        {editingMilestone.id ? "تعديل المحطة" : "إضافة محطة جديدة"}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            السنة أو المناسبة (مثال: 2022، الصيف الماضي) *
                          </label>
                          <input
                            type="text"
                            value={editingMilestone.dateOrYear || ""}
                            onChange={(e) =>
                              setEditingMilestone({ ...editingMilestone, dateOrYear: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">عنوان المحطة *</label>
                          <input
                            type="text"
                            value={editingMilestone.title || ""}
                            onChange={(e) =>
                              setEditingMilestone({ ...editingMilestone, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs text-slate-300 mb-1">وصف المحطة</label>
                          <textarea
                            rows={3}
                            value={editingMilestone.description || ""}
                            onChange={(e) =>
                              setEditingMilestone({ ...editingMilestone, description: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingMilestone(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={handleSaveMilestone}
                          className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white shadow"
                        >
                          حفظ المحطة
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {timeline.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-bold text-amber-400 block mb-1">
                            {t.dateOrYear}
                          </span>
                          <h5 className="font-bold text-white text-sm mb-1">{t.title}</h5>
                          <p className="text-xs text-slate-400">{t.description}</p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => setEditingMilestone(t)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(t.id)}
                            className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: Wishes Moderation */}
              {activeTab === "wishes" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">إدارة تهاني الزوار والأصدقاء ({wishes.length})</h3>
                    <p className="text-xs text-slate-400">
                      يمكنك حذف أي تهنئة غير مرغوبة أو مراجعة الرسائل المتروكة
                    </p>
                  </div>

                  <div className="space-y-3">
                    {wishes.map((w) => (
                      <div
                        key={w.id}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-sm">{w.authorName}</span>
                            <span className="text-xs text-pink-400">({w.relationship})</span>
                            <span className="text-[10px] text-slate-500">
                              ❤️ {w.likesCount || 0} إعجاب
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                            {w.message}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteWish(w.id)}
                          className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400"
                          title="حذف التهنئة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: Reset Demo */}
              {activeTab === "reset" && (
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center max-w-xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <RotateCcw className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-bold text-white">إعادة تعيين البيانات النموذجية</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    إذا أردت استعادة كافة البيانات النموذجية الجميلة (الصور المختارة، الذكريات، الرسائل، والنصوص الرومانسية الغنية) كما تم تصميمها في أول مرة، يمكنك الضغط على الزر أدناه.
                  </p>

                  <button
                    onClick={handleResetDemo}
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-600/30 transition-transform active:scale-95"
                  >
                    {loading ? "جارٍ الاستعادة..." : "استعادة البيانات النموذجية الآن 🔄"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
