import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  secretPin: text("secret_pin").notNull().default("2024"),
  friendName: text("friend_name").notNull().default("سارة الغالية"),
  friendNickname: text("friend_nickname").notNull().default("أميرة قلبي ونجمة أيامي"),
  senderName: text("sender_name").notNull().default("أعز أصدقائك ورفيق دربك"),
  birthdayDate: text("birthday_date").notNull().default("2025-10-25T00:00"),
  heroBadge: text("hero_badge").notNull().default("✨ يوم ميلادكِ ليس كأي يوم... إنه عيد لقلبي"),
  heroTitle: text("hero_title").notNull().default("كل عام وأنتِ أجمل صدفة في حياتي 🎂"),
  heroSubtitle: text("hero_subtitle").notNull().default("في هذا اليوم وُلدت أجمل ابتسامة وأطهر روح، دمتِ لي شمسًا تُنير عتمة الأيام، وكل عام وأنتِ بمليون خير وسعادة لا تنتهي."),
  heroImageUrl: text("hero_image_url").notNull().default("/images/birthday-hero.jpg"),
  themeColor: text("theme_color").notNull().default("rose"), // rose, amber, purple, emerald
  bgMusicUrl: text("bg_music_url").notNull().default("https://actions.google.com/sounds/v1/ambiences/gentle_rain_and_chimes.ogg"),
  musicTitle: text("music_title").notNull().default("لحن الذكريات والمشاعر الهادئة 🎵"),
  musicEnabled: boolean("music_enabled").notNull().default(true),
  countdownTitle: text("countdown_title").notNull().default("العد التنازلي للحظة المنتظرة ⏳"),
  countdownEndMessage: text("countdown_end_message").notNull().default("حان الوقت للاحتفال! اليوم عيدكِ يا أروع من في الكون 🎉💖"),
  cakeTitle: text("cake_title").notNull().default("تمني أمنية واطفئي الشموع! 🎂"),
  cakeSubtitle: text("cake_subtitle").notNull().default("أغمضي عينيكِ، تمني أمنية من أعماق قلبك، ثم اضغطي على الشموع لإطفائها!"),
  cakeWishRevealed: text("cake_wish_revealed").notNull().default("عسى كل أمانيكِ وطموحاتكِ تتحقق، وتكون أيامكِ القادمة سكر وفرح! ✨❤️"),
  candlesCount: integer("candles_count").notNull().default(3),
  letterTitle: text("letter_title").notNull().default("رسالة حب وامتنان من أعماق الوجدان 💌"),
  letterSender: text("letter_sender").notNull().default("محبكِ الأبدي"),
  letterContent: text("letter_content").notNull().default(`إلى أعز وأغلى صديقة...

لا أدري من أين أبدأ كلماتي، فالكلمات تعجز أحياناً عن وصف ما يحمله القلب من تقدير وحب وامتنان لوجودكِ.
منذ أن عرفتكِ، أدركتُ أن في هذا العالم أرواحاً نقية كقطرات الندى، وضحكات تشبه الموسيقى التي تعيد للقلب نبضه.

شكراً لأنكِ كنتِ السند في اللحظات الصعبة، والضحكة في أسعد الأوقات، والكتف الذي لا يميل مهما مالت الحياة.
في يوم ميلادكِ، أدعو الله أن يملأ قلبكِ بالسلام، وعينيكِ بالفرح، وأن يديمكِ في حياتي نعيماً لا ينقطع.

كل عام وأنتِ أجمل هدايا القدر لي، وكل عام وأنتِ بألف ألف خير 🌸❤️`),
  letterDate: text("letter_date").notNull().default("يوم ميلادكِ السعيد"),
  giftTitle: text("gift_title").notNull().default("صندوق المفاجأة الخاصة بكِ 🎁"),
  giftSubtitle: text("gift_subtitle").notNull().default("لقد خبأت لكِ مفاجأة مميزة، اضغطي لفتح الصندوق وفك الشريط الذهبي!"),
  giftRevealTitle: text("gift_reveal_title").notNull().default("هديتي لكِ: قسيمة مفاجأة خاصة لا تُقدّر بثمن! ✨"),
  giftRevealMessage: text("gift_reveal_message").notNull().default("يوم كامل من اختياراتكِ المفضلة + عشاء في مكانكِ المحبوب + هدية تذكارية صُنعت بحب! يمكنكِ استبدال هذه الهدية في أي وقت تشائين."),
  giftRevealCode: text("gift_reveal_code").notNull().default("BIRTHDAY-QUEEN-2025"),
  giftImageUrl: text("gift_image_url").notNull().default("/images/gift-box.jpg"),
  quizTitle: text("quiz_title").notNull().default("رسائل وأمنيات الأصدقاء المقربين 💌"),
  footerText: text("footer_text").notNull().default("صُنِع بكل حب وشغف ليكون ذكرى لا تُنسى في عيد ميلادكِ الأجمل 💕"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memoriesTable = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  dateStr: text("date_str").notNull(),
  category: text("category").notNull().default("لحظات لا تُنسى"),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  location: text("location").default("معاً"),
  orderNum: integer("order_num").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reasonsTable = pgTable("reasons", {
  id: serial("id").primaryKey(),
  orderNum: integer("order_num").notNull().default(0),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Heart"),
  color: text("color").notNull().default("pink"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timelineTable = pgTable("timeline", {
  id: serial("id").primaryKey(),
  orderNum: integer("order_num").notNull().default(0),
  dateOrYear: text("date_or_year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Sparkles"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishesTable = pgTable("wishes", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  relationship: text("relationship").notNull().default("صديق"),
  message: text("message").notNull(),
  likesCount: integer("likes_count").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
export type MemoryItem = typeof memoriesTable.$inferSelect;
export type ReasonItem = typeof reasonsTable.$inferSelect;
export type TimelineItem = typeof timelineTable.$inferSelect;
export type WishItem = typeof wishesTable.$inferSelect;
