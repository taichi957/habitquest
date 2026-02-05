import PhoneFrame from "../components/PhoneFrame";
import AvatarCharacter from "../components/AvatarCharacter";
import PlayerStatus from "../components/PlayerStatus";
import HabitCard from "../components/HabitCard";
import { useHabitStore } from "../store/useHabitStore";
import { useVictoryLogStore } from "../store/useVictoryLogStore";
import { useAchievementStore } from "../store/useAchievementStore";
import { useTranslation } from "../hooks/useTranslation"; // ✅ NEW
import { Link } from "react-router-dom";
import type { Habit } from "../types/habit";
import { usePlayerStore } from "../store/usePlayerStore";
import { useTimeStore } from "../store/useTimeStore";

export default function Home() {
  const habits = useHabitStore((s) => s.habits);
  const resetToday = useHabitStore((s) => s.resetToday);
  const addLog = useVictoryLogStore((s) => s.addLog);
  const checkAchievements = useAchievementStore((s) => s.checkAchievements);
  const currentDay = useTimeStore((s) => s.currentDay);
  const lastDate = useTimeStore((s) => s.lastDate);
  const loseHp = usePlayerStore((s) => s.loseHp);
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const t = useTranslation(); // ✅ NEW

  const handleFinishDay = () => {
    const incompleteCount = habits.filter(
      (h) => !h.completedToday
    ).length;

    const DAMAGE_PER_HABIT = 10;
    const totalDamage = incompleteCount * DAMAGE_PER_HABIT;

    if (totalDamage > 0) {
      const ok = window.confirm(
        t("home.unfinishedHabits", {
          count: incompleteCount,
          damage: totalDamage,
        })
      );
      if (!ok) return;

      loseHp(totalDamage);
    }

    checkAchievements(habits);

    if (lastDate) {
      addLog(lastDate, currentDay);
    }

    resetToday();
  };

  return (
    <PhoneFrame>
      {dayLocked && (
        <div className="day-locked-banner">
          {t("home.dayLocked")}
        </div>
      )}

      {/* ===== HEADER ===== */}
      <PlayerStatus />

      {/* ===== AVATAR ZONE ===== */}
      <AvatarCharacter />

      {/* ===== ADD HABIT ===== */}
      {!dayLocked && (
        <Link to="/add" className="add-btn">
          {t("home.addHabit")}
        </Link>
      )}

      {/* ===== HABIT LIST ===== */}
      <div className="habit-list">
        {habits.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "20px",
            opacity: 0.6,
            fontSize: 12
          }}>
            {t("home.noHabits")}
          </div>
        ) : (
          habits.map((habit: Habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))
        )}
      </div>

      {/* ===== FINISH DAY ===== */}
      {!dayLocked && (
        <button className="reset-btn" onClick={handleFinishDay}>
          {t("home.finishDay")}
        </button>
      )}
    </PhoneFrame>
  );
}
