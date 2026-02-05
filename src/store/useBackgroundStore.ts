import { create } from "zustand";
import { persist } from "zustand/middleware";
import bg1 from "../assets/bg1.png";
import { BACKGROUNDS } from "../data/backgrounds";

type BackgroundState = {
  unlockedBackgroundIds: string[];
  selectedBackground: string;
  unlockBackground: (id: string) => void;
  selectBackground: (id: string) => void;
  resetBackgrounds: () => void;
};

export const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      unlockedBackgroundIds: ["bg1"],
      selectedBackground: bg1,

      unlockBackground: (id) =>
        set((state) => ({
          unlockedBackgroundIds: [...state.unlockedBackgroundIds, id],
        })),

      selectBackground: (id) => {
        const bg = BACKGROUNDS.find((b) => b.id === id);
        if (bg) {
          set({
            selectedBackground: bg.src,
          });
        }
      },

      resetBackgrounds: () =>
        set({
          unlockedBackgroundIds: ["bg1"],
          selectedBackground: bg1,
        }),
    }),
    {
      name: "habitquest-backgrounds",
    }
  )
);
