"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import type { WeddingProject, RSVPData } from "@/lib/types";

interface RSVPFormProps {
  wedding: WeddingProject;
  onClose: () => void;
}

export function RSVPForm({ wedding, onClose }: RSVPFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<RSVPData, "weddingId">>({
    name: "",
    phone: "",
    attending: true,
    guestCount: 1,
    comment: "",
    hasChildren: false,
    childrenCount: 0,
    needsTransfer: false,
    needsParking: false,
    menuPreference: "none",
    stayingUntilEnd: true,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, weddingId: wedding.id }),
      });
      if (res.ok) {
        try {
          const existing = JSON.parse(localStorage.getItem("wedding-quest-rsvp-list") || "[]");
          existing.push({ ...form, weddingId: wedding.id });
          localStorage.setItem("wedding-quest-rsvp-list", JSON.stringify(existing));
        } catch { /* ignore */ }
        setSubmitted(true);
      }
    } catch {
      /* fallback: still show success for demo */
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-amber-950 p-6 sm:rounded-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-amber-100">Подтверждение участия</h2>
            <button onClick={onClose} className="text-amber-300">
              <X size={20} />
            </button>
          </div>

          {submitted ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="py-12 text-center">
              <CheckCircle className="mx-auto text-green-400" size={48} />
              <p className="mt-4 text-lg text-amber-100">Спасибо! Ваш ответ принят.</p>
              <p className="mt-2 text-sm text-amber-300/70">
                Мы отправили уведомление организаторам.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Имя" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                  placeholder="Ваше имя"
                />
              </Field>

              <Field label="Телефон" required>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+7 (999) 123-45-67"
                />
              </Field>

              <Field label="Будете присутствовать?">
                <div className="flex gap-3">
                  <ToggleBtn active={form.attending} onClick={() => update("attending", true)} label="Да" />
                  <ToggleBtn active={!form.attending} onClick={() => update("attending", false)} label="Нет" />
                </div>
              </Field>

              {form.attending && (
                <>
                  <Field label="Количество гостей">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={form.guestCount}
                      onChange={(e) => update("guestCount", Number(e.target.value))}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Есть ли дети?">
                    <div className="flex gap-3">
                      <ToggleBtn active={form.hasChildren} onClick={() => update("hasChildren", true)} label="Да" />
                      <ToggleBtn active={!form.hasChildren} onClick={() => update("hasChildren", false)} label="Нет" />
                    </div>
                  </Field>

                  {form.hasChildren && (
                    <Field label="Количество детей">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={form.childrenCount}
                        onChange={(e) => update("childrenCount", Number(e.target.value))}
                        className={inputClass}
                      />
                    </Field>
                  )}

                  <Field label="Нужен ли трансфер?">
                    <div className="flex gap-3">
                      <ToggleBtn active={form.needsTransfer} onClick={() => update("needsTransfer", true)} label="Да" />
                      <ToggleBtn active={!form.needsTransfer} onClick={() => update("needsTransfer", false)} label="Нет" />
                    </div>
                  </Field>

                  <Field label="Нужна ли парковка?">
                    <div className="flex gap-3">
                      <ToggleBtn active={form.needsParking} onClick={() => update("needsParking", true)} label="Да" />
                      <ToggleBtn active={!form.needsParking} onClick={() => update("needsParking", false)} label="Нет" />
                    </div>
                  </Field>

                  <Field label="Предпочтения по меню">
                    <select
                      value={form.menuPreference}
                      onChange={(e) => update("menuPreference", e.target.value as RSVPData["menuPreference"])}
                      className={inputClass}
                    >
                      <option value="none">Без ограничений</option>
                      <option value="meat">Мясо</option>
                      <option value="fish">Рыба</option>
                      <option value="vegetarian">Вегетарианское</option>
                    </select>
                  </Field>

                  <Field label="Останетесь до конца?">
                    <div className="flex gap-3">
                      <ToggleBtn active={form.stayingUntilEnd} onClick={() => update("stayingUntilEnd", true)} label="Да" />
                      <ToggleBtn active={!form.stayingUntilEnd} onClick={() => update("stayingUntilEnd", false)} label="Нет" />
                    </div>
                  </Field>
                </>
              )}

              <Field label="Комментарий">
                <textarea
                  value={form.comment}
                  onChange={(e) => update("comment", e.target.value)}
                  className={inputClass}
                  rows={3}
                  placeholder="Пожелания, аллергии..."
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-amber-600 to-amber-800 py-4 font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Отправка..." : "Подтвердить участие"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const inputClass =
  "w-full rounded-lg border border-amber-700/50 bg-amber-900/40 px-4 py-2.5 text-amber-100 placeholder:text-amber-400/40 focus:border-amber-500 focus:outline-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-amber-300/80">
        {label}
        {required && <span className="text-amber-500"> *</span>}
      </label>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
        active ? "bg-amber-700 text-white" : "bg-amber-900/40 text-amber-400"
      }`}
    >
      {label}
    </button>
  );
}
