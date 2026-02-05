import { useEffect } from "react";
import { fetchServerDate } from "../api/timeApi";
import { useTimeStore } from "../store/useTimeStore";
import { useHabitStore } from "../store/useHabitStore";
import { usePlayerStore } from "../store/usePlayerStore";

export function useDailyCheck() {
  const lastDate = useTimeStore((s) => s.lastDate);
  const nextDay = useTimeStore((s) => s.nextDay);

  const resetToday = useHabitStore((s) => s.resetToday);
  const unlockDay = usePlayerStore((s) => s.unlockDay);

  useEffect(() => {
    async function checkDate() {
      try {
        const today = await fetchServerDate();

        if (lastDate !== today) {
          // 🌅 NGÀY MỚI
          resetToday();
          unlockDay();
          nextDay(today); // ✅ CHỈ GỌI HÀM NÀY
        }
      } catch (e) {
        console.error("Time API error", e);
      }
    }

    checkDate();
  }, [lastDate, resetToday, unlockDay, nextDay]);
}
