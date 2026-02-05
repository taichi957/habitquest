import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Habit } from "../types/habit";

type HabitState = {
  habits: Habit[];

  addHabit: (data: {
    title: string;
    color: string;
    badgeId?: string;
    badgeName?: string;
  }) => void;

  toggleComplete: (id: string) => void;
  removeHabit: (id: string) => void;
  addStreakToHabit: (id: string, amount: number) => void; // ✅ NEW
  resetToday: () => void;
  resetHabits: () => void; // ✅ NEW
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

      // ===== ADD HABIT =====
      addHabit: (data) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: crypto.randomUUID(),
              title: data.title,
              color: data.color,

              badgeId: data.badgeId,
              badgeName: data.badgeName,

              completedToday: false,
              streak: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

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

      // ===== RESET ALL HABITS (IMPORTANT) =====
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
