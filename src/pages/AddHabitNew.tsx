import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabitStore } from "../store/useHabitStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore";
import { useNotification } from "../hooks/useNotification";
import { BADGES, getBadgeInfo } from "../data/badges";
import PhoneFrame from "../components/PhoneFrame";
import { getSeedHabits } from "../data/seedHabits";
import type { Habit, Schedule, Goal, ReminderConfig, HabitDifficulty, HabitPriority, VerificationType } from "../types/habit";
import "../css/addHabit.css";

const HABIT_ICONS = ["⭐", "💪", "📚", "🏃", "🧘", "🎯", "🎨", "🎵", "🍎", "💧", "😴", "🚴"];
const COLORS = ["#FFD76E", "#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#87CEEB"];

export default function AddHabitNew() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const habits = useHabitStore((s) => s.habits);
  const navigate = useNavigate();
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language); // For locale support
  const notify = useNotification();

  // ===== STATE MANAGEMENT =====
  const [step, setStep] = useState<"templates" | "form">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Habit | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FFD76E");
  const [icon, setIcon] = useState("⭐");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"daily" | "alternate" | "custom">("daily");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [specificTime, setSpecificTime] = useState("07:00");
  const [goalType, setGoalType] = useState<"count" | "time" | "status" | "quantity">("status");
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalUnit, setGoalUnit] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("07:00");
  const [reminderSound, setReminderSound] = useState<"none" | "bell" | "chime" | "vibrate">("bell");
  const [repeatReminder, setRepeatReminder] = useState(false);
  const [expReward, setExpReward] = useState(50);
  const [coinReward, setCoinReward] = useState(10);
  const [badgeId, setBadgeId] = useState<string | undefined>(undefined);
  const [previewBadge, setPreviewBadge] = useState<typeof BADGES[0] | null>(null);
  const [difficulty, setDifficulty] = useState<HabitDifficulty>("easy");
  const [priority, setPriority] = useState<HabitPriority>("medium");
  const [energyCost, setEnergyCost] = useState(5);
  const [notes, setNotes] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [verificationType, setVerificationType] = useState<VerificationType>("tap");
  // timer duration in minutes (for timer verification)
  const [timerDuration, setTimerDuration] = useState(30);

  const [checklistItems, setChecklistItems] = useState<Array<{ id: string; text: string }>>([
    { id: "1", text: "gather and sort items" },
    { id: "2", text: "dust and clean" },
    { id: "3", text: "organize neatly" },
  ]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const seedHabits = getSeedHabits();
  const maxStreak = Math.max(0, ...habits.map((h) => h.streak || 0));

  // Reward mapping based on difficulty
  const difficultyRewards = {
    easy: { coin: 10, exp: 20 },
    medium: { coin: 20, exp: 50 },
    hard: { coin: 40, exp: 100 },
  };

  // Handle difficulty change and update rewards
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as HabitDifficulty);
    const rewards = difficultyRewards[value as keyof typeof difficultyRewards];
    if (rewards) {
      setCoinReward(rewards.coin);
      setExpReward(rewards.exp);
    }
  };

  // ===== SELECT TEMPLATE & POPULATE FORM =====
  const handleSelectTemplate = (template: Habit) => {
    setSelectedTemplate(template);
    // Load template values into form
    setTitle(template.title);
    setDescription(template.description || "");
    setColor(template.color);
    setIcon(template.icon || "⭐");
    setSelectedDays(template.schedule?.daysOfWeek || []);
    setFrequency(template.schedule?.frequency || "daily");
    setTimesPerDay(template.schedule?.timesPerDay || 1);
    setSpecificTime(template.schedule?.specificTime || "07:00");
    setGoalType(template.goal?.type || "status");
    setGoalTarget(template.goal?.target || 10);
    setGoalUnit(template.goal?.unit || "");
    setReminderEnabled(template.reminder?.enabled || false);
    setReminderTime(template.reminder?.time || "07:00");
    setReminderSound(template.reminder?.sound || "bell");
    setRepeatReminder(template.reminder?.repeatIfIncomplete || false);
    
    // Set difficulty (from template) and auto-set rewards from difficulty
    const templateDifficulty = template.difficulty || "easy";
    setDifficulty(templateDifficulty);
    const rewards = difficultyRewards[templateDifficulty as keyof typeof difficultyRewards];
    setExpReward(rewards.exp);
    setCoinReward(rewards.coin);
    
    setBadgeId(template.badge);
    setPriority(template.priority || "medium");
    setEnergyCost(template.energyCost || 5);
    setNotes(template.notes || "");
    setCanShare(template.canShare || false);
    setVerificationType(template.verificationType || "tap");
    // set timer duration if template has one
    if (template.verificationConfig?.timer?.duration) {
      setTimerDuration(template.verificationConfig.timer.duration);
    }
    
    // Load checklist items from template if available
    if (template.verificationConfig?.checklist?.items) {
      setChecklistItems(
        template.verificationConfig.checklist.items.map((item) => ({
          id: item.id,
          text: item.text,
        }))
      );
    } else {
      // Reset to default checklist items
      setChecklistItems([
        { id: "1", text: "gather and sort items" },
        { id: "2", text: "dust and clean" },
        { id: "3", text: "organize neatly" },
      ]);
    }
    
    setStep("form");
  };

  // ===== CREATE CUSTOM HABIT (FROM TEMPLATE OR SCRATCH) =====
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

    // Create verification config based on type
    const verificationConfig =
      verificationType === "checklist"
        ? {
            checklist: {
              items: checklistItems.map((item) => ({
                id: item.id,
                text: item.text,
                completed: false,
              })),
              requiredCount: checklistItems.length,
            },
          }
        : verificationType === "timer"
        ? {
            timer: {
              duration: timerDuration,
              isRunning: false,
              elapsedTime: 0,
            },
          }
        : undefined;

    addHabit({
      title,
      description,
      color,
      icon,
      schedule,
      goal,
      reminder,
      // Group rewards under `rewards` object
      rewards: {
        exp: expReward,
        coin: coinReward,
      },
      badge: badgeId,
      difficulty,
      priority,
      energyCost,
      notes,
      canShare,
      verificationType,
      verificationConfig,
    });

    navigate("/");
  };

  // ===== AUTO-DETECT VERIFICATION TYPE =====
  // Removed - now user manually selects verification type

  // ===== CHECKLIST ITEM HANDLERS =====
  const handleAddChecklistItem = () => {
    const newItem = {
      id: Date.now().toString(),
      text: "",
    };
    setChecklistItems([...checklistItems, newItem]);
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleUpdateChecklistItem = (id: string, text: string) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    );
  };

  // ===== TOGGLE DAY =====
  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // ===== GET VERIFICATION ICON =====
  const getVerificationIcon = () => {
    switch (verificationType) {
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

  // ============================================
  // 📋 STEP 1: TEMPLATE SELECTOR
  // ============================================
  if (step === "templates") {
    return (
      <PhoneFrame>
        <div className="form-section">
          <h2 className="page-title">✏️ {t("addHabit.title")}</h2>
        </div>

        <div className="template-selector">
          <h3 className="template-title">📌 Choose Template</h3>
          <p className="template-subtitle">Select one of 6 examples or create custom</p>

          <div className="template-grid">
            {seedHabits.map((habit) => {
              const getIcon = () => {
                switch (habit.verificationType) {
                  case "timer":
                    return "⏱️";
                  case "checklist":
                    return "✅";
                  case "proof":
                    return "📸";
                  case "sensor":
                    return "👟";
                  default:
                    return "👆";
                }
              };

              return (
                <button
                  key={habit.id}
                  className="template-card"
                  onClick={() => handleSelectTemplate(habit)}
                >
                  <div className="template-icon">{habit.icon}</div>
                  <div className="template-name">{habit.title}</div>
                  <div className="template-type">{getIcon()}</div>
                </button>
              );
            })}

            {/* CUSTOM BUTTON */}
            <button
              className="template-card custom"
              onClick={() => {
                setSelectedTemplate(null);
                setTitle("");
                setDescription("");
                setColor("#FFD76E");
                setIcon("⭐");
                setSelectedDays([]);
                setFrequency("daily");
                setTimesPerDay(1);
                setSpecificTime("07:00");
                setGoalType("status");
                setGoalTarget(10);
                setGoalUnit("");
                setReminderEnabled(false);
                setReminderTime("07:00");
                setReminderSound("bell");
                setRepeatReminder(false);
                setExpReward(50);
                setCoinReward(10);
                setBadgeId(undefined);
                setDifficulty("easy");
                setPriority("medium");
                setEnergyCost(5);
                setNotes("");
                setCanShare(false);
                setVerificationType("tap");
                setChecklistItems([
                  { id: "1", text: "gather and sort items" },
                  { id: "2", text: "dust and clean" },
                  { id: "3", text: "organize neatly" },
                ]);
                setStep("form");
              }}
            >
              <div className="template-icon">➕</div>
              <div className="template-name">Custom</div>
              <div className="template-type">✨</div>
            </button>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  // ============================================
  // ✏️ STEP 2: EDIT FORM
  // ============================================
  return (
    <PhoneFrame>
      <div className="form-section">
        <h2 className="page-title">✏️ {selectedTemplate ? "Customize Template" : "Create Custom"}</h2>
        <button
          className="back-btn"
          onClick={() => setStep("templates")}
        >
          ← Back
        </button>
      </div>

      <div className="habit-form-container">
        {/* ===== BASIC INFO ===== */}
        <div className="form-section">
          <h3 className="form-section-title">📝 {t("addHabit.basicInfo")}</h3>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="habit-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Habit name..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="habit-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Icon</label>
              <div className="icon-picker">
                {HABIT_ICONS.map((i) => (
                  <button
                    key={i}
                    className={`icon-btn ${icon === i ? "selected" : ""}`}
                    onClick={() => setIcon(i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    className={`color-btn ${color === c ? "selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== GOAL ===== */}
        <div className="form-section">
          <h3 className="form-section-title">🎯 {t("addHabit.goal")}</h3>

          <div className="form-group">
            <label className="form-label">Goal Type</label>
            <select
              className="habit-input"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value as any)}
            >
              <option value="status">Status (No Target)</option>
              <option value="count">Count</option>
              <option value="time">Time (minutes)</option>
              <option value="quantity">Quantity</option>
            </select>
          </div>

          {goalType !== "status" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target</label>
                  <input
                    className="habit-input"
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(parseInt(e.target.value) || 0)}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input
                    className="habit-input"
                    type="text"
                    value={goalUnit}
                    onChange={(e) => setGoalUnit(e.target.value)}
                    placeholder="e.g., min, km, items"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== DIFFICULTY & REWARDS ===== */}
        <div className="form-section">
          <h3 className="form-section-title">⭐ {t("rewards")}</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="habit-input"
                value={difficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
              >
                <option value="easy">Easy 😊</option>
                <option value="medium">Medium 🤔</option>
                <option value="hard">Hard 💪</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="habit-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="low">Low ⬇️</option>
                <option value="medium">Medium ➡️</option>
                <option value="high">High ⬆️</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🎖️ {t("addHabit.badge") || "Achievement Badge"}</label>
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
                <small>🔥 {t("addHabit.unlockedAt") || "Unlock at streak:"} {previewBadge.requiredStreak}</small>
              </div>
            )}
          </div>
        </div>

        {/* ===== SCHEDULE ===== */}
        <div className="form-section">
          <h3 className="form-section-title">📅 {t("addHabit.schedule")}</h3>

          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="habit-input"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
            >
              <option value="daily">Daily</option>
              <option value="alternate">Alternate Days</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {frequency === "custom" && (
            <div className="days-picker">
              <p>{t("addHabit.selectDays") || "Select days:"}</p>
              <div className="days-grid">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    className={`day-btn ${selectedDays.includes(day) ? "selected" : ""}`}
                    onClick={() => handleToggleDay(day)}
                  >
                    {day.substring(0, 1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Times Per Day</label>
              <input
                className="habit-input"
                type="number"
                value={timesPerDay}
                onChange={(e) => setTimesPerDay(parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                className="habit-input"
                type="time"
                value={specificTime}
                onChange={(e) => setSpecificTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ===== REMINDER ===== */}
        <div className="form-section">
          <h3 className="form-section-title">🔔 {t("addHabit.reminder")}</h3>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              Enable Reminder
            </label>
          </div>

          {reminderEnabled && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Reminder Time</label>
                  <input
                    className="habit-input"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sound</label>
                  <select
                    className="habit-input"
                    value={reminderSound}
                    onChange={(e) => setReminderSound(e.target.value as any)}
                  >
                    <option value="none">None</option>
                    <option value="bell">Bell 🔔</option>
                    <option value="chime">Chime 🎵</option>
                    <option value="vibrate">Vibrate 📳</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={repeatReminder}
                    onChange={(e) => setRepeatReminder(e.target.checked)}
                  />
                  Repeat if Incomplete
                </label>
              </div>
            </>
          )}
        </div>

        {/* ===== VERIFICATION TYPE (USER SELECT) ===== */}
        <div className="form-section">
          <h3 className="form-section-title">🎮 Verification Method</h3>
          <p className="form-hint">Choose how to verify habit completion:</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
            {/* Tap - Simple Completion */}
            <button
              type="button"
              className={`verification-btn ${verificationType === "tap" ? "active" : ""}`}
              onClick={() => setVerificationType("tap")}
            >
              👆 Tap<br/>
              <small>Simple click</small>
            </button>

            {/* Timer - Time-based */}
            <button
              type="button"
              className={`verification-btn ${verificationType === "timer" ? "active" : ""}`}
              onClick={() => setVerificationType("timer")}
            >
              ⏱️ Timer<br/>
              <small>Time required</small>
            </button>

            {/* Checklist - Multiple steps */}
            <button
              type="button"
              className={`verification-btn ${verificationType === "checklist" ? "active" : ""}`}
              onClick={() => setVerificationType("checklist")}
            >
              ✅ Checklist<br/>
              <small>Multiple tasks</small>
            </button>

            {/* Proof - Photo/Evidence */}
            <button
              type="button"
              className={`verification-btn ${verificationType === "proof" ? "active" : ""}`}
              onClick={() => setVerificationType("proof")}
            >
              📸 Proof<br/>
              <small>Photo/Evidence</small>
            </button>

            {/* Sensor - GPS/Steps/Activity */}
            <button
              type="button"
              className={`verification-btn ${verificationType === "sensor" ? "active" : ""}`}
              onClick={() => setVerificationType("sensor")}
            >
              👟 Sensor<br/>
              <small>GPS/Steps</small>
            </button>

            {/* Auto - System auto-detect */}
            <button
              type="button"
              className={`verification-btn ${verificationType === "auto" ? "active" : ""}`}
              onClick={() => setVerificationType("auto")}
            >
              🤖 Auto<br/>
              <small>System detect</small>
            </button>
          </div>

          {/* Current selection display */}
          <div className="verification-selection-display">
            <span className="verification-selection-icon">{getVerificationIcon()}</span>
            <p className="verification-selection-text">Selected:</p>
            <p className="verification-selection-type">{verificationType}</p>
          </div>

          {/* TIMER SETTINGS */}
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
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* CHECKLIST ITEMS EDITOR */}
          {verificationType === "checklist" && (
            <div className="checklist-editor">
              <h4 className="checklist-editor-title">✅ Checklist Items</h4>
              
              <div className="checklist-items-list">
                {checklistItems.map((item, index) => (
                  <div key={item.id} className="checklist-item-input-group">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleUpdateChecklistItem(item.id, e.target.value)}
                      placeholder={`Item ${index + 1}`}
                      className="checklist-item-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="checklist-delete-btn"
                    >
                      🗑 Delete
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="checklist-add-btn"
              >
                ➕ Add Item
              </button>

              <div className="checklist-footer">
                <small className="checklist-counter">
                  Total items: <strong>{checklistItems.length}</strong>
                </small>
              </div>
            </div>
          )}
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="form-actions">
          <button className="btn-cancel" onClick={() => setStep("templates")}>
            ← Back
          </button>
          <button className="btn-save" onClick={handleSave}>
            ➕ Add Habit
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
