import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettingsTable, memoriesTable, reasonsTable, timelineTable, wishesTable } from "@/db/schema";
import { verifyAdminPin } from "@/lib/auth-helpers";
import { asc, desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    const isValid = await verifyAdminPin(pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "رمز الدخول السري غير صحيح. يرجى المحاولة مرة أخرى." },
        { status: 401 }
      );
    }

    // PIN is valid: fetch full settings including current PIN for editing
    const [settingsList, memories, reasons, timeline, wishes] = await Promise.all([
      db.select().from(siteSettingsTable).limit(1),
      db.select().from(memoriesTable).orderBy(asc(memoriesTable.orderNum), asc(memoriesTable.id)),
      db.select().from(reasonsTable).orderBy(asc(reasonsTable.orderNum), asc(reasonsTable.id)),
      db.select().from(timelineTable).orderBy(asc(timelineTable.orderNum), asc(timelineTable.id)),
      db.select().from(wishesTable).orderBy(desc(wishesTable.createdAt)),
    ]);

    return NextResponse.json({
      success: true,
      message: "تم التحقق بنجاح من الرمز السري",
      data: {
        settings: settingsList[0] || null,
        memories,
        reasons,
        timeline,
        wishes,
      },
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء التحقق من الرمز" },
      { status: 500 }
    );
  }
}
