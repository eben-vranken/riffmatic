import { useEffect, useRef, useState } from "react";

const Metronome = (): JSX.Element => {
  const [val, setVal] = useState("300");
  const min = 1,
    max = 180;

  // RUN/PAUSE
  const [running, setRunning] = useState(true);
  const frozenFracRef = useRef(0);

  // AUDIO
  const ctxRef = useRef<AudioContext | null>(null);
  const epochRef = useRef(0);
  const nextTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  // VISUAL
  const [animKey, setAnimKey] = useState(0);
  const [animDelaySec, setAnimDelaySec] = useState(0);

  // VOLUME (0..1)
  const [volume, setVolume] = useState(0.7);

  const allow = (next: string) => {
    if (next === "") return true;
    if (!/^\d+$/.test(next)) return false;
    const n = parseInt(next, 10);
    return n >= min && n <= max;
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (allow(next)) setVal(next);
  };

  const parsed = parseInt(val, 10);
  const bpm = Number.isFinite(parsed) ? parsed : min;
  const period = 60 / bpm;

  const getPhaseNow = () => {
    const ctx = ctxRef.current;
    if (!ctx) return 0;
    const t = ctx.currentTime - epochRef.current;
    const m = ((t % period) + period) % period;
    return m;
  };

  const ensureSample = async (ctx: AudioContext) => {
    if (bufferRef.current) return bufferRef.current;
    const res = await fetch("/click.wav");
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr);
    bufferRef.current = buf;
    return buf;
  };

  // play sample at time t
  const scheduleClick = (t: number) => {
    const ctx = ctxRef.current!;
    const buf = bufferRef.current;
    if (!buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(masterGainRef.current!);
    src.start(t);
  };

  // init / scheduler (runs only when BPM or running change)
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!ctxRef.current)
        ctxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      const ctx = ctxRef.current;

      // master gain once
      if (!masterGainRef.current) {
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.gain.value = volume;
        masterGainRef.current.connect(ctx.destination);
      }

      if (!running) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        return;
      }

      await ctx.resume();
      await ensureSample(ctx);
      if (cancelled) return;

      if (epochRef.current === 0) epochRef.current = ctx.currentTime;

      if (timerRef.current) window.clearInterval(timerRef.current);

      // align next beat to the epoch grid
      let next = epochRef.current;
      while (next < ctx.currentTime + 0.05) next += period;
      nextTimeRef.current = next;

      // set the animation’s fixed negative delay for this run
      setAnimDelaySec(getPhaseNow());
      setAnimKey((k) => k + 1);

      const lookahead = 25; // ms
      const scheduleAhead = 0.1; // s
      timerRef.current = window.setInterval(() => {
        while (nextTimeRef.current < ctx.currentTime + scheduleAhead) {
          scheduleClick(nextTimeRef.current);
          nextTimeRef.current += period;
        }
      }, lookahead);
    };

    start();

    return () => {
      cancelled = true;
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [period, running]);

  // smooth volume updates
  useEffect(() => {
    const ctx = ctxRef.current;
    const mg = masterGainRef.current;
    if (ctx && mg) mg.gain.setTargetAtTime(volume, ctx.currentTime, 0.01);
  }, [volume]);

  const toggleRun = () => {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    ctxRef.current.resume();

    if (running) {
      // freeze at current fraction of cycle
      frozenFracRef.current = getPhaseNow() / period;
      if (timerRef.current) window.clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  return (
    <main className="p-2 w-full h-[calc(100vh-64px)] relative">
      <h1 className="font-bold">Metronome</h1>

      <section className="flex flex-col items-center justify-center w-full h-full">
        {/* Visual metronome */}
        <section>
          <section className="metronome">
            <section
              key={animKey}
              className="ball"
              style={{
                animationDuration: `${period}s`,
                animationTimingFunction: "linear",
                animationDirection: "alternate",
                animationDelay: `${-animDelaySec}s`,
                animationPlayState: running
                  ? ("running" as const)
                  : ("paused" as const),
              }}
            />
            <section className="line" />
          </section>
        </section>

        {/* Control */}
        <section className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            value={val}
            onChange={onChange}
            onPointerDown={() => ctxRef.current?.resume()}
            aria-label={`Number between ${min} and ${max}`}
            className="hidden-input w-full text-center text-[100px] h-[70%] font-bold cursor-pointer"
          />
          <span className="opacity-75 font-semibold text-lg">BPM</span>

          {/* Pause + Volume */}
          <section className="flex gap-x-5 mt-2">
            <button
              onClick={toggleRun}
              className={`w-20 aspect-square flex flex-col items-center justify-center rounded-full py-2 border-2 opacity-75 font-semibold cursor-pointer ${
                running
                  ? "border-red-500/50 text-red-500/90"
                  : "border-green-500/50 text-green-500/90"
              }`}
            >
              <span className="font-bold">{running ? "Pause" : "Start"}</span>
            </button>

            {/* Volume slider */}
            <div
              className="w-20 aspect-square flex flex-col items-center justify-center rounded-full border border-white/20 opacity-75"
              onPointerDown={() => ctxRef.current?.resume()}
            >
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(e) => setVolume(parseInt(e.target.value, 10) / 100)}
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
