import { useEffect, useRef, useState } from "react";

/* audio + scheduler */
const useMetronomeEngine = (bpm: number, running: boolean, volume: number) => {
  const ctxRef = useRef<AudioContext>();
  const gainRef = useRef<GainNode>();
  const nextTimeRef = useRef(0);

  const period = 60 / bpm;

  // click sound
  const click = (t: number) => {
    const ctx = ctxRef.current!;
    const osc = ctx.createOscillator();
    osc.frequency.value = 1000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(g).connect(gainRef.current!);
    osc.start(t);
    osc.stop(t + 0.05);
  };

  useEffect(() => {
    if (!running) return;
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;

    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.gain.value = volume;
      gainRef.current.connect(ctx.destination);
    }

    ctx.resume();
    nextTimeRef.current = ctx.currentTime + 0.05;

    const id = setInterval(() => {
      while (nextTimeRef.current < ctx.currentTime + 0.1) {
        click(nextTimeRef.current);
        nextTimeRef.current += period;
      }
    }, 25);

    return () => clearInterval(id);
  }, [bpm, running]);

  /* smooth volume */
  useEffect(() => {
    const ctx = ctxRef.current;
    const g = gainRef.current;
    if (ctx && g) g.gain.setTargetAtTime(volume, ctx.currentTime, 0.01);
  }, [volume]);

  return period;
};

const Metronome = (): JSX.Element => {
  const min = 1,
    max = 180;
  const [val, setVal] = useState("180");
  const [running, setRunning] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const bpm = Math.min(max, Math.max(min, parseInt(val, 10) || min));
  const period = useMetronomeEngine(bpm, running, volume);

  /* restart animation */
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    if (running) setAnimKey((k) => k + 1);
  }, [running, period]);

  const toggleRun = () => setRunning((v) => !v);

  return (
    <main className="p-2 w-full h-[calc(100vh-64px)] relative">
      <h1 className="font-bold">Metronome</h1>

      <section className="flex flex-col items-center justify-center w-full h-full">
        {/* Visual */}
        <section className="metronome">
          <section
            key={animKey}
            className="ball"
            style={{
              animationDuration: `${period}s`,
              animationTimingFunction: "linear",
              animationDirection: "alternate",
              animationPlayState: running ? "running" : "paused",
            }}
          />
          <section className="line" />
        </section>

        {/* Controls */}
        <section className="flex flex-col items-center mt-8">
          <input
            type="text"
            inputMode="numeric"
            value={val}
            onChange={(e) => {
              const next = e.target.value;
              if (/^\d*$/.test(next)) setVal(next);
            }}
            aria-label={`Number between ${min} and ${max}`}
            className="hidden-input w-full text-center text-[100px] h-[70%] font-bold cursor-pointer"
          />
          <span className="opacity-75 font-semibold text-lg">BPM</span>

          <section className="flex gap-x-5 mt-2">
            <button
              onClick={toggleRun}
              className={`w-20 aspect-square flex flex-col items-center justify-center rounded-full py-2 border-2 opacity-75 font-semibold cursor-pointer ${running ? "border-red-500/50 text-red-500/90" : "border-green-500/50 text-green-500/90"}`}
            >
              <span className="font-bold">{running ? "Pause" : "Start"}</span>
            </button>

            <div className="w-20 aspect-square flex flex-col items-center justify-center rounded-full border border-white/20 opacity-75">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(e) =>
                  setVolume(parseInt(e.target.value, 10) / 100)
                }
                aria-label="Volume"
                className="w-12 cursor-pointer"
              />
              <span className="text-xs font-semibold mt-1">Vol</span>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Metronome;