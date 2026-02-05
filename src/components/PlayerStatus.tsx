import { useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import StatusBar from "./StatusBar";
import PlayerAvatar from "./PlayerAvatar";
import { useTimeStore } from "../store/useTimeStore";


export default function PlayerStatus() {
  const player = usePlayerStore((s) => s.player);
  const isHealing = usePlayerStore((s) => s.isHealing);
  const clearHealing = usePlayerStore((s) => s.clearHealing);
  const isDamaged = usePlayerStore((s) => s.isDamaged);
  const clearDamage = usePlayerStore((s) => s.clearDamage);
  
const currentDay = useTimeStore((s) => s.currentDay);
  const lastDate = useTimeStore((s) => s.lastDate);

  // ⏱️ tự tắt animation sau khi hồi máu
  useEffect(() => {
    if (!isHealing) return;

    const timer = setTimeout(() => {
      clearHealing();
    }, 300);

    return () => clearTimeout(timer);
  }, [isHealing, clearHealing]);
  useEffect(() => {
  if (!isDamaged) return;

  const timer = setTimeout(() => {
    clearDamage();
  }, 300);

  return () => clearTimeout(timer);
}, [isDamaged, clearDamage]);

  return (
    <div className="player-status">
      <div className="player-header">
        <PlayerAvatar src={player.avatar} size={56} />

        <div>
          {/* <strong style={{ display: "block", fontSize: 16 }}>
            {player.name || "Adventurer"}
          </strong> */}
          <span>Lv. {player.level}</span>
          <p>💰 {player.gold} Gold</p>
          
        </div>
        
      </div>
      {isHealing && (
  <span className="heal-float">+HP</span>
)}

      {/* ❤️ HP BAR */}
      <StatusBar
  label="HP"
  value={player.hp}
  max={player.maxHp}
  color="#4CAF50"
  animate={isHealing}
  damage={isDamaged}
/>
      {/* 🔵 EXP BAR */}
      <StatusBar
        label="EXP"
        value={player.exp}
        max={player.level * 100}
        color="#2196F3"
      />
      <p style={{ fontSize: 12, opacity: 0.8 }}>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#3d2916"><path d="M200-640h560v-80H200v80Zm0 0v-80 80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v227q-19-9-39-15t-41-9v-43H200v400h252q7 22 16.5 42T491-80H200Zm520 40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm67-105 28-28-75-75v-112h-40v128l87 87Z"/></svg>
      Day {currentDay} · {lastDate}
  </p>
    </div>
    
  );
  
}

