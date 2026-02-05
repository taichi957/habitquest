import { usePlayerStore } from "../store/usePlayerStore";
import { useHabitStore } from "../store/useHabitStore";
import { useAchievementStore } from "../store/useAchievementStore";
import { useShopStore } from "../store/useShopStore";
import PlayerAvatar from "../components/PlayerAvatar";
import PhoneFrame from "../components/PhoneFrame";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAvatarStore } from "../store/useAvatarStore";
import { fetchServerDate } from "../api/timeApi";
import { useTimeStore } from "../store/useTimeStore";
import { useSoundStore } from "../store/useSoundStore";
import { useVictoryLogStore } from "../store/useVictoryLogStore";
import { useLanguageStore, type Language } from "../store/useLanguageStore";
import { useTranslation } from "../hooks/useTranslation";
import { useBackgroundStore } from "../store/useBackgroundStore"; // ✅ NEW
import { BACKGROUNDS } from "../data/backgrounds"; // ✅ NEW
import { usePetStore } from "../store/usePetStore"; // ✅ NEW
import { PETS, type Pet } from "../data/pets"; // ✅ NEW - ADD TYPE

import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import avatar4 from "../assets/avatar4.png";
import avatar5 from "../assets/avatar5.png";
import avatar6 from "../assets/avatar6.png";
import avatar7 from "../assets/avatar7.png";
import avatar8 from "../assets/avatar8.png";
import avatar9 from "../assets/avatar9.png";
import avatar10 from "../assets/avatar10.png";
import avatar11 from "../assets/avatar11.png";
import avatar12 from "../assets/avatar12.png";

const AVATARS = [
  { id: "avatar1", src: avatar1, price: 0 },
  { id: "avatar2", src: avatar2, price: 0 },
  { id: "avatar3", src: avatar3, price: 80 },
  { id: "avatar4", src: avatar4, price: 120 }, //🔒
  { id: "avatar5", src: avatar5, price: 150 }, //🔒
  { id: "avatar6", src: avatar6, price: 200 }, //🔒
  { id: "avatar7", src: avatar7, price: 250 }, //🔒
  { id: "avatar8", src: avatar8, price: 300 }, //🔒
  { id: "avatar9", src: avatar9, price: 350 }, //🔒
  { id: "avatar10", src: avatar10, price: 400 }, //🔒
  { id: "avatar11", src: avatar11, price: 450 }, //🔒
  { id: "avatar12", src: avatar12, price: 500 }, //🔒
];

export default function Profile() {
  const soundEnabled = useSoundStore((s) => s.enabled);
  const bgVolume = useSoundStore((s) => s.bgVolume);
  const sfxVolume = useSoundStore((s) => s.sfxVolume);
  const toggleSound = useSoundStore((s) => s.toggle);
  const setBgVolume = useSoundStore((s) => s.setBgVolume);
  const setSFXVolume = useSoundStore((s) => s.setSFXVolume);
  const player = usePlayerStore((s) => s.player);
  const setAvatar = usePlayerStore((s) => s.setAvatar);
  const setName = usePlayerStore((s) => s.setName);
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);
  const resetHabits = useHabitStore((s) => s.resetHabits);
  const resetAchievements = useAchievementStore((s) => s.resetAchievements);
  const resetTime = useTimeStore((s) => s.resetTime);

  const [name, setLocalName] = useState(player.name);
  const gold = usePlayerStore((s) => s.player.gold);
  const spendGold = usePlayerStore((s) => s.spendGold);

  const unlockedAvatarIds = useAvatarStore((s) => s.unlockedAvatarIds);
  const unlockAvatar = useAvatarStore((s) => s.unlockAvatar);
  const resetAvatars = useAvatarStore((s) => s.resetAvatars);
  const resetLogs = useVictoryLogStore((s) => s.resetLogs);
  const logs = useVictoryLogStore((s) => s.logs); // ✅ NEW - ADD THIS LINE
  const resetShop = useShopStore((s) => s.resetShop); // ✅ NEW

  const ownedItemIds = useShopStore((s) => s.ownedItemIds);
  const [showAvatarList, setShowAvatarList] = useState(false);
  const [showInventory, setShowInventory] = useState(false); // ✅ NEW
  const [showLanguage, setShowLanguage] = useState(false); // ✅ NEW
  const [showBackgroundList, setShowBackgroundList] = useState(false); // ✅ NEW
  const [showPetList, setShowPetList] = useState(false); // ✅ NEW
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const t = useTranslation();

  const unlockedBackgroundIds = useBackgroundStore((s) => s.unlockedBackgroundIds); // ✅ NEW
  const unlockBackground = useBackgroundStore((s) => s.unlockBackground); // ✅ NEW
  const selectBackground = useBackgroundStore((s) => s.selectBackground); // ✅ NEW
  const resetBackgrounds = useBackgroundStore((s) => s.resetBackgrounds); // ✅ NEW
  const selectedBackground = useBackgroundStore((s) => s.selectedBackground); // ✅ NEW

  const unlockedPetIds = usePetStore((s) => s.unlockedPetIds); // ✅ NEW
  const unlockPet = usePetStore((s) => s.unlockPet); // ✅ NEW
  const selectPet = usePetStore((s) => s.selectPet); // ✅ NEW
  const resetPets = usePetStore((s) => s.resetPets); // ✅ NEW
  const selectedPet = usePetStore((s) => s.selectedPet); // ✅ NEW

  return (
    <PhoneFrame>
      <div className="page-card">
        <h2 className="page-title">{t("profile.title")}</h2>

        {/* ===== AVATAR + NAME ===== */}
        <div className="profile-header">
          <PlayerAvatar
            src={player.avatar}
            size={56}
            className="profile-avatar"
          />

          <div className="profile-info">
            <input
              className="profile-name-input"
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={() => setName(name)}
              placeholder="Player name"
            />
            <div className="profile-level">
              Lv. {player.level} • 💰 {player.gold}G
            </div>
          </div>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <Link 
          to="/victory-log" 
          style={{
            display: "block",
            marginBottom: 12,
            padding: "10px 12px",
            background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 8,
            textDecoration: "none",
            color: "#ff6200",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,165,0,0.15))";
            e.currentTarget.style.borderColor = "rgba(255,215,0,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))";
            e.currentTarget.style.borderColor = "rgba(255, 0, 0, 0.3)";
          }}
        >
          {t("profile.victoryLog")} <br></br> ({logs.length} days)
        </Link>

        {/* ===== INVENTORY ===== */}
        <div style={{ marginBottom: 12 }}>
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
              cursor: "pointer",
              padding: "8px 0",
            }}
            onClick={() => setShowInventory(!showInventory)}
          >
            <h3 style={{ fontSize: 11, marginBottom: 0 }}>
              {t("profile.inventory")}
            </h3>
            <span style={{ fontSize: 16, transition: "transform 0.2s ease", transform: showInventory ? "rotate(180deg)" : "rotate(0deg)" }}>
              ▼
            </span>
          </div>

          {showInventory && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                padding: 6,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 8,
                minHeight: 30,
              }}
            >
              {ownedItemIds.length === 0 ? (
                <span style={{ fontSize: 9, opacity: 0.6 }}>
                  {t("profile.noItems")}
                </span>
              ) : (
                ownedItemIds.map((itemId) => {
                  const item = useShopStore.getState().items.find(
                    (i) => i.id === itemId
                  );
                  return (
                    <div
                      key={itemId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 20,
                        background: "rgba(255,255,255,0.15)",
                        padding: "4px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {item?.icon} 
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ===== CHOOSE PET ===== */}
        <div className="avatar-header">
          <h3>{t("profile.choosePet")}</h3>
          <button
            className="avatar-toggle-btn"
            onClick={() => setShowPetList(!showPetList)}
          >
            {showPetList ? "▼" : "▶"}
          </button>
        </div>

        {showPetList && (
          <div className="pet-select">
            {PETS.map((pet: Pet) => { // ✅ ADD TYPE
              const unlocked = unlockedPetIds.includes(pet.id);

              return (
                <div key={pet.id} className="pet-slot">
                  {pet.id === "none" ? (
                    <div
                      className={`pet-option ${selectedPet === "" ? "active" : ""}`}
                      onClick={() => selectPet("none")}
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "rgba(255,255,255,0.1)",
                        border: "4px solid var(--border-dark)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#4a2f1b",
                      }}
                    >
                      No Pet
                    </div>
                  ) : (
                    <img
                      src={pet.src}
                      alt={pet.name}
                      className={`pet-option ${selectedPet === pet.src ? "active" : ""} ${!unlocked ? "locked" : ""}`}
                      onClick={() => {
                        if (unlocked) {
                          selectPet(pet.id);
                          return;
                        }

                        if (gold < pet.price) {
                          alert(t("profile.notEnoughGold"));
                          return;
                        }

                        const ok = window.confirm(
                          t("profile.unlockPet", { price: pet.price })
                        );
                        if (!ok) return;

                        spendGold(pet.price);
                        unlockPet(pet.id);
                        selectPet(pet.id);
                      }}
                    />
                  )}

                  {pet.id !== "none" && !unlocked && (
                    <div className="pet-lock">
                      🔒 {pet.price}G
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== CHOOSE AVATAR ===== */}
        <div className="avatar-header">
          <h3>{t("profile.choosAvatar")}</h3>
          <button
            className="avatar-toggle-btn"
            onClick={() => setShowAvatarList(!showAvatarList)}
          >
            {showAvatarList ? "▼" : "▶"}
          </button>
        </div>

        {showAvatarList && (
          <div className="avatar-select">
            {AVATARS.map((a) => {
              const unlocked = unlockedAvatarIds.includes(a.id);

              return (
                <div key={a.id} className="avatar-slot">
                  <img
                    src={a.src}
                    alt="avatar"
                    className={`avatar-option ${
                      player.avatar === a.src ? "active" : ""
                    } ${!unlocked ? "locked" : ""}`}
                    onClick={() => {
                      // ✅ Đã mở → đổi avatar
                      if (unlocked) {
                        setAvatar(a.src);
                        return;
                      }

                      // 🔒 Chưa mở → mua
                      if (gold < a.price) {
                        alert(t("profile.notEnoughGold"));
                        return;
                      }

                      const ok = window.confirm(
                        t("profile.unlockAvatar", { price: a.price })
                      );
                      if (!ok) return;

                      spendGold(a.price);
                      unlockAvatar(a.id);
                      setAvatar(a.src);
                    }}
                  />

                  {!unlocked && (
                    <div className="avatar-lock">
                      🔒 {a.price}G
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== CHOOSE BACKGROUND ===== */}
        <div className="avatar-header">
          <h3>{t("profile.chooseBackground")}</h3>
          <button
            className="avatar-toggle-btn"
            onClick={() => setShowBackgroundList(!showBackgroundList)}
          >
            {showBackgroundList ? "▼" : "▶"}
          </button>
        </div>

        {showBackgroundList && (
          <div className="background-select">
            {BACKGROUNDS.map((bg) => {
              const unlocked = unlockedBackgroundIds.includes(bg.id);

              return (
                <div key={bg.id} className="background-slot">
                  <img
                    src={bg.src}
                    alt={bg.name}
                    className={`background-option ${
                      selectedBackground === bg.src ? "active" : ""
                    } ${!unlocked ? "locked" : ""}`}
                    onClick={() => {
                      // ✅ Đã mở → chọn background
                      if (unlocked) {
                        selectBackground(bg.id);
                        return;
                      }

                      // 🔒 Chưa mở → mua
                      if (gold < bg.price) {
                        alert(t("profile.notEnoughGold"));
                        return;
                      }

                      const ok = window.confirm(
                        t("profile.unlockBackground", { price: bg.price })
                      );
                      if (!ok) return;

                      spendGold(bg.price);
                      unlockBackground(bg.id);
                      selectBackground(bg.id);
                    }}
                  />

                  {!unlocked && (
                    <div className="background-lock">
                      🔒 {bg.price}G
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESET BUTTON */}
      <button
        className="profile-reset-btn"
        onClick={async () => {
          const ok = window.confirm(
            t("profile.resetConfirm")
          );
          if (!ok) return;

          const today = await fetchServerDate();

          resetPlayer();
          resetHabits();
          resetAchievements();
          resetAvatars();
          resetPets(); // ✅ ADD THIS
          resetBackgrounds();
          resetLogs();
          resetShop();
          resetTime(today);
        }}
      >
        {t("profile.resetProgress")}
      </button>

      {/* SETTINGS */}
      <h3>{t("profile.settings")}</h3>
      
      {/* 🌍LANGUAGE SELECT */}
      <div
        style={{
          marginTop: 12,
          padding: "10px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: 8,
          border: "2px solid #6b4a2b",
        }}
      >
        <div 
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            cursor: "pointer",
          }}
          onClick={() => setShowLanguage(!showLanguage)}
        >
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {t("profile.language")}
          </label>
          <span style={{ fontSize: 14, transition: "transform 0.2s ease", transform: showLanguage ? "rotate(180deg)" : "rotate(0deg)" }}>
            ▼
          </span>
        </div>

        {showLanguage && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {(["en", "vi", "ja"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: "8px",
                  borderRadius: 6,
                  border: language === lang ? "3px solid #4caf50" : "2px solid #6b4a2b",
                  background:
                    language === lang
                      ? "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                      : "linear-gradient(135deg, #fdf0d5, #fce8c3)",
                  color: language === lang ? "#2d5a2d" : "#4a2f1b",
                  fontWeight: 600,
                  fontSize: 11,
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
        )}
      </div>

      {/* SOUND BUTTON */}
      <button
        className="profile-sound-btn"
        onClick={toggleSound}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          borderRadius: 8,
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
        <div
          style={{
            marginTop: 12,
            padding: "10px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            border: "2px solid #6b4a2b",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
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
              height: 6,
              borderRadius: 3,
            }}
          />
          <small style={{ opacity: 0.7, display: "block", marginTop: 4 }}>
            {Math.round(bgVolume * 100)}%
          </small>
        </div>
      )}

      {/* 🔊 SOUND EFFECTS VOLUME */}
      {soundEnabled && (
        <div
          style={{
            marginTop: 12,
            padding: "10px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            border: "2px solid #6b4a2b",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
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
              height: 6,
              borderRadius: 3,
            }}
          />
          <small style={{ opacity: 0.7, display: "block", marginTop: 4 }}>
            {Math.round(sfxVolume * 100)}%
          </small>
        </div>
      )}
    </PhoneFrame>
  );
}