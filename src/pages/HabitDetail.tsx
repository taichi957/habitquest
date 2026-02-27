import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHabitStore } from "../store/useHabitStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useShopStore } from "../store/useShopStore";
import { useTranslation } from "../hooks/useTranslation";
import { useNotification } from "../hooks/useNotification";
import { useLanguageStore } from "../store/useLanguageStore";
import { BADGES, getBadgeInfo } from "../data/badges";
import { setProofData, toggleChecklistItem } from "../utils/verificationSystem";
import PhoneFrame from "../components/PhoneFrame";
import "../css/habitDetailModal.css";

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habits = useHabitStore((s) => s.habits);
  const toggleHabit = useHabitStore((s) => s.toggleComplete);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const gainExp = usePlayerStore((s) => s.gainExp);
  const loseHp = usePlayerStore((s) => s.loseHp);
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const ownedItemIds = useShopStore((s) => s.ownedItemIds);
  const hasShield = ownedItemIds.includes("shield");
  const t = useTranslation();
  const notify = useNotification();
  const lang = useLanguageStore((s) => s.language);

  const habit = habits.find((h) => h.id === id);
  const [completionValue, setCompletionValue] = useState(0);
  const [showError, setShowError] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0); // elapsed
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const targetSeconds = (habit?.verificationConfig?.timer?.duration || 30) * 60;
  const remainingSeconds = Math.max(0, targetSeconds - timerSeconds);
  const [proofImage, setProofImage] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [sensorInput, setSensorInput] = useState("");

  useEffect(() => {
    if (!habit) {
      navigate("/");
    }
  }, [habit, navigate]);

  // ⏱️ TIMER EFFECT (increment elapsed, stop when reaching duration)
  useEffect(() => {
    if (!isTimerRunning || habit?.verificationType !== "timer") return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev + 1 >= targetSeconds) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return targetSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, habit?.verificationType, targetSeconds]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!habit) {
    return (
      <PhoneFrame>
        <div style={{ textAlign: "center", padding: "20px" }}>
          {t("habit.habitNotFound")}
        </div>
      </PhoneFrame>
    );
  }

  const badgeData = habit.badge
    ? BADGES.find((b) => b.id === habit.badge)
    : null;

  const badgeInfo =
    badgeData && habit.badge ? getBadgeInfo(habit.badge, lang) : null;

  // ✅ Validate completion based on goal type
  const validateCompletion = (): boolean => {
    // If habit has verification type, skip goal completion check
    // Verification type will handle the validation instead
    if (habit.verificationType) {
      return true; // Let verification type handle validation
    }

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

  // 📸 HANDLE IMAGE UPLOAD
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      notify(t("habit.selectImageFile") || "Please select an image file", "warning");
      return;
    }

    // Set uploading state
    setIsImageUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setProofImage(base64String);
      setIsImageUploading(false);
      
      // Auto-submit after upload completes
      // Save to habit config immediately
      if (habit && habit.verificationConfig) {
        const updatedConfig = setProofData(habit.verificationConfig, base64String);
        updateHabit(habit.id, { verificationConfig: updatedConfig });
      }
    };
    reader.onerror = () => {
      notify(t("habit.imageUploadFailed") || "Failed to upload image", "error");
      setIsImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // ✅ HANDLE CHECKLIST TOGGLE
  const handleChecklistToggle = (itemId: string) => {
    if (!habit || !habit.verificationConfig) return;

    const updatedConfig = toggleChecklistItem(habit.verificationConfig, itemId);
    updateHabit(habit.id, { verificationConfig: updatedConfig });
  };

  // ===== VALIDATE VERIFICATION METHOD =====
  const validateVerificationCompletion = (currentHabit: any): boolean => {
    switch (currentHabit.verificationType) {
      case "tap":
        // Tap method always completes successfully
        return true;

      case "timer": {
        // Timer must reach target duration (in minutes)
        const targetMinutes = currentHabit.goal?.target || 30;
        const targetSeconds = targetMinutes * 60;
        if (timerSeconds < targetSeconds) {
          setShowError(true);
          return false;
        }
        return true;
      }

      case "checklist": {
        // Must complete all checked items
        if (!currentHabit.verificationConfig?.checklist?.items) {
          return true;
        }
        const allCompleted = currentHabit.verificationConfig.checklist.items.every(
          (item: any) => item.completed
        );
        if (!allCompleted) {
          setShowError(true);
          return false;
        }
        return true;
      }

      case "proof": {
        // Must provide image proof - check verificationConfig
        if (!currentHabit.verificationConfig?.proof?.proofData) {
          setShowError(true);
          return false;
        }
        return true;
      }

      case "sensor": {
        // Must reach target sensor value (steps, distance, etc)
        const targetValue = currentHabit.goal?.target || 1000;
        if (parseInt(sensorInput, 10) < targetValue) {
          setShowError(true);
          return false;
        }
        return true;
      }

      case "auto":
      default:
        // Auto-detect always completes
        return true;
    }
  };

  const handleComplete = () => {
    // Prevent completing while image is uploading
    if (isImageUploading) {
      notify("Please wait for image to finish uploading...", "info");
      return;
    }

    // Get the latest habit from store (not the closure variable)
    const currentHabit = habits.find((h) => h.id === id);
    if (!currentHabit) return;

    if (validateCompletion() && validateVerificationCompletion(currentHabit)) {
      if (!currentHabit.completedToday) {
        const expAmount = currentHabit.expReward || 50;
        gainExp(expAmount);
      } else {
        loseHp(10);
      }

      toggleHabit(currentHabit.id);
      setCompletionValue(0);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setProofImage("");
      setSensorInput("");
      setShowError(false);
      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  };

  const handleDelete = () => {
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
    navigate("/");
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
    <PhoneFrame>
      <div className="modal-content" style={{ borderRadius: 0, boxShadow: "none" }}>
        {/* ===== BACK BUTTON ===== */}
        <button
          className="modal-close"
          onClick={() => navigate("/")}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
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
          <div className="stat-item">
            <span className="stat-label">{getVerificationIcon()}</span>
            <span className="stat-value" style={{ fontSize: 12 }}>
              {habit.verificationType}
            </span>
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
            <h4 className="section-title">🎯 {t("habit.goal")}</h4>
            <div className="goal-info">
              <div>
                <strong>{t("habit.goalType") || "Goal Type:"}</strong>{" "}
                {habit.goal.type === "count" && t("habit.goalCount")}
                {habit.goal.type === "time" && t("habit.goalTime")}
                {habit.goal.type === "quantity" && t("habit.goalQuantity")}
              </div>
              <div>
                <strong>{t("habit.targetLabel") || "Target:"}</strong> {habit.goal.target}{" "}
                {habit.goal.unit && `${habit.goal.unit}`}
              </div>

              {/* Input for completion
              <div style={{ marginTop: "10px" }}>
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
              </div> */}
            </div>
          </div>
        )}

        {/* ===== SCHEDULE SECTION ===== */}
        {habit.schedule && (
          <div className="modal-section">
            <h4 className="section-title">📅 {t("habit.schedule")}</h4>
            <div className="schedule-info">
              <div>
                <strong>{t("habit.daysLabel") || "Days:"}</strong>{" "}
                {habit.schedule.daysOfWeek.join(", ")}
              </div>
              <div>
                <strong>{t("habit.frequencyLabel") || "Frequency:"}</strong>{" "}
                {habit.schedule.frequency === "daily" && t("habit.frequencyDaily")}
                {habit.schedule.frequency === "alternate" && t("habit.frequencyAlternate")}
                {habit.schedule.frequency === "custom" && t("habit.frequencyCustom")}
              </div>
              <div>
                <strong>{t("habit.timesPerDayLabel") || "Times/Day:"}</strong> {habit.schedule.timesPerDay}
              </div>
              {habit.schedule.specificTime && (
                <div>
                  <strong>{t("habit.specificTimeLabel") || "Specific Time:"}</strong>{" "}
                  {habit.schedule.specificTime}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== REMINDER SECTION ===== */}
        {habit.reminder && habit.reminder.enabled && (
          <div className="modal-section">
            <h4 className="section-title">🔔 {t("habit.reminderSection")}</h4>
            <div className="reminder-info">
              <div>
                <strong>{t("habit.timeLabel") || "Time:"}</strong> {habit.reminder.time}
              </div>
              <div>
                <strong>{t("habit.soundLabel") || "Sound:"}</strong>{" "}
                {habit.reminder.sound === "none" && t("habit.soundNone")}
                {habit.reminder.sound === "bell" && t("habit.soundBell")}
                {habit.reminder.sound === "chime" && t("habit.soundChime")}
                {habit.reminder.sound === "vibrate" && t("habit.soundVibrate")}
              </div>
              {habit.reminder.repeatIfIncomplete && (
                <div>⚠️ {t("habit.repeatIfIncomplete")}</div>
              )}
            </div>
          </div>
        )}

        {/* ===== VERIFICATION SECTION ===== */}
        <div className="modal-section">
          <h4 className="section-title">🎮 {getVerificationIcon()} {t("habit.verificationSection") || "Verification"}</h4>

          {/* TAP TYPE */}
          {habit.verificationType === "tap" && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "64px", marginBottom: "10px" }}>👆</div>
              <p>{t("habit.ready") || "Ready? Just complete this habit!"}</p>
            </div>
          )}

          {/* TIMER TYPE */}
          {habit.verificationType === "timer" && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "10px" }}>
                {formatTime(remainingSeconds)}
              </div>
              <small style={{ display: "block", marginBottom: "15px" }}>
                {t("habit.targetTime") || "Target:"} {formatTime(targetSeconds)}
              </small>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    if (timerSeconds === 0) setTimerSeconds(0);
                    setIsTimerRunning(true);
                  }}
                  disabled={isTimerRunning}
                  style={{ flex: 1 }}
                >
                  ▶️ {t("habit.startButton") || "Start"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setIsTimerRunning(false)}
                  disabled={!isTimerRunning}
                  style={{ flex: 1 }}
                >
                  ⏸️ {t("habit.stopButton") || "Stop"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setTimerSeconds(0)}
                  style={{ flex: 1 }}
                >
                  🔄 {t("habit.resetButton") || "Reset"}
                </button>
              </div>
            </div>
          )}

          {/* PROOF TYPE */}
          {habit.verificationType === "proof" && (
            <div style={{ padding: "15px" }}>
              <p>{t("habit.uploadProof") || "Upload proof of completion:"}</p>
              
              {/* Image Upload */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "bold", color: "#FFD76E" }}>
                  📸 {t("habit.chooseImage") || "Choose Image:"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isImageUploading}
                  style={{
                    padding: "8px",
                    border: "2px solid #FFD76E",
                    borderRadius: "6px",
                    width: "100%",
                    cursor: isImageUploading ? "not-allowed" : "pointer",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    opacity: isImageUploading ? 0.6 : 1
                  }}
                />
                {isImageUploading && (
                  <div style={{ marginTop: "8px", color: "#FFD76E", fontSize: "12px" }}>
                    ⏳ {t("habit.uploadingImage") || "Uploading image..."}
                  </div>
                )}
                {proofImage && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <img 
                      src={proofImage} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: "100%", 
                        maxHeight: "150px", 
                        borderRadius: "8px",
                        border: "2px solid #FFD76E"
                      }}
                    />
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "#FFD76E" }}>
                      ✅ {t("habit.imageUploadedSuccess") || "Image uploaded and saved"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SENSOR TYPE */}
          {habit.verificationType === "sensor" && (
            <div style={{ padding: "15px" }}>
              <p>{t("habit.enterSensorData") || "Enter sensor data"} ({habit.goal?.unit || "count"}):</p>
              <input
                type="number"
                placeholder={t("habit.enterCount") || "Enter count..."}
                value={sensorInput}
                onChange={(e) => setSensorInput(e.target.value)}
                className="completion-input"
              />
              <small style={{ display: "block", marginTop: "10px", color: "#666" }}>
                {t("habit.targetTime") || "Target:"} {habit.goal?.target || 1000} {habit.goal?.unit || ""}
              </small>
            </div>
          )}

          {/* CHECKLIST TYPE */}
          {habit.verificationType === "checklist" && (
            <div style={{ padding: "15px" }}>
              <p>{t("habit.completeChecklist") || "Complete all checklist items below:"}</p>
              {habit.verificationConfig?.checklist?.items && habit.verificationConfig.checklist.items.length > 0 ? (
                <div style={{ marginTop: "12px" }}>
                  {habit.verificationConfig.checklist.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChecklistToggle(item.id)}
                      style={{
                        padding: "10px",
                        marginBottom: "8px",
                        background: item.completed ? "#2d5a2d" : "#1a1a1a",
                        border: `2px solid ${item.completed ? "#4caf50" : "#FFD76E"}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        transition: "all 0.2s",
                        userSelect: "none"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        style={{ cursor: "pointer", width: "18px", height: "18px" }}
                      />
                      <span style={{ textDecoration: item.completed ? "line-through" : "none", color: item.completed ? "#4caf50" : "#fff" }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: "10px", color: "#666" }}>
                  <small>{t("habit.noChecklistItems") || "No checklist items configured"}</small>
                </div>
              )}
            </div>
          )}

          {/* AUTO TYPE */}
          {habit.verificationType === "auto" && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🤖</div>
              <p>{t("habit.autoDetected") || "Automatically detected completion"}</p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {showError && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              background: "#ffebee",
              border: "1px solid #ef5350",
              borderRadius: "4px",
              color: "#d32f2f",
              fontSize: "14px"
            }}>
              ❌ {t("habit.verificationIncomplete") || "Verification not complete yet!"}
              {habit.verificationType === "timer" && (
                <div>{t("habit.needTimerMinutes", { minutes: habit.goal?.target || 30 }) || `You need to run the timer for ${habit.goal?.target || 30} minutes`}</div>
              )}
              {habit.verificationType === "proof" && (
                <div>{t("habit.needProofImage") || "Upload an image as proof"}</div>
              )}
              {habit.verificationType === "sensor" && (
                <div>{t("habit.needSensorValue", { value: habit.goal?.target || 1000, unit: habit.goal?.unit || "" }) || `You need to reach ${habit.goal?.target || 1000} ${habit.goal?.unit || ""}`}</div>
              )}
              {habit.verificationType === "checklist" && (
                <div>{t("habit.needChecklistComplete") || "You need to complete all checklist items"}</div>
              )}
            </div>
          )}
        </div>

        {/* ===== PRIORITY & DIFFICULTY ===== */}
        <div className="modal-section">
          <h4 className="section-title">⚙️ {t("habit.settings")}</h4>
          <div className="settings-grid">
            {habit.priority && (
              <div>
                <strong>📌 {t("habit.priorityLabel") || "Priority:"}</strong>{" "}
                {habit.priority === "low" && t("habit.priorityLow")}
                {habit.priority === "medium" && t("habit.priorityMedium")}
                {habit.priority === "high" && t("habit.priorityHigh")}
              </div>
            )}
            {habit.energyCost && (
              <div>
                <strong>⚡ {t("habit.energyLabel") || "Energy:"}</strong> {habit.energyCost}/10
              </div>
            )}
          </div>

          {habit.notes && (
            <div style={{ marginTop: "10px" }}>
              <strong>📝 {t("habit.notesLabel") || "Notes:"}</strong>
              <p className="notes-text">{habit.notes}</p>
            </div>
          )}
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => navigate("/")}>
            ❌ {t("addHabit.cancel")}
          </button>
          <button
            className={`btn-danger`}
            onClick={handleDelete}
            disabled={dayLocked}
          >
            🗑 {t("habit.deleteButton")}
          </button>
          <button
            className={`btn-primary ${dayLocked || isImageUploading ? "disabled" : ""}`}
            onClick={handleComplete}
            disabled={dayLocked || isImageUploading}
            title={isImageUploading ? t("habit.uploadingWait") : ""}
          >
            {isImageUploading ? "⏳ Uploading..." : " " + t("habit.done")}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
