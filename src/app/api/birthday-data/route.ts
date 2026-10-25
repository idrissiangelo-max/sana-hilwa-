import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettingsTable, memoriesTable, reasonsTable, timelineTable, wishesTable } from "@/db/schema";
import { ensureInitialData } from "@/db/init";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureInitialData();

    const [settingsList, memories, reasons, timeline, wishes] = await Promise.all([
      db.select().from(siteSettingsTable).limit(1),
      db.select().from(memoriesTable).orderBy(asc(memoriesTable.orderNum), asc(memoriesTable.id)),
      db.select().from(reasonsTable).orderBy(asc(reasonsTable.orderNum), asc(reasonsTable.id)),
      db.select().from(timelineTable).orderBy(asc(timelineTable.orderNum), asc(timelineTable.id)),
      db.select().from(wishesTable).where(eq(wishesTable.isApproved, true)).orderBy(desc(wishesTable.createdAt)),
    ]);

    const settings = settingsList[0] || null;

    // Do not return raw secretPin in public payload; pass hasPin flag
    const safeSettings = settings
      ? {
          ...settings,
          secretPin: undefined,
          hasPin: Boolean(settings.secretPin),
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        settings: safeSettings,
        memories,
        reasons,
        timeline,
        wishes,
      },
    });
  } catch (error) {
    console.error("Error fetching birthday data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load birthday data" },
      { status: 500 }
    );
  }
}
