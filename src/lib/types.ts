export type MiniGameType = "quiz" | "puzzle" | "matching" | "chest";

export type PhotoCategory =
  | "cover"
  | "meeting"
  | "date"
  | "travel"
  | "proposal"
  | "wedding";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  successMessage: string;
}

export interface MatchingFact {
  id: string;
  text: string;
  person: "bride" | "groom";
}

export interface Location {
  id: string;
  order: number;
  name: string;
  description: string;
  story: string;
  image: string;
  photos: string[];
  miniGameType: MiniGameType;
  hint: string;
  mapX: number;
  mapY: number;
  successMessage?: string;
  videoUrl?: string;
  quiz?: QuizQuestion;
  puzzleSize?: 3 | 4 | 5;
  puzzleImage?: string;
  matchingFacts?: MatchingFact[];
  codeWord?: string;
  codeHint?: string;
}

export interface StoryBlock {
  id: string;
  title: string;
  content: string;
  photos: string[];
  videoUrl?: string;
}

export interface DressCode {
  palette: string[];
  recommendations: string;
  exampleImages: string[];
}

export interface WishList {
  giftPreferences: string;
  colorPreferences: string;
  comments: string;
}

export interface WeddingProject {
  id: string;
  slug: string;
  brideName: string;
  groomName: string;
  brideNameGenitive?: string;
  groomNameGenitive?: string;
  weddingDate: string;
  weddingTime: string;
  address: string;
  venueDescription: string;
  coordinates: { lat: number; lng: number };
  organizerContacts: string;
  coverImage: string;
  theme: "pirates" | "travel" | "medieval" | "magic";
  videoUrl?: string;
  showCountdown: boolean;
  countdownHiddenAfterDate: boolean;
  dressCode?: DressCode;
  wishList?: WishList;
  locations: Location[];
  storyBlocks: StoryBlock[];
  gallery: { id: string; url: string; category: PhotoCategory; caption?: string }[];
  telegramBotToken?: string;
  telegramChatIds?: string[];
  organizerEmail?: string;
  coupleEmail?: string;
}

export interface RSVPData {
  weddingId: string;
  name: string;
  phone: string;
  attending: boolean;
  guestCount: number;
  comment: string;
  hasChildren: boolean;
  childrenCount: number;
  needsTransfer: boolean;
  needsParking: boolean;
  menuPreference: "meat" | "fish" | "vegetarian" | "none";
  stayingUntilEnd: boolean;
}

export interface GameProgress {
  completedLocations: string[];
  currentLocationIndex: number;
  skippedToInvitation: boolean;
  soundEnabled: boolean;
}
