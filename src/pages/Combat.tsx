import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import PlayerStatus from "../components/PlayerStatus";
import { usePlayerStore } from "../store/usePlayerStore";
import { useTranslation } from "../hooks/useTranslation";
import { useNotification } from "../hooks/useNotification";

export default function Combat() {
  const energy = usePlayerStore((s) => s.player.energy);
  const spendEnergy = usePlayerStore((s) => s.spendEnergy);
  const battlesWon = usePlayerStore((s) => s.battlesWon);
  const t = useTranslation();
  const notify = useNotification();
  const navigate = useNavigate();

  const handleStart = (battleType: 1 | 2 | 3) => {
    if (energy < 2) {
      notify(t("combat.notEnoughEnergy"), "warning");
      return;
    }
    spendEnergy(2);

  let path = "/combat/battle";

  switch (battleType) {
    case 1:
      path = "/combat/battle";
      break;
    case 2:
      path = "/combat/battle1";
      break;
    case 3:
      path = "/combat/battle2";
      break;
  }
    navigate(path);
  };

  return (
    <PhoneFrame>
      {/* reuse existing status component to show level / gold / energy */}
      <PlayerStatus />

      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>{t("combat.title")}</h2>
        <p>
          {t("combat.energyLabel")} : {energy} {t("playerStatus.energy")}
        </p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          {t("combat.costPerRun")}
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            onClick={() => handleStart(1)}
            disabled={energy < 2}
            style={{ fontSize: 24, width: 80, height: 80, borderRadius: 40 }}
            title="Battle 1 - Luôn có sẵn"
          >
            1
          </button>
          <button
            onClick={() => handleStart(2)}
            disabled={energy < 2 || !battlesWon.battle1}
            style={{ fontSize: 24, width: 80, height: 80, borderRadius: 40 }}
            title={battlesWon.battle1 ? "Battle 2 - Đã mở khóa" : "Battle 2 - Hãy thắng Battle 1 trước"}
          >
            2
          </button>
          <button
            onClick={() => handleStart(3)}
            disabled={energy < 2 || !battlesWon.battle2}
            style={{ fontSize: 24, width: 80, height: 80, borderRadius: 40 }}
            title={battlesWon.battle2 ? "Battle 3 - Đã mở khóa" : "Battle 3 - Hãy thắng Battle 2 trước"}
          >
            3
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
