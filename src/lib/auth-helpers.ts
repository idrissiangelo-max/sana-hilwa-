import { db } from "@/db";
import { siteSettingsTable } from "@/db/schema";

export async function verifyAdminPin(enteredPin: string | null | undefined): Promise<boolean> {
  if (!enteredPin || typeof enteredPin !== "string") {
    return false;
  }
  const cleanPin = enteredPin.trim();
  if (!cleanPin) return false;

  const rows = await db.select({ secretPin: siteSettingsTable.secretPin }).from(siteSettingsTable).limit(1);
  if (rows.length === 0) {
    return cleanPin === "2024";
  }

  const currentPin = rows[0].secretPin || "2024";
  return cleanPin === currentPin;
}
