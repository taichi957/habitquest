import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Habit } from "../types/habit";
import { useHabitStore } from "../store/useHabitStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useShopStore } from "../store/useShopStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore";
import { BADGES, getBadgeInfo } from "../data/badges";
import VerificationModal from "./VerificationModal";

type Props = {
  habit: Habit;
};

export default function HabitCard({ habit }: Props) {
  const navigate = useNavigate();
  const toggleHabit = useHabitStore((s) => s.toggleComplete);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const gainExp = usePlayerStore((s) => s.gainExp);
  const loseHp = usePlayerStore((s) => s.loseHp);
  const addEnergy = usePlayerStore((s) => s.addEnergy); // ⚡ new
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const ownedItemIds = useShopStore((s) => s.ownedItemIds);
  const hasShield = ownedItemIds.includes("shield");
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language);

  const [showModal, setShowModal] = useState(false);

  const badgeData = habit.badge
    ? BADGES.find((b) => b.id === habit.badge)
    : null;

  const badgeInfo =
    badgeData && habit.badge
      ? getBadgeInfo(habit.badge, lang)
      : null;

  /* ================= COMPLETE HABIT ================= */
  const handleComplete = () => {
    if (dayLocked) return;

    if (!habit.completedToday) {
      const expAmount = habit.expReward || 50;
      gainExp(expAmount);
      addEnergy(1); // ⚡ reward energy
    } else {
      loseHp(10);
    }

    toggleHabit(habit.id);
    setShowModal(false);
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

  // 🎮 Get verification type icon
  const getVerificationIcon = () => {
    switch (habit.verificationType) {
      case "timer":
        return "⏱️";
      case "checklist":
        return "✅";
      case "proof":
        return "📸";
      case "sensor":
        return "👟";
      case "auto":
        return "🤖";
      case "tap":
      default:
        return "👆";
    }
  };

  return (
    <>
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
        <div className="habit-main" onClick={() => navigate(`/habit/${habit.id}`)}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {habit.icon && <span className="habit-icon">{habit.icon}</span>}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{habit.title}</h4>
              {habit.description && (
                <small className="habit-description">{habit.description}</small>
              )}
            </div>
            {badgeData && badgeInfo && (
              <span title={badgeInfo.name} style={{ fontSize: 14 }}>
                {badgeData.icon}
              </span>
            )}
          </div>

          {/* Custom Habit Info */}
          <div className="habit-custom-info">
            {/* 🎮 Verification Type Icon */}
            <span title={`${t("habit.verification")} : ${habit.verificationType}`}>
              {getVerificationIcon()}
            </span>

            {habit.goal && habit.goal.type !== "status" && (
              <span title={`Goal: ${habit.goal.target} ${habit.goal.unit || ""}`}>
                🎯 {habit.goal.type === "count" && "Count"}
                {habit.goal.type === "time" && "Time"}
                {habit.goal.type === "quantity" && "Qty"}
              </span>
            )}

            {habit.difficulty && (
              <span title={`${t("habit.difficulty")} : ${habit.difficulty}`}>
                {habit.difficulty === "easy" && "😊"}
                {habit.difficulty === "medium" && "🤔"}
                {habit.difficulty === "hard" && "💪"}
              </span>
            )}

            {habit.reminder && habit.reminder.enabled && (
              <span title={`${t("habit.reminder")} : ${habit.reminder.time}`}>🔔</span>
            )}

            {habit.schedule && habit.schedule.daysOfWeek.length < 7 && (
              <span title={`${t("habit.days")} : ${habit.schedule.daysOfWeek.join(", ")}`}>
                📅
              </span>
            )}
          </div>

          <div className="habit-info">
            <span>🔥 {habit.streak}</span>
            <span>
              {habit.completedToday ? t("habit.done") : t("habit.pending")}
            </span>
            {habit.expReward && habit.expReward !== 50 && (
              <span>⭐ {habit.expReward}</span>
            )}
          </div>
        </div>

        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={dayLocked}
          title={t("habit.delete")}
        >
          🗑
        </button>
      </div>

      {/* 🎮 VERIFICATION MODAL */}
      <VerificationModal
        habit={habit}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleComplete}
      />
    </>
  );
}
