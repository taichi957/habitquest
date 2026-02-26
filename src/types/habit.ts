export type HabitDifficulty = "easy" | "medium" | "hard";
export type HabitPriority = "low" | "medium" | "high";
export type GoalType = "count" | "time" | "status" | "quantity";
export type NotificationSound = "none" | "bell" | "chime" | "vibrate";

// 🎮 VERIFICATION SYSTEM
export type VerificationType = "tap" | "timer" | "checklist" | "proof" | "sensor" | "auto";

// ⏱️ Timer config
export type TimerConfig = {
  duration: number; // phút
  isRunning?: boolean;
  elapsedTime?: number; // giây
};

// ✅ Checklist config
export type ChecklistConfig = {
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  requiredCount: number; // bao nhiêu items cần check
};

// 📸 Proof config
export type ProofConfig = {
  proofRequired: boolean;
  proofType: "photo" | "text" | "signature";
  proofData?: string; // base64 or URL
  timestamp?: string;
};

// 👟 Sensor config
export type SensorConfig = {
  stepGoal: number;
  currentSteps?: number;
  accuracy: "high" | "medium" | "low"; // sensors khác nhau
};

// 🔍 Verification config (union của tất cả types)
export type VerificationConfig = {
  timer?: TimerConfig;
  checklist?: ChecklistConfig;
  proof?: ProofConfig;
  sensor?: SensorConfig;
  detectedType?: VerificationType; // cho auto-detect
};

// 📝 Schedule configuration
export type Schedule = {
  daysOfWeek: string[]; // ["Mon", "Tue", "Wed", ...]
  frequency: "daily" | "alternate" | "custom"; // hàng ngày / cách ngày / tùy chỉnh
  timesPerDay: number; // số lần mỗi ngày
  specificTime?: string; // VD: "07:00"
};

// 🎯 Goal configuration
export type Goal = {
  type: GoalType; // count, time, status, quantity
  target?: number; // VD: 10 (cho count), 30 (cho time phút), 2 (cho quantity lít...)
  unit?: string; // VD: "lần", "phút", "lít", ""
};

// 🔔 Reminder configuration
export type ReminderConfig = {
  enabled: boolean;
  time?: string; // "07:00"
  sound: NotificationSound;
  repeatIfIncomplete: boolean; // nhắc lại nếu chưa hoàn thành
};

export type Habit = {
  id: string;
  title: string;
  description?: string; // 📝 mô tả chi tiết mục tiêu
  color: string;
  icon?: string; // emoji hoặc id icon từ data
  completedToday: boolean;
  streak: number;
  createdAt: string;

  // 🎯 Gamification
  badge?: string; // id badge
  badgeName?: string; // tên hiển thị
  expReward?: number; // exp khi hoàn thành (default: 50)
  coinReward?: number; // coin khi hoàn thành (default: 10)
  // Grouped rewards (new)
  rewards?: {
    exp?: number;
    coin?: number;
  };

  // ⏱️ Schedule
  schedule?: Schedule; // lịch thực hiện
  
  // 🎯 Goal
  goal?: Goal; // mục tiêu
  
  // 🔔 Reminder
  reminder?: ReminderConfig; // nhắc nhở
  
  // 📊 Tracking
  completionRate?: number; // tỷ lệ hoàn thành %
  totalCompleted?: number; // tổng lần hoàn thành
  
  // 🧠 Advanced
  difficulty?: HabitDifficulty; // độ khó
  priority?: HabitPriority; // mức ưu tiên
  energyCost?: number; // năng lượng tiêu hao (1-10)
  
  // 📝 Feedback
  notes?: string; // ghi chú sau khi hoàn thành
  moodTrack?: "sad" | "neutral" | "happy"; // cảm xúc
  
  // 👥 Social
  canShare?: boolean; // chia sẻ với bạn bè
  isGroupChallenge?: boolean; // nhóm challenge

  // 🎮 VERIFICATION SYSTEM - NEW
  verificationType: VerificationType; // loại xác minh (default: "tap")
  verificationConfig?: VerificationConfig; // config cho verification
};
