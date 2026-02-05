import { create } from "zustand";
import { persist } from "zustand/middleware";

type AvatarState = {
  unlockedAvatarIds: string[];
  unlockAvatar: (id: string) => void;
  resetAvatars: () => void;
};

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      //  avatar FREE
      unlockedAvatarIds: ["avatar1"],

      unlockAvatar: (id) =>
        set((state) => ({
          unlockedAvatarIds: [...state.unlockedAvatarIds, id],
        })),

      resetAvatars: () =>
        set({
          unlockedAvatarIds: ["avatar1"],
        }),
    }),
    {
      name: "habitquest-avatars",
    }
  )
);
