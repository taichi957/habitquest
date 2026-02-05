import PhoneFrame from "../components/PhoneFrame";
import VictoryLogList from "../components/VictoryLogList";
import { useVictoryLogStore } from "../store/useVictoryLogStore";
import { useTranslation } from "../hooks/useTranslation"; // ✅ NEW
import { Link } from "react-router-dom";

export default function VictoryLogPage() {
  const logs = useVictoryLogStore((s) => s.logs);
  const t = useTranslation(); // ✅ NEW

  return (
    <PhoneFrame>
      <div className="page-card">
        <h2 className="page-title">{t("victoryLog.title")}</h2>
        
        <div style={{ marginBottom: 12, fontSize: 12, opacity: 0.7, textAlign: "center" }}>
          {t("victoryLog.days", { count: logs.length })}
        </div>

        <VictoryLogList />

        <Link 
          to="/profile" 
          className="reset-btn"
          style={{ marginTop: 12 }}
        >
          {t("victoryLog.backToProfile")}
        </Link>
      </div>
    </PhoneFrame>
  );
}
