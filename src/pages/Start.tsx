import PhoneFrame from "../components/PhoneFrame";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguageStore, type Language } from "../store/useLanguageStore"; // ✅ NEW
import { useSoundStore } from "../store/useSoundStore"; // ✅ NEW
import { useState } from "react"; // ✅ NEW

type Props = {
  onStart: () => void;
};

export default function Start({ onStart }: Props) {
  const t = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const soundEnabled = useSoundStore((s) => s.enabled);
  const bgVolume = useSoundStore((s) => s.bgVolume);
  const sfxVolume = useSoundStore((s) => s.sfxVolume);
  const toggleSound = useSoundStore((s) => s.toggle);
  const setBgVolume = useSoundStore((s) => s.setBgVolume);
  const setSFXVolume = useSoundStore((s) => s.setSFXVolume);
  const [showSettings, setShowSettings] = useState(false); // ✅ NEW

  return (
    <PhoneFrame>
      <div className="page-card">
        <h2 className="page-title">HabitQuest</h2>
        
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#531607">
                <path d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160ZM334-583l24-23 23-24-23 24-24 23Zm-56 57L80-724v-160h160l198 198-57 56-174-174h-47v47l174 174-56 57Zm92 199 430-430v-47h-47L323-374l47 47Zm0 0-24-23-23-24 23 24 24 23Z"/>
            </svg>
          </div>
          
          <h3 style={{ marginBottom: "30px", fontSize: "18px" }}>
            {t("start.welcome")}
          </h3>
          
          <p style={{ marginBottom: "40px", opacity: 0.8, fontSize: "14px" }}>
            {t("start.description")}
          </p>
          
          {/* ===== START BUTTON ===== */}
          <button
            onClick={onStart}
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              background: "linear-gradient(#ffb45c, #e08b3a)",
              border: "4px solid #6b4a2b",
              borderRadius: "12px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 0 #6b4a2b",
              transition: "all 0.2s",
              marginBottom: "20px",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(4px)";
              e.currentTarget.style.boxShadow = "0 0 0 #6b4a2b";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 0 #6b4a2b";
            }}
          >
            {t("start.startButton")}
          </button>
          
          {/* ===== SETTING BUTTON ===== */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              background: "linear-gradient(#e8c4a0, #c3873a)",
              border: "3px solid #6b4a2b",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 3px 0 #6b4a2b",
              transition: "all 0.2s",
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(3px)";
              e.currentTarget.style.boxShadow = "0 0 0 #6b4a2b";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 3px 0 #6b4a2b";
            }}
          >
            ⚙️ {t("start.settings")}
          </button>
        </div>

        {/* ===== SETTINGS SECTION ===== */}
        {showSettings && (
          <div style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: "2px solid #6b4a2b" }}>
            {/* 🌍 LANGUAGE SELECT */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
                {t("profile.language")}
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {(["en", "vi", "ja"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: language === lang ? "3px solid #4caf50" : "2px solid #6b4a2b",
                      background: language === lang ? "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" : "linear-gradient(135deg, #fdf0d5, #fce8c3)",
                      color: language === lang ? "#2d5a2d" : "#4a2f1b",
                      fontWeight: 600,
                      fontSize: "11px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {lang === "en" && "US"}
                    {lang === "vi" && "VN"}
                    {lang === "ja" && "JP"}
                  </button>
                ))}
              </div>
            </div>

            {/* 🎵 SOUND BUTTON */}
            <button
              onClick={toggleSound}
              style={{
                marginBottom: "20px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: soundEnabled ? "#c3873a" : "#6b4a2b",
                color: "#fff",
                fontWeight: 600,
                width: "100%",
                cursor: "pointer",
              }}
            >
              {soundEnabled ? t("profile.sound.on") : t("profile.sound.off")}
            </button>

            {/* 🎵 BACKGROUND MUSIC VOLUME */}
            {soundEnabled && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  {t("profile.sound.bgMusic")}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={bgVolume}
                  onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    height: "6px",
                    borderRadius: "3px",
                  }}
                />
                <small style={{ opacity: 0.7, display: "block", marginTop: "4px" }}>
                  {Math.round(bgVolume * 100)}%
                </small>
              </div>
            )}

            {/* 🔊 SOUND EFFECTS VOLUME */}
            {soundEnabled && (
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                  {t("profile.sound.sfx")}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={sfxVolume}
                  onChange={(e) => setSFXVolume(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    height: "6px",
                    borderRadius: "3px",
                  }}
                />
                <small style={{ opacity: 0.7, display: "block", marginTop: "4px" }}>
                  {Math.round(sfxVolume * 100)}%
                </small>
              </div>
            )}
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
