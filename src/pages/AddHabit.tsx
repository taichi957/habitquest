import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabitStore } from "../store/useHabitStore";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore } from "../store/useLanguageStore"; // ✅ NEW
import { BADGES, getBadgeInfo } from "../data/badges"; // ✅ NEW
import PhoneFrame from "../components/PhoneFrame";

export default function AddHabit() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const habits = useHabitStore((s) => s.habits);
  const navigate = useNavigate();
  const t = useTranslation();
  const lang = useLanguageStore((s) => s.language); // ✅ NEW

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#FFD76E");
  const [badgeId, setBadgeId] = useState<string | undefined>(undefined);
  const [previewBadge, setPreviewBadge] = useState<typeof BADGES[0] | null>(null);

  const maxStreak = Math.max(0, ...habits.map((h) => h.streak));

  return (
    <PhoneFrame>
      {/* ================= ADD HABIT BOX ================= */}
      <div className="page-card">
        <h2 className="page-title">{t("addHabit.title")}</h2>

        <div className="habit-form">
          <input
            className="habit-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("addHabit.habitName")}
            maxLength={30}
          />

          <input
            className="habit-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Pick a color"
          />
        </div>
      </div>

      {/* ================= ACHIEVEMENT BOX ================= */}
      <div className="page-card">
        <h3 className="page-subtitle">{t("addHabit.badge")}</h3>

        <div className="badge-grid">
          {BADGES.map((b) => {
            const unlocked = maxStreak >= b.requiredStreak;
            const badgeInfo = getBadgeInfo(b.id, lang); // ✅ GET TRANSLATED INFO

            return (
              <button
                key={b.id}
                disabled={!unlocked}
                className={`badge-btn
                  ${badgeId === b.id ? "active" : ""}
                  ${!unlocked ? "locked" : ""}
                `}
                onClick={() => {
                  setBadgeId(b.id);
                  setPreviewBadge(b);
                }}
                title={!unlocked ? `Unlock at ${b.requiredStreak} streak` : badgeInfo.name}
              >
                {b.icon} {badgeInfo.name} {/* ✅ USE TRANSLATED NAME */}
              </button>
            );
          })}
        </div>

        {previewBadge && (
          <div className="badge-preview">
            {(() => {
              const info = getBadgeInfo(previewBadge.id, lang); // ✅ GET INFO
              return (
                <>
                  <strong>{previewBadge.icon} {info.name}</strong>
                  <p>⭐ {info.effect}</p>
                  <small>🔥 Streak: {previewBadge.requiredStreak}</small>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* ================= SAVE BUTTON ================= */}
      <button
        className="habit-save floating"
        onClick={() => {
          if (!title.trim()) {
            alert(t("addHabit.enterName"));
            return;
          }
          addHabit({
            title,
            color,
            badgeId,
          });
          navigate("/");
        }}
        style={{ marginBottom: 12 }}
      >
        {t("addHabit.saveHabit")}
      </button>
    </PhoneFrame>
  );
}
