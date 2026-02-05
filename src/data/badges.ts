import { translations } from "../i18n/translations";

export type Badge = {
  id: string;
  iconId: string; // 'fire', 'star', 'warrior', 'king'
  icon: string;
  requiredStreak: number;
};

export const BADGES: Badge[] = [
  {
    id: "fire",
    iconId: "fire",
    icon: "🔥",
    requiredStreak: 3,
  },
  {
    id: "star",
    iconId: "star",
    icon: "⭐",
    requiredStreak: 7,
  },
  {
    id: "warrior",
    iconId: "warrior",
    icon: "⚔️",
    requiredStreak: 14,
  },
  {
    id: "king",
    iconId: "king",
    icon: "👑",
    requiredStreak: 30,
  }
];

// ✅ Helper function để lấy name & effect từ translations
export function getBadgeInfo(badgeId: string, lang: 'en' | 'vi' | 'ja') {
  const badgeData = translations[lang].badges[badgeId as keyof typeof translations['en']['badges']];
  if (!badgeData) return { name: badgeId, effect: '' };
  return badgeData;
}
