import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Achievement } from "../types/achievement";
import type { Habit } from "../types/habit";

type AchievementState = {
  achievements: Achievement[];
  checkAchievements: (habits: Habit[]) => void;
  resetAchievements: () => void; // ✅ NEW
};

const initialAchievements: Achievement[] = [
  {
    id: "first_habit",
    title: "The First Step",
    description: "Complete your first habit",
    unlocked: false,
  },
  {
    id: "streak_7",
    title: "7-Day Perseverance",
    description: "Reach a 7-day streak on any habit",
    unlocked: false,
  },
  {
    id: "streak_30",
    title: "Habit Master",
    description: "Reach a 30-day streak on any habit",
    unlocked: false,
  },
  {
    id: "daily_all",
    title: "Perfection",
    description: "Complete all daily habits",
    unlocked: false,
  },
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set) => ({
      achievements: initialAchievements,

      // ===== CHECK ACHIEVEMENTS =====
      checkAchievements: (habits) => {
        set((state) => {
          const updated = state.achievements.map((a) => {
            if (a.unlocked) return a;

            let conditionMet = false;

            switch (a.id) {
              case "first_habit":
                conditionMet = habits.some((h) => h.completedToday);
                break;

              case "streak_7":
                conditionMet = habits.some((h) => h.streak >= 7);
                break;

              case "streak_30":
                conditionMet = habits.some((h) => h.streak >= 30);
                break;

              case "daily_all":
                conditionMet =
                  habits.length > 0 &&
                  habits.every((h) => h.completedToday);
                break;
            }

            if (conditionMet) {
              return {
                ...a,
                unlocked: true,
                unlockedAt: new Date().toISOString(),
              };
            }

            return a;
          });

          return { achievements: updated };
        });
      },

      // ===== RESET ALL ACHIEVEMENTS =====
      resetAchievements: () =>
        set(() => ({
          achievements: initialAchievements,
        })),
    }),
    {
      name: "habitquest-achievements",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
