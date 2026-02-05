import { create } from "zustand";
import { persist } from "zustand/middleware";

type TimeState = {
  currentDay: number;
  lastDate: string | null;
  nextDay: (today: string) => void;
  resetTime: (today: string) => void; };

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      currentDay: 1,
      lastDate: null,

      nextDay: (today: string) => {
        const { lastDate, currentDay } = get();

        if (today !== lastDate) {
          set({
            currentDay: currentDay + 1,
            lastDate: today,
          });
        }
      },

resetTime: (today: string) =>
  set({
    currentDay: 1,
    lastDate: today,
  }),

    }),
    {
      name: "habitquest-time",
    }
  )
);
