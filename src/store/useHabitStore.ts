import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Habit } from "../types/habit";
import { detectVerificationType, initializeVerificationConfig } from "../utils/verificationSystem";
import { getSeedHabits } from "../data/seedHabits";

type HabitState = {
  habits: Habit[];

  addHabit: (data: Partial<Habit>) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void; // ✅ NEW

  toggleComplete: (id: string) => void;
  removeHabit: (id: string) => void;
  addStreakToHabit: (id: string, amount: number) => void; // ✅ NEW
  resetToday: () => void;
  resetHabits: () => void; // ✅ NEW
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      // 🎮 LOAD SEED DATA for first time users
      habits: getSeedHabits(),

      // ===== ADD HABIT =====
      addHabit: (data) =>
        set((state) => {
          // 🤖 AUTO-DETECT VERIFICATION TYPE
          const verificationType =
            data.verificationType ||
            detectVerificationType(data.title || "", data.description);

          // 🎛️ INITIALIZE VERIFICATION CONFIG
          const verificationConfig =
            data.verificationConfig ||
            initializeVerificationConfig(verificationType, data.title);

          return {
            habits: [
              ...state.habits,
              {
                id: crypto.randomUUID(),
                title: data.title || "",
                description: data.description,
                color: data.color || "#FFD76E",
                icon: data.icon,
                completedToday: false,
                streak: 0,
                badge: data.badge,
                badgeName: data.badgeName,
                expReward: data.expReward || 50,
                coinReward: data.coinReward || 10,
                schedule: data.schedule,
                goal: data.goal,
                reminder: data.reminder,
                completionRate: 0,
                totalCompleted: 0,
                difficulty: data.difficulty || "easy",
                priority: data.priority || "medium",
                energyCost: data.energyCost || 5,
                notes: data.notes,
                moodTrack: data.moodTrack,
                canShare: data.canShare ?? false,
                isGroupChallenge: data.isGroupChallenge ?? false,
                createdAt: new Date().toISOString(),
                // 🎮 VERIFICATION SYSTEM
                verificationType,
                verificationConfig,
              },
            ],
          };
        }),

      // ===== TOGGLE COMPLETE =====
      toggleComplete: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedToday: !h.completedToday,
                  streak: !h.completedToday
                    ? h.streak + 1
                    : Math.max(0, h.streak - 1),
                }
              : h
          ),
        })),

      // ===== UPDATE HABIT (for verification config updates) =====
      updateHabit: (id, data) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...data } : h
          ),
        })),

      // ===== REMOVE HABIT =====
      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      // ===== RESET TODAY =====
      resetToday: () =>
        set((state) => ({
          habits: state.habits.map((h) => ({
            ...h,
            completedToday: false,
          })),
        })),

      // ===== ADD STREAK (for Streak Elixir) =====
      addStreakToHabit: (id, amount) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, streak: h.streak + amount }
              : h
          ),
        })),

      // ===== RESET ALL HABITS =====
      resetHabits: () =>
        set(() => ({
          habits: [],
        })),
    }),
    {
      name: "habitquest-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
