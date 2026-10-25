import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishesTable } from "@/db/schema";
import { verifyAdminPin } from "@/lib/auth-helpers";
import { eq, desc } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, action, data, id } = body;

    const isValid = await verifyAdminPin(pin);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "غير مصرح لك. الرمز السري غير صحيح." },
        { status: 401 }
      );
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للحذف" }, { status: 400 });
      }
      await db.delete(wishesTable).where(eq(wishesTable.id, Number(id)));
      return NextResponse.json({ success: true, message: "تم حذف التهنئة بنجاح" });
    }

    if (action === "toggle_approval") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب" }, { status: 400 });
      }
      const wish = await db.select().from(wishesTable).where(eq(wishesTable.id, Number(id))).limit(1);
      if (wish.length === 0) {
        return NextResponse.json({ success: false, error: "التهنئة غير موجودة" }, { status: 404 });
      }
      const updated = await db
        .update(wishesTable)
        .set({ isApproved: !wish[0].isApproved })
        .where(eq(wishesTable.id, Number(id)))
        .returning();

      return NextResponse.json({ success: true, message: "تم تحديث حالة الظهور", data: updated[0] });
    }

    if (action === "add") {
      const { authorName, relationship, message } = data;
      if (!authorName || !message) {
        return NextResponse.json(
          { success: false, error: "اسم الكاتب والرسالة مطلوبان" },
          { status: 400 }
        );
      }
      const inserted = await db
        .insert(wishesTable)
        .values({
          authorName,
          relationship: relationship || "صديق عزيز",
          message,
          likesCount: 0,
          isApproved: true,
        })
        .returning();
      return NextResponse.json({ success: true, message: "تمت إضافة التهنئة بنجاح", data: inserted[0] });
    }

    const all = await db.select().from(wishesTable).orderBy(desc(wishesTable.createdAt));
    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    console.error("Error managing wishes:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء إدارة التهاني" }, { status: 500 });
  }
}
