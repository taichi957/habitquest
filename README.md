# 🎮 HabitQuest - Gamified Habit Tracker

> A fun and engaging habit-tracking game where you build habits, level up your character, and conquer your goals!

## ✨ Features

### 🎯 Core Gameplay
- **Daily Habit Tracking** - Create and complete daily habits
- **Streak System** - Build consecutive streaks for each habit (🔥)
- **Experience & Leveling** - Gain XP by completing habits and level up
- **Health System** - Manage your character's HP (health decreases when leaving habits incomplete)
- **Gold Rewards** - Earn gold to buy items and upgrades

### 🎨 Character Customization
- **Avatar Selection** - Choose from 12+ different character avatars
  - Free avatars: Default, Knight
  - Premium avatars: Mage, Dragon, Hunter, Rogue, and more (60-500 Gold)
- **Pet System** - Adopt and customize your pet companion
  - Free: No pet
  - Premium: Cat (60G), Dog (80G), Bird (100G)
- **Background Selection** - Customize your avatar's environment
  - Free: Forest
  - Premium: Ocean (50G), Mountain (100G), Castle (150G)

### 🏆 Achievements & Badges
- **First Step** - Complete your first habit
- **7-Day Perseverance** - Reach 7-day streak
- **Habit Master** - Reach 30-day streak
- **Perfection** - Complete all daily habits

### 🛒 Shop System
- **Buff Items** (one-time purchase)
  - 📘 EXP Boost (100G) - +20% EXP
  - 💰 Gold Rush (80G) - +30% Gold
  - ❤️ Vitality (150G) - +50 Max HP

- **Passive Items** (protection)
  - 🛡️ Shield (80G) - 50% reduce delete damage
  - 🔷 Barrier (150G) - 75% reduce delete damage

- **Consumable Items** (reusable)
  - 🧪 Heal Potion (50G) - Restore 30 HP
  - 🧬 Mega Potion (100G) - Restore 60 HP
  - 💊 Revive Scroll (120G) - Revive when dead
  - ⚗️ Streak Elixir (90G) - +1 Streak to any habit

### 📊 Statistics & Progress
- **Motivation Page**
  - Daily quotes for motivation
  - Total habits & completion stats
  - Max streak tracking
  - Achievement progress bar
  - Daily tips for success

- **Victory Log**
  - Track your daily completion history
  - Expandable log entries showing completed habits and streaks
  - Day counter to see your progress

### 🌐 Multilingual Support
- **English (US)** 🇺🇸
- **Vietnamese (VN)** 🇻🇳
- **Japanese (JP)** 🇯🇵

### 🎵 Sound & Music
- **Background Music** - Ambient music while playing
- **Sound Effects** - Feedback sounds for actions
- **Volume Control** - Adjust BGM and SFX levels independently

## 🎮 How to Play

### Starting Out
1. **Create Your Profile** - Set your name and choose an avatar
2. **Add Habits** - Create daily habits with custom colors
3. **Assign Badges** - Select badges to represent your habits

### Daily Routine
1. **Check Tasks** - See your daily habit list
2. **Complete Habits** - Click habits to mark them complete
3. **Earn Rewards** - Gain XP and Gold for each completed habit
4. **Finish Day** - Click "Finish Day" to complete the cycle

### Consequences
- ⚠️ **Incomplete Habits** - Each unfinished habit deals 10 damage
- ❌ **Deleted Habit** - Deleting a habit costs HP (affected by Shield)
- 💀 **Game Over** - When HP reaches 0, the day locks and you can revive (costs 20G)

### Progression
- 📈 **Levels** - Complete habits to gain XP and level up
- 🔥 **Streaks** - Consecutive daily completions boost your stats
- 💰 **Gold** - Use gold to customize and buy power-ups
- 🏆 **Achievements** - Unlock achievements by hitting milestones

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation

### State Management
- **Zustand** - Lightweight state management with persistence
- **LocalStorage** - Data persistence across sessions

### Styling
- **CSS3** - Custom pixelated/retro theme
- **Font Awesome** - Icons via Google Fonts
- **Press Start 2P** - Pixel art font

### Tools & Libraries
- **Zustand Persist** - State hydration
- **JSON Storage** - LocalStorage wrapper

## 📁 Project Structure

```
src/
├── assets/          # Static assets like images and fonts
├── components/      # Reusable React components
├── features/        # Feature-specific code (e.g., habits, goals)
├── locales/         # Localization files
├── App.tsx          # Root component
├── main.tsx         # Entry point
└── ...
```

## 📚 Learning Resources

### React
- **React Docs** - Official React documentation
- **React Router Docs** - Routing library for React

### TypeScript
- **TypeScript Docs** - Official TypeScript documentation
- **TypeScript React Cheat Sheet** - Quick reference for using TypeScript with React

### Vite
- **Vite Docs** - Official Vite documentation
- **Vite + React Template** - Starter template for React and Vite

### Zustand
- **Zustand Docs** - Official Zustand documentation
- **State Management in React** - Understanding state management concepts

### CSS
- **MDN Web Docs - CSS** - Comprehensive CSS documentation
- **CSS Tricks** - Tips and tricks for using CSS

## 🤝 Contributing

We welcome contributions to HabitQuest! To get involved:

1. Check out the [GitHub repository](https://github.com/yourusername/habitquest).
2. Read the [contribution guidelines](https://github.com/yourusername/habitquest/blob/main/CONTRIBUTING.md).
3. Submit a pull request with your changes.

## 📄 License

HabitQuest is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the software as you wish.

## 🙏 Acknowledgments

- Inspired by habit-tracking apps and RPGs
- Built with passion and dedication
