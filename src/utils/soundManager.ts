class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private backgroundMusic: HTMLAudioElement | null = null;
  private sfxVolume: number = 0.5; // 🎵 Sound effects volume

  constructor() {
    this.sounds = {
      heal: new Audio("/sounds/heal.mp3"),
      damage: new Audio("/sounds/damage.mp3"),
      exp: new Audio("/sounds/exp.mp3"),
      levelup: new Audio("/sounds/levelup.mp3"),
    };

    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.sfxVolume;
      sound.preload = "auto";
    });

    // 🎵 BACKGROUND MUSIC
    this.backgroundMusic = new Audio("/sounds/heart-of-the-dream-128069.mp3");
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.preload = "auto";
  }

  play(name: keyof typeof this.sounds) {
    const sound = this.sounds[name];
    if (!sound) return;

    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  // 🎵 SOUND EFFECTS VOLUME
  setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }

  getSFXVolume() {
    return this.sfxVolume;
  }

  // 🎵 BACKGROUND MUSIC CONTROL
  playBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  pauseBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  setBackgroundMusicVolume(volume: number) {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const soundManager = new SoundManager();
