import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  Flame,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';

type Habit = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  completedDates: string[];
};

const STORAGE_KEY = 'quickutility-habits';

const colorOptions = [
  '#4f7cff',
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#ef4444',
  '#14b8a6',
];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getLastNDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    return date.toISOString().split('T')[0];
  });
}

function getInitialHabits(): Habit[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function calculateStreak(completedDates: string[]) {
  const completedSet = new Set(completedDates);
  let streak = 0;
  const cursor = new Date();

  while (completedSet.has(cursor.toISOString().split('T')[0])) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(getInitialHabits);
  const [name, setName] = useState('');
  const [color, setColor] = useState(colorOptions[0]);

  const today = getToday();
  const days = getLastNDays(14);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const stats = useMemo(() => {
    const totalCompletions = habits.reduce(
      (sum, habit) => sum + habit.completedDates.length,
      0
    );

    const completedToday = habits.filter((habit) =>
      habit.completedDates.includes(today)
    ).length;

    const bestStreak = habits.reduce(
      (best, habit) => Math.max(best, calculateStreak(habit.completedDates)),
      0
    );

    return {
      total: habits.length,
      completedToday,
      totalCompletions,
      bestStreak,
    };
  }, [habits, today]);

  const addHabit = () => {
    if (!name.trim()) return;

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    setHabits((current) => [habit, ...current]);
    setName('');
    setColor(colorOptions[0]);
  };

  const toggleDate = (habitId: string, date: string) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) return habit;

        const exists = habit.completedDates.includes(date);

        return {
          ...habit,
          completedDates: exists
            ? habit.completedDates.filter((item) => item !== date)
            : [...habit.completedDates, date],
        };
      })
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits((current) => current.filter((habit) => habit.id !== habitId));
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Wellness
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Habit Tracker
        </h2>
        <p className="mt-2 hub-muted">
          Build streaks, track daily completions, and view recent progress.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="hub-card rounded-3xl p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Habit name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') addHabit();
                  }}
                  className="hub-input"
                  placeholder="Drink water, Read, Exercise..."
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Color
                </span>
                <div className="flex h-[50px] items-center gap-2 rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] px-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setColor(option)}
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{ backgroundColor: option }}
                      aria-label={`Select ${option}`}
                    >
                      {color === option && <Check className="h-4 w-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end">
                <button type="button" onClick={addHabit} className="hub-button w-full">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className="hub-card rounded-3xl p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                No habits yet
              </h3>
              <p className="mt-2 hub-muted">
                Add your first habit to start building momentum.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {habits.map((habit) => {
                const streak = calculateStreak(habit.completedDates);
                const completedToday = habit.completedDates.includes(today);

                return (
                  <div key={habit.id} className="hub-card rounded-3xl p-5">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                          style={{ backgroundColor: habit.color }}
                        >
                          <Target className="h-6 w-6" />
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-[color:var(--qu-text)]">
                            {habit.name}
                          </h3>
                          <p className="text-sm hub-muted">
                            {streak} day streak · {habit.completedDates.length}{' '}
                            completions
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteHabit(habit.id)}
                        className="hub-icon-button"
                        aria-label="Delete habit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 sm:grid-cols-14">
                      {days.map((day) => {
                        const done = habit.completedDates.includes(day);

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDate(habit.id, day)}
                            title={day}
                            className="aspect-square rounded-xl border border-[color:var(--qu-border)] text-xs font-black transition hover:-translate-y-0.5"
                            style={{
                              backgroundColor: done ? habit.color : 'var(--qu-surface-soft)',
                              color: done ? 'white' : 'var(--qu-muted)',
                            }}
                          >
                            {new Date(day).getDate()}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDate(habit.id, today)}
                      className={
                        completedToday
                          ? 'hub-secondary-button mt-5 w-full'
                          : 'hub-button mt-5 w-full'
                      }
                    >
                      <Check className="h-4 w-4" />
                      {completedToday ? 'Completed today' : 'Mark today complete'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="hub-card h-fit rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Flame className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Progress stats
          </h3>

          <div className="mt-6 grid gap-3">
            <Stat label="Habits" value={stats.total} />
            <Stat label="Completed today" value={stats.completedToday} />
            <Stat label="Total completions" value={stats.totalCompletions} />
            <Stat label="Best current streak" value={stats.bestStreak} />
          </div>

          <div className="mt-6 rounded-2xl bg-[color:var(--qu-surface-soft)] p-4">
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[color:var(--qu-accent-strong)]" />
              <p className="text-sm font-black text-[color:var(--qu-text)]">
                Recent view
              </p>
            </div>
            <p className="text-sm leading-6 hub-muted">
              The grid shows the last 14 days. Tap any date to toggle completion.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-4">
      <p className="text-sm font-bold hub-muted">{label}</p>
      <p className="mt-1 text-3xl font-black text-[color:var(--qu-text)]">
        {value}
      </p>
    </div>
  );
}