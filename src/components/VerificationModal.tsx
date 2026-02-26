import { useState, useEffect } from "react";
import type { Habit } from "../types/habit";
import {
  validateCompletion,
  updateTimerElapsedTime,
  toggleChecklistItem,
  setProofData,
  updateSensorSteps,
} from "../utils/verificationSystem";
import { useTranslation } from "../hooks/useTranslation";
import { useNotification } from "../hooks/useNotification"; // custom toast notifications
import { usePlayerStore } from "../store/usePlayerStore";
import { useHabitStore } from "../store/useHabitStore";
import { BADGES } from "../data/badges";
import "../css/verificationModal.css";

type Props = {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export default function VerificationModal({
  habit,
  isOpen,
  onClose,
  onComplete,
}: Props) {
  const t = useTranslation();
  const notify = useNotification();
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const updateHabit = useHabitStore((s) => s.updateHabit);

  // Timer state (elapsed seconds)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // compute target/remaining for countdown
  const targetSeconds = (habit.verificationConfig?.timer?.duration || 30) * 60;
  const remainingSeconds = Math.max(0, targetSeconds - timerSeconds);

  // Proof state
  const [showProofInput, setShowProofInput] = useState(false);
  const [proofImage, setProofImage] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Sensor state
  const [sensorInput, setSensorInput] = useState("");

  // Validation state
  const [showError, setShowError] = useState(false);

  const badgeData = habit.badge ? BADGES.find((b) => b.id === habit.badge) : null;

  // ⏱️ TIMER EFFECT (increment elapsed and stop when reaching target)
  useEffect(() => {
    if (!isTimerRunning || habit.verificationType !== "timer") return;

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
  }, [isTimerRunning, habit.verificationType, targetSeconds]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 🎯 HANDLE TIMER CONTROL
  const handleTimerStart = () => {
    // reset elapsed if starting from zero
    if (timerSeconds === 0) {
      setTimerSeconds(0);
    }
    setIsTimerRunning(true);
  };

  const handleTimerStop = () => {
    setIsTimerRunning(false);
  };

  // ✅ HANDLE CHECKLIST TOGGLE
  const handleChecklistToggle = (itemId: string) => {
    if (!habit.verificationConfig) return;

    const updatedConfig = toggleChecklistItem(habit.verificationConfig, itemId);
    updateHabit(habit.id, { verificationConfig: updatedConfig });
  };

  // 📸 HANDLE PROOF UPLOAD
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      notify("Please select an image file", "warning");
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
      if (habit.verificationConfig) {
        const updatedConfig = setProofData(habit.verificationConfig, base64String);
        updateHabit(habit.id, { verificationConfig: updatedConfig });
      }
    };
    reader.onerror = () => {
      notify("Failed to upload image", "error");
      setIsImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // 👟 HANDLE SENSOR UPDATE
  const handleSensorSubmit = () => {
    const steps = parseInt(sensorInput, 10);
    if (isNaN(steps)) return;

    if (!habit.verificationConfig) return;

    const updatedConfig = updateSensorSteps(habit.verificationConfig, steps);
    updateHabit(habit.id, { verificationConfig: updatedConfig });
    setSensorInput("");
  };

  // ✅ VALIDATE & COMPLETE
  const handleComplete = async () => {
    // Prevent completing while image is uploading
    if (isImageUploading) {
      notify("Please wait for image to finish uploading...", "info");
      return;
    }

    const config = habit.verificationConfig;

    // For proof type, also check local proofImage state (might be set from upload)
    if (habit.verificationType === "proof") {
      if (!proofImage && !config?.proof?.proofData) {
        setShowError(true);
        return;
      }
      setShowError(false);
      // Reset state before closing
      setProofImage("");
      setTimerSeconds(0);
      setSensorInput("");
      onComplete();
      onClose();
      return;
    }

    // Update timer config before validation
    if (habit.verificationType === "timer") {
      if (!config) return;
      const updatedConfig = updateTimerElapsedTime(config, timerSeconds);
      updateHabit(habit.id, { verificationConfig: updatedConfig });
      
      const validation = validateCompletion(habit.verificationType, updatedConfig);
      if (!validation.valid) {
        setShowError(true);
        return;
      }
    } else {
      const validation = validateCompletion(habit.verificationType, config);
      if (!validation.valid) {
        setShowError(true);
        return;
      }
    }

    setShowError(false);
    // Reset state before closing
    setProofImage("");
    setTimerSeconds(0);
    setSensorInput("");
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  const isDisabled = dayLocked;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon-badge">
            <span style={{ fontSize: 32 }}>{habit.icon || "⭐"}</span>
            {badgeData && (
              <div className="badge-indicator" style={{ backgroundColor: "#FFD76E" }}>
                {badgeData.icon}
              </div>
            )}
          </div>
          <div>
            <h2>{habit.title}</h2>
            {habit.description && <p className="modal-description">{habit.description}</p>}
          </div>
        </div>

        {/* Stats Row */}
        {habit.verificationType !== "auto" && (
          <div className="stats-row">
            <div className="stat-item">
              <span>🔥</span>
              <div>
                <small>Streak</small>
                <strong>{habit.streak}</strong>
              </div>
            </div>
            <div className="stat-item">
              <span>⭐</span>
              <div>
                <small>EXP</small>
                <strong>{habit.expReward || 50}</strong>
              </div>
            </div>
            <div className="stat-item">
              <span>💰</span>
              <div>
                <small>Gold</small>
                <strong>{habit.coinReward || 10}</strong>
              </div>
            </div>
            <div className="stat-item">
              <span>💪</span>
              <div>
                <small>Difficulty</small>
                <strong>
                  {habit.difficulty === "easy"
                    ? "😊"
                    : habit.difficulty === "medium"
                      ? "🤔"
                      : "💪"}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Verification Content */}
        <div className="verification-content">
          {/* TAP TYPE */}
          {habit.verificationType === "tap" && (
            <div className="verification-section">
              <h3>✅ Simple Tap</h3>
              <p>{t("verification.tap.description") || "Click to complete this habit"}</p>
              <div className="tap-icon">👆</div>
            </div>
          )}

          {/* TIMER TYPE */}
          {habit.verificationType === "timer" && (
            <div className="verification-section">
              <h3>⏱️ Timer</h3>
              <p>
                {t("verification.timer.description") || "Run the timer for"}{" "}
                {habit.verificationConfig?.timer?.duration || 30} minutes
              </p>

              <div className="timer-display">
                <div className="timer-value">{formatTime(remainingSeconds)}</div>
                <small className="timer-target">
                  Target: {formatTime(targetSeconds)}
                </small>
              </div>

              <div className="timer-buttons">
                <button
                  className="btn-secondary"
                  onClick={handleTimerStart}
                  disabled={isTimerRunning}
                >
                  ▶️ Start
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleTimerStop}
                  disabled={!isTimerRunning}
                >
                  ⏸️ Pause
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setTimerSeconds(0)}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          )}

          {/* CHECKLIST TYPE */}
          {habit.verificationType === "checklist" && (
            <div className="verification-section">
              <h3>✅ Checklist</h3>
              <p>
                {t("verification.checklist.description") || "Complete"}{" "}
                {habit.verificationConfig?.checklist?.requiredCount || 0} items
              </p>

              <div className="checklist-items">
                {habit.verificationConfig?.checklist?.items.map((item) => (
                  <label key={item.id} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(item.id)}
                    />
                    <span className={item.completed ? "completed" : ""}>{item.text}</span>
                  </label>
                ))}
              </div>

              <div className="progress-info">
                {habit.verificationConfig?.checklist &&
                  (() => {
                    const completed = habit.verificationConfig.checklist.items.filter(
                      (item) => item.completed
                    ).length;
                    const required = habit.verificationConfig.checklist.requiredCount;
                    return (
                      <p>
                        ✅ {completed}/{required} completed
                      </p>
                    );
                  })()}
              </div>
            </div>
          )}

          {/* PROOF TYPE */}
          {habit.verificationType === "proof" && (
            <div className="verification-section">
              <h3>📸 Proof</h3>
              <p>
                {t("verification.proof.description") ||
                  "Upload proof of completion"}
              </p>

              {habit.verificationConfig?.proof?.proofData ? (
                <div className="proof-uploaded">
                  <div>✅ Proof submitted</div>
                  <small>{habit.verificationConfig.proof.timestamp}</small>
                  {/* Show preview if it's base64 image */}
                  {habit.verificationConfig.proof.proofData.startsWith("data:image") && (
                    <img 
                      src={habit.verificationConfig.proof.proofData} 
                      alt="Proof" 
                      style={{ maxWidth: "100%", marginTop: "10px", borderRadius: "8px" }}
                    />
                  )}
                </div>
              ) : (
                <>
                  {!showProofInput ? (
                    <button className="btn-proof" onClick={() => setShowProofInput(true)}>
                      📸 Upload Proof
                    </button>
                  ) : (
                    <div className="proof-input-group">
                      {/* Image Upload */}
                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", color: "#FFD76E" }}>
                          📸 Choose Image:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isImageUploading}
                          style={{
                            padding: "8px",
                            border: "1px solid #FFD76E",
                            borderRadius: "6px",
                            width: "100%",
                            cursor: isImageUploading ? "not-allowed" : "pointer",
                            opacity: isImageUploading ? 0.6 : 1
                          }}
                        />
                        {isImageUploading && (
                          <div style={{ marginTop: "8px", color: "#FFD76E", fontSize: "12px" }}>
                            ⏳ Uploading image...
                          </div>
                        )}
                        {proofImage && (
                          <img 
                            src={proofImage} 
                            alt="Preview" 
                            style={{ 
                              maxWidth: "100%", 
                              maxHeight: "150px", 
                              marginTop: "10px", 
                              borderRadius: "8px" 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SENSOR TYPE */}
          {habit.verificationType === "sensor" && (
            <div className="verification-section">
              <h3>👟 Steps</h3>
              <p>
                {t("verification.sensor.description") || "Achieve"}{" "}
                {habit.verificationConfig?.sensor?.stepGoal || 10000} steps
              </p>

              <div className="sensor-display">
                <div className="sensor-progress">
                  {(() => {
                    const current = habit.verificationConfig?.sensor?.currentSteps || 0;
                    const goal = habit.verificationConfig?.sensor?.stepGoal || 10000;
                    const percent = Math.min(100, (current / goal) * 100);
                    return (
                      <>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="progress-text">
                          {current} / {goal} steps
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="sensor-input-group">
                <input
                  type="number"
                  placeholder="Enter steps"
                  value={sensorInput}
                  onChange={(e) => setSensorInput(e.target.value)}
                  className="sensor-input"
                />
                <button className="btn-submit" onClick={handleSensorSubmit}>
                  Update
                </button>
              </div>
            </div>
          )}

          {/* AUTO-DETECT (显示实际的验证类型) */}
          {habit.verificationType === "auto" && (
            <div className="verification-section">
              <h3>🤖 Auto-Detected</h3>
              <p>
                Detected Type:{" "}
                <strong>{habit.verificationConfig?.detectedType || "tap"}</strong>
              </p>
              <p>
                {t("verification.auto.description") ||
                  "System automatically detected the verification method"}
              </p>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="error-message">
              ❌{" "}
              {validateCompletion(habit.verificationType, habit.verificationConfig)
                .message || "Completion condition not met"}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            {t("cancel") || "Cancel"}
          </button>
          <button
            className="btn-complete"
            onClick={handleComplete}
            disabled={isDisabled || isImageUploading}
            title={isImageUploading ? "Waiting for image upload..." : ""}
          >
            {isImageUploading ? "⏳ Uploading..." : isDisabled ? "🔒 Locked" : `✅ ${t("complete") || "Complete"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
