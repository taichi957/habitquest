import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useShopStore } from '../store/useShopStore';
import { useTranslation } from '../hooks/useTranslation';
import monsterSrc from '../assets/monster2.png';
import bgSrc from '../assets/bg6.png';
import '../css/combat.css';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

interface Skill {
  name: string;
  damage: number;
  type: 'attack' | 'heal';
  energyCost?: number;
  goldCost?: number;
}

const skills: Skill[] = [
  { name: '🗡', damage: 25, type: 'attack', energyCost: 1 },
  { name: '⚔', damage: 45, type: 'attack', energyCost: 1 },
  { name: '♥️', damage: 30, type: 'heal', goldCost: 10 },
];

const Battle2: React.FC = () => {
  const playerAvatar = usePlayerStore((s) => s.player.avatar);
  const loseHpGlobal = usePlayerStore((s) => s.loseHp);
  const loseExp = usePlayerStore((s) => s.loseExp);
  const gainExp = usePlayerStore((s) => s.gainExp);
  const addGold = usePlayerStore((s) => s.addGold);
  const winBattle = usePlayerStore((s) => s.winBattle);
  const grantItem = useShopStore((s) => s.grantItem);
  const t = useTranslation();
  const navigate = useNavigate();
  const notify = useNotification();
  const energy = usePlayerStore((s) => s.player.energy);
  const gold = usePlayerStore((s) => s.player.gold);
  const spendEnergy = usePlayerStore((s) => s.spendEnergy);
  const spendGold = usePlayerStore((s) => s.spendGold);

  const [playerHP, setPlayerHP] = useState(100);
  const MAX_MONSTER_HP = 200;
  const [monsterHP, setMonsterHP] = useState(MAX_MONSTER_HP);
  const [log, setLog] = useState(t('battle.startLog'));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [, setIsWin] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerAnimating, setPlayerAnimating] = useState(false);
  const [enemyAnimating, setEnemyAnimating] = useState(false);
  const [playerEffect, setPlayerEffect] = useState<'hurt' | 'heal' | ''>('');
  const [enemyEffect, setEnemyEffect] = useState<'hurt' | 'heal' | ''>('');

  const [rewardText, setRewardText] = useState('');

  useEffect(() => {
    if (!isPlayerTurn && !isGameOver) {
      const timer = setTimeout(() => {
        const action = Math.random() < 0.5 ? 'attack' : 'heal';

        if (action === 'attack') {
          const base = Math.floor(Math.random() * 16) + 20;
          const crit = Math.random() < 0.25 ? 2 : 1;
          const dmg = base * crit;

          setEnemyAnimating(true);
          setTimeout(() => setEnemyAnimating(false), 400);

          setPlayerEffect('hurt');
          setTimeout(() => setPlayerEffect(''), 400);

          setPlayerHP((prev) => Math.max(0, prev - dmg));
          const critText = crit === 2 ? t('battle.monsterAttackCrit') : '';
          setLog(t('battle.monsterAttack', { crit: critText, damage: dmg }));
        } else {
          const heal = Math.floor(Math.random() * 17) + 25;
          setEnemyEffect('heal');
          setTimeout(() => setEnemyEffect(''), 400);
          setMonsterHP((prev) => Math.min(MAX_MONSTER_HP, prev + heal));
          setLog(t('battle.monsterHeal', { amount: heal }));
        }

        setIsPlayerTurn(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, isGameOver]);

  useEffect(() => {
    if (monsterHP <= 0) {
      const gold = 25;
      const exp = 35;
      const itemId = 'heal_potion';

      setRewardText(
        t('battle.winMessage', { gold, exp }) +
          '\n' +
          t('battle.itemReward', { item: t('items.healPotion.name') })
      );
      setIsGameOver(true);
      setIsWin(true);

      addGold(gold);
      gainExp(exp);
      winBattle("battle3");
      grantItem(itemId);
      notify(t('battle.itemReward', { item: t('items.healPotion.name') }), 'success');
    } else if (playerHP <= 0) {
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

    if (skill.type === 'attack') {
      if (energy < (skill.energyCost || 1)) {
        notify(t('notEnoughEnergy'), 'warning');
        return;
      }
      spendEnergy(skill.energyCost || 1);
    } else if (skill.type === 'heal') {
      if (gold < (skill.goldCost || 10)) {
        notify(t('notEnoughGold'), 'warning');
        return;
      }
      spendGold(skill.goldCost || 10);
    }

    setPlayerAnimating(true);
    setTimeout(() => setPlayerAnimating(false), 400);

    if (skill.type === 'attack') {
      const dmg = Math.floor(Math.random() * 10) + skill.damage;

      setEnemyEffect('hurt');
      setTimeout(() => setEnemyEffect(''), 400);
      setEnemyAnimating(true);
      setTimeout(() => setEnemyAnimating(false), 400);

      setMonsterHP((prev) => Math.max(0, prev - dmg));
      setLog(t('battle.playerAttack', { skill: skill.name, damage: dmg }));
    } else {
      setPlayerEffect('heal');
      setTimeout(() => setPlayerEffect(''), 400);

      setPlayerHP((prev) => Math.min(100, prev + skill.damage));
      setLog(t('battle.playerHeal', { skill: skill.name, amount: skill.damage }));
    }

    setIsPlayerTurn(false);
  };


  return (
    <div id="game-container">
      <h2>{t('battle.title3')}</h2>

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
            <div className="hp-fill" 
            style={{ width: `${(monsterHP / MAX_MONSTER_HP) * 100}%` }} />
          </div>
        </div>
      


      <div className="controls">
  {!isGameOver &&
    skills.map((skill) => (
      <button
        key={skill.name}
        onClick={() => handleSkill(skill)}
        disabled={!isPlayerTurn || (skill.type === 'attack' ? energy < (skill.energyCost || 1) : gold < (skill.goldCost || 10))}
        title={
          skill.type === 'attack'
            ? `${t('energyCost')}: ${skill.energyCost || 1}`
            : `${t('playerStatus.gold')}: ${skill.goldCost || 10}`
        }
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

export default Battle2;
