import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react"; // ✅ ADD useState
import { useDailyCheck } from "./hooks/useDailyCheck";
import { soundManager } from "./utils/soundManager";
import { useSoundStore } from "./store/useSoundStore";
import { useLanguageStore } from "./store/useLanguageStore";

import Home from "./pages/Home";
import AddHabit from "./pages/AddHabit";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Motivation from "./pages/Motivation";
import VictoryLog from "./pages/VictoryLog";
import Start from "./pages/Start"; // ✅ NEW

export default function App() {
  const soundEnabled = useSoundStore((s) => s.enabled);
  const language = useLanguageStore((s) => s.language);
  const [hasStarted, setHasStarted] = useState(false); // ✅ NEW STATE

  // 📅 KIỂM TRA NGÀY MỚI
  useDailyCheck();

  // 🎵 BACKGROUND MUSIC
  useEffect(() => {
    if (soundEnabled) {
      soundManager.playBackgroundMusic();
    } else {
      soundManager.pauseBackgroundMusic();
    }
  }, [soundEnabled]);

  // 🔓 UNLOCK AUDIO BẰNG CLICK ĐẦU TIÊN
  useEffect(() => {
    const unlockAudio = () => {
      soundManager.play("exp");
      if (soundEnabled) {
        soundManager.playBackgroundMusic();
      }
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, [soundEnabled]);

// ✅ SHOW START PAGE IF NOT STARTED
  if (!hasStarted) {
    return <Start onStart={() => setHasStarted(true)} />;
  }


  return (
    <div className="app-shell" lang={language}> {/* ✅ ADD LANG ATTRIBUTE */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddHabit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/store" element={<Store />} />
        <Route path="/motivation" element={<Motivation />} />
        <Route path="/victory-log" element={<VictoryLog />} />
      </Routes>

      {/* 🔽 BOTTOM NAVIGATION */}
      <nav className="bottom-nav">
        <Link to="/motivation" className="nav-btn" title="Motivation">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#6b4a2b">
            <path d="m80-80 200-560 360 360L80-80Zm132-132 282-100-182-182-100 282Zm370-246-42-42 224-224q32-32 77-32t77 32l24 24-42 42-24-24q-14-14-35-14t-35 14L582-458ZM422-618l-42-42 24-24q14-14 14-34t-14-34l-26-26 42-42 26 26q32 32 32 76t-32 76l-24 24Zm80 80-42-42 144-144q14-14 14-35t-14-35l-64-64 42-42 64 64q32 32 32 77t-32 77L502-538Zm160 160-42-42 64-64q32-32 77-32t77 32l64 64-42 42-64-64q-14-14-35-14t-35 14l-64 64ZM212-212Z"/>
          </svg>
        </Link>
        <Link to="/add" className="nav-btn" title="Add Habit">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#6b4a2b">
            <path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z"/>
          </svg>
        </Link>
        <Link to="/" className="nav-btn-big" title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#6b4a2b">
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
          </svg>
        </Link>
        <Link to="/profile" className="nav-btn" title="Profile">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#6b4a2b">
            <path d="M480-440q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0-80q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0 440q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-400Zm0-315-240 90v189q0 54 15 105t41 96q42-21 88-33t96-12q50 0 96 12t88 33q26-45 41-96t15-105v-189l-240-90Zm0 515q-36 0-70 8t-65 22q29 30 63 52t72 34q38-12 72-34t63-52q-31-14-65-22t-70-8Z"/>
          </svg>
        </Link>
        <Link to="/store" className="nav-btn" title="Store">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#6b4a2b">
            <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
          </svg>
        </Link>
      </nav>
    </div>
  );
}
