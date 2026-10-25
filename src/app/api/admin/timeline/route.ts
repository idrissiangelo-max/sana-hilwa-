import { NextResponse } from "next/server";
import { db } from "@/db";
import { timelineTable } from "@/db/schema";
import { verifyAdminPin } from "@/lib/auth-helpers";
import { eq, asc } from "drizzle-orm";

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

    if (action === "create") {
      const { dateOrYear, title, description, iconName, orderNum } = data;
      if (!title || !dateOrYear) {
        return NextResponse.json(
          { success: false, error: "العنوان والتاريخ/السنة مطلوبان." },
          { status: 400 }
        );
      }
      const inserted = await db
        .insert(timelineTable)
        .values({
          dateOrYear,
          title,
          description: description || "",
          iconName: iconName || "Sparkles",
          orderNum: Number(orderNum) || 0,
        })
        .returning();

      return NextResponse.json({ success: true, message: "تمت إضافة المحطة بنجاح", data: inserted[0] });
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للتعديل" }, { status: 400 });
      }
      const { dateOrYear, title, description, iconName, orderNum } = data;
      const updated = await db
        .update(timelineTable)
        .set({
          dateOrYear,
          title,
          description,
          iconName: iconName || "Sparkles",
          orderNum: Number(orderNum) || 0,
        })
        .where(eq(timelineTable.id, Number(id)))
        .returning();

      return NextResponse.json({ success: true, message: "تم تعديل المحطة بنجاح", data: updated[0] });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للحذف" }, { status: 400 });
      }
      await db.delete(timelineTable).where(eq(timelineTable.id, Number(id)));
      return NextResponse.json({ success: true, message: "تم حذف المحطة بنجاح" });
    }

    const all = await db.select().from(timelineTable).orderBy(asc(timelineTable.orderNum), asc(timelineTable.id));
    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    console.error("Error managing timeline:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء إدارة المحطات" }, { status: 500 });
  }
}
