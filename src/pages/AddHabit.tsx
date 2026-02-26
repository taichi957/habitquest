import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHabitStore } from "../store/useHabitStore";
import { useTranslation } from "../hooks/useTranslation";
import { useNotification } from "../hooks/useNotification";
import { useLanguageStore } from "../store/useLanguageStore";
import { BADGES, getBadgeInfo } from "../data/badges";
import PhoneFrame from "../components/PhoneFrame";
import { detectVerificationType } from "../utils/verificationSystem";
import type { Schedule, Goal, ReminderConfig, HabitDifficulty, HabitPriority, VerificationType } from "../types/habit";
import "../css/addHabit.css";

const HABIT_ICONS = ["⭐", "💪", "📚", "🏃", "🧘", "🎯", "🎨", "🎵", "🍎", "💧", "😴", "🚴"];
const COLORS = ["#FFD76E", "#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#87CEEB"];

export default function AddHabit() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const habits = useHabitStore((s) => s.habits);
  const navigate = useNavigate();
  const t = useTranslation();
  const notify = useNotification();
  const lang = useLanguageStore((s) => s.language);

  // ===== BASIC INFO =====
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FFD76E");
  const [icon, setIcon] = useState("⭐");

  // ===== SCHEDULE =====
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"daily" | "alternate" | "custom">("daily");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [specificTime, setSpecificTime] = useState("07:00");

  // ===== GOAL =====
  const [goalType, setGoalType] = useState<"count" | "time" | "status" | "quantity">("status");
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalUnit, setGoalUnit] = useState("");

  // ===== REMINDER =====
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("07:00");
  const [reminderSound, setReminderSound] = useState<"none" | "bell" | "chime" | "vibrate">("bell");
  const [repeatReminder, setRepeatReminder] = useState(false);

  // ===== GAMIFICATION =====
  const [expReward, setExpReward] = useState(50);
  const [coinReward, setCoinReward] = useState(10);
  const [badgeId, setBadgeId] = useState<string | undefined>(undefined);
  const [previewBadge, setPreviewBadge] = useState<typeof BADGES[0] | null>(null);

  // ===== ADVANCED =====
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("easy");
  const [priority, setPriority] = useState<HabitPriority>("medium");
  const [energyCost, setEnergyCost] = useState(5);
  const [notes, setNotes] = useState("");
  const [canShare, setCanShare] = useState(false);

  // ===== VERIFICATION SYSTEM =====
  const [verificationType, setVerificationType] = useState<VerificationType>("tap");
  const [timerDuration, setTimerDuration] = useState(30); // minutes for timer verification

  // ===== UI =====
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 🤖 AUTO-DETECT VERIFICATION TYPE WHEN TITLE CHANGES
  useEffect(() => {
    if (title.trim()) {
      const detected = detectVerificationType(title, description);
      setVerificationType(detected);
    }
  }, [title, description]);

  const maxStreak = Math.max(0, ...habits.map((h) => h.streak));
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      notify(t("addHabit.enterName"), "warning");
      return;
    }

    const schedule: Schedule = {
      daysOfWeek: selectedDays.length > 0 ? selectedDays : daysOfWeek,
      frequency,
      timesPerDay,
      specificTime,
    };

    const goal: Goal = {
      type: goalType,
      target: goalType !== "status" ? goalTarget : undefined,
      unit: goalUnit,
    };

    const reminder: ReminderConfig | undefined = reminderEnabled
      ? {
          enabled: true,
          time: reminderTime,
          sound: reminderSound,
          repeatIfIncomplete: repeatReminder,
        }
      : undefined;

    const verificationConfig =
      verificationType === "timer"
        ? { timer: { duration: timerDuration, isRunning: false, elapsedTime: 0 } }
        : undefined;

    addHabit({
      title,
      description,
      color,
      icon,
      schedule,
      goal,
      reminder,
      expReward,
      coinReward,
      badge: badgeId,
      difficulty,
      priority,
      energyCost,
      notes,
      canShare,
      // 🎮 VERIFICATION SYSTEM
      verificationType,
      verificationConfig,
    });

    navigate("/");
  };

  return (
    <PhoneFrame>
      <div className="form-section">
        <h2 className="page-title">{t("addHabit.title")}</h2>
      </div>

      <div className="habit-form-container">
        {/* ================= 1️⃣ BASIC INFO ================= */}
        <div className="form-section">
          <h3 className="form-section-title">📝 {t("addHabit.basicInfo")}</h3>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">📄</span>
              {t("addHabit.habitName")}
            </label>
            <input
              className="habit-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("addHabit.habitNamePlaceholder")}
              maxLength={30}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">💬</span>
              {t("addHabit.description")}
            </label>
            <textarea
              className="habit-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("addHabit.descriptionPlaceholder")}
              maxLength={100}
            />
          </div>

          {/* Icon Picker */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🎨</span>
              {t("addHabit.icon")}
            </label>
            <div className="icon-picker-grid">
              {HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  className={`icon-btn ${icon === ic ? "active" : ""}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🎨</span>
              {t("addHabit.color")}
            </label>
            <div className="color-picker-group">
              <input
                className="habit-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <div className="color-preview" style={{ background: color }}>
                {color}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: "32px",
                    height: "32px",
                    background: c,
                    border: color === c ? "3px solid #000" : "2px solid #666",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= 2️⃣ SCHEDULE ================= */}
        <div className="form-section">
          <h3 className="form-section-title">⏱️ {t("addHabit.schedule")}</h3>

          {/* Days of Week */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">📅</span>
              {t("addHabit.daysOfWeek")}
            </label>
            <div className="schedule-grid">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={`day-btn ${selectedDays.includes(day) ? "active" : ""}`}
                  onClick={() => handleToggleDay(day)}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🔄</span>
              {t("addHabit.frequency")}
            </label>
            <div className="toggle-group">
              {(["daily", "alternate", "custom"] as const).map((freq) => (
                <button
                  key={freq}
                  className={`${frequency === freq ? "active" : ""}`}
                  onClick={() => setFrequency(freq)}
                >
                  {freq === "daily" && "Daily"}
                  {freq === "alternate" && "Alternate"}
                  {freq === "custom" && "Custom"}
                </button>
              ))}
            </div>
          </div>

          {/* Times Per Day */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🔢</span>
              {t("addHabit.timesPerDay")}
            </label>
            <input
              className="habit-number-input"
              type="number"
              min="1"
              max="10"
              value={timesPerDay}
              onChange={(e) => setTimesPerDay(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          {/* Specific Time */}
          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🕐</span>
              {t("addHabit.specificTime")}
            </label>
            <input
              className="habit-input"
              type="time"
              value={specificTime}
              onChange={(e) => setSpecificTime(e.target.value)}
            />
          </div>
        </div>

        {/* ================= 3️⃣ GOAL ================= */}
        <div className="form-section">
          <h3 className="form-section-title">🎯 {t("addHabit.goal")}</h3>

          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🎯</span>
              {t("addHabit.goalType")}
            </label>
            <div className="goal-type-grid">
              {[
                { type: "status" as const, label: "Status", icon: "✓" },
                { type: "count" as const, label: "Count", icon: "🔢" },
                { type: "time" as const, label: "Time", icon: "⏱️" },
                { type: "quantity" as const, label: "Quantity", icon: "📏" },
              ].map((g) => (
                <button
                  key={g.type}
                  className={`goal-type-btn ${goalType === g.type ? "active" : ""}`}
                  onClick={() => setGoalType(g.type)}
                >
                  <span className="goal-type-icon">{g.icon}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {goalType !== "status" && (
            <>
              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🔢</span>
                  {t("addHabit.target")}
                </label>
                <input
                  className="habit-number-input"
                  type="number"
                  min="1"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">📐</span>
                  {t("addHabit.unit")} ({goalType === "time" && "min"} {goalType === "quantity" && "lít"}...)
                </label>
                <input
                  className="habit-input"
                  value={goalUnit}
                  onChange={(e) => setGoalUnit(e.target.value)}
                  placeholder={goalType === "time" ? "min" : goalType === "quantity" ? "lít" : "unit"}
                />
              </div>
            </>
          )}
        </div>

        {/* ================= 4️⃣ REMINDER ================= */}
        <div className="form-section">
          <h3 className="form-section-title">🔔 {t("addHabit.reminder")}</h3>

          <div className="form-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              <span className="checkbox-label">{t("addHabit.enableReminder")}</span>
            </label>
          </div>

          {reminderEnabled && (
            <>
              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🕐</span>
                  {t("addHabit.reminderTime")}
                </label>
                <input
                  className="habit-input"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">🔊</span>
                  {t("addHabit.reminderSound")}
                </label>
                <select
                  className="habit-select"
                  value={reminderSound}
                  onChange={(e) => setReminderSound(e.target.value as any)}
                >
                  <option value="none">None</option>
                  <option value="bell">🔔 Bell</option>
                  <option value="chime">✨ Chime</option>
                  <option value="vibrate">📳 Vibrate</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={repeatReminder}
                    onChange={(e) => setRepeatReminder(e.target.checked)}
                  />
                  <span className="checkbox-label">{t("addHabit.repeatIfIncomplete")}</span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* ================= 5️⃣ GAMIFICATION ================= */}
        <div className="form-section">
          <h3 className="form-section-title">🏆 {t("addHabit.gamification")}</h3>

          <div className="reward-preview">
            <div className="reward-item">
              <div className="reward-icon">⭐</div>
              <div className="reward-value">EXP: {expReward}</div>
            </div>
            <div className="reward-item">
              <div className="reward-icon">💰</div>
              <div className="reward-value">Gold: {coinReward}</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">⭐</span>
              {t("addHabit.expReward")}
            </label>
            <input
              className="habit-number-input"
              type="number"
              min="10"
              max="500"
              step="10"
              value={expReward}
              onChange={(e) => setExpReward(Math.max(10, parseInt(e.target.value) || 50))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">💰</span>
              {t("addHabit.coinReward")}
            </label>
            <input
              className="habit-number-input"
              type="number"
              min="5"
              max="100"
              step="5"
              value={coinReward}
              onChange={(e) => setCoinReward(Math.max(5, parseInt(e.target.value) || 10))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="form-label-icon">🎖️</span>
              {t("addHabit.badge")}
            </label>
            <div className="badge-grid">
              {BADGES.map((b) => {
                const unlocked = maxStreak >= b.requiredStreak;
                const badgeInfo = getBadgeInfo(b.id, lang);

                return (
                  <button
                    key={b.id}
                    disabled={!unlocked}
                    className={`badge-btn ${badgeId === b.id ? "active" : ""} ${!unlocked ? "locked" : ""}`}
                    onClick={() => {
                      setBadgeId(b.id);
                      setPreviewBadge(b);
                    }}
                  >
                    <span className="badge-icon">{b.icon}</span>
                    {badgeInfo.name}
                  </button>
                );
              })}
            </div>

            {previewBadge && (
              <div className="badge-preview">
                <strong>
                  {previewBadge.icon} {getBadgeInfo(previewBadge.id, lang).name}
                </strong>
                <p>⭐ {getBadgeInfo(previewBadge.id, lang).effect}</p>
                <small>🔥 {t("addHabit.unlockedAt")} {previewBadge.requiredStreak}</small>
              </div>
            )}
          </div>
        </div>

        {/* ================= 6️⃣ ADVANCED ================= */}
        <div className="form-section">
          <div
            className={`advanced-toggle ${showAdvanced ? "open" : ""}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <label className="advanced-toggle-label">
              ⚙️ {t("addHabit.advanced")}
            </label>
            <span className="advanced-toggle-icon">▼</span>
          </div>

          <div className={`advanced-section ${showAdvanced ? "open" : ""}`}>
            {/* Difficulty */}
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">⚔️</span>
                {t("addHabit.difficulty")}
              </label>
              <div className="difficulty-selector">
                {(["easy", "medium", "hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    className={`difficulty-btn ${difficulty === diff ? "active" : ""}`}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff === "easy" && "😊 Easy"}
                    {diff === "medium" && "🤔 Medium"}
                    {diff === "hard" && "💪 Hard"}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">📌</span>
                {t("addHabit.priority")}
              </label>
              <div className="priority-selector">
                {(["low", "medium", "high"] as const).map((pri) => (
                  <button
                    key={pri}
                    className={`priority-btn ${priority === pri ? "active" : ""}`}
                    onClick={() => setPriority(pri)}
                  >
                    {pri === "low" && "⬇️ Low"}
                    {pri === "medium" && "➡️ Medium"}
                    {pri === "high" && "⬆️ High"}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Cost */}
            <div className="form-group">
              <div className="slider-group">
                <div className="slider-header">
                  <label className="slider-label">
                    <span>⚡ {t("addHabit.energyCost")}</span>
                  </label>
                  <span className="slider-value">{energyCost}/10</span>
                </div>
                <input
                  className="habit-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={energyCost}
                  onChange={(e) => setEnergyCost(parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">
                <span className="form-label-icon">📝</span>
                {t("addHabit.notes")}
              </label>
              <textarea
                className="habit-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("addHabit.notesPlaceholder")}
                maxLength={150}
              />
            </div>

            {/* Social */}
            <div className="form-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={canShare}
                  onChange={(e) => setCanShare(e.target.checked)}
                />
                <span className="checkbox-label">👥 {t("addHabit.canShare")}</span>
              </label>
            </div>
          </div>
        </div>

        {/* ================= 7️⃣ VERIFICATION SYSTEM (AUTO-DETECTED) ================= */}
        <div className="form-section">
          <h3 className="form-section-title">🎮 {t("verification.title") || "Verification"}</h3>

          <div className="verification-info">
            <p className="verification-subtitle">
              {t("verification.autoDetected") || "System automatically detected:"}
            </p>

            <div className="verification-type-display">
              <div className="verification-badge">
                <span className="verification-icon">
                  {verificationType === "timer" && "⏱️"}
                  {verificationType === "checklist" && "✅"}
                  {verificationType === "proof" && "📸"}
                  {verificationType === "sensor" && "👟"}
                  {verificationType === "auto" && "🤖"}
                  {verificationType === "tap" && "👆"}
                </span>
                <div className="verification-details">
                  <strong>{verificationType.toUpperCase()}</strong>
                  <small>
                    {verificationType === "timer" && (t("verification.timer.description") || "Time-based completion")}
                    {verificationType === "timer" && (
                      <span style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                        Duration: {timerDuration} min
                      </span>
                    )}
                    {verificationType === "checklist" && (t("verification.checklist.description") || "Multi-step checklist")}
                    {verificationType === "proof" && (t("verification.proof.description") || "Proof submission required")}
                    {verificationType === "sensor" && (t("verification.sensor.description") || "Sensor-based tracking")}
                    {verificationType === "auto" && (t("verification.auto.description") || "Auto-detect method")}
                    {verificationType === "tap" && (t("verification.tap.description") || "Simple tap to complete")}
                  </small>
                </div>
              </div>
            </div>

            <div className="verification-selector">
              <label className="form-label" style={{ marginBottom: 8 }}>
                {t("verification.changeType") || "Change verification method:"}
              </label>
              <div className="verification-buttons-grid">
                {(["tap", "timer", "checklist", "proof", "sensor"] as const).map((vtype) => (
                  <button
                    key={vtype}
                    className={`verification-type-btn ${verificationType === vtype ? "active" : ""}`}
                    onClick={() => setVerificationType(vtype)}
                  >
                    {vtype === "timer" && "⏱️ Timer"}
                    {vtype === "checklist" && "✅ Checklist"}
                    {vtype === "proof" && "📸 Proof"}
                    {vtype === "sensor" && "👟 Sensor"}
                    {vtype === "tap" && "👆 Tap"}
                  </button>
                ))}
              </div>
            </div>
            {verificationType === "timer" && (
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={timerDuration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) setTimerDuration(val);
                  }}
                  className="habit-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="button-group">
          <button className="habit-cancel" onClick={() => navigate("/")}>
            ❌ {t("addHabit.cancel")}
          </button>
          <button className="habit-save" onClick={handleSave}>
            ✅ {t("addHabit.saveHabit")}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
