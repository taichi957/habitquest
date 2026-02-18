export type Language = "en" | "vi" | "ja";

export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      addHabit: "Add Habit",
      motivation: "Motivation",
      profile: "Profile",
      store: "Store",
    },
    // Home Page
    home: {
      noHabits: "No habits yet. Add one to get started! 🚀",
      finishDay: "Finish Day ✅",
      addHabit: "➕ Add Habit",
      dayLocked: "💀 You collapsed from exhaustion.\nCome back tomorrow.",
      unfinishedHabits: "You still have {count} unfinished habit(s).\nYou will lose {damage} HP.\n\nFinish the day?",
    },
    // Habit Card
    habit: {
      done: "✅ Done",
      pending: "⬜ Pending",
      deleteConfirm: "Delete \"{title}\"?\nPenalty: {damage} HP{shield}",
      shieldActive: " (Shield active)",
    },
    // Profile Page
    profile: {
      title: "Profile",
      choosAvatar: "Choose Avatar",
      chooseBackground: "Choose Background", // ✅ NEW
      unlockBackground: "Unlock this background for {price} Gold?", // ✅ NEW
      choosePet: "Choose Pet", // ✅ NEW
      unlockPet: "Unlock this pet for {price} Gold?", // ✅ NEW
      inventory: "📦 Inventory",
      noItems: "No items yet",
      settings: "⚙️ Settings",
      resetProgress: "🔄 Reset Progress",
      resetConfirm: "Reset all progress? (All Level, EXP, Gold, and Victory Log will be lost)",
      sound: {
        on: "🔊 Sound: ON",
        off: "🔇 Sound: OFF",
        bgMusic: "🎵 Background Music",
        sfx: "🔊 Sound Effects",
      },
      language: "🌍Language",
      victoryLog: "⚔️Victory Log",
      notEnoughGold: "Not enough gold",
      unlockAvatar: "Unlock this avatar for {price} Gold?",
    },
    // Add Habit
    addHabit: {
      title: "Add Habit",
      habitName: "Habit name",
      badge: "✨ Achievement Badge",
      saveHabit: "Save Habit",
      enterName: "Please enter a habit name",
    },
    // Store
    store: {
      title: "🛒 Store",
      gold: "💰 Gold:",
      buy: "Buy",
      use: "Use",
      owned: "✅ Owned",
      resetStore: "🔄 Reset Store (-{cost}G)",
      noItems: "No items to reset",
      resetConfirm: "Reset store for {cost} Gold?\nAll items will be lost.",
      resetSuccess: "🔄 Store reset! New items available.",
      hpFull: "❤️ HP is already full",
      notDead: "⚠️ You are not dead",
      revived: "💊 You have been revived!",
      noHabits: "📝 No habits to boost",
      streakAdded: "🔥 +{amount} streak to \"{title}\"",
    },
    // Motivation
    motivation: {
      title: "💪 Motivation",
      totalHabits: "Total Habits",
      doneToday: "Done Today",
      maxStreak: "Max Streak",
      level: "Level",
      achievements: "🏆 Achievements",
      progress: "🎖️ Achievement Progress",
      unlocked: "{count} of {total} unlocked",
      tips: "💡 Tips to Stay Motivated",
      tipList: [
        "✅ Start small with achievable habits",
        "🔥 Build streaks for momentum",
        "🎯 Track progress consistently",
        "🏆 Celebrate small wins",
        "💪 Don't break the chain",
        "📈 Level up for rewards",
        "⏰ Schedule habits at the same time daily",
        "📊 Review your progress weekly",
        "🎁 Reward yourself for milestones",
        "📱 Use reminders to stay on track",
        "👥 Share goals with a friend",
        "🧠 Focus on one habit at a time",
        "💧 Stay hydrated and rest well",
        "📝 Write down why you want to change",
        "🌅 Start your day with a habit",
        "🎬 Visualize success before doing it",
        "⚡ Break habits into smaller steps",
        "🎓 Learn from setbacks, not failures",
        "🎪 Make it fun and enjoyable",
        "🌟 Believe in yourself always",
      ],
    },
    // Victory Log
    victoryLog: {
      title: "⚔️ Victory Log",
      totalDays: "Total Days",
      currentStreak: "Current Streak",
      longestStreak: "Longest Streak",
      history: "📜 Victory History",
      noVictories: "No victories yet. Complete your first day! 🚀",
      backToProfile: "← Back to Profile",
      days: "{count} victorious days",
      deleteConfirm: "Delete this victory record?",

      // ✅ VICTORY MESSAGES
      messages: [
         "Another day of victory! 🎉",
  "You crushed it today! 💪",
  "Consistency is paying off! 🔥",
  "Keep the momentum going! 🚀",
  "Daily champion! ⭐",
  "Unstoppable! 🏆",
  "Legend status unlocked! 👑",
  "Perfect execution! ✨",
  "The streak continues! 🔗",
  "You're on fire! 🌟",

  "Quest completed successfully! ⚔️",
  "EXP gained! Well done! 💎",
  "Your discipline led to victory! 🛡️",
  "Another win added to your record! 📜",
  "Heroes are built one win at a time! 🦸",
  "Flawless habit execution! ✅",
  "Victory achieved — keep pushing! 🔥",
  "Your power is growing! ⬆️",
  "This win brings you closer to greatness! 🌠",
  "Daily quest mastered! 🎮",
      ],
    },
    // ===== ACHIEVEMENTS =====
    achievements: {
      firstStep: {
        title: "The First Step",
        description: "Complete your first habit",
      },
      streak7: {
        title: "7-Day Perseverance",
        description: "Reach a 7-day streak on any habit",
      },
      streak30: {
        title: "Habit Master",
        description: "Reach a 30-day streak on any habit",
      },
      dailyAll: {
        title: "Perfection",
        description: "Complete all daily habits",
      },
    },
    // ===== ITEMS =====
    items: {
      expBoost: {
        name: "EXP Boost",
        description: "+20% EXP per habit",
      },
      goldBoost: {
        name: "Gold Rush",
        description: "+30% Gold per habit",
      },
      hpBoost: {
        name: "Vitality",
        description: "+50 Max HP",
      },
      shield: {
        name: "Shield",
        description: "50% reduce delete damage",
      },
      barrier: {
        name: "Barrier",
        description: "75% reduce delete damage",
      },
      healPotion: {
        name: "Heal Potion",
        description: "Restore 30 HP",
      },
      megaPotion: {
        name: "Mega Potion",
        description: "Restore 60 HP",
      },
      reviveScroll: {
        name: "Revive Scroll",
        description: "Revive when dead",
      },
      streakElixir: {
        name: "Streak Elixir",
        description: "+1 Streak (any habit)",
      },
    },

    // ===== QUOTES =====
    quotes: [
      "Every small step counts! 🚀",
      "You're building a better you every day! 💪",
      "Consistency is the key to success! 🔑",
      "Keep going, you're amazing! ⭐",
      "Progress over perfection! 📈",
      "Your future self will thank you! 🙏",
      "One day at a time! 📅",
      "You've got this! 🎯",
      "Take the quest today! ⚔️",
      "A hero is forged by daily habits! 🛡️",
      "Small actions, epic results! 🌱",
      "Today’s effort is tomorrow’s power! 🔥",
      "You showed up — that’s a victory! 🏆",
      "Discipline beats motivation! ⏳",
      "Don’t break the chain! 🔗",
      "Level up your life! ⬆️",
      "Quest completed! 🎉",
      "This is how legends are made! 📜",
    ],

    // ===== BADGES =====
    badges: {
      fire: {
        name: "Persistence",
        effect: "+5 EXP daily",
      },
      star: {
        name: "Diligence",
        effect: "+10 EXP daily",
      },
      warrior: {
        name: "Warrior",
        effect: "Double streak bonus",
      },
      king: {
        name: "Ambition",
        effect: "+1 Level Instant",
      },
    },
    // Start Page
    start: {
      welcome: "Welcome to Habigo!",
      description: "Embark on your journey to build better habits. Track your progress, level up, and conquer your goals!",
      startButton: "Start Adventure",
      settings: "Settings", // ✅ NEW
    },
  },

  vi: {
    // Navigation
    nav: {
      home: "Trang chủ",
      addHabit: "Thêm Thói Quen",
      motivation: "Động Lực",
      profile: "Hồ Sơ",
      store: "Cửa Hàng",
    },
    // Home Page
    home: {
      noHabits: "Chưa có thói quen. Hãy bắt đầu! 🚀",
      finishDay: "Kết Thúc Ngày ✅",
      addHabit: "➕ Thêm Thói Quen",
      dayLocked: "💀 Bạn đã sụp đổ từ mệt mỏi.\nHãy quay lại ngày mai.",
      unfinishedHabits: "Bạn còn {count} thói quen chưa hoàn thành.\nBạn sẽ mất {damage} HP.\n\nKết thúc ngày?",
    },
    // Habit Card
    habit: {
      done: "✅ Hoàn Thành",
      pending: "⬜ Chưa Làm",
      deleteConfirm: "Xóa \"{title}\"?\nPhạt: {damage} HP{shield}",
      shieldActive: " (Lá chắn hoạt động)",
    },
    // Profile Page
    profile: {
      title: "Hồ Sơ",
      choosAvatar: "Chọn Avatar",
      chooseBackground: "Chọn Nền", // ✅ NEW
      unlockBackground: "Mở khóa nền này với {price} Gold?", // ✅ NEW
      choosePet: "Chọn Thú Cưng", // ✅ NEW
      unlockPet: "Mở khóa thú cưng này với {price} Gold?", // ✅ NEW
      inventory: "📦 Kho Đồ",
      noItems: "Chưa có vật phẩm",
      settings: "⚙️ Cài Đặt",
      resetProgress: "🔄 Đặt Lại Tiến Độ",
      resetConfirm: "Đặt lại toàn bộ tiến độ? (Tất cả Level, EXP, Gold và Nhật Ký Chiến Thắng sẽ bị mất)",
      sound: {
        on: "🔊 Âm Thanh: BẬT",
        off: "🔇 Âm Thanh: TẮT",
        bgMusic: "🎵 Nhạc Nền",
        sfx: "🔊 Hiệu Ứng Âm Thanh",
      },
      language: "🌍Ngôn Ngữ",
      victoryLog: "⚔️Nhật Ký Chiến Thắng",
      notEnoughGold: "Không đủ vàng",
      unlockAvatar: "Mở khóa avatar này với {price} Gold?",
    },
    // Add Habit
    addHabit: {
      title: "Thêm Thói Quen",
      habitName: "Tên thói quen",
      badge: "✨ Huy Hiệu Thành Tích",
      saveHabit: "Lưu Thói Quen",
      enterName: "Vui lòng nhập tên thói quen",
    },
    // Store
    store: {
      title: "🛒 Cửa Hàng",
      gold: "💰 Vàng:",
      buy: "Mua",
      use: "Sử Dụng",
      owned: "✅ Sở Hữu",
      resetStore: "🔄 Đặt Lại Cửa Hàng (-{cost}G)",
      noItems: "Không có vật phẩm để đặt lại",
      resetConfirm: "Đặt lại cửa hàng với {cost} Gold?\nTất cả vật phẩm sẽ bị mất.",
      resetSuccess: "🔄 Cửa hàng đã đặt lại! Vật phẩm mới có sẵn.",
      hpFull: "❤️ HP đã đầy",
      notDead: "⚠️ Bạn chưa chết",
      revived: "💊 Bạn đã được hồi sinh!",
      noHabits: "📝 Không có thói quen để tăng",
      streakAdded: "🔥 +{amount} streak cho \"{title}\"",
    },
    // Motivation
    motivation: {
      title: "💪 Động Lực",
      totalHabits: "Tổng Thói Quen",
      doneToday: "Hoàn Thành Hôm Nay",
      maxStreak: "Streak Tối Đa",
      level: "Cấp Độ",
      achievements: "🏆 Thành Tích",
      progress: "🎖️ Tiến Độ Thành Tích",
      unlocked: "{count} của {total} đã mở khóa",
      tips: "💡 Mẹo Giữ Động Lực",
      tipList: [
        "✅ Bắt đầu nhỏ với những thói quen khả thi",
        "🔥 Xây dựng streak để tăng tốc",
        "🎯 Theo dõi tiến độ liên tục",
        "🏆 Ăn mừng những chiến thắng nhỏ",
        "💪 Đừng phá vỡ chuỗi",
        "📈 Lên cấp độ để nhận phần thưởng",
        "⏰ Lên lịch thói quen cùng giờ hàng ngày",
        "📊 Xem lại tiến độ của bạn hàng tuần",
        "🎁 Thưởng cho bản thân ở các mốc chính",
        "📱 Sử dụng nhắc nhở để luôn tập trung",
        "👥 Chia sẻ mục tiêu với bạn bè",
        "🧠 Tập trung vào một thói quen cùng lúc",
        "💧 Uống đủ nước và nghỉ ngơi tốt",
        "📝 Viết ra lý do bạn muốn thay đổi",
        "🌅 Bắt đầu ngày mới với một thói quen",
        "🎬 Tưởng tượng thành công trước khi làm",
        "⚡ Chia nhỏ thói quen thành các bước",
        "🎓 Học từ sai lầm, không phí bỏ",
        "🎪 Làm cho nó vui vẻ và thú vị",
        "🌟 Luôn tin tưởng vào bản thân",
      ],
    },
    // Victory Log
    victoryLog: {
        title: "⚔️ Nhật Ký Chiến Thắng",
        totalDays: "Tổng số ngày",
        currentStreak: "Chuỗi hiện tại",
        longestStreak: "Chuỗi dài nhất",
        history: "📜 Lịch sử chiến thắng",
        noVictories: "Chưa có chiến thắng nào. Hãy hoàn thành ngày đầu tiên của bạn! 🚀",
        backToProfile: "← Quay lại hồ sơ",
        days: "Chiến thắng trong {count} ngày",
        deleteConfirm: "Bạn có chắc chắn muốn xóa bản ghi chiến thắng này không?",

        // ✅ VICTORY MESSAGES
        messages: [
          "Thêm một ngày chiến thắng! 🎉",
  "Hôm nay bạn làm quá tốt! 💪",
  "Sự kiên trì đang mang lại kết quả! 🔥",
  "Giữ vững đà tiến lên nhé! 🚀",
  "Nhà vô địch của ngày hôm nay! ⭐",
  "Không gì có thể cản bạn! 🏆",
  "Đã mở khóa cấp độ huyền thoại! 👑",
  "Thực hiện hoàn hảo! ✨",
  "Chuỗi chiến thắng vẫn tiếp tục! 🔗",
  "Bạn đang bùng cháy! 🌟",

  "Hoàn thành nhiệm vụ xuất sắc! ⚔️",
  "Nhận EXP! Làm tốt lắm! 💎",
  "Kỷ luật đã mang lại chiến thắng! 🛡️",
  "Thêm một chiến thắng vào nhật ký! 📜",
  "Anh hùng được tạo nên từ từng chiến thắng nhỏ! 🦸",
  "Thói quen hoàn thành hoàn hảo! ✅",
  "Chiến thắng đạt được — tiếp tục tiến lên! 🔥",
  "Sức mạnh của bạn đang tăng lên! ⬆️",
  "Chiến thắng này đưa bạn gần hơn tới vĩ đại! 🌠",
  "Làm chủ nhiệm vụ hằng ngày! 🎮",
        ],
    },
    // ===== ACHIEVEMENTS =====
    achievements: {
      firstStep: {
        title: "Bước Đầu Tiên",
        description: "Hoàn thành thói quen đầu tiên của bạn",
      },
      streak7: {
        title: "Kiên Trì 7 Ngày",
        description: "Đạt streak 7 ngày trên bất kỳ thói quen nào",
      },
      streak30: {
        title: "Bậc Thầy Thói Quen",
        description: "Đạt streak 30 ngày trên bất kỳ thói quen nào",
      },
      dailyAll: {
        title: "Hoàn Hảo",
        description: "Hoàn thành tất cả các thói quen hàng ngày",
      },
    },
    // ===== ITEMS =====
    items: {
      expBoost: {
        name: "EXP Boost",
        description: "+20% EXP mỗi thói quen",
      },
      goldBoost: {
        name: "Gold Rush",
        description: "+30% Vàng mỗi thói quen",
      },
      hpBoost: {
        name: "Vitality",
        description: "+50 HP Tối Đa",
      },
      shield: {
        name: "Shield",
        description: "Giảm 50% sát thương khi xóa",
      },
      barrier: {
        name: "Barrier",
        description: "Giảm 75% sát thương khi xóa",
      },
      healPotion: {
        name: "Heal Potion",
        description: "Hồi 30 HP",
      },
      megaPotion: {
        name: "Mega Potion",
        description: "Hồi 60 HP",
      },
      reviveScroll: {
        name: "Revive Scroll",
        description: "Hồi sinh khi chết",
      },
      streakElixir: {
        name: "Streak Elixir",
        description: "+1 Streak (bất kỳ thói quen)",
      },
    },

    // ===== QUOTES =====
    quotes: [
      "Mỗi bước nhỏ đều có giá trị! 🚀",
  "Bạn đang xây dựng phiên bản tốt hơn của chính mình mỗi ngày! 💪",
  "Kiên trì là chìa khóa của thành công! 🔑",
  "Cứ tiếp tục đi, bạn làm rất tốt! ⭐",
  "Tiến bộ quan trọng hơn sự hoàn hảo! 📈",
  "Phiên bản tương lai của bạn sẽ biết ơn điều này! 🙏",
  "Mỗi ngày một bước! 📅",
  "Bạn làm được mà! 🎯",

  "Nhận nhiệm vụ hôm nay nào! ⚔️",
  "Anh hùng được rèn luyện từ thói quen hằng ngày! 🛡️",
  "Hành động nhỏ, kết quả lớn! 🌱",
  "Nỗ lực hôm nay là sức mạnh của ngày mai! 🔥",
  "Bạn đã xuất hiện — đó là chiến thắng! 🏆",
  "Kỷ luật luôn mạnh hơn động lực! ⏳",
  "Đừng phá vỡ chuỗi ngày cố gắng! 🔗",
  "Nâng cấp cuộc sống của bạn! ⬆️",
  "Hoàn thành nhiệm vụ! 🎉",
  "Huyền thoại được tạo ra từ đây! 📜",
    ],

    // ===== BADGES =====
    badges: {
      fire: {
        name: "Kiên Trì",
        effect: "+5 EXP hàng ngày",
      },
      star: {
        name: "Chăm Chỉ",
        effect: "+10 EXP hàng ngày",
      },
      warrior: {
        name: "Chiến Binh",
        effect: "Gấp đôi bonus streak",
      },
      king: {
        name: "Tham Vọng",
        effect: "+1 Cấp độ ngay",
      },
    },
    // Start Page
    start: {
      welcome: "Chào mừng đến với Habigo!",
      description: "Bắt đầu hành trình xây dựng thói quen tốt. Theo dõi tiến độ, lên cấp và chinh phục mục tiêu!",
      startButton: "Bắt Đầu",
      settings: "Cài Đặt", // ✅ NEW
    },
  },

  ja: {
    // Navigation
    nav: {
      home: "ホーム",
      addHabit: "習慣を追加",
      motivation: "モチベーション",
      profile: "プロフィール",
      store: "ストア",
    },
    // Home Page
    home: {
      noHabits: "習慣がまだありません。始めましょう！🚀",
      finishDay: "1日を終わる ✅",
      addHabit: "➕ 習慣を追加",
      dayLocked: "💀 疲労で倒れました。\n明日戻ってください。",
      unfinishedHabits: "まだ {count} 個の習慣が完了していません。\n{damage} HP を失います。\n\n1日を終わりますか？",
    },
    // Habit Card
    habit: {
      done: "✅ 完了",
      pending: "⬜ 保留中",
      deleteConfirm: "\"{title}\" を削除しますか？\nペナルティ: {damage} HP{shield}",
      shieldActive: " (シールド有効)",
    },
    // Profile Page
    profile: {
      title: "プロフィール",
      choosAvatar: "アバターを選択",
      chooseBackground: "背景を選択", // ✅ NEW
      unlockBackground: "この背景を {price} ゴールドでロック解除しますか？", // ✅ NEW
      choosePet: "ペットを選択", // ✅ NEW
      unlockPet: "このペットを {price} ゴールドでロック解除しますか？", // ✅ NEW
      inventory: "📦 インベントリ",
      noItems: "アイテムがありません",
      settings: "⚙️ 設定",
      resetProgress: "🔄 進度をリセット",
      resetConfirm: "すべての進度をリセットしますか？ (レベル、EXP、ゴールド、勝利ログがすべて失われます)",
      sound: {
        on: "🔊 サウンド: オン",
        off: "🔇 サウンド: オフ",
        bgMusic: "🎵 背景音楽",
        sfx: "🔊 効果音",
      },
      language: "🌍言語",
      victoryLog: "⚔️勝利ログ",
      notEnoughGold: "ゴールドが不足しています",
      unlockAvatar: "このアバターを {price} ゴールドでロック解除しますか？",
    },
    // Add Habit
    addHabit: {
      title: "習慣を追加",
      habitName: "習慣名",
      badge: "✨ アチーブメントバッジ",
      saveHabit: "習慣を保存",
      enterName: "習慣名を入力してください",
    },
    // Store
    store: {
      title: "🛒 ストア",
      gold: "💰 ゴールド:",
      buy: "購入",
      use: "使用",
      owned: "✅ 所有",
      resetStore: "🔄 ストアをリセット (-{cost}G)",
      noItems: "リセットするアイテムがありません",
      resetConfirm: "{cost} ゴールドでストアをリセットしますか？\nすべてのアイテムが失われます。",
      resetSuccess: "🔄 ストアがリセットされました！新しいアイテムが利用可能です。",
      hpFull: "❤️ HP は既に満杯です",
      notDead: "⚠️ あなたは死んでいません",
      revived: "💊 あなたは復活しました！",
      noHabits: "📝 ブーストする習慣がありません",
      streakAdded: "🔥 \"{title}\" に +{amount} ストリークを追加",
    },
    // Motivation
    motivation: {
      title: "💪 モチベーション",
      totalHabits: "合計習慣",
      doneToday: "今日完了",
      maxStreak: "最大ストリーク",
      level: "レベル",
      achievements: "🏆 アチーブメント",
      progress: "🎖️ アチーブメント進度",
      unlocked: "{count} of {total} ロック解除",
      tips: "💡 モチベーション維持のコツ",
      tipList: [
        "✅ 実現可能な小さな習慣から始める",
        "🔥 ストリークを構築して勢いをつける",
        "🎯 進度を一貫して追跡する",
        "🏆 小さな勝利を祝う",
        "💪 チェーンを壊さない",
        "📈 レベルアップして報酬を獲得",
        "⏰ 毎日同じ時間に習慣をスケジュール",
        "📊 毎週進度を確認する",
        "🎁 マイルストーンで自分に報酬を与える",
        "📱 リマインダーを使用して集中を保つ",
        "👥 友人と目標を共有する",
        "🧠 一度に1つの習慣に焦点を当てる",
        "💧 十分な水を飲んで休息を取る",
        "📝 変わりたい理由を書き出す",
        "🌅 習慣で1日を始める",
        "🎬 それを行う前に成功をイメージ",
        "⚡ 習慣を小さなステップに分割",
        "🎓 失敗ではなく失敗から学ぶ",
        "🎪 楽しく楽しくしよう",
        "🌟 常に自分を信じてください",
      ],
    },
    // Victory Log
    victoryLog: {
      title: "⚔️ 勝利ログ",
      totalDays: "合計日数",
      currentStreak: "現在のストリーク",
      longestStreak: "最長ストリーク",
      history: "📜 勝利の履歴",
      noVictories: "まだ勝利がありません。最初の日を完了してください！🚀",
      backToProfile: "← プロフィールに戻る",
      days: "{count} 日の勝利",
      deleteConfirm: "この勝利レコードを削除しますか？", // ✅ NEW

      // ✅ VICTORY MESSAGES
      messages: [
         "今日も勝利！🎉",
  "今日もやり切った！💪",
  "継続の成果が出ている！🔥",
  "この勢いを保とう！🚀",
  "今日のチャンピオン！⭐",
  "止まらない成長！🏆",
  "レジェンド級に到達！👑",
  "完璧な実行！✨",
  "ストリーク継続中！🔗",
  "絶好調！🌟",

  "クエスト成功！⚔️",
  "EXP獲得！よくやった！💎",
  "規律が勝利を導いた！🛡️",
  "勝利が記録に追加された！📜",
  "英雄は一つ一つの勝利から生まれる！🦸",
  "習慣を完璧に達成！✅",
  "勝利達成、さらに前へ！🔥",
  "力が確実に成長している！⬆️",
  "この勝利が偉大さへ近づける！🌠",
  "デイリークエスト制覇！🎮",
      ],
    },
    // ===== ACHIEVEMENTS =====
    achievements: {
      firstStep: {
        title: "最初の一歩",
        description: "最初の習慣を完了する",
      },
      streak7: {
        title: "7日間の忍耐",
        description: "任意の習慣で7日間のストリークに達する",
      },
      streak30: {
        title: "習慣マスター",
        description: "任意の習慣で30日間のストリークに達する",
      },
      dailyAll: {
        title: "完璧",
        description: "すべての毎日の習慣を完了する",
      },
    },
    // ===== ITEMS =====
    items: {
      expBoost: {
        name: "EXP Boost",
        description: "習慣ごとに+20%EXP",
      },
      goldBoost: {
        name: "Gold Rush",
        description: "習慣ごとに+30%ゴールド",
      },
      hpBoost: {
        name: "Vitality",
        description: "+50最大 HP",
      },
      shield: {
        name: "Shield",
        description: "削除ダメージを50%減少",
      },
      barrier: {
        name: "Barrier",
        description: "削除ダメージを75%減少",
      },
      healPotion: {
        name: "Heal Potion",
        description: "30Hpを回復",
      },
      megaPotion: {
        name: "Mega Potion",
        description: "60Hpを回復",
      },
      reviveScroll: {
        name: "Revive Scroll",
        description: "死亡時に復活",
      },
      streakElixir: {
        name: "Streak Elixir",
        description: "+1ストリーク (任意の習慣)",
      },
    },

    // ===== QUOTES =====
    quotes: [
      "小さな一歩も大切！🚀",
  "毎日、より良い自分を作っている！💪",
  "継続こそが成功の鍵！🔑",
  "その調子、そのまま進もう！⭐",
  "完璧より進歩！📈",
  "未来の自分が感謝してくれる！🙏",
  "一日一歩でいい！📅",
  "君ならできる！🎯",

  "今日のクエストを始めよう！⚔️",
  "英雄は日々の習慣から生まれる！🛡️",
  "小さな行動が大きな結果を生む！🌱",
  "今日の努力が明日の力になる！🔥",
  "行動したこと自体が勝利だ！🏆",
  "モチベーションより規律！⏳",
  "継続の鎖を切るな！🔗",
  "人生をレベルアップしよう！⬆️",
  "クエスト完了！🎉",
  "伝説はこうして生まれる！📜",
    ],

    // ===== BADGES =====
    badges: {
      fire: {
        name: "忍耐",
        effect: "毎日 +5 EXP",
      },
      star: {
        name: "勤勉",
        effect: "毎日 +10 EXP",
      },
      warrior: {
        name: "戦士",
        effect: "ストリークボーナス2倍",
      },
      king: {
        name: "野心",
        effect: "+1 レベル即座",
      },
    },
    // Start Page
    start: {
      welcome: "Habigoへようこそ！",
      description: "良い習慣を築く旅を始めましょう。進捗を追跡し、レベルアップして目標を達成しましょう！",
      startButton: "冒険を開始",
      settings: "設定", // ✅ NEW
    },
  },
};

export function t(
  key: string,
  lang: Language,
  params?: Record<string, string | number>
): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  if (typeof value !== "string") {
    return key;
  }

  if (params) {
    return value.replace(/{(\w+)}/g, (_, param) => String(params[param] ?? ""));
  }

  return value;
}