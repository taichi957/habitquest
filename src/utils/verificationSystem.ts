import type { VerificationType, VerificationConfig } from "../types/habit";

/**
 * 🤖 AUTO-DETECT VERIFICATION TYPE
 * Dựa trên keyword trong habit title để phân loại
 */
export function detectVerificationType(title: string, description?: string): VerificationType {
  const text = `${title} ${description || ""}`.toLowerCase();

  // ⏱️ Timer keywords: 分 / 時間 / 分間 / hours / minutes
  const timerKeywords = [
    "分", "時間", "時間", "分間", "分勉強", "hour", "minute", "mins", "hours",
    "運動", "歩く", "走る", "トレーニング", "workout", "exercise", "run", "walk", "train"
  ];
  if (timerKeywords.some(kw => text.includes(kw))) {
    return "timer";
  }

  // ✅ Checklist keywords: リスト / チェック / 項目 / steps / tasks
  const checklistKeywords = [
    "リスト", "チェック", "項目", "ステップ", "掃除", "片付け", "list", "steps", "tasks",
    "買い物", "準備", "チェックリスト", "清掃", "整理", "organize", "prepare", "cleaning"
  ];
  if (checklistKeywords.some(kw => text.includes(kw))) {
    return "checklist";
  }

  // 📸 Proof keywords: 写真 / 証拠 / 証明 / photo / image / proof
  const proofKeywords = [
    "写真", "証拠", "証明", "撮る", "photo", "image", "proof", "picture", "screenshot",
    "証拠写真", "記録写真", "画像", "証書"
  ];
  if (proofKeywords.some(kw => text.includes(kw))) {
    return "proof";
  }

  // 👟 Sensor keywords: 歩数 / ステップ / 距離 / steps / km
  const sensorKeywords = [
    "歩数", "ステップ", "距離", "km", "steps", "walk distance", "running distance",
    "カロリー", "心拍", "height", "elevation"
  ];
  if (sensorKeywords.some(kw => text.includes(kw))) {
    return "sensor";
  }

  // デフォルト: tap (シンプルクリック)
  return "tap";
}

/**
 * 🎛️ INITIALIZE VERIFICATION CONFIG
 * Tạo config mặc định dựa trên verificationType
 */
export function initializeVerificationConfig(
  verificationType: VerificationType,
  title?: string
): VerificationConfig {
  const config: VerificationConfig = {};

  switch (verificationType) {
    case "timer":
      // Default 30 minutes
      config.timer = {
        duration: 30,
        isRunning: false,
        elapsedTime: 0,
      };
      break;

    case "checklist":
      // Default 3 items
      config.checklist = {
        items: [
          { id: "item-1", text: "", completed: false },
          { id: "item-2", text: "", completed: false },
          { id: "item-3", text: "", completed: false },
        ],
        requiredCount: 3,
      };
      break;

    case "proof":
      config.proof = {
        proofRequired: true,
        proofType: "photo",
        proofData: undefined,
      };
      break;

    case "sensor":
      config.sensor = {
        stepGoal: 10000,
        currentSteps: 0,
        accuracy: "medium",
      };
      break;

    case "auto":
      // Auto-detect actual type
      const detectedType = detectVerificationType(title || "");
      config.detectedType = detectedType;
      // Recursively initialize config for detected type
      return initializeVerificationConfig(detectedType, title);

    case "tap":
    default:
      // No extra config needed
      break;
  }

  return config;
}

/**
 * ✅ VALIDATE COMPLETION
 * Check xem habit có đủ điều kiện hoàn thành không
 */
export function validateCompletion(
  verificationType: VerificationType,
  config?: VerificationConfig
): { valid: boolean; message?: string } {
  switch (verificationType) {
    case "tap":
      // Tap không cần validation gì
      return { valid: true };

    case "timer":
      if (!config?.timer) {
        return { valid: false, message: "Timer config not found" };
      }
      // Timer phải chạy xong (elapsedTime >= duration)
      const elapsedTime = config.timer.elapsedTime || 0;
      const duration = config.timer.duration || 30;
      if (elapsedTime < duration * 60) {
        // Chuyển phút sang giây
        const remaining = Math.ceil((duration * 60 - elapsedTime) / 60);
        return {
          valid: false,
          message: `⏱️ 残り ${remaining} 分`,
        };
      }
      return { valid: true };

    case "checklist":
      if (!config?.checklist) {
        return { valid: false, message: "Checklist config not found" };
      }
      const completedCount = config.checklist.items.filter(
        (item) => item.completed
      ).length;
      const required = config.checklist.requiredCount;
      if (completedCount < required) {
        return {
          valid: false,
          message: `✅ ${completedCount}/${required} 完了`,
        };
      }
      return { valid: true };

    case "proof":
      if (!config?.proof) {
        return { valid: false, message: "Proof config not found" };
      }
      if (config.proof.proofRequired && !config.proof.proofData) {
        return { valid: false, message: "📸 証拠をアップロードしてください" };
      }
      return { valid: true };

    case "sensor":
      if (!config?.sensor) {
        return { valid: false, message: "Sensor config not found" };
      }
      const currentSteps = config.sensor.currentSteps || 0;
      const stepGoal = config.sensor.stepGoal;
      if (currentSteps < stepGoal) {
        return {
          valid: false,
          message: `👟 ${currentSteps}/${stepGoal} steps`,
        };
      }
      return { valid: true };

    case "auto":
      if (!config?.detectedType) {
        return { valid: false, message: "Auto-detected type not found" };
      }
      return validateCompletion(config.detectedType, config);

    default:
      return { valid: false, message: "Unknown verification type" };
  }
}

/**
 * 🔄 UPDATE TIMER ELAPSED TIME
 */
export function updateTimerElapsedTime(
  config: VerificationConfig,
  elapsedSeconds: number
): VerificationConfig {
  if (!config.timer) return config;

  return {
    ...config,
    timer: {
      ...config.timer,
      elapsedTime: elapsedSeconds,
    },
  };
}

/**
 * ✅ TOGGLE CHECKLIST ITEM
 */
export function toggleChecklistItem(
  config: VerificationConfig,
  itemId: string
): VerificationConfig {
  if (!config.checklist) return config;

  return {
    ...config,
    checklist: {
      ...config.checklist,
      items: config.checklist.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    },
  };
}

/**
 * 📸 SET PROOF DATA
 */
export function setProofData(
  config: VerificationConfig,
  proofData: string
): VerificationConfig {
  if (!config.proof) return config;

  return {
    ...config,
    proof: {
      ...config.proof,
      proofData,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * 👟 UPDATE SENSOR STEPS
 */
export function updateSensorSteps(
  config: VerificationConfig,
  currentSteps: number
): VerificationConfig {
  if (!config.sensor) return config;

  return {
    ...config,
    sensor: {
      ...config.sensor,
      currentSteps,
    },
  };
}
