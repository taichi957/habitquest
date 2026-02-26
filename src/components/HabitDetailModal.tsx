import { useState } from "react";
import type { Habit } from "../types/habit";
import { usePlayerStore } from "../store/usePlayerStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore";
import { BADGES, getBadgeInfo } from "../data/badges";
import "../css/habitDetailModal.css";

type Props = {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export default function HabitDetailModal({
  habit,
  isOpen,
  onClose,
  onComplete,
}: Props) {
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const [completionValue, setCompletionValue] = useState(0);
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  // ✅ Validate completion based on goal type
  const validateCompletion = (): boolean => {
    if (!habit.goal) return true; // status type, no validation needed

    if (habit.goal.type === "count" && completionValue < (habit.goal.target || 0)) {
      setShowError(true);
      return false;
    }

    if (habit.goal.type === "time" && completionValue < (habit.goal.target || 0)) {
      setShowError(true);
      return false;
    }

    if (habit.goal.type === "quantity" && completionValue < (habit.goal.target || 0)) {
      setShowError(true);
      return false;
    }

    setShowError(false);
    return true;
  };

  const handleComplete = () => {
    if (validateCompletion()) {
      onComplete();
      onClose();
      setCompletionValue(0);
    }
  };

  const badgeData = habit.badge
    ? BADGES.find((b) => b.id === habit.badge)
    : null;

  const badgeInfo =
    badgeData && habit.badge ? getBadgeInfo(habit.badge, lang) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* ===== CLOSE BTN ===== */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* ===== HEADER ===== */}
        <div className="modal-header">
          <div className="habit-title-section">
            {habit.icon && <span className="habit-icon-large">{habit.icon}</span>}
            <div>
              <h2 style={{ margin: "0 0 4px 0" }}>{habit.title}</h2>
              {habit.description && (
                <p className="habit-description">{habit.description}</p>
              )}
            </div>
          </div>
          {badgeData && badgeInfo && (
            <div className="badge-display">
              <span className="badge-large">{badgeData.icon}</span>
              <small>{badgeInfo.name}</small>
            </div>
          )}
        </div>

        {/* ===== STATS ROW ===== */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">🔥 Streak</span>
            <span className="stat-value">{habit.streak}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">⭐ EXP</span>
            <span className="stat-value">{habit.expReward || 50}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">💰 Gold</span>
            <span className="stat-value">{habit.coinReward || 10}</span>
          </div>
          {habit.difficulty && (
            <div className="stat-item">
              <span className="stat-label">⚔️ Difficulty</span>
              <span className="stat-value">
                {habit.difficulty === "easy" && "😊"}
                {habit.difficulty === "medium" && "🤔"}
                {habit.difficulty === "hard" && "💪"}
              </span>
            </div>
          )}
        </div>

        {/* ===== GOAL SECTION ===== */}
        {habit.goal && habit.goal.type !== "status" && (
          <div className="modal-section">
            <h4 className="section-title">🎯 Goal</h4>
            <div className="goal-info">
              <div>
                <strong>Goal Type:</strong>{" "}
                {habit.goal.type === "count" && "Count"}
                {habit.goal.type === "time" && "Time (minutes)"}
                {habit.goal.type === "quantity" && "Quantity"}
              </div>
              <div>
                <strong>Target:</strong> {habit.goal.target}{" "}
                {habit.goal.unit && `${habit.goal.unit}`}
              </div>

              {/* Input for completion */}
              <div style={{ marginTop: "10px" }}>
                <label className="form-label">
                  <span className="form-label-icon">✓</span>
                  {t("addHabit.target")} (
                  {habit.goal.type === "time" && "minutes"}
                  {habit.goal.type === "quantity" && habit.goal.unit}
                  {habit.goal.type === "count" && "times"})
                </label>
                <input
                  className="completion-input"
                  type="number"
                  min="0"
                  max={habit.goal.target ? habit.goal.target * 2 : 100}
                  value={completionValue}
                  onChange={(e) => {
                    setCompletionValue(parseInt(e.target.value) || 0);
                    setShowError(false);
                  }}
                  placeholder="Enter completion..."
                />
                {showError && (
                  <div className="error-message">
                    ❌ Chưa đạt mục tiêu: cần {habit.goal.target}{" "}
                    {habit.goal.unit || ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== SCHEDULE SECTION ===== */}
        {habit.schedule && (
          <div className="modal-section">
            <h4 className="section-title">📅 Schedule</h4>
            <div className="schedule-info">
              <div>
                <strong>Days:</strong>{" "}
                {habit.schedule.daysOfWeek.join(", ")}
              </div>
              <div>
                <strong>Frequency:</strong>{" "}
                {habit.schedule.frequency === "daily" && "Hàng ngày"}
                {habit.schedule.frequency === "alternate" && "Cách ngày"}
                {habit.schedule.frequency === "custom" && "Tùy chỉnh"}
              </div>
              <div>
                <strong>Times/Day:</strong> {habit.schedule.timesPerDay}
              </div>
              {habit.schedule.specificTime && (
                <div>
                  <strong>Specific Time:</strong>{" "}
                  {habit.schedule.specificTime}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REMINDER SECTION ===== */}
        {habit.reminder && habit.reminder.enabled && (
          <div className="modal-section">
            <h4 className="section-title">🔔 Reminder</h4>
            <div className="reminder-info">
              <div>
                <strong>Time:</strong> {habit.reminder.time}
              </div>
              <div>
                <strong>Sound:</strong>{" "}
                {habit.reminder.sound === "none" && "None"}
                {habit.reminder.sound === "bell" && "🔔 Bell"}
                {habit.reminder.sound === "chime" && "✨ Chime"}
                {habit.reminder.sound === "vibrate" && "📳 Vibrate"}
              </div>
              {habit.reminder.repeatIfIncomplete && (
                <div>⚠️ Repeat if incomplete</div>
              )}
            </div>
          </div>
        )}

        {/* ===== PRIORITY & DIFFICULTY ===== */}
        <div className="modal-section">
          <h4 className="section-title">⚙️ Settings</h4>
          <div className="settings-grid">
            {habit.priority && (
              <div>
                <strong>📌 Priority:</strong>{" "}
                {habit.priority === "low" && "⬇️ Low"}
                {habit.priority === "medium" && "➡️ Medium"}
                {habit.priority === "high" && "⬆️ High"}
              </div>
            )}
            {habit.energyCost && (
              <div>
                <strong>⚡ Energy:</strong> {habit.energyCost}/10
              </div>
            )}
          </div>

          {habit.notes && (
            <div style={{ marginTop: "10px" }}>
              <strong>📝 Notes:</strong>
              <p className="notes-text">{habit.notes}</p>
            </div>
          )}
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            ❌ {t("addHabit.cancel")}
          </button>
          <button
            className={`btn-primary ${dayLocked ? "disabled" : ""}`}
            onClick={handleComplete}
            disabled={dayLocked}
          >
            ✅ {t("habit.done")}
          </button>
        </div>
      </div>
    </div>
  );
}
