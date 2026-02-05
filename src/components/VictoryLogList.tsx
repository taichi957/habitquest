import { useState } from "react";
import { useVictoryLogStore } from "../store/useVictoryLogStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore"; // ✅ NEW
import { translations } from "../i18n/translations"; // ✅ NEW

export default function VictoryLogList() {
  const logs = useVictoryLogStore((s) => s.logs);
  const removeLog = useVictoryLogStore((s) => s.removeLog);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language); // ✅ NEW

  const handleDelete = (id: string) => {
    const ok = window.confirm(t("victoryLog.deleteConfirm"));
    if (!ok) return;

    setDeletingId(id);
    setTimeout(() => {
      removeLog(id);
      setDeletingId(null);
    }, 300);
  };

  // ✅ HELPER: Get translated message
  const getDisplayMessage = (log: ReturnType<typeof useVictoryLogStore.getState>["logs"][0]) => {
    if (log.messageKey) {
      const match = log.messageKey.match(/victory_(\d+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const messages = translations[lang].victoryLog.messages;
        return messages[index] || log.message || "Victory!";
      }
    }
    return log.message || "Victory!";
  };

  if (logs.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          opacity: 0.6,
          background: "rgba(255,215,0,0.03)",
          borderRadius: 12,
          border: "2px dashed rgba(255,215,0,0.2)",
          marginTop: 12,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚔️</div>
        {t("victoryLog.noVictories")}
      </div>
    );
  }

  return (
    <div className="victory-log-list">
      {logs.map((log, index) => (
        <div
          key={log.id}
          className="victory-log-item"
          style={{
            animation: `slideIn 0.5s ease-out ${index * 0.1}s backwards`,
            opacity: deletingId === log.id ? 0 : 1,
            transform:
              deletingId === log.id ? "translateX(100%)" : "translateX(0)",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          <div className="log-header">
            <span className="log-day">⭐ Day {log.day}</span><br></br>
            <span className="log-date">{log.date}</span>
          </div>
          <p className="log-message">{getDisplayMessage(log)}</p>

          {/* DELETE BUTTON */}
          <button
            onClick={() => handleDelete(log.id)}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(255,69,0,0.8)",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              cursor: "pointer",
              padding: "4px 8px",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.2s ease",
              opacity: 0.7,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.background = "rgba(255,69,0,1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.7";
              e.currentTarget.style.background = "rgba(255,69,0,0.8)";
            }}
            title="Delete this log"
          >
            🗑 Delete
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
