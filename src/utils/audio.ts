// Web Audio API Synthesizer for notifications and focus ambient tone
// 100% client-side, zero external assets

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a gentle, crisp chime for completed tasks or timer completion
  playChime(type: 'task' | 'timer' | 'break' = 'task') {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      if (type === 'task') {
        // High, cheerful ascending bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'timer') {
        // Double harmonic chime for session end
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);

          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.65);
        });
      } else {
        // Break notification chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio might fail if user has not interacted yet, ignore safely
    }
  }

  // Toggle subtle brown/pink noise focus tone
  toggleFocusNoise(enable: boolean) {
    try {
      const ctx = this.getContext();
      if (!enable) {
        if (this.ambientOsc) {
          this.ambientGain?.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
          setTimeout(() => {
            try {
              this.ambientOsc?.stop();
              this.ambientOsc?.disconnect();
              this.ambientGain?.disconnect();
            } catch {}
            this.ambientOsc = null;
            this.ambientGain = null;
          }, 300);
        }
        return;
      }

      if (this.ambientOsc) return;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      // Brown noise formula for relaxing deep focus
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for warm soothing hum
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.025, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.ambientOsc = whiteNoise as any;
      this.ambientGain = gain;
    } catch {
      // Ignore audio failure
    }
  }
}

export const sound = new SoundEngine();
