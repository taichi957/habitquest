import type { Habit } from "../types/habit";
import { initializeVerificationConfig } from "../utils/verificationSystem";

/**
 * 🎮 SEED DATA - Ví dụ các habits để demo
 */
export const SEED_HABITS: Habit[] = [
  // ⏱️ TIMER - 30 phút học tiếng Nhật
  {
    id: "habit-timer-1",
    title: "30分勉強する",
    description: "Learn Japanese for 30 minutes",
    color: "#4ECDC4",
    icon: "📚",
    completedToday: false,
    streak: 7,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    badge: "star",
    badgeName: "Diligence",
    expReward: 75,
    coinReward: 20,
    difficulty: "medium",
    priority: "high",
    energyCost: 7,
    notes: "Morning session - practice vocabulary",
    schedule: {
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      frequency: "daily",
      timesPerDay: 1,
      specificTime: "07:00",
    },
    goal: {
      type: "time",
      target: 30,
      unit: "phút",
    },
    reminder: {
      enabled: true,
      time: "07:00",
      sound: "bell",
      repeatIfIncomplete: true,
    },
    totalCompleted: 7,
    completionRate: 100,
    canShare: true,
    isGroupChallenge: false,
    verificationType: "timer",
    verificationConfig: initializeVerificationConfig("timer", "30分勉強する"),
  },

  // ✅ CHECKLIST - Làm việc nhà
  {
    id: "habit-checklist-1",
    title: "掃除と片付け",
    description: "Clean and organize the room",
    color: "#FFD76E",
    icon: "🧹",
    completedToday: false,
    streak: 3,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    badge: undefined,
    expReward: 50,
    coinReward: 15,
    difficulty: "easy",
    priority: "medium",
    energyCost: 4,
    notes: "Weekend cleaning task",
    schedule: {
      daysOfWeek: ["Sat", "Sun"],
      frequency: "daily",
      timesPerDay: 1,
      specificTime: "08:00",
    },
    goal: {
      type: "count",
      target: 3,
      unit: "tasks",
    },
    reminder: {
      enabled: true,
      time: "08:00",
      sound: "chime",
      repeatIfIncomplete: false,
    },
    totalCompleted: 3,
    completionRate: 100,
    canShare: false,
    isGroupChallenge: false,
    verificationType: "checklist",
    verificationConfig: {
      checklist: {
        items: [
          { id: "item-1", text: "掃除 (Clean room)", completed: false },
          { id: "item-2", text: "片付け (Organize desk)", completed: false },
          { id: "item-3", text: "ゴミ出し (Take out trash)", completed: false },
        ],
        requiredCount: 3,
      },
    },
  },

  // 📸 PROOF - Chạy bộ
  {
    id: "habit-proof-1",
    title: "毎日ランニング",
    description: "Daily running - take proof photo",
    color: "#FF6B9D",
    icon: "🏃",
    completedToday: false,
    streak: 12,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    badge: "warrior",
    badgeName: "Warrior",
    expReward: 100,
    coinReward: 30,
    difficulty: "hard",
    priority: "high",
    energyCost: 9,
    notes: "Outdoor running - morning or evening",
    schedule: {
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      frequency: "daily",
      timesPerDay: 1,
      specificTime: "06:00",
    },
    goal: {
      type: "quantity",
      target: 5,
      unit: "km",
    },
    reminder: {
      enabled: true,
      time: "06:00",
      sound: "bell",
      repeatIfIncomplete: true,
    },
    totalCompleted: 12,
    completionRate: 100,
    canShare: true,
    isGroupChallenge: true,
    verificationType: "proof",
    verificationConfig: {
      proof: {
        proofRequired: true,
        proofType: "photo",
        proofData: undefined,
      },
    },
  },

  // 👟 SENSOR - Đi bộ 10k bước
  {
    id: "habit-sensor-1",
    title: "10000歩歩く",
    description: "Walk 10,000 steps daily",
    color: "#96CEB4",
    icon: "🚶",
    completedToday: false,
    streak: 5,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    badge: undefined,
    expReward: 60,
    coinReward: 18,
    difficulty: "medium",
    priority: "medium",
    energyCost: 6,
    notes: "Track with phone step counter",
    schedule: {
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      frequency: "daily",
      timesPerDay: 1,
      specificTime: "20:00",
    },
    goal: {
      type: "quantity",
      target: 10000,
      unit: "steps",
    },
    reminder: {
      enabled: false,
      sound: "none",
      repeatIfIncomplete: false,
    },
    totalCompleted: 5,
    completionRate: 100,
    canShare: false,
    isGroupChallenge: false,
    verificationType: "sensor",
    verificationConfig: {
      sensor: {
        stepGoal: 10000,
        currentSteps: 0,
        accuracy: "medium",
      },
    },
  },

  // 👆 TAP - Uống nước
  {
    id: "habit-tap-1",
    title: "水を飲む",
    description: "Drink a glass of water",
    color: "#45B7D1",
    icon: "💧",
    completedToday: false,
    streak: 21,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    badge: "fire",
    badgeName: "Persistence",
    expReward: 20,
    coinReward: 5,
    difficulty: "easy",
    priority: "low",
    energyCost: 1,
    notes: "Keep hydrated - 8 glasses per day",
    schedule: {
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      frequency: "custom",
      timesPerDay: 8,
      specificTime: "09:00",
    },
    goal: {
      type: "count",
      target: 8,
      unit: "glasses",
    },
    reminder: {
      enabled: true,
      time: "09:00",
      sound: "vibrate",
      repeatIfIncomplete: false,
    },
    totalCompleted: 21,
    completionRate: 100,
    canShare: false,
    isGroupChallenge: false,
    verificationType: "tap",
    verificationConfig: {},
  },

  // 🤖 AUTO-DETECT Example - Meditation
  {
    id: "habit-meditation-1",
    title: "瞑想 15分",
    description: "Morning meditation practice",
    color: "#DDA0DD",
    icon: "🧘",
    completedToday: false,
    streak: 10,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    badge: undefined,
    expReward: 75,
    coinReward: 20,
    difficulty: "medium",
    priority: "high",
    energyCost: 5,
    notes: "Use app: Insight Timer or Calm",
    schedule: {
      daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      frequency: "daily",
      timesPerDay: 1,
      specificTime: "06:30",
    },
    goal: {
      type: "time",
      target: 15,
      unit: "minutes",
    },
    reminder: {
      enabled: true,
      time: "06:30",
      sound: "bell",
      repeatIfIncomplete: true,
    },
    totalCompleted: 10,
    completionRate: 100,
    canShare: true,
    isGroupChallenge: false,
    verificationType: "timer",
    verificationConfig: initializeVerificationConfig("timer", "瞑想 15分"),
  },
];

/**
 * 🏆 Returns seed habits (or empty array if user prefers fresh start)
 */
export function getSeedHabits(): Habit[] {
  // Set to empty array if you want users to start fresh
  // return [];

  // Return seed habits for demo/testing
  return SEED_HABITS;
}
