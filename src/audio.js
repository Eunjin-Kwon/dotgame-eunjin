// Sound effects from synthesized tones (GAME_DESIGN.md section 7). No sound files.
// Every call is wrapped in try/catch: audio failure never breaks the game.
const GAIN = 0.1;

// dew: one square note. clear: three square notes back to back. fail: sawtooth gliding 220 -> 110 Hz.
const SOUNDS = {
  dew: [{ type: 'square', from: 880, to: 880, dur: 0.08 }],
  clear: [
    { type: 'square', from: 523, to: 523, dur: 0.12 },
    { type: 'square', from: 659, to: 659, dur: 0.12 },
    { type: 'square', from: 784, to: 784, dur: 0.12 },
  ],
  fail: [{ type: 'sawtooth', from: 220, to: 110, dur: 0.3 }],
};

// makeContext() returns an AudioContext-like object, null, or throws.
export function createAudio(makeContext) {
  let context = null;

  function tone(type, from, to, start, dur) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = type;
    gain.gain.value = GAIN;
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.setValueAtTime(from, start);
    if (to !== from) osc.frequency.linearRampToValueAtTime(to, start + dur);
    osc.start(start);
    osc.stop(start + dur);
  }

  return {
    // Creates the context once. Called on the first Enter press.
    unlock() {
      if (context) return;
      try {
        context = makeContext() || null;
      } catch {
        context = null;
      }
    },

    play(name) {
      const notes = SOUNDS[name];
      if (!context || !notes) return;
      try {
        let start = context.currentTime;
        for (const n of notes) {
          tone(n.type, n.from, n.to, start, n.dur);
          start += n.dur;
        }
      } catch {
        // Audio unavailable at play time: ignore.
      }
    },
  };
}
