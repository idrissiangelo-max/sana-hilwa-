import { NextResponse } from "next/server";
import { db } from "@/db";
import { memoriesTable } from "@/db/schema";
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
      const { title, dateStr, category, imageUrl, description, location, orderNum } = data;
      if (!title || !imageUrl) {
        return NextResponse.json(
          { success: false, error: "عنوان الصورة ورابط الصورة مطلوبان." },
          { status: 400 }
        );
      }
      const inserted = await db
        .insert(memoriesTable)
        .values({
          title,
          dateStr: dateStr || "لحظة مميزة",
          category: category || "ذكريات جميلة",
          imageUrl,
          description: description || "",
          location: location || "معاً",
          orderNum: Number(orderNum) || 0,
        })
        .returning();

      return NextResponse.json({ success: true, message: "تمت إضافة الذكرى بنجاح", data: inserted[0] });
    }

    if (action === "update") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للتعديل" }, { status: 400 });
      }
      const { title, dateStr, category, imageUrl, description, location, orderNum } = data;
      const updated = await db
        .update(memoriesTable)
        .set({
          title,
          dateStr,
          category,
          imageUrl,
          description,
          location,
          orderNum: Number(orderNum) || 0,
        })
        .where(eq(memoriesTable.id, Number(id)))
        .returning();

      return NextResponse.json({ success: true, message: "تم تعديل الذكرى بنجاح", data: updated[0] });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "المعرف مطلوب للحذف" }, { status: 400 });
      }
      await db.delete(memoriesTable).where(eq(memoriesTable.id, Number(id)));
      return NextResponse.json({ success: true, message: "تم حذف الذكرى بنجاح" });
    }

    // Default: fetch all
    const all = await db.select().from(memoriesTable).orderBy(asc(memoriesTable.orderNum), asc(memoriesTable.id));
    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    console.error("Error managing memories:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء إدارة الذكريات" }, { status: 500 });
  }
}
