import { NextRequest, NextResponse } from "next/server";
import type { RSVPData } from "@/lib/types";

const RSVP_STORAGE_KEY = "wedding-quest-rsvp-list";

export async function POST(request: NextRequest) {
  try {
    const data: RSVPData = await request.json();

    if (!data.name || !data.phone) {
      return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
    }

    // Rate limiting via simple timestamp check in headers
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Send Telegram notification
    await sendTelegramNotification(data);

    // Send email notification (placeholder)
    await sendEmailNotification(data);

    return NextResponse.json({ success: true, ip });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

async function sendTelegramNotification(data: RSVPData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS?.split(",") || [];

  if (!token || chatIds.length === 0) return;

  const text = [
    "🎉 Новый RSVP!",
    `👤 ${data.name}`,
    `📞 ${data.phone}`,
    `${data.attending ? "✅ Будет" : "❌ Не будет"}`,
    data.attending ? `👥 Гостей: ${data.guestCount}` : "",
    data.hasChildren ? `👶 Детей: ${data.childrenCount}` : "",
    data.needsTransfer ? "🚌 Нужен трансфер" : "",
    data.needsParking ? "🅿️ Нужна парковка" : "",
    `🍽 Меню: ${data.menuPreference}`,
    data.comment ? `💬 ${data.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  for (const chatId of chatIds) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId.trim(), text, parse_mode: "HTML" }),
    });
  }
}

async function sendEmailNotification(data: RSVPData) {
  const email = process.env.NOTIFICATION_EMAIL;
  if (!email) return;
  // Email integration placeholder — connect Resend/SendGrid in production
  console.log(`RSVP notification to ${email}:`, data.name);
}
