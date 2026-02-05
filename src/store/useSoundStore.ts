import { create } from "zustand";
import { persist } from "zustand/middleware";
import { soundManager } from "../utils/soundManager";

type SoundState = {
  enabled: boolean;
  bgVolume: number; // 0 - 1
  sfxVolume: number; // 0 - 1 (🎵 NEW)
  toggle: () => void;
  setBgVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void; // 🎵 NEW
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      enabled: true,
      bgVolume: 0.3,
      sfxVolume: 0.5, // 🎵 NEW

      toggle: () =>
        set((state) => {
          const newEnabled = !state.enabled;

          // 🎵 Điều khiển nhạc nền
          if (newEnabled) {
            soundManager.playBackgroundMusic();
          } else {
            soundManager.pauseBackgroundMusic();
          }

          return {
            enabled: newEnabled,
          };
        }),

      setBgVolume: (volume) =>
        set((_state) => {
          const newVolume = Math.max(0, Math.min(1, volume));
          soundManager.setBackgroundMusicVolume(newVolume);

          return {
            bgVolume: newVolume,
          };
        }),

      // 🎵 SET SFX VOLUME
      setSFXVolume: (volume) =>
        set((_state) => {
          const newVolume = Math.max(0, Math.min(1, volume));
          soundManager.setSFXVolume(newVolume);

          return {
            sfxVolume: newVolume,
          };
        }),
    }),
    {
      name: "habitquest-sound",
    }
  )
);
