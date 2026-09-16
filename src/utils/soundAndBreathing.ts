// Web Audio API pure synthesizer for calming Tibetan bowl, chimes, and ambient soundscapes
import { AmbianceMode } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a gentle, peaceful harmonic chime (Tibetan singing bowl style)
 */
export function playGentleChime(frequency = 432) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
    masterGain.connect(ctx.destination);

    // Fundamental & soft harmonic overtones
    [frequency, frequency * 1.5, frequency * 2.01, frequency * 2.76].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const oscGain = ctx.createGain();
      const volume = idx === 0 ? 0.6 : 0.4 / (idx + 1);
      oscGain.gain.setValueAtTime(volume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + (3.5 - idx * 0.5));

      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 4);
    });
  } catch (e) {
    console.warn('Audio chime could not be played:', e);
  }
}

/**
 * Soft breath transition tone (higher soft tone for inhale, deeper warm tone for exhale)
 */
export function playBreathCue(type: 'inhale' | 'hold' | 'exhale') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = type === 'inhale' ? 528 : type === 'hold' ? 480 : 396;
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2);
  } catch {
    // Ignore audio restrictions
  }
}

// Generate colored noise buffer helper
function createNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Pink noise filter approximation
    lastOut = (lastOut * 0.95) + (white * 0.05);
    data[i] = lastOut * 3.5;
  }
  return buffer;
}

// Ambient Soundscapes Engine (Looping synthesis)
interface AmbientNodes {
  oscillators: OscillatorNode[];
  gains: GainNode[];
  noiseSources?: AudioBufferSourceNode[];
  intervalId?: any;
}

let activeAmbient: AmbientNodes | null = null;
let currentAmbianceMode: AmbianceMode = 'off';

export function stopAmbiance() {
  if (activeAmbient) {
    if (activeAmbient.intervalId) clearInterval(activeAmbient.intervalId);
    activeAmbient.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    if (activeAmbient.noiseSources) {
      activeAmbient.noiseSources.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch {}
      });
    }
    activeAmbient = null;
  }
  currentAmbianceMode = 'off';
}

export function getCurrentAmbianceMode(): AmbianceMode {
  return currentAmbianceMode;
}

export function startAmbiance(mode: AmbianceMode, volume = 0.08) {
  stopAmbiance();
  if (mode === 'off') return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    const nodes: AmbientNodes = {
      oscillators: [],
      gains: [masterGain],
      noiseSources: [],
    };

    if (mode === 'calme') {
      // Gentle ocean waves & 432Hz harmonic drone
      const freqs = [432, 216, 648];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.04, now);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        nodes.oscillators.push(osc);
      });

      // LFO for wave swelling
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, now); // ~8s breath wave
      lfoGain.gain.setValueAtTime(0.03, now);
      lfo.connect(lfoGain);
      lfoGain.connect(masterGain.gain);
      lfo.start();
      nodes.oscillators.push(lfo);

    } else if (mode === 'pluie') {
      // Soothing continuous rainfall
      const noiseBuffer = createNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.12, now);

      noiseSource.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(masterGain);
      noiseSource.start();
      nodes.noiseSources?.push(noiseSource);

      // Random gentle droplets
      const interval = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const t = ctx.currentTime;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400 + Math.random() * 800, t);
          osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);
          g.gain.setValueAtTime(0.02, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.1);
        } catch {}
      }, 400);
      nodes.intervalId = interval;

    } else if (mode === 'ocean') {
      // Swelling ocean surf
      const noiseBuffer = createNoiseBuffer(ctx, 6);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      const surfGain = ctx.createGain();
      surfGain.gain.setValueAtTime(0.09, now);

      // Swell LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.09, now); // ~11s ocean wave cycle
      lfoGain.gain.setValueAtTime(0.06, now);
      lfo.connect(lfoGain);
      lfoGain.connect(surfGain.gain);

      noiseSource.connect(filter);
      filter.connect(surfGain);
      surfGain.connect(masterGain);

      noiseSource.start();
      lfo.start();
      nodes.noiseSources?.push(noiseSource);
      nodes.oscillators.push(lfo);

    } else if (mode === 'foret') {
      // Whispering forest leaves & soft bird song tones
      const noiseBuffer = createNoiseBuffer(ctx, 4);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(0.8, now);

      const leafGain = ctx.createGain();
      leafGain.gain.setValueAtTime(0.04, now);

      noiseSource.connect(filter);
      filter.connect(leafGain);
      leafGain.connect(masterGain);
      noiseSource.start();
      nodes.noiseSources?.push(noiseSource);

      // Occasional gentle sweet chirp
      const interval = setInterval(() => {
        try {
          if (Math.random() > 0.4) {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            const t = ctx.currentTime;
            osc.type = 'sine';
            const f = 2400 + Math.random() * 600;
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.exponentialRampToValueAtTime(f + 400, t + 0.12);
            g.gain.setValueAtTime(0.02, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
            osc.connect(g);
            g.connect(masterGain);
            osc.start(t);
            osc.stop(t + 0.26);
          }
        } catch {}
      }, 2400);
      nodes.intervalId = interval;

    } else if (mode === 'vent') {
      // Wind whisper
      const noiseBuffer = createNoiseBuffer(ctx, 5);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(2.5, now);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, now);
      lfoGain.gain.setValueAtTime(180, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.09, now);

      noiseSource.connect(filter);
      filter.connect(windGain);
      windGain.connect(masterGain);

      noiseSource.start();
      lfo.start();
      nodes.noiseSources?.push(noiseSource);
      nodes.oscillators.push(lfo);

    } else if (mode === 'concentration') {
      // Alpha waves (10Hz binaural beat around 200Hz)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.type = 'sine';
      oscR.type = 'sine';
      oscL.frequency.setValueAtTime(196, now);
      oscR.frequency.setValueAtTime(206, now); // 10Hz alpha difference

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, now);
      oscL.connect(g);
      oscR.connect(g);
      g.connect(masterGain);
      oscL.start();
      oscR.start();
      nodes.oscillators.push(oscL, oscR);

    } else if (mode === 'creativite') {
      // Ethereal ambient arpeggio bells repeating softly
      const chord = [330, 392, 493, 587, 659];
      let step = 0;
      const interval = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const t = ctx.currentTime;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(chord[step % chord.length], t);
          g.gain.setValueAtTime(0.05, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t);
          osc.stop(t + 2.6);
          step++;
        } catch {}
      }, 1600);
      nodes.intervalId = interval;

    } else if (mode === 'motivation') {
      // Inspiring warm rising chords with gentle vitality
      const rootNotes = [261.63, 329.63, 392.0, 523.25];
      rootNotes.forEach((f) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.02, now);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        nodes.oscillators.push(osc);
      });

    } else if (mode === 'nuit') {
      // Night warmth: deep 108Hz delta resonance & warm lullaby tone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(108, now);
      osc2.frequency.setValueAtTime(111, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.05, now);
      osc1.connect(g);
      osc2.connect(g);
      g.connect(masterGain);
      osc1.start();
      osc2.start();
      nodes.oscillators.push(osc1, osc2);
    }

    activeAmbient = nodes;
    currentAmbianceMode = mode;
  } catch (err) {
    console.warn("Could not start ambiance:", err);
  }
}
