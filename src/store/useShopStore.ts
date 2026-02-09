import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopItem } from "../types/item";


type ShopState = {
  items: ShopItem[];
  ownedItemIds: string[];
  consumableQuantity: Record<string, number>; // ✅ NEW

  buyItem: (
    item: ShopItem,
    gold: number,
    spendGold: (amount: number) => void
  ) => void;

  consumeItem: (itemId: string) => void;
  resetShop: () => void; // ✅ NO PARAMS - just reset owned items
};

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      items: [
        // 📘 BUFF ITEMS (1 lần)
        {
          id: "exp_boost",
          name: "📘 EXP Boost",
          description: "+20% EXP per habit",
          price: 100,
          icon: "📘",
          type: "buff",
          effect: { expBonus: 0.2 },
        },
        {
          id: "gold_boost",
          name: "💰 Gold Rush",
          description: "+30% Gold per habit",
          price: 80,
          icon: "💰",
          type: "buff",
          effect: { goldBonus: 0.3 },
        },
        {
          id: "hp_boost",
          name: "❤️ Vitality",
          description: "+50 Max HP",
          price: 150,
          icon: "❤️",
          type: "buff",
          effect: { hpBonus: 50 },
        },

        // 🛡️ PASSIVE ITEMS (1 lần)
        {
          id: "shield",
          name: "🛡️ Shield",
          description: "50% reduce delete damage",
          price: 80,
          icon: "🛡️",
          type: "passive",
          effect: { reduceDeleteDamage: 0.5 },
        },
        {
          id: "barrier",
          name: "🔷 Barrier",
          description: "75% reduce delete damage",
          price: 150,
          icon: "🔷",
          type: "passive",
          effect: { reduceDeleteDamage: 0.75 },
        },

        // 🧪 CONSUMABLE ITEMS (nhiều lần)
        {
          id: "heal_potion",
          name: "🧪 Heal Potion",
          description: "Restore 30 HP",
          price: 50,
          icon: "🧪",
          type: "consumable",
          effect: { healHp: 30 },
        },
        {
          id: "mega_potion",
          name: "🧬 Mega Potion",
          description: "Restore 60 HP",
          price: 100,
          icon: "🧬",
          type: "consumable",
          effect: { healHp: 60 },
        },
        {
          id: "revive_scroll",
          name: "💊 Revive Scroll",
          description: "Revive when dead",
          price: 120,
          icon: "💊",
          type: "consumable",
          effect: { revive: true },
        },
        {
          id: "streak_elixir",
          name: "⚗️ Streak Elixir",
          description: "+1 Streak (any habit)",
          price: 90,
          icon: "⚗️",
          type: "consumable",
          effect: { streak: 1 },
        },
      ],

      ownedItemIds: [],
      consumableQuantity: {},

      /* ===== BUY ITEM ===== */
      buyItem: (item, gold, spendGold) => {
        if (gold < item.price) return;

        const { ownedItemIds } = get();

        // 🧪 CONSUMABLE - có thể mua nhiều lần
        if (item.type === "consumable") {
          spendGold(item.price);
          set((state) => ({
            ownedItemIds: [...state.ownedItemIds, item.id],
            consumableQuantity: {
              ...state.consumableQuantity,
              [item.id]: (state.consumableQuantity[item.id] ?? 0) + 1,
            },
          }));
          return;
        }

        // 🛡️ BUFF/PASSIVE - chỉ mua 1 lần
        if (ownedItemIds.includes(item.id)) return;

        spendGold(item.price);
        set((state) => ({
          ownedItemIds: [...state.ownedItemIds, item.id],
        }));
      },

      /* ===== CONSUME ITEM ===== */
      consumeItem: (itemId) => {
        set((state) => {
          const qty = state.consumableQuantity[itemId] ?? 1;

          if (qty <= 1) {
            // Xóa hoàn toàn
            return {
              ownedItemIds: state.ownedItemIds.filter((id) => id !== itemId),
              consumableQuantity: {
                ...state.consumableQuantity,
                [itemId]: 0,
              },
            };
          }

          // Giảm quantity
          return {
            consumableQuantity: {
              ...state.consumableQuantity,
              [itemId]: qty - 1,
            },
          };
        });
      },

      /* ===== RESET SHOP ===== */
      resetShop: () => {
        localStorage.removeItem("habitquest-shop-v12");
        return set({
          ownedItemIds: [],
          consumableQuantity: {},
        });
      },
    }),
    {
      name: "habitquest-shop-v12",
    }
  )
);
