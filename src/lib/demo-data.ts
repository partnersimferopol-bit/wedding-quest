import type { WeddingProject } from "./types";
import { IMAGES } from "./images";

export const DEMO_WEDDING: WeddingProject = {
  id: "demo-maria-dmitry",
  slug: "maria-dmitry",
  brideName: "Мария",
  groomName: "Дмитрий",
  brideNameGenitive: "Марии",
  groomNameGenitive: "Дмитрия",
  weddingDate: "2026-09-15T16:00:00",
  weddingTime: "16:00",
  address: "Усадьба «Белая Роза», Московская область, д. Солнечное, ул. Садовая, 12",
  venueDescription:
    "Живописная усадьба в окружении садов и прудов. Церемония пройдёт на открытой террасе, банкет — в историческом зале.",
  coordinates: { lat: 55.7558, lng: 37.6173 },
  organizerContacts: "+7 (999) 123-45-67, wedding@example.com",
  coverImage: IMAGES.title,
  theme: "pirates",
  showCountdown: true,
  countdownHiddenAfterDate: true,
  dressCode: {
    palette: ["#8B4513", "#D4AF37", "#F5E6D3", "#2C1810"],
    recommendations:
      "Пиратская романтика! Приветствуются кремовые, золотые и терракотовые оттенки. Можно добавить морские акценты.",
    exampleImages: [],
  },
  wishList: {
    giftPreferences:
      "Ваше присутствие — лучший подарок! Если хотите нас порадовать — будем благодарны за вклад в медовый месяц.",
    colorPreferences: "Белые розы, пионы, эвкалипт",
    comments: "",
  },
  locations: [
    {
      id: "loc-1",
      order: 1,
      name: "Остров знакомства",
      description: "Здесь началась наша история",
      story:
        "Мария и Дмитрий познакомились на концерте под открытым небом. Он помог ей найти потерянный билет, она угостила его мороженым. С того вечера они не расставались.",
      image: IMAGES.islandMeeting,
      photos: [IMAGES.islandMeeting],
      miniGameType: "quiz",
      hint: "Подумайте о месте, где всё началось...",
      successMessage: "Вы нашли первую подсказку!",
      mapX: 50,
      mapY: 12,
      quiz: {
        id: "q1",
        question: "Где познакомились Мария и Дмитрий?",
        options: [
          { id: "a", text: "На концерте под открытым небом", isCorrect: true },
          { id: "b", text: "В кофейне на Арбате", isCorrect: false },
          { id: "c", text: "На морском круизе", isCorrect: false },
          { id: "d", text: "На дне рождения друга", isCorrect: false },
        ],
        successMessage: "Вы нашли первую подсказку! Корабль отправляется дальше...",
      },
    },
    {
      id: "loc-2",
      order: 2,
      name: "Бухта первого свидания",
      description: "Закат, море и первый поцелуй",
      story:
        "Первое свидание состоялось на закате у моря. Они гуляли по пляжу, разговаривали о мечтах и впервые по-настоящему почувствовали, что нашли друг друга.",
      image: IMAGES.bayDate,
      photos: [IMAGES.bayDate],
      miniGameType: "puzzle",
      hint: "Соберите картину их первого свидания",
      successMessage: "Картина собрана — путь продолжается!",
      mapX: 74,
      mapY: 24,
      puzzleSize: 3,
      puzzleImage: IMAGES.bayDate,
    },
    {
      id: "loc-3",
      order: 3,
      name: "Гора приключений",
      description: "Путешествия, которые сближают",
      story:
        "Вместе они покоряли горы, шли к вершинам и открывали новые горизонты. Каждое приключение делало их связь крепче.",
      image: IMAGES.mountainAdventure,
      photos: [IMAGES.mountainAdventure],
      miniGameType: "matching",
      hint: "Сопоставьте факты с героем истории",
      successMessage: "Все факты на месте — вперёд!",
      mapX: 26,
      mapY: 40,
      matchingFacts: [
        { id: "f1", text: "Любит горы и походы", person: "groom" },
        { id: "f2", text: "Обожает море и пляжи", person: "bride" },
        { id: "f3", text: "Не может начать день без кофе", person: "bride" },
        { id: "f4", text: "Мастер на все руки", person: "groom" },
        { id: "f5", text: "Мечтает о путешествии в Японию", person: "bride" },
        { id: "f6", text: "Умеет готовить лучшую пасту", person: "groom" },
      ],
    },
    {
      id: "loc-4",
      order: 4,
      name: "Пещера предложения",
      description: "Момент, который изменил всё",
      story:
        "Дмитрий сделал предложение в волшебной пещере. Мария, не раздумывая, сказала «Да!». Это был самый волшебный вечер в их жизни.",
      image: IMAGES.caveProposal,
      photos: [IMAGES.caveProposal, IMAGES.chestClosed],
      miniGameType: "chest",
      hint: "Кодовое слово — то, что Мария ответила в тот вечер (по-русски, одно слово)",
      successMessage: "Сундук открыт — сокровище найдено!",
      mapX: 74,
      mapY: 54,
      codeWord: "да",
      codeHint: "Подсказка: одно короткое слово, которое меняет жизнь",
    },
    {
      id: "loc-5",
      order: 5,
      name: "Остров свадьбы",
      description: "Финальная точка маршрута",
      story:
        "И вот мы здесь — на пороге самого важного дня. Спасибо, что прошли этот путь вместе с нами!",
      image: IMAGES.islandWedding,
      photos: [IMAGES.islandWedding, IMAGES.chestOpen],
      miniGameType: "chest",
      hint: "",
      successMessage: "Вы прибыли на остров свадьбы!",
      mapX: 36,
      mapY: 76,
    },
  ],
  storyBlocks: [
    {
      id: "s1",
      title: "Знакомство",
      content:
        "Мария и Дмитрий познакомились на концерте под открытым небом. Случайная встреча переросла в бесконечные разговоры и прогулки.",
      photos: [IMAGES.islandMeeting],
    },
    {
      id: "s2",
      title: "Первое свидание",
      content: "Закат у моря, прогулка по пляжу и чувство, что впереди — целая жизнь вместе.",
      photos: [IMAGES.bayDate],
    },
    {
      id: "s3",
      title: "Путешествия",
      content: "Горы, море, новые горизонты — каждое приключение сближало их.",
      photos: [IMAGES.mountainAdventure],
    },
    {
      id: "s4",
      title: "Предложение",
      content: "Пещера, кольцо и слово, которое изменило всё.",
      photos: [IMAGES.caveProposal],
    },
    {
      id: "s5",
      title: "Подготовка к свадьбе",
      content: "Сейчас мы готовимся к самому важному дню и ждём вас!",
      photos: [IMAGES.islandWedding, IMAGES.chestOpen],
    },
  ],
  gallery: [
    { id: "g1", url: IMAGES.islandMeeting, category: "meeting", caption: "Остров знакомства" },
    { id: "g2", url: IMAGES.bayDate, category: "date", caption: "Бухта первого свидания" },
    { id: "g3", url: IMAGES.mountainAdventure, category: "travel", caption: "Гора приключений" },
    { id: "g4", url: IMAGES.caveProposal, category: "proposal", caption: "Пещера предложения" },
    { id: "g5", url: IMAGES.islandWedding, category: "wedding", caption: "Остров свадьбы" },
    { id: "g6", url: IMAGES.chestOpen, category: "wedding", caption: "Сундук с сокровищами" },
    { id: "g7", url: IMAGES.title, category: "meeting", caption: "Путешествие Марии и Дмитрия" },
    { id: "g8", url: IMAGES.map, category: "travel", caption: "Карта сокровищ" },
  ],
};

export function getWeddingBySlug(slug: string): WeddingProject | null {
  if (slug === DEMO_WEDDING.slug) return DEMO_WEDDING;
  return null;
}

export function getAllWeddingSlugs(): string[] {
  return [DEMO_WEDDING.slug];
}
