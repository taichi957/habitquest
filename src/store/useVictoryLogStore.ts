import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translations } from "../i18n/translations"; // ✅ NEW
import { useLanguageStore } from "./useLanguageStore"; // ✅ NEW

export type VictoryLog = {
  id: string;
  date: string;
  day: number;
  messageKey?: string; // ✅ NEW - lưu key thay vì nội dung
  message?: string; // ✅ OLD - keep for backward compatibility
  timestamp: string;
};

type VictoryLogState = {
  logs: VictoryLog[];
  addLog: (date: string, day: number) => void;
  getLogs: () => VictoryLog[];
  removeLog: (id: string) => void;
  resetLogs: () => void;
};

export const useVictoryLogStore = create<VictoryLogState>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (date, day) => {
        set((state) => {
          // ✅ Kiểm tra nếu đã có log hôm nay
          const existingLog = state.logs.find((log) => log.date === date);
          if (existingLog) return state;

          // ✅ LẤY MESSAGES TỪ TRANSLATIONS THEO NGÔN NGỮ HIỆN TẠI
          const lang = useLanguageStore.getState().language;
          const messages = translations[lang].victoryLog.messages;

          const randomIndex = Math.floor(Math.random() * messages.length);
          const messageKey = `victory_${randomIndex}`;
          const messageText = messages[randomIndex];

          return {
            logs: [
              ...state.logs,
              {
                id: crypto.randomUUID(),
                date,
                day,
                messageKey, // ✅ Lưu key
                message: messageText, // ✅ Backup text
                timestamp: new Date().toISOString(),
              },
            ],
          };
        });
      },

      getLogs: () => get().logs,

      // ✅ REMOVE LOG
      removeLog: (id) =>
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        })),

      resetLogs: () =>
        set({
          logs: [],
        }),
    }),
    {
      name: "habitquest-victory-log",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
