import { BADGES, getBadgeInfo } from "../data/badges"; // ✅ NEW
import { useHabitStore } from "../store/useHabitStore";
import { useLanguageStore } from "../store/useLanguageStore"; // ✅ NEW
import { useTranslation } from "../hooks/useTranslation"; // ✅ NEW
import PhoneFrame from "../components/PhoneFrame";

export default function Achievements() {
  const habits = useHabitStore((s) => s.habits);
  const lang = useLanguageStore((s) => s.language); // ✅ NEW
  const t = useTranslation(); // ✅ NEW
  const maxStreak = Math.max(0, ...habits.map((h) => h.streak));

  return (
    <PhoneFrame>
      <div className="page-card">
        <h2 className="page-title">{t("achievementsPage.title")}</h2>

        <div className="badge-grid">
          {BADGES.map((b) => {
            const unlocked = maxStreak >= b.requiredStreak;
            const badgeInfo = getBadgeInfo(b.id, lang); // ✅ GET INFO

            return (
              <div
                key={b.id}
                className={`achievement-card ${
                  unlocked ? "unlocked" : "locked"
                }`}
              >
                <div>{b.icon}</div>
                <div>{badgeInfo.name}</div> {/* ✅ USE TRANSLATED */}
                {!unlocked && <small>{t("achievementsPage.locked")} {b.requiredStreak}</small>}
              </div>
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}
