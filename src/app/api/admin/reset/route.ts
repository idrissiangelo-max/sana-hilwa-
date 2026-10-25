import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettingsTable, memoriesTable, reasonsTable, timelineTable, wishesTable } from "@/db/schema";
import { verifyAdminPin } from "@/lib/auth-helpers";
import { ensureInitialData } from "@/db/init";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    const isValid = await verifyAdminPin(pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك. الرمز السري غير صحيح." },
        { status: 401 }
      );
    }

    // Clear existing tables
    await db.delete(memoriesTable);
    await db.delete(reasonsTable);
    await db.delete(timelineTable);
    await db.delete(wishesTable);
    await db.delete(siteSettingsTable);

    // Re-seed
    await ensureInitialData();

    return NextResponse.json({
      success: true,
      message: "تمت إعادة تعيين جميع البيانات بنجاح إلى النسخة الافتراضية الغنية!",
    });
  } catch (error) {
    console.error("Error resetting data:", error);
    return NextResponse.json(
      { success: false, error: "فشل إعادة تعيين البيانات" },
      { status: 500 }
    );
  }
}
