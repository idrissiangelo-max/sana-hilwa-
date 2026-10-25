import { db } from "@/db";
import { siteSettingsTable, memoriesTable, reasonsTable, timelineTable, wishesTable } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function ensureInitialData() {
  try {
    // Check if site settings exist
    const settings = await db.select().from(siteSettingsTable).limit(1);
    if (settings.length === 0) {
      await db.insert(siteSettingsTable).values({
        secretPin: "2024",
        friendName: "سارة الغالية",
        friendNickname: "أميرة قلبي ونجمة أيامي",
        senderName: "أعز أصدقائك ورفيق دربك",
        birthdayDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 16),
        heroBadge: "✨ اليوم يوم استثنائي وغير عادي في التاريخ",
        heroTitle: "كل عام وأنتِ أجمل صدفة في حياتي 🎂",
        heroSubtitle: "في هذا اليوم وُلدت أجمل ابتسامة وأطهر روح، دمتِ لي شمسًا تُنير عتمة الأيام، وكل عام وأنتِ بمليون خير وسعادة لا تنتهي.",
        heroImageUrl: "/images/birthday-hero.jpg",
        themeColor: "rose",
        bgMusicUrl: "https://actions.google.com/sounds/v1/ambiences/gentle_rain_and_chimes.ogg",
        musicTitle: "لحن الذكريات والمشاعر الهادئة 🎵",
        musicEnabled: true,
        countdownTitle: "العد التنازلي للحظة المنتظرة ⏳",
        countdownEndMessage: "حان الوقت للاحتفال! اليوم عيدكِ يا أروع من في الكون 🎉💖",
        cakeTitle: "تمني أمنية واطفئي الشموع! 🎂",
        cakeSubtitle: "أغمضي عينيكِ، تمني أمنية من أعماق قلبك، ثم اضغطي على الشموع لإطفائها!",
        cakeWishRevealed: "عسى كل أمانيكِ وطموحاتكِ تتحقق، وتكون أيامكِ القادمة سكر وفرح وسعادة أبدية! ✨❤️",
        candlesCount: 3,
        letterTitle: "رسالة حب وامتنان من أعماق الوجدان 💌",
        letterSender: "محبكِ الأبدي ورفيقك المخلص",
        letterContent: `إلى أعز وأغلى إنسانة في حياتي...

لا أدري من أين أبدأ كلماتي، فالكلمات تعجز أحياناً عن وصف ما يحمله القلب من تقدير وحب وامتنان لوجودكِ النادر.
منذ أن عرفتكِ، أدركتُ أن في هذا العالم أرواحاً نقية كقطرات الندى، وضحكات تشبه الموسيقى التي تعيد للقلب نبضه وهدوءه.

شكراً لأنكِ كنتِ السند الدائم في اللحظات الصعبة، والضحكة العفوية في أسعد الأوقات، والكتف الذي لا يميل مهما مالت الحياة بنا.
في هذا اليوم الأجمل من كل الأيام، يوم ميلادكِ السعيد، أدعو الله أن يملأ قلبكِ بالسكينة والسلام، وعينيكِ بالفرح والبريق، وأن يديمكِ في حياتي نعيماً لا ينقطع.

كل عام وأنتِ الأقرب لقلبي، وكل عام وأنتِ بألف ألف خير وفرح 🌸❤️`,
        letterDate: "يوم ميلادكِ السعيد",
        giftTitle: "صندوق المفاجأة الخاصة بكِ 🎁",
        giftSubtitle: "لقد خبأت لكِ مفاجأة مميزة من القلب، اضغطي لفتح الصندوق وفك الشريط الذهبي!",
        giftRevealTitle: "هديتي لكِ: باقة لحظات استثنائية وقسيمة دلال لا تنتهي! ✨",
        giftRevealMessage: "يوم كامل من اختياراتكِ المفضلة + عشاء فاخر في مطعمكِ المفضل + رحلة تسوق خاصة + هدية تذكارية صُنعت بحب! يمكنكِ استبدال هذه القسيمة في أي وقت تشائين دون شروط مسبقة.",
        giftRevealCode: "SARAH-QUEEN-2025",
        giftImageUrl: "/images/gift-box.jpg",
        quizTitle: "رسائل وأمنيات الأصدقاء المقربين 💌",
        footerText: "صُنِع بكل حب وشغف ليكون ذكرى لا تُنسى في عيد ميلادكِ الأجمل 💕",
      });
    }

    // Check memories
    const mems = await db.select().from(memoriesTable).limit(1);
    if (mems.length === 0) {
      await db.insert(memoriesTable).values([
        {
          title: "أول ضحكة من القلب",
          dateStr: "14 مايو",
          category: "ضحكات وعفوية",
          imageUrl: "https://images.pexels.com/photos/13871784/pexels-photo-13871784.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          description: "أتذكرين هذا اليوم عندما ضحكنا دون سبب حتى دمعت أعيننا؟ تلك اللحظة عرفتُ أنكِ روح لا تتكرر في العمر.",
          location: "الحديقة الهادئة",
          orderNum: 1,
        },
        {
          title: "غروب الشمس وسوالف العمر",
          dateStr: "22 يوليو",
          category: "لحظات دافئة",
          imageUrl: "https://images.pexels.com/photos/33225974/pexels-photo-33225974.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          description: "جلسنا نراقب غروب الشمس ونتحدث عن أحلامنا الصغيرة وطموحاتنا التي ستتحقق بإذن الله.",
          location: "شاطئ البحر",
          orderNum: 2,
        },
        {
          title: "يوم الاحتفال بالإنجاز",
          dateStr: "3 سبتمبر",
          category: "فخر ونجاح",
          imageUrl: "https://images.pexels.com/photos/39462471/pexels-photo-39462471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          description: "فرحتي بنجاحكِ كانت أكبر من أي فرحة، لأنكِ تستحقين كل القمم وكل التقدير في هذا الكون.",
          location: "يوم الإنجاز",
          orderNum: 3,
        },
        {
          title: "كوب القهوة والأحاديث العميقة",
          dateStr: "10 نوفمبر",
          category: "أحاديث القلب",
          imageUrl: "https://images.pexels.com/photos/37543298/pexels-photo-37543298.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          description: "حين تصبح القهوة مجرد حجة لنلتقي ونسمع تفاصيل اليوم وأسرار القلب دون قيود.",
          location: "المقهى المفضل",
          orderNum: 4,
        },
        {
          title: "كعكة المفاجأة الأولى",
          dateStr: "العام الماضي",
          category: "احتفالات سابقة",
          imageUrl: "https://images.pexels.com/photos/9405269/pexels-photo-9405269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          description: "نظرة الدهشة والابتسامة الساحرة في عينيكِ عندما رأيتِ الكعكة والشموع كانت أجمل مكافأة.",
          location: "جلسة الأصدقاء",
          orderNum: 5,
        },
        {
          title: "صندوق الذكريات والهدايا",
          dateStr: "أجمل الأيام",
          category: "ذكريات باقية",
          imageUrl: "https://images.pexels.com/photos/28855250/pexels-photo-28855250.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          description: "كل هدية وكل كلمة وكل رسالة احتفظتُ بها لأنها تذكرني دائماً بمدى تميز وجودك في حياتي.",
          location: "أرشيف المحبة",
          orderNum: 6,
        },
      ]);
    }

    // Check reasons
    const reasons = await db.select().from(reasonsTable).limit(1);
    if (reasons.length === 0) {
      await db.insert(reasonsTable).values([
        {
          orderNum: 1,
          title: "ابتسامتكِ التي تشفي كل تعب",
          description: "بمجرد أن تبتسمي، يبدو كل شيء معقد في العالم بسيطاً ومريحاً للغاية.",
          iconName: "Smile",
          color: "rose",
        },
        {
          orderNum: 2,
          title: "قلبكِ النقي الذي لا يعرف حقداً",
          description: "تحملين براءة وطيبة نادرة تجعل كل من يقترب منكِ يشعر بالأمان والسلام.",
          iconName: "Heart",
          color: "pink",
        },
        {
          orderNum: 3,
          title: "سند حقيقي في أصعب الأوقات",
          description: "حين يبتعد الجميع، أجدكِ أول الحاضرين بالكلمة الطيبة واليد الممتدة دون تردد.",
          iconName: "Shield",
          color: "amber",
        },
        {
          orderNum: 4,
          title: "ضحكتكِ المعدية والمليئة بالحياة",
          description: "صوت ضحكتكِ كفيل بنشر البهجة في أي مكان وتحويل أثقل الأيام إلى عرس من الفرح.",
          iconName: "Sparkles",
          color: "violet",
        },
        {
          orderNum: 5,
          title: "أحاديثنا التي لا تنتهي ولا تُمَل",
          description: "نستطيع الحديث لساعات طوال في كل شيء ولا شيء دون أن نشعر بمرور الوقت.",
          iconName: "MessageCircle",
          color: "sky",
        },
        {
          orderNum: 6,
          title: "طموحكِ وإصراركِ الملهم",
          description: "رؤيتكِ تسعين لتحقيق أهدافكِ تمنح كل من حولكِ دافعاً وأملاً حقيقياً للتطور.",
          iconName: "Star",
          color: "yellow",
        },
      ]);
    }

    // Check timeline
    const timeline = await db.select().from(timelineTable).limit(1);
    if (timeline.length === 0) {
      await db.insert(timelineTable).values([
        {
          orderNum: 1,
          dateOrYear: "البداية الجميلة",
          title: "أول مرة تلاقت فيها مساراتنا",
          description: "كانت صدفة عابرة لم نتوقع أنها ستتحول إلى أجمل وأقوى صداقة في العمر.",
          iconName: "Compass",
        },
        {
          orderNum: 2,
          dateOrYear: "الضحكة الأولى",
          title: "حين أدركنا أننا نفهم بعضنا دون كلام",
          description: "نظرة واحدة كانت كافية لنفهم الموقف ونغرق في نوبة ضحك طويلة.",
          iconName: "Smile",
        },
        {
          orderNum: 3,
          dateOrYear: "الشدائد والاختبارات",
          title: "أيام أثبتت أنكِ السند الذي لا يعوض",
          description: "مرت أيام صعبة لكن وجودكِ جعل كل مر يمر بسلام وخفة.",
          iconName: "HeartHandshake",
        },
        {
          orderNum: 4,
          dateOrYear: "اليوم وكل يوم",
          title: "عيد ميلادكِ السعيد والاحتفال بروحكِ",
          description: "نحتفل بكِ وبكل عام قادم سيكون بإذن الله أجمل وأبهى بوجودكِ وإشراقتكِ.",
          iconName: "Cake",
        },
      ]);
    }

    // Check wishes
    const wishes = await db.select().from(wishesTable).limit(1);
    if (wishes.length === 0) {
      await db.insert(wishesTable).values([
        {
          authorName: "أعز أصدقائك 💖",
          relationship: "رفيق الدرب",
          message: "كل سنة وأنتِ منورة حياتي، يا رب أيامكِ كلها سكر وفرح ونجاح لا ينتهي، وعقبال 100 سنة سعيدة!",
          likesCount: 12,
          isApproved: true,
        },
        {
          authorName: "نور العائلة 🌸",
          relationship: "صديقة الطفولة",
          message: "عيد ميلاد سعيد يا غالية! أنتِ الضحكة اللي بتفرح البيت والدنيا كلها، سنة حلوة تشبه قلبكِ الطيب.",
          likesCount: 8,
          isApproved: true,
        },
        {
          authorName: "شهد 💐",
          relationship: "زميلة الروح",
          message: "كل عام وأنتِ الألطف والأجمل، عسى كل أمنياتكِ هذا العام تتحقق خطوة بخطوة!",
          likesCount: 5,
          isApproved: true,
        },
      ]);
    }
  } catch (error) {
    console.error("Error ensuring initial data:", error);
  }
}
