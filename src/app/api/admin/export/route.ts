import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  // In production, fetch from Supabase
  const demoData = [
    {
      Имя: "Пример",
      Телефон: "+7 999 000-00-00",
      Участие: "Да",
      "Кол-во гостей": 2,
      Дети: "Нет",
      Трансфер: "Да",
      Парковка: "Нет",
      Меню: "Без ограничений",
      Комментарий: "",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(demoData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "RSVP");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="rsvp-export.xlsx"',
    },
  });
}
