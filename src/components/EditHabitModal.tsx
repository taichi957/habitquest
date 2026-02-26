import { useState, useEffect } from "react";
import type { Habit, Schedule } from "../types/habit";
import { useHabitStore } from "../store/useHabitStore";
import { detectVerificationType } from "../utils/verificationSystem";
import "../css/habitDetailModal.css";

type Props = {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditHabitModal({ habit, isOpen, onClose }: Props) {
  const updateHabit = useHabitStore((s) => s.updateHabit);

  // ===== FORM STATE =====
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || "");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(habit.difficulty || "easy");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(habit.priority || "medium");
  const [energyCost, setEnergyCost] = useState(habit.energyCost || 5);
  const [expReward, setExpReward] = useState(habit.expReward || 50);
  const [goalTarget, setGoalTarget] = useState(
    habit.goal?.target?.toString() || ""
  );
  const [goalUnit, setGoalUnit] = useState(habit.goal?.unit || "");
  const [goalType, setGoalType] = useState<"count" | "time" | "status" | "quantity">(
    habit.goal?.type || "status"
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    habit.reminder?.enabled || false
  );
  const [reminderTime, setReminderTime] = useState(habit.reminder?.time || "07:00");
  const [frequencyType, setFrequencyType] = useState<"daily" | "alternate" | "custom">(
    habit.schedule?.frequency || "daily"
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    habit.schedule?.daysOfWeek || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  );
  // timer duration state (minutes)
  const [timerDuration, setTimerDuration] = useState(
    habit.verificationConfig?.timer?.duration || 30
  );

  // compute current detection for displaying the timer input
  const detectedType = detectVerificationType(title, description);

  // ===== RESET FORM WHEN HABIT CHANGES =====
  useEffect(() => {
    setTitle(habit.title);
    setDescription(habit.description || "");
    setDifficulty(habit.difficulty || "easy");
    setPriority(habit.priority || "medium");
    setEnergyCost(habit.energyCost || 5);
    setExpReward(habit.expReward || 50);
    setGoalTarget(habit.goal?.target?.toString() || "");
    setGoalUnit(habit.goal?.unit || "");
    setGoalType(habit.goal?.type || "status");
    setReminderEnabled(habit.reminder?.enabled || false);
    setReminderTime(habit.reminder?.time || "07:00");
    setFrequencyType(habit.schedule?.frequency || "daily");
    setSelectedDays(habit.schedule?.daysOfWeek || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    setTimerDuration(habit.verificationConfig?.timer?.duration || 30);
  }, [habit, isOpen]);

  // ===== DAYS OF WEEK =====
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  // ===== SAVE CHANGES =====
  const handleSave = () => {
    const newVerificationType = detectVerificationType(title, description);

    const updatedData = {
      title,
      description,
      difficulty,
      priority,
      energyCost,
      expReward,
      goal: goalTarget
        ? {
            type: goalType as "count" | "time" | "status" | "quantity",
            target: parseInt(goalTarget) || 0,
            unit: goalUnit,
          }
        : undefined,
      reminder: reminderEnabled
        ? {
            enabled: true,
            time: reminderTime,
            sound: habit.reminder?.sound || "bell" as const,
            repeatIfIncomplete: habit.reminder?.repeatIfIncomplete ?? false,
          }
        : { enabled: false, sound: "none" as const, repeatIfIncomplete: false },
      schedule: {
        daysOfWeek: selectedDays,
        frequency: frequencyType,
        timesPerDay: habit.schedule?.timesPerDay || 1,
        specificTime: reminderTime,
      } as Schedule,
      // Re-detect verification type if title/description changed
      verificationType: newVerificationType,
    } as any;

    // add verificationConfig for timer if needed
    if (newVerificationType === "timer") {
      (updatedData as any).verificationConfig = {
        timer: { duration: timerDuration, isRunning: false, elapsedTime: 0 },
      };
    }

    updateHabit(habit.id, updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>✏️ Edit Habit</h2>

        {/* TITLE & DESCRIPTION */}
        <div className="form-section">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Habit name..."
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details..."
            rows={2}
          />
        </div>

        {/* GOAL SETTINGS */}
        <div className="form-section">
          {/* show duration field if detection suggests timer */}
          {detectedType === "timer" && (
            <>
              <label>Timer Duration (min)</label>
              <input
                type="number"
                className="habit-input"
                min={1}
                value={timerDuration}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v > 0) setTimerDuration(v);
                }}
              />
            </>
          )}
          <label>Goal Type</label>
          <select value={goalType} onChange={(e) => setGoalType(e.target.value as any)}>
            <option value="status">Status (No Target)</option>
            <option value="count">Count</option>
            <option value="time">Time (minutes)</option>
            <option value="quantity">Quantity</option>
          </select>

          {goalType !== "status" && (
            <>
              <label>Target</label>
              <input
                className="habit-input"
                type="number"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                placeholder="Target value"
                min="1"
              />

              <label>Unit</label>
              <input
                className="habit-input"
                type="text"
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                placeholder="e.g., km, pages, items"
              />
            </>
          )}
        </div>

        {/* DIFFICULTY & REWARDS */}
        <div className="form-section">
          <label>Difficulty</label>
          <select className="habit-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
            <option value="easy">Easy 😊</option>
            <option value="medium">Medium 🤔</option>
            <option value="hard">Hard 💪</option>
          </select>

          <label>Priority</label>
          <select className="habit-input" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="low">Low ⬇️</option>
            <option value="medium">Medium ➡️</option>
            <option value="high">High ⬆️</option>
          </select>

          <label>EXP Reward: {expReward}</label>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={expReward}
            onChange={(e) => setExpReward(parseInt(e.target.value))}
          />

          <label>Energy Cost: {energyCost}</label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={energyCost}
            onChange={(e) => setEnergyCost(parseInt(e.target.value))}
          />
        </div>

        {/* SCHEDULE */}
        <div className="form-section">
          <label>Schedule Type</label>
          <select value={frequencyType} onChange={(e) => setFrequencyType(e.target.value as any)}>
            <option value="daily">Daily</option>
            <option value="alternate">Alternate Days</option>
            <option value="custom">Custom</option>
          </select>

          {frequencyType === "custom" && (
            <div className="days-grid">
              {DAYS.map((day) => (
                <button
                  key={day}
                  className={`day-btn ${selectedDays.includes(day) ? "selected" : ""}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* REMINDER */}
        <div className="form-section">
          <label>
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
            Enable Reminder
          </label>

          {reminderEnabled && (
            <>
              <label>Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>
      </div>

      
    </div>
  );
}
