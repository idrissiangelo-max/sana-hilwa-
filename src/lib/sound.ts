// Web Audio API based ambient music and sound effects generator

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientInterval: any = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft romantic piano-like harmonic chime
  playNote(frequency: number, duration = 1.5, volume = 0.15) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // ignore
    }
  }

  // Celebrate chime (fanfare chords)
  playCelebrationFanfare() {
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 2.0, 0.18);
      }, idx * 120);
    });
  }

  // Blow candle sound (gentle wind whoosh + sparkle)
  playBlowCandle() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      // Gentle noise buffer
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.4);

      setTimeout(() => {
        this.playNote(523.25, 1.2, 0.12);
      }, 300);
    } catch (e) {
      // ignore
    }
  }

  // Pop sound for opening gift or clicking heart
  playPop() {
    this.playNote(440, 0.3, 0.1);
  }

  // Ambient gentle piano loop in C Major / Pentatonic
  startGentleAmbience() {
    if (this.ambientInterval) return;
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    let noteIdx = 0;
    const playNext = () => {
      const freq = scale[noteIdx % scale.length];
      this.playNote(freq, 2.5, 0.08);
      noteIdx = (noteIdx + 1 + Math.floor(Math.random() * 3)) % scale.length;
    };

    playNext();
    this.ambientInterval = setInterval(playNext, 2400);
  }

  stopGentleAmbience() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopGentleAmbience();
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
