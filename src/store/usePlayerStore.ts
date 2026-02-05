import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Player } from "../types/player";
import avatar1 from "../assets/avatar1.png";
import deadAvatar from "../assets/dead.png"; // ✅ NEW - IMPORT DEAD AVATAR
import { useShopStore } from "./useShopStore";
import { soundManager } from "../utils/soundManager";
import { useSoundStore } from "./useSoundStore";


type PlayerState = {
  player: Player;
    /* ===== DAY SYSTEM ===== */
  currentDay: number;
  lastDate: string; // YYYY-MM-DD

  nextDay: () => void;
  
  /* ===== DAY / ANIMATION ===== */
  dayLocked: boolean;
  isHealing: boolean;
  isDamaged: boolean;
  
  /* ===== CORE ===== */
  gainExp: (amount: number) => void;
  loseHp: (amount: number) => void;
  healHp: (amount: number) => void;

  clearHealing: () => void;
  clearDamage: () => void;

  /* ===== GOLD ===== */
  addGold: (amount: number) => void;
  spendGold: (amount: number) => void;

  /* ===== DAY CONTROL ===== */
  
  unlockDay: () => void;
  revive: () => void;

  /* ===== PROFILE ===== */
  setAvatar: (avatar: string) => void;
  setName: (name: string) => void;
  resetPlayer: () => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      /* ================= INIT ================= */
      dayLocked: false,
      isHealing: false,
      isDamaged: false,
      currentDay: 1,
    lastDate: new Date().toISOString().slice(0, 10),

      player: {
        name: "Player",
        level: 1,
        exp: 0,
        hp: 100,
        maxHp: 100,
        gold: 0,
        avatar: avatar1,
      },
      
      /* ================= EXP / LEVEL ================= */
      gainExp: (amount) =>
  set((state) => {
    if (state.dayLocked) return state;

    const soundOn = useSoundStore.getState().enabled;
    if (soundOn) {
      soundManager.play("exp");
    }

    const shop = useShopStore.getState();
    let bonusRate = 0;

    if (shop.ownedItemIds.includes("exp_boost")) {
      const expItem = shop.items.find(
        (item) => item.id === "exp_boost"
      );
      bonusRate = expItem?.effect?.expBonus ?? 0;
    }

    const finalExp = Math.floor(amount * (1 + bonusRate));

    let { name, level, exp, hp, maxHp, gold, avatar } = state.player;

    let leveledUp = false; // ✅ KHAI BÁO BIẾN KIỂM TRA LEVEL UP

    exp += finalExp;
    gold += Math.floor(finalExp / 2);

    const expNeeded = level * 100;
    if (exp >= expNeeded) {
      exp -= expNeeded;
      level += 1;
      maxHp = 100 + level * 20;
      hp = maxHp;
      leveledUp = true;
    }

    // 🎵 PHÁT NHẠC LEVEL UP
    if (leveledUp && soundOn) {
      soundManager.play("levelup");
    }

    return {
      player: { name, level, exp, hp, maxHp, gold, avatar },
    };
  }),

      /* ================= DAMAGE ================= */
      loseHp: (amount) =>
        set((state) => {
          if (amount <= 0) return state;
          const soundOn = useSoundStore.getState().enabled;
    if (soundOn) {
      soundManager.play("damage");
    }
          const newHp = Math.max(0, state.player.hp - amount);

          // ✅ DEAD - CHANGE AVATAR TO DEAD.PNG
          const newAvatar = newHp === 0 ? deadAvatar : state.player.avatar;

          return {
            isDamaged: true,
            dayLocked: newHp === 0,
            player: {
              ...state.player,
              hp: newHp,
              avatar: newAvatar, // ✅ CHANGE AVATAR
            },
          };
        }),

      clearDamage: () =>
        set(() => ({
          isDamaged: false,
        })),

      /* ================= HEAL ================= */
      healHp: (amount) =>
        set((state) => {
if (amount <= 0 || state.dayLocked) return {};
const soundOn = useSoundStore.getState().enabled;
    if (soundOn) {
      soundManager.play("heal");
    }
          const newHp = Math.min(
            state.player.maxHp,
            state.player.hp + amount
          );

          return {
            isHealing: true,
            player: {
              ...state.player,
              hp: newHp,
            },
          };
        }),

      clearHealing: () =>
        set(() => ({
          isHealing: false,
        })),

      /* ================= GOLD ================= */
      addGold: (amount) =>
        set((state) => ({
          player: {
            ...state.player,
            gold: state.player.gold + amount,
          },
        })),

      spendGold: (amount) =>
        set((state) => ({
          player: {
            ...state.player,
            gold: Math.max(0, state.player.gold - amount),
          },
        })),

      /* ================= DAY CONTROL ================= */
revive: () =>
  set((state) => {
    if (!state.dayLocked || state.player.gold < 20) return {};

    return {
      dayLocked: false,
      isHealing: true,
      player: {
        ...state.player,
        gold: state.player.gold - 20,
        hp: Math.floor(state.player.maxHp * 0.5),
        avatar: avatar1, // ✅ RESTORE ORIGINAL AVATAR WHEN REVIVED
      },
    };
  }),


      unlockDay: () =>
        set((state) => ({
          dayLocked: false,
          isHealing: true,
          player: {
            ...state.player,
            hp: state.player.maxHp,
            avatar: avatar1, // ✅ RESTORE ORIGINAL AVATAR
          },
        })),

      /* ================= NEXT DAY ================= */
      nextDay: () =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);

          // ❌ vẫn cùng ngày → không làm gì
          if (state.lastDate === today) return {};

          return {
            currentDay: state.currentDay + 1,
            lastDate: today,
            dayLocked: false,
            isHealing: true,
            isDamaged: false,
            player: {
              ...state.player,
              hp: Math.min(
                state.player.maxHp,
                state.player.hp + Math.floor(state.player.maxHp * 0.2)
              ),
            },
          };
        }),


      /* ================= PROFILE ================= */
      setAvatar: (avatar) =>
        set((state) => ({
          player: {
            ...state.player,
            avatar,
          },
        })),

      setName: (name) =>
        set((state) => ({
          player: {
            ...state.player,
            name,
          },
        })),

      /* ================= RESET ================= */
            resetPlayer: () =>
        set(() => ({
          dayLocked: false,
          isHealing: false,
          isDamaged: false,
          currentDay: 1,
          lastDate: new Date().toISOString().slice(0, 10),
          player: {
            name: "Player",
            level: 1,
            exp: 0,
            hp: 100,
            maxHp: 100,
            gold: 0,
            avatar: avatar1,
          },
        })),

    }),
    {
      name: "habitquest-player",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
