import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishesTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, authorName, relationship, message, wishId } = body;

    if (action === "like") {
      if (!wishId) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للإعجاب" }, { status: 400 });
      }
      const updated = await db
        .update(wishesTable)
        .set({ likesCount: sql`${wishesTable.likesCount} + 1` })
        .where(eq(wishesTable.id, Number(wishId)))
        .returning();

      return NextResponse.json({
        success: true,
        message: "تم الإعجاب بالتهنئة ❤️",
        likesCount: updated[0]?.likesCount,
      });
    }

    // Default action: add new wish
    if (!authorName || !message) {
      return NextResponse.json(
        { success: false, error: "الرجاء كتابة اسمك ورسالة التهنئة الجميلة." },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(wishesTable)
      .values({
        authorName: authorName.trim().slice(0, 50),
        relationship: (relationship || "صديق عزيز").trim().slice(0, 50),
        message: message.trim().slice(0, 500),
        likesCount: 1,
        isApproved: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تمت إضافة تهنئتكِ الرائعة بنجاح! شكراً لمشاركتك الفرحة 💖",
      wish: inserted[0],
    });
  } catch (error) {
    console.error("Error submitting wish:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إرسال التهنئة" },
      { status: 500 }
    );
  }
}
