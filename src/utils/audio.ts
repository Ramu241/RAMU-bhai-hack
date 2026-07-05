// Web Audio API Synthesizer for Retro & Futuristic Sound Effects
let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(type: "click" | "verify" | "unlock" | "win" | "loss" | "jackpot") {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case "click": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case "verify": {
        // Futuristic radar scanning sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.3);
        
        // Add a fast tremolo
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 30; // 30Hz tremolo
        lfoGain.gain.value = 100;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.35);
        osc.stop(now + 0.35);
        break;
      }

      case "unlock": {
        // Success sci-fi chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.08, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
        break;
      }

      case "win": {
        // Upbeat victory bubble/arcade sound
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]; // Upwards C-major scale
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.1, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.18);
        });
        break;
      }

      case "loss": {
        // Sad down-sliding arcade retro buzzer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(330, now); // E4
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.6); // A2
        
        // Add low pass filter to make it sound muffled and analog
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.6);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
        break;
      }

      case "jackpot": {
        // Epic winning multi-voice chime
        const chords = [
          [261.63, 329.63, 392.00, 523.25], // C Major
          [349.23, 440.00, 523.25, 698.46], // F Major
          [392.00, 493.88, 587.33, 783.99], // G Major
          [523.25, 659.25, 783.99, 1046.50]  // C Major octave
        ];
        
        chords.forEach((chord, chordIdx) => {
          chord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + chordIdx * 0.15);
            gain.gain.setValueAtTime(0.08, now + chordIdx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + chordIdx * 0.15 + 0.3);
            
            // Subtle vibrato
            const vibrato = ctx.createOscillator();
            const vibGain = ctx.createGain();
            vibrato.frequency.value = 8;
            vibGain.gain.value = 5;
            vibrato.connect(vibGain);
            vibGain.connect(osc.frequency);

            osc.connect(gain);
            gain.connect(ctx.destination);
            
            vibrato.start(now + chordIdx * 0.15);
            osc.start(now + chordIdx * 0.15);
            vibrato.stop(now + chordIdx * 0.15 + 0.3);
            osc.stop(now + chordIdx * 0.15 + 0.3);
          });
        });
        break;
      }
    }
  } catch (e) {
    console.warn("Audio Context sound failed (interaction required first):", e);
  }
}
