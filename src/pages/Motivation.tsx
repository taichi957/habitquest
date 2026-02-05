import { useEffect, useState } from "react";
import PhoneFrame from "../components/PhoneFrame";
import { usePlayerStore } from "../store/usePlayerStore";
import { useHabitStore } from "../store/useHabitStore";
import { useAchievementStore } from "../store/useAchievementStore";
import { useTranslation } from "../hooks/useTranslation";
import { translations } from "../i18n/translations";
import { useLanguageStore } from "../store/useLanguageStore";

export default function Motivation() {
  const player = usePlayerStore((s) => s.player);
  const habits = useHabitStore((s) => s.habits);
  const achievements = useAchievementStore((s) => s.achievements);
  const checkAchievements = useAchievementStore((s) => s.checkAchievements);
  const t = useTranslation();

  // 📊 STATS
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedToday).length;
  const maxStreak = Math.max(0, ...habits.map((h) => h.streak));
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  // 💬 MOTIVATIONAL QUOTES (✅ FROM TRANSLATIONS)
  const lang = useLanguageStore((s) => s.language);
  const quotes = translations[lang].quotes; // ✅ FIXED
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // 🌐 API QUOTE
  const [apiQuote] = useState<string>("");

  useEffect(() => {
    async function fetchQuote() {
      try {
        // const res = await fetch("https://api.quotable.io/random");
        // const data = await res.json();
        // setApiQuote(data.content);
      } catch (error) {
        console.log("Quote API failed, using default");
      }
    }
    fetchQuote();
  }, []);

  // ✅ CHECK ACHIEVEMENTS KHOÁ MỖI LẦN HABIT THAY ĐỔI
  useEffect(() => {
    checkAchievements(habits);
  }, [habits, checkAchievements]);

  const displayQuote = apiQuote || randomQuote;
  const tipList = translations[lang].motivation.tipList;

  const achievementPercentage = Math.round(
    (unlockedAchievements / achievements.length) * 100
  );

  // ✅ HELPER: Get translated achievement info
  const getAchievementText = (id: string) => {
    switch (id) {
      case "first_habit":
        return translations[lang].achievements.firstStep;
      case "streak_7":
        return translations[lang].achievements.streak7;
      case "streak_30":
        return translations[lang].achievements.streak30;
      case "daily_all":
        return translations[lang].achievements.dailyAll;
      default:
        return { title: "Unknown", description: "" };
    }
  };

  return (
    <PhoneFrame>
      {/* ===== HEADER ===== */}
      <div className="page-card">
        <h2 className="page-title">{t("motivation.title")}</h2>
      </div>

      {/* ===== MOTIVATIONAL QUOTE ===== */}
      <div
        className="page-card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            margin: "0 0 8px 0",
            lineHeight: 1.4,
          }}
        >
          "{displayQuote}"
        </p>
        {/* <small style={{ opacity: 0.8 }}>
          Keep pushing your limits! 🔥
        </small> */}
      </div>

      {/* ===== STATS GRID ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {/* Habits Stat */}
        <div className="page-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📝</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#667eea" }}>
            {totalHabits}
          </div>
          <small style={{ opacity: 0.7 }}>{t("motivation.totalHabits")}</small>
        </div>

        {/* Completed Today */}
        <div className="page-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#4caf50" }}>
            {completedToday}/{totalHabits}
          </div>
          <small style={{ opacity: 0.7 }}>{t("motivation.doneToday")}</small>
        </div>

        {/* Max Streak */}
        <div className="page-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🔥</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#ff6b35" }}>
            {maxStreak}
          </div>
          <small style={{ opacity: 0.7 }}>{t("motivation.maxStreak")}</small>
        </div>

        {/* Level */}
        <div className="page-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>⭐</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#ffd700" }}>
            {player.level}
          </div>
          <small style={{ opacity: 0.7 }}>{t("motivation.level")}</small>
        </div>
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className="page-card">
        <h3 className="page-subtitle">{t("motivation.progress")}</h3>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 16,
              background: "#ddd",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${achievementPercentage}%`,
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, minWidth: 40 }}>
            {achievementPercentage}%
          </span>
        </div>
        <small style={{ opacity: 0.7 }}>
          {t("motivation.unlocked", {
            count: unlockedAchievements,
            total: achievements.length,
          })}
        </small>
      </div>

      {/* ===== ACHIEVEMENTS ===== */}
      <div className="page-card">
        <h3 className="page-subtitle">{t("motivation.achievements")}</h3>
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          {achievements.map((achievement) => {
            // ✅ GET TRANSLATED TEXT
            const translatedText = getAchievementText(achievement.id);

            return (
              <div
                key={achievement.id}
                style={{
                  padding: 10,
                  background: achievement.unlocked
                    ? "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                    : "rgba(0,0,0,0.05)",
                  borderRadius: 10,
                  border: achievement.unlocked
                    ? "2px solid #4caf50"
                    : "2px solid #ccc",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    opacity: achievement.unlocked ? 1 : 0.3,
                  }}
                >
                  {achievement.unlocked ? "🔓" : "🔒"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: achievement.unlocked ? "#2d5a2d" : "#666",
                    }}
                  >
                    {translatedText.title} {/* ✅ USE TRANSLATED */}
                  </div>
                  <small
                    style={{
                      opacity: achievement.unlocked ? 0.7 : 0.5,
                      color: achievement.unlocked ? "#2d5a2d" : "#666",
                    }}
                  >
                    {translatedText.description} {/* ✅ USE TRANSLATED */}
                  </small>
                </div>
                {achievement.unlocked && (
                  <div style={{ fontSize: 12 }}>✨</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== TIPS ===== */}
      <div className="page-card">
        <h3 className="page-subtitle">{t("motivation.tips")}</h3>
        <ul
          style={{
            paddingLeft: 16,
            margin: "0",
            fontSize: 10,
            lineHeight: 1.6,
          }}
        >
          {tipList.map((tip: string, i: number) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </PhoneFrame>
  );
}
