import PhoneFrame from "../components/PhoneFrame";
import { useShopStore } from "../store/useShopStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore"; // ✅ NEW
import { translations } from "../i18n/translations"; // ✅ NEW
import type { ShopItem } from "../types/item";
import { useHabitStore } from "../store/useHabitStore";

export default function Store() {
  const items = useShopStore((s) => s.items);
  const ownedItemIds = useShopStore((s) => s.ownedItemIds);
  const consumableQuantity = useShopStore((s) => s.consumableQuantity);
  const buyItem = useShopStore((s) => s.buyItem);
  const resetShop = useShopStore((s) => s.resetShop);
  const consumeItem = useShopStore((s) => s.consumeItem);

  const player = usePlayerStore((s) => s.player);
  const dayLocked = usePlayerStore((s) => s.dayLocked);
  const spendGold = usePlayerStore((s) => s.spendGold);
  const healHp = usePlayerStore((s) => s.healHp);
  const revive = usePlayerStore((s) => s.revive);

  const habits = useHabitStore((s) => s.habits);
  const addStreakToHabit = useHabitStore((s) => s.addStreakToHabit);
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language); // ✅ NEW

  const RESET_COST = 10;

  // ✅ HELPER: Get translated item text
  const getItemText = (itemId: string) => {
    const itemsMap: Record<string, keyof typeof translations["en"]["items"]> = {
      exp_boost: "expBoost",
      gold_boost: "goldBoost",
      hp_boost: "hpBoost",
      shield: "shield",
      barrier: "barrier",
      heal_potion: "healPotion",
      mega_potion: "megaPotion",
      revive_scroll: "reviveScroll",
      streak_elixir: "streakElixir",
    };

    const key = itemsMap[itemId];
    if (!key) return { name: "Unknown", description: "" };

    return translations[lang].items[key];
  };

  const handleUseItem = (item: ShopItem) => {
    if (!item.effect) return;

    if (item.effect.healHp) {
      if (player.hp >= player.maxHp) {
        alert(t("store.hpFull"));
        return;
      }

      healHp(item.effect.healHp);
      consumeItem(item.id);
      return;
    }

    if (item.effect.revive) {
      if (!dayLocked) {
        alert(t("store.notDead"));
        return;
      }

      revive();
      consumeItem(item.id);
      alert(t("store.revived"));
      return;
    }

    if (item.effect.streak) {
      if (habits.length === 0) {
        alert(t("store.noHabits"));
        return;
      }

      const bestHabit = habits.reduce((prev, curr) =>
        prev.streak > curr.streak ? prev : curr
      );

      if (addStreakToHabit) {
        addStreakToHabit(bestHabit.id, item.effect.streak);
        consumeItem(item.id);
        alert(
          t("store.streakAdded", {
            amount: item.effect.streak,
            title: bestHabit.title,
          })
        );
      }
      return;
    }
  };

  return (
    <PhoneFrame>
      <div className="page-card">
        <h2 className="page-title">{t("store.title")}</h2>
        <p style={{ marginBottom: 12, fontSize: 12, marginTop: -6 }}>
          {t("store.gold")}{" "}
          <strong style={{ color: "var(--accent)", fontSize: 14 }}>
            {player.gold}
          </strong>
        </p>

        {/* ===== SHOP ITEMS ===== */}
        <div className="shop-grid">
          {items.map((item) => {
            const owned = ownedItemIds.includes(item.id);
            const isConsumable = item.type === "consumable";
            const qty = consumableQuantity[item.id] ?? 0;

            // ✅ GET TRANSLATED TEXT
            const translatedItem = getItemText(item.id);

            return (
              <div
                key={item.id}
                className={`shop-item ${owned ? "owned" : ""}`}
              >
                <div className="shop-icon">{item.icon}</div>
                <div className="shop-name">{translatedItem.name}</div> {/* ✅ USE TRANSLATED */}

                <div className="shop-description">
                  {translatedItem.description}
                </div> {/* ✅ USE TRANSLATED */}

                <div className="shop-price">{item.price}G</div>

                {/* ===== ACTION BUTTON ===== */}
                {owned ? (
                  isConsumable ? (
                    <button
                      className="use-btn"
                      onClick={() => handleUseItem(item)}
                      title={`Use ${item.name}`}
                    >
                      {t("store.use")}
                      {qty > 0 && <span>({qty})</span>}
                    </button>
                  ) : (
                    <button disabled title="Already owned">
                      {t("store.owned")}
                    </button>
                  )
                ) : (
                  <button
                    disabled={player.gold < item.price || dayLocked}
                    onClick={() => buyItem(item, player.gold, spendGold)}
                    title={
                      dayLocked
                        ? "Cannot buy when locked"
                        : player.gold < item.price
                        ? t("store.noItems")
                        : `Buy ${item.name}`
                    }
                  >
                    {t("store.buy")}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ===== RESET STORE ===== */}
        <button
          className="store-reset-btn"
          disabled={player.gold < RESET_COST || ownedItemIds.length === 0}
          onClick={() => {
            const ok = window.confirm(
              t("store.resetConfirm", { cost: RESET_COST })
            );
            if (!ok) return;

            resetShop(); // ✅ NO PARAMS
            spendGold(RESET_COST);
            alert(t("store.resetSuccess"));
          }}
          title={
            ownedItemIds.length === 0
              ? t("store.noItems")
              : player.gold < RESET_COST
              ? "Not enough gold"
              : "Reset store"
          }
        >
          {t("store.resetStore", { cost: RESET_COST })}
        </button>
      </div>
    </PhoneFrame>
  );
}
