import type { Habit } from "../types/habit";
import { useHabitStore } from "../store/useHabitStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useShopStore } from "../store/useShopStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore";
import { BADGES, getBadgeInfo } from "../data/badges";

type Props = {
  habit: Habit;
};

export default function HabitCard({ habit }: Props) {
  const toggleHabit = useHabitStore((s) => s.toggleComplete);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const gainExp = usePlayerStore((s) => s.gainExp);
  const loseHp = usePlayerStore((s) => s.loseHp);
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const ownedItemIds = useShopStore((s) => s.ownedItemIds);
  const hasShield = ownedItemIds.includes("shield");
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language);

  const badgeData = habit.badge
    ? BADGES.find((b) => b.id === habit.badge)
    : null;

  const badgeInfo =
    badgeData && habit.badge
      ? getBadgeInfo(habit.badge, lang)
      : null;

  /* ================= TOGGLE ================= */
  const handleToggle = () => {
    if (dayLocked) return;

    if (!habit.completedToday) {
      gainExp(20);
    } else {
      loseHp(10);
    }

    toggleHabit(habit.id);
  };

  /* ================= DELETE ================= */
  const handleDelete = () => {
    if (dayLocked) return;

    let damage = habit.streak >= 7 ? 20 : 10;

    if (hasShield) {
      damage = Math.floor(damage / 2);
    }

    const ok = window.confirm(
      t("habit.deleteConfirm", {
        title: habit.title,
        damage: damage,
        shield: hasShield ? t("habit.shieldActive") : "",
      })
    );
    if (!ok) return;

    removeHabit(habit.id);
    loseHp(damage);
  };

  return (
    <div
      className={`habit-card ${habit.completedToday ? "done" : ""} ${
        dayLocked ? "locked" : ""
      }`}
      style={{
        borderColor: habit.color,
        opacity: dayLocked ? 0.5 : 1,
        pointerEvents: dayLocked ? "none" : "auto",
      }}
    >
      <div className="habit-main" onClick={handleToggle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <h4 style={{ margin: 0 }}>{habit.title}</h4>
          {badgeData && badgeInfo && (
            <span title={badgeInfo.name} style={{ fontSize: 14 }}>
              {badgeData.icon}
            </span>
          )}
        </div>
        <div className="habit-info">
          <span>🔥 {habit.streak}</span>
          <span>
            {habit.completedToday ? t("habit.done") : t("habit.pending")}
          </span>
        </div>
      </div>

      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={dayLocked}
        title="Delete habit"
      >
        🗑
      </button>
    </div>
  );
}
