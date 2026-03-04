import { useRef, useCallback, useEffect } from "react";

/**
 * Spatial audio engine using Web Audio API.
 * - Ambient cosmic drone (continuous, subtle)
 * - Whoosh sound triggered by scroll speed
 */
export function useSpaceAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const whooshGainRef = useRef<GainNode | null>(null);
  const whooshFilterRef = useRef<BiquadFilterNode | null>(null);
  const whooshNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const startedRef = useRef(false);
  const mutedRef = useRef(false);
  const masterGainRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // === Cosmic Drone ===
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.12;
    droneGain.connect(master);
    droneGainRef.current = droneGain;

    // Low bass oscillator
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55; // A1
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.4;
    osc1.connect(osc1Gain).connect(droneGain);
    osc1.start();

    // Sub harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 82.5; // E2
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.2;
    osc2.connect(osc2Gain).connect(droneGain);
    osc2.start();

    // Slow LFO to modulate drone volume for pulsing feel
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(droneGain.gain);
    lfo.start();

    // === Whoosh (filtered noise) ===
    const whooshGain = ctx.createGain();
    whooshGain.gain.value = 0;
    whooshGainRef.current = whooshGain;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.8;
    whooshFilterRef.current = filter;

    // Create noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect(filter).connect(whooshGain).connect(master);
    noise.start();
    whooshNoiseRef.current = noise;
  }, []);

  // Call every frame with current scroll speed
  const updateScrollSpeed = useCallback((speed: number) => {
    if (!ctxRef.current || !whooshGainRef.current || !whooshFilterRef.current) return;

    const absSpeed = Math.abs(speed);
    const targetGain = Math.min(absSpeed * 2.5, 0.5);
    
    // Smooth gain transition
    const now = ctxRef.current.currentTime;
    whooshGainRef.current.gain.setTargetAtTime(targetGain, now, 0.05);
    
    // Shift filter frequency with speed
    const freq = 600 + absSpeed * 3000;
    whooshFilterRef.current.frequency.setTargetAtTime(Math.min(freq, 4000), now, 0.03);
  }, []);

  const toggleMute = useCallback(() => {
    if (!masterGainRef.current || !ctxRef.current) return;
    mutedRef.current = !mutedRef.current;
    const now = ctxRef.current.currentTime;
    masterGainRef.current.gain.setTargetAtTime(mutedRef.current ? 0 : 0.35, now, 0.1);
    return mutedRef.current;
  }, []);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return { initAudio, updateScrollSpeed, toggleMute, isMuted: () => mutedRef.current };
}
