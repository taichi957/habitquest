import { useState } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import { useBackgroundStore } from "../store/useBackgroundStore";
import { translations } from "../i18n/translations";
import { useLanguageStore } from "../store/useLanguageStore";
import { usePetStore } from "../store/usePetStore"; // ✅ NEW

export default function AvatarCharacter() {
  const avatar = usePlayerStore((s) => s.player.avatar);
  const name = usePlayerStore((s) => s.player.name);
  const selectedBackground = useBackgroundStore((s) => s.selectedBackground);
  const [showQuote, setShowQuote] = useState(false);
  const lang = useLanguageStore((s) => s.language);
  const selectedPet = usePetStore((s) => s.selectedPet); // ✅ NEW

  // ✅ GET RANDOM QUOTE
  const quotes = translations[lang].quotes;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div
      className="avatar-container"
      style={{
        backgroundImage: `url(${selectedBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <p className="avatar-text">{name}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <img
          src={avatar}
          alt="Avatar"
          className="avatar-idle"
          onClick={() => setShowQuote(!showQuote)}
          style={{ cursor: "pointer" }}
        />
        {/* 🎮 PET DISPLAY */}
        {selectedPet && (
          <img
            src={selectedPet}
            alt="Pet"
            style={{
              width: "80px",
              height: "auto",
              marginTop: "110px",
              marginLeft: "-30px",
              animation: "idleFloat 2s ease-in-out infinite",
              filter:
                "drop-shadow(1px 0 0 rgb(0, 0, 0)) drop-shadow(-1px 0 0 rgb(0, 0, 0)) drop-shadow(0 1px 0 rgb(0, 0, 0)) drop-shadow(0 -1px 0 rgb(0, 0, 0))",
            }}
          />
        )}
      </div>

      {/* 🎈 SPEECH BUBBLE */}
      {showQuote && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255, 255, 255, 0.62)",
            border: "3px solid #6b2b2b",
            borderRadius: "12px",
            padding: "10px 15px",
            maxWidth: "200px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#2b1b0e",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 10,
            animation: "bubbleAppear 0.5s ease-out",
          }}
        >
          "{randomQuote}"
          {/* ARROW DOWN */}
          <div
            style={{
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #6b4a2b",
            }}
          />
        </div>
      )}
    </div>
  );
}
