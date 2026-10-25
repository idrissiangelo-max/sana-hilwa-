import { NextResponse } from "next/server";
import { db } from "@/db";
import { reasonsTable } from "@/db/schema";
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
      const { title, description, iconName, color, orderNum } = data;
      if (!title || !description) {
        return NextResponse.json(
          { success: false, error: "عنوان السبب ووصفه مطلوبان." },
          { status: 400 }
        );
      }
      const inserted = await db
        .insert(reasonsTable)
        .values({
          title,
          description,
          iconName: iconName || "Heart",
          color: color || "pink",
          orderNum: Number(orderNum) || 0,
        })
        .returning();

      return NextResponse.json({ success: true, message: "تمت إضافة الميزة بنجاح", data: inserted[0] });
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للتعديل" }, { status: 400 });
      }
      const { title, description, iconName, color, orderNum } = data;
      const updated = await db
        .update(reasonsTable)
        .set({
          title,
          description,
          iconName: iconName || "Heart",
          color: color || "pink",
          orderNum: Number(orderNum) || 0,
        })
        .where(eq(reasonsTable.id, Number(id)))
        .returning();

      return NextResponse.json({ success: true, message: "تم تعديل الميزة بنجاح", data: updated[0] });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للحذف" }, { status: 400 });
      }
      await db.delete(reasonsTable).where(eq(reasonsTable.id, Number(id)));
      return NextResponse.json({ success: true, message: "تم حذف الميزة بنجاح" });
    }

    const all = await db.select().from(reasonsTable).orderBy(asc(reasonsTable.orderNum), asc(reasonsTable.id));
    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    console.error("Error managing reasons:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء إدارة المزايا" }, { status: 500 });
  }
}
