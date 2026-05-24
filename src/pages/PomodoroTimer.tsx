import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Timer, Trash2 } from 'lucide-react';

type Mode = 'work' | 'break';

type PomodoroSession = {
  id: string;
  mode: Mode;
  completedAt: string;
  minutes: number;
};

const STORAGE_KEY = 'quickutility-pomodoro-history';

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

function getInitialHistory(): PomodoroSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<PomodoroSession[]>(getInitialHistory);

  const intervalRef = useRef<number | null>(null);

  const totalSeconds = mode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const workSessions = useMemo(
    () => history.filter((session) => session.mode === 'work').length,
    [history]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          completeSession();
          return mode === 'work' ? BREAK_SECONDS : WORK_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const completeSession = () => {
    const completed: PomodoroSession = {
      id: crypto.randomUUID(),
      mode,
      completedAt: new Date().toISOString(),
      minutes: mode === 'work' ? 25 : 5,
    };

    setHistory((current) => [completed, ...current].slice(0, 12));

    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setSecondsLeft(nextMode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
    setIsRunning(false);

    try {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='
      );
      audio.play().catch(() => {});
    } catch {
      // Ignore audio failures.
    }
  };

  const switchMode = (nextMode: Mode) => {
    setIsRunning(false);
    setMode(nextMode);
    setSecondsLeft(nextMode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Focus
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Pomodoro Timer
        </h2>
        <p className="mt-2 hub-muted">
          Focus with 25-minute work sessions and 5-minute breaks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="hub-card rounded-3xl p-6 sm:p-8">
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => switchMode('work')}
              className={mode === 'work' ? 'hub-button' : 'hub-secondary-button'}
            >
              Work 25
            </button>

            <button
              type="button"
              onClick={() => switchMode('break')}
              className={
                mode === 'break' ? 'hub-button' : 'hub-secondary-button'
              }
            >
              Break 5
            </button>
          </div>

          <div className="relative mx-auto flex aspect-square max-w-md items-center justify-center rounded-full bg-[color:var(--qu-surface-soft)] p-6">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--qu-accent) ${progress}%, transparent ${progress}%)`,
              }}
            />
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-[color:var(--qu-surface)]">
              <Timer className="mb-4 h-10 w-10 text-[color:var(--qu-accent-strong)]" />

              <p className="text-sm font-black uppercase tracking-[0.2em] hub-muted">
                {mode === 'work' ? 'Focus session' : 'Break time'}
              </p>

              <p className="mt-3 text-6xl font-black tracking-tight text-[color:var(--qu-text)] sm:text-7xl">
                {formatTime(secondsLeft)}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsRunning((value) => !value)}
              className="hub-button min-w-36"
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? 'Pause' : 'Start'}
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="hub-secondary-button min-w-36"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </section>

        <aside className="hub-card rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                Session history
              </h3>
              <p className="text-sm hub-muted">{workSessions} work sessions</p>
            </div>

            <button
              type="button"
              onClick={() => setHistory([])}
              className="hub-icon-button"
              aria-label="Clear history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3">
            {history.length === 0 ? (
              <div className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-5 text-sm hub-muted">
                Completed sessions will appear here.
              </div>
            ) : (
              history.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-[color:var(--qu-text)]">
                      {session.mode === 'work' ? 'Focus' : 'Break'}
                    </p>
                    <span className="hub-badge">{session.minutes} min</span>
                  </div>

                  <p className="mt-1 text-xs hub-muted">
                    {new Date(session.completedAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}