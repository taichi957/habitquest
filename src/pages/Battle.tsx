import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useTranslation } from '../hooks/useTranslation';
import monsterSrc from '../assets/monster.png';
import bgSrc from '../assets/bg.png';
import '../css/combat.css';
import { useNavigate } from 'react-router-dom';

interface Skill {
  name: string;
  damage: number;
  type: 'attack' | 'heal';
}

const skills: Skill[] = [
  { name: '🗡', damage: 15, type: 'attack' },
  { name: '⚔', damage: 25, type: 'attack' },
  { name: '♥️', damage: 25, type: 'heal' },
];

const Battle: React.FC = () => {
  // avatar is stored in profile store, updates when user selects in profile page
  const playerAvatar = usePlayerStore((s) => s.player.avatar);
  // hooks for global player updates
  const loseHpGlobal = usePlayerStore((s) => s.loseHp);
  const loseExp = usePlayerStore((s) => s.loseExp);
  const gainExp = usePlayerStore((s) => s.gainExp);
  const addGold = usePlayerStore((s) => s.addGold);
  const winBattle = usePlayerStore((s) => s.winBattle);
  const t = useTranslation();
 
const navigate = useNavigate();

  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);
  const [log, setLog] = useState(t('battle.startLog'));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isWin, setIsWin] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerAnimating, setPlayerAnimating] = useState(false);
  const [enemyAnimating, setEnemyAnimating] = useState(false);
  const [playerEffect, setPlayerEffect] = useState<'hurt' | 'heal' | ''>('');
  const [enemyEffect, setEnemyEffect] = useState<'hurt' | 'heal' | ''>('');

  const [rewardText, setRewardText] = useState('');

  // monster's turn: choose crit attack or heal
  useEffect(() => {
    if (!isPlayerTurn && !isGameOver) {
      const timer = setTimeout(() => {
        // decide action
        const action = Math.random() < 0.5 ? 'attack' : 'heal';

        if (action === 'attack') {
          // critical chance 20%
          const base = Math.floor(Math.random() * 15) + 10;
          const crit = Math.random() < 0.2 ? 2 : 1;
          const dmg = base * crit;

          setEnemyAnimating(true);
          setTimeout(() => setEnemyAnimating(false), 400);

          setPlayerEffect('hurt');
          setTimeout(() => setPlayerEffect(''), 400);

          setPlayerHP((prev) => Math.max(0, prev - dmg));
          const critText = crit === 2 ? t('battle.monsterAttackCrit') : '';
          setLog(t('battle.monsterAttack', { crit: critText, damage: dmg }));
        } else {
          // heal itself 15-30
          const heal = Math.floor(Math.random() * 16) + 15;
          setEnemyEffect('heal');
          setTimeout(() => setEnemyEffect(''), 400);
          setMonsterHP((prev) => Math.min(100, prev + heal));
          setLog(t('battle.monsterHeal', { amount: heal }));
        }

        setIsPlayerTurn(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, isGameOver]);

  // check win/lose conditions
  useEffect(() => {
    if (monsterHP <= 0) {
  const gold = 10;
  const exp = 20;

  setRewardText(t('battle.winMessage', { gold, exp }));
  setIsGameOver(true);
  setIsWin(true);

  addGold(gold);
  gainExp(exp);
  winBattle("battle1");
}
else if (playerHP <= 0) {
  const hpLoss = 20;
  const expLoss = 10;
  setLog(t('battle.loseMessage'));
  setIsGameOver(true);
  setIsWin(false);

  loseHpGlobal(hpLoss);
  loseExp(expLoss);
  setRewardText(t('battle.loseReward', { hp: hpLoss, exp: expLoss }));
}
  }, [monsterHP, playerHP, addGold, gainExp, loseHpGlobal, loseExp, winBattle, t]);

  const handleSkill = (skill: Skill) => {
    if (!isPlayerTurn || isGameOver) return;

    // Trigger player attack animation
    setPlayerAnimating(true);
    setTimeout(() => setPlayerAnimating(false), 400);

    if (skill.type === 'attack') {
      const dmg = Math.floor(Math.random() * 10) + skill.damage;
      
      // enemy hurt effect
      setEnemyEffect('hurt');
      setTimeout(() => setEnemyEffect(''), 400);
      // Trigger enemy take damage animation
      setEnemyAnimating(true);
      setTimeout(() => setEnemyAnimating(false), 400);

      setMonsterHP((prev) => Math.max(0, prev - dmg));
      setLog(t('battle.playerAttack', { skill: skill.name, damage: dmg }));
    } else {
      // heal effect on player
      setPlayerEffect('heal');
      setTimeout(() => setPlayerEffect(''), 400);

      setPlayerHP((prev) => Math.min(100, prev + skill.damage));
      setLog(t('battle.playerHeal', { skill: skill.name, amount: skill.damage }));
    }

    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    setPlayerHP(100);
    setMonsterHP(100);
    setLog(t('battle.startLog'));
    setIsPlayerTurn(true);
    setIsGameOver(false);
  };

  return (
    <div id="game-container">
      <h2>{t('battle.title')}</h2>

      <div
        className="battle-arena"
        style={{
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`character player ${playerAnimating ? 'attacking' : ''} ${playerEffect==='hurt' ? 'hurt-red' : playerEffect==='heal' ? 'heal-green' : ''}`}>
          <div className="sprite">
            <img src={playerAvatar} alt="Player avatar" />
          </div>
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${playerHP}%` }} />
          </div>
        </div>

        <div className={`character enemy ${enemyAnimating ? 'taking-damage' : ''} ${enemyEffect==='hurt' ? 'hurt-red' : enemyEffect==='heal' ? 'heal-green' : ''}`}>
          <div className="sprite1">
            <img src={monsterSrc} alt="Monster" />
          </div>
          <div className="hp-bar">
            <div className="hp-fill" style={{ width: `${monsterHP}%` }} />
          </div>
        </div>
      


      <div className="controls">
  {!isGameOver &&
    skills.map((skill) => (
      <button
        key={skill.name}
        onClick={() => handleSkill(skill)}
        disabled={!isPlayerTurn}
      >
        {skill.name}
      </button>
    ))
  }
</div>
     {isGameOver && (
  <div className="reward-container">
    <div className="reward-text">
      {rewardText}
    </div>

    <button
      onClick={() => navigate('/combat')}
      className="back-button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px"
        viewBox="0 -960 960 960" width="24px" fill="#000000">
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
      </svg>
    </button>
  </div>
)}

      </div><div className="battle-log">{log}</div>
    </div>
  );
};

export default Battle;
