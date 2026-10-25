import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettingsTable } from "@/db/schema";
import { verifyAdminPin } from "@/lib/auth-helpers";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, settings } = body;

    const isValid = await verifyAdminPin(pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك. الرمز السري غير صحيح." },
        { status: 401 }
      );
    }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { success: false, error: "بيانات الإعدادات غير صالحة" },
        { status: 400 }
      );
    }

    // Filter fields to update
    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    const allowedFields = [
      "secretPin",
      "friendName",
      "friendNickname",
      "senderName",
      "birthdayDate",
      "heroBadge",
      "heroTitle",
      "heroSubtitle",
      "heroImageUrl",
      "themeColor",
      "bgMusicUrl",
      "musicTitle",
      "musicEnabled",
      "countdownTitle",
      "countdownEndMessage",
      "cakeTitle",
      "cakeSubtitle",
      "cakeWishRevealed",
      "candlesCount",
      "letterTitle",
      "letterSender",
      "letterContent",
      "letterDate",
      "giftTitle",
      "giftSubtitle",
      "giftRevealTitle",
      "giftRevealMessage",
      "giftRevealCode",
      "giftImageUrl",
      "quizTitle",
      "footerText",
    ];

    for (const field of allowedFields) {
      if (field in settings) {
        updatePayload[field] = settings[field];
      }
    }

    const existing = await db.select().from(siteSettingsTable).limit(1);
    let updated;
    if (existing.length === 0) {
      const inserted = await db.insert(siteSettingsTable).values(updatePayload as any).returning();
      updated = inserted[0];
    } else {
      const res = await db
        .update(siteSettingsTable)
        .set(updatePayload)
        .where(eq(siteSettingsTable.id, existing[0].id))
        .returning();
      updated = res[0];
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ وتحديث الإعدادات بنجاح! ستظهر التعديلات فوراً على الموقع.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "فشل تحديث الإعدادات" },
      { status: 500 }
    );
  }
}
