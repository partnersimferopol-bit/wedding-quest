# Wedding Quest

Интерактивное свадебное приглашение — приключение по карте сокровищ с мини-играми, RSVP и админ-панелью.

## Быстрый старт (локально)

```bash
cd wedding-quest
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

- **Демо-приглашение:** [/maria-dmitry](http://localhost:3000/maria-dmitry)
- **Админ-панель:** [/admin](http://localhost:3000/admin) (логин: `admin`, пароль: `wedding2026`)

## Публикация в интернет (GitHub + Vercel)

Чтобы **поделиться ссылкой** с гостями и **редактировать** игру через Git:

### 1. Загрузить код на GitHub

1. Создайте новый репозиторий на [github.com/new](https://github.com/new) (например, `wedding-quest`), **без** README и .gitignore.
2. В папке проекта выполните:

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/wedding-quest.git
git add .
git commit -m "Wedding Quest: интерактивное свадебное приглашение"
git branch -M main
git push -u origin main
```

### 2. Опубликовать сайт на Vercel (бесплатно)

1. Зайдите на [vercel.com](https://vercel.com) и войдите через GitHub.
2. **Add New Project** → выберите репозиторий `wedding-quest`.
3. Нажмите **Deploy** (настройки по умолчанию подходят для Next.js).

Через 1–2 минуты появится ссылка вида:

`https://wedding-quest-xxxx.vercel.app/maria-dmitry`

Её можно отправлять гостям.

### 3. Как вносить правки

1. Меняете код локально или прямо на GitHub (редактор файлов).
2. Делаете `git push` — Vercel **автоматически** обновит сайт.

Основные файлы для правок:

| Что менять | Файл |
|------------|------|
| Имена, дата, локации, тексты | `src/lib/demo-data.ts` |
| Картинки | `public/images/` |
| Музыка | `public/audio/` |
| Координаты корабля на карте | `mapX`, `mapY` в `demo-data.ts` |

### Переменные окружения (опционально)

Для Telegram-уведомлений RSVP в Vercel: **Settings → Environment Variables** — скопируйте из `.env.example`.

Без Supabase и Telegram игра работает полностью — RSVP сохраняется в памяти сервера (для продакшена лучше подключить Supabase позже).

## Возможности MVP

- Карта сокровищ с 5 локациями и анимацией корабля
- Мини-игры: викторина, пазл, drag & drop, сундук с кодовым словом
- Кнопка «Пропустить квест» для гостей старше 55–60 лет
- Финальное приглашение с таймером обратного отсчёта
- RSVP-анкета с Telegram-уведомлениями
- Разделы «Наша история» (timeline) и «Галерея»
- Админ-панель с управлением контентом и экспортом RSVP в Excel
- Mobile First, Framer Motion анимации

## Стек

- Next.js 16 / React / TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (схема в `supabase/schema.sql`)

## Настройка Telegram

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Скопируйте `.env.example` в `.env.local`
3. Укажите `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_IDS`

## Структура

```
src/
  app/[slug]/          — страница приглашения-игры
  app/admin/           — админ-панель
  components/game/     — игровые компоненты
  components/rsvp/     — форма RSVP
  lib/demo-data.ts     — демо-данные Марии и Дмитрия
public/images/         — иллюстрации карты, корабля, сундуков
public/audio/          — фоновая музыка
```
