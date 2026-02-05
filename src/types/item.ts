// src/types/item.ts

export type ShopItemType = "buff" | "cosmetic" | "consumable" | "passive";

export type ItemEffect = {
  healHp?: number;
  expBonus?: number;
  hpBonus?: number;

  // 🛡 Shield – giảm damage khi xóa habit
  reduceDeleteDamage?: number; // ví dụ: 0.5 = giảm 50%
   revive?: boolean; // ✅ NEW – hồi sinh khi HP về 0
   streak?: number; // ✅ NEW - tăng streak
  goldBonus?: number; // ✅ NEW - tăng gold
};

export type ShopItem = {
  id: string;
  name: string;
  description: string; // ✅ NEW
  price: number;
  icon: string;
  type: ShopItemType;
  effect?: ItemEffect;
  quantity?: number; // ✅ NEW - cho consumable
};
