"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  MapPin,
  HelpCircle,
  Image as ImageIcon,
  Users,
  Download,
  LogOut,
  Puzzle,
} from "lucide-react";
import { DEMO_WEDDING } from "@/lib/demo-data";
import type { RSVPData } from "@/lib/types";

type Tab = "info" | "stories" | "photos" | "locations" | "questions" | "puzzles" | "rsvp";

const RSVP_STORAGE_KEY = "wedding-quest-rsvp-list";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("info");
  const [rsvpList, setRsvpList] = useState<RSVPData[]>([]);
  const [wedding, setWedding] = useState(DEMO_WEDDING);

  useEffect(() => {
    if (sessionStorage.getItem("admin-auth") === "true") setAuthed(true);
    try {
      const raw = localStorage.getItem(RSVP_STORAGE_KEY);
      if (raw) setRsvpList(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === "admin" && password === "wedding2026") {
      sessionStorage.setItem("admin-auth", "true");
      setAuthed(true);
    } else {
      alert("Неверный логин или пароль");
    }
  };

  const exportExcel = async () => {
    const res = await fetch("/api/admin/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvp-export.xlsx";
    a.click();
  };

  if (!authed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-amber-950 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 rounded-2xl bg-amber-900/50 p-8">
          <h1 className="text-center text-2xl font-bold text-amber-100">Админ-панель</h1>
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Логин"
            className="w-full rounded-lg border border-amber-700/50 bg-amber-950/50 px-4 py-3 text-amber-100"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full rounded-lg border border-amber-700/50 bg-amber-950/50 px-4 py-3 text-amber-100"
          />
          <button type="submit" className="w-full rounded-lg bg-amber-700 py-3 font-semibold text-white">
            Войти
          </button>
          <p className="text-center text-xs text-amber-400/50">Демо: admin / wedding2026</p>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "info", label: "Основная информация", icon: <Settings size={16} /> },
    { id: "stories", label: "Истории", icon: <MapPin size={16} /> },
    { id: "photos", label: "Фотографии", icon: <ImageIcon size={16} /> },
    { id: "locations", label: "Локации", icon: <MapPin size={16} /> },
    { id: "questions", label: "Вопросы", icon: <HelpCircle size={16} /> },
    { id: "puzzles", label: "Пазлы", icon: <Puzzle size={16} /> },
    { id: "rsvp", label: "RSVP", icon: <Users size={16} /> },
  ];

  return (
    <div className="flex min-h-dvh bg-amber-950">
      <aside className="hidden w-64 flex-shrink-0 border-r border-amber-800/50 bg-amber-900/30 p-4 lg:block">
        <h1 className="mb-6 font-serif text-xl font-bold text-amber-100">Wedding Quest</h1>
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                tab === t.id ? "bg-amber-800 text-white" : "text-amber-300 hover:bg-amber-800/40"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin-auth");
            setAuthed(false);
          }}
          className="mt-8 flex items-center gap-2 text-sm text-amber-400/60 hover:text-amber-300"
        >
          <LogOut size={16} /> Выйти
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs ${
                tab === t.id ? "bg-amber-700 text-white" : "bg-amber-900/50 text-amber-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {tab === "info" && (
            <Section title="Основная информация">
              <FormField label="Имя невесты" value={wedding.brideName} onChange={(v) => setWedding({ ...wedding, brideName: v })} />
              <FormField label="Имя жениха" value={wedding.groomName} onChange={(v) => setWedding({ ...wedding, groomName: v })} />
              <FormField label="Дата свадьбы" value={wedding.weddingDate.slice(0, 10)} onChange={(v) => setWedding({ ...wedding, weddingDate: v + "T16:00:00" })} type="date" />
              <FormField label="Время" value={wedding.weddingTime} onChange={(v) => setWedding({ ...wedding, weddingTime: v })} />
              <FormField label="Адрес" value={wedding.address} onChange={(v) => setWedding({ ...wedding, address: v })} />
              <FormField label="Контакты организатора" value={wedding.organizerContacts} onChange={(v) => setWedding({ ...wedding, organizerContacts: v })} />
              <label className="flex items-center gap-2 text-sm text-amber-300">
                <input
                  type="checkbox"
                  checked={wedding.showCountdown}
                  onChange={(e) => setWedding({ ...wedding, showCountdown: e.target.checked })}
                />
                Показывать таймер
              </label>
              <label className="flex items-center gap-2 text-sm text-amber-300">
                <input
                  type="checkbox"
                  checked={wedding.countdownHiddenAfterDate}
                  onChange={(e) => setWedding({ ...wedding, countdownHiddenAfterDate: e.target.checked })}
                />
                Скрыть таймер после даты
              </label>
              <SaveButton />
            </Section>
          )}

          {tab === "stories" && (
            <Section title="Истории">
              {wedding.storyBlocks.map((block) => (
                <div key={block.id} className="mb-4 rounded-xl bg-amber-900/30 p-4">
                  <FormField label="Заголовок" value={block.title} onChange={() => {}} />
                  <FormField label="Текст" value={block.content} onChange={() => {}} multiline />
                </div>
              ))}
              <SaveButton />
            </Section>
          )}

          {tab === "photos" && (
            <Section title="Фотографии">
              <div className="mb-4 rounded-xl border-2 border-dashed border-amber-700/50 p-8 text-center">
                <ImageIcon className="mx-auto text-amber-500" size={32} />
                <p className="mt-2 text-amber-300">Перетащите фото сюда или нажмите для загрузки</p>
                <p className="mt-1 text-xs text-amber-400/50">JPG, PNG, WebP — до 100 фото</p>
                <input type="file" accept="image/*" multiple className="mt-4" />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {wedding.gallery.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-amber-900/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[10px] text-white">
                      {photo.category}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {tab === "locations" && (
            <Section title="Локации">
              {wedding.locations.map((loc) => (
                <div key={loc.id} className="mb-4 rounded-xl bg-amber-900/30 p-4">
                  <h3 className="font-semibold text-amber-200">
                    {loc.order}. {loc.name}
                  </h3>
                  <p className="mt-1 text-sm text-amber-400/70">Тип игры: {loc.miniGameType}</p>
                  <FormField label="Описание" value={loc.description} onChange={() => {}} />
                  <FormField label="История" value={loc.story} onChange={() => {}} multiline />
                  <FormField label="Подсказка" value={loc.hint} onChange={() => {}} />
                </div>
              ))}
            </Section>
          )}

          {tab === "questions" && (
            <Section title="Вопросы викторины">
              {wedding.locations
                .filter((l) => l.quiz)
                .map((loc) => (
                  <div key={loc.id} className="mb-4 rounded-xl bg-amber-900/30 p-4">
                    <h3 className="font-semibold text-amber-200">{loc.name}</h3>
                    <FormField label="Вопрос" value={loc.quiz!.question} onChange={() => {}} />
                    {loc.quiz!.options.map((opt) => (
                      <div key={opt.id} className="mt-1 text-sm text-amber-300">
                        {opt.isCorrect ? "✓" : "○"} {opt.text}
                      </div>
                    ))}
                  </div>
                ))}
            </Section>
          )}

          {tab === "puzzles" && (
            <Section title="Настройка пазлов">
              {wedding.locations
                .filter((l) => l.miniGameType === "puzzle")
                .map((loc) => (
                  <div key={loc.id} className="mb-4 rounded-xl bg-amber-900/30 p-4">
                    <h3 className="font-semibold text-amber-200">{loc.name}</h3>
                    <p className="text-sm text-amber-300">Размер: {loc.puzzleSize}×{loc.puzzleSize}</p>
                    <select className="mt-2 rounded-lg bg-amber-950/50 px-3 py-2 text-amber-200">
                      <option value="3">3×3</option>
                      <option value="4">4×4</option>
                      <option value="5">5×5</option>
                    </select>
                  </div>
                ))}
            </Section>
          )}

          {tab === "rsvp" && (
            <Section title="RSVP — Ответы гостей">
              <div className="mb-4 flex gap-2">
                <button
                  onClick={exportExcel}
                  className="flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm text-white"
                >
                  <Download size={16} /> Экспорт Excel
                </button>
              </div>
              {rsvpList.length === 0 ? (
                <p className="text-amber-400/60">Пока нет ответов</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-amber-200">
                    <thead>
                      <tr className="border-b border-amber-800">
                        <th className="p-2">Имя</th>
                        <th className="p-2">Телефон</th>
                        <th className="p-2">Участие</th>
                        <th className="p-2">Гостей</th>
                        <th className="p-2">Меню</th>
                        <th className="p-2">Комментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvpList.map((r, i) => (
                        <tr key={i} className="border-b border-amber-900/50">
                          <td className="p-2">{r.name}</td>
                          <td className="p-2">{r.phone}</td>
                          <td className="p-2">{r.attending ? "Да" : "Нет"}</td>
                          <td className="p-2">{r.guestCount}</td>
                          <td className="p-2">{r.menuPreference}</td>
                          <td className="p-2">{r.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold text-amber-100">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  const cls = "w-full rounded-lg border border-amber-700/50 bg-amber-950/50 px-4 py-2.5 text-amber-100";
  return (
    <div>
      <label className="mb-1 block text-sm text-amber-300/80">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls} rows={3} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

function SaveButton() {
  return (
    <button
      onClick={() => alert("Сохранено! (В демо-режиме изменения локальные)")}
      className="rounded-lg bg-amber-700 px-6 py-2 font-semibold text-white"
    >
      Сохранить
    </button>
  );
}
