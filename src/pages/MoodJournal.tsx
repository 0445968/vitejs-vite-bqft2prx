import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Smile, Trash2 } from 'lucide-react';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'bad';

type JournalEntry = {
  id: string;
  date: string;
  mood: Mood;
  note: string;
};

const STORAGE_KEY = 'quickutility-mood-journal';

const moods: Array<{ value: Mood; label: string; emoji: string; score: number }> = [
  { value: 'great', label: 'Great', emoji: '😄', score: 5 },
  { value: 'good', label: 'Good', emoji: '🙂', score: 4 },
  { value: 'okay', label: 'Okay', emoji: '😐', score: 3 },
  { value: 'low', label: 'Low', emoji: '😕', score: 2 },
  { value: 'bad', label: 'Bad', emoji: '😔', score: 1 },
];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getInitialEntries(): JournalEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function MoodJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(getInitialEntries);
  const [date, setDate] = useState(getToday());
  const [mood, setMood] = useState<Mood>('good');
  const [note, setNote] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const insights = useMemo(() => {
    if (entries.length === 0) {
      return {
        total: 0,
        average: 0,
        commonMood: 'None yet',
      };
    }

    const average =
      entries.reduce((sum, entry) => {
        const moodInfo = moods.find((item) => item.value === entry.mood);
        return sum + (moodInfo?.score || 0);
      }, 0) / entries.length;

    const counts = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const commonMoodValue = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const commonMood = moods.find((item) => item.value === commonMoodValue);

    return {
      total: entries.length,
      average,
      commonMood: commonMood?.label || 'None yet',
    };
  }, [entries]);

  const addEntry = () => {
    if (!note.trim()) return;

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date,
      mood,
      note: note.trim(),
    };

    setEntries((current) => [entry, ...current]);
    setNote('');
    setMood('good');
    setDate(getToday());
  };

  const deleteEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Wellness
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Mood / Journal Tracker
        </h2>
        <p className="mt-2 hub-muted">
          Log your daily mood, write notes, and review simple insights.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="hub-card rounded-3xl p-6">
            <div className="grid gap-5">
              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="hub-input"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Mood
                </span>

                <div className="grid gap-3 sm:grid-cols-5">
                  {moods.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setMood(item.value)}
                      className={
                        mood === item.value
                          ? 'rounded-2xl bg-[color:var(--qu-accent)] p-4 text-center font-black text-white shadow-lg shadow-blue-500/20'
                          : 'rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4 text-center font-black text-[color:var(--qu-text)] transition hover:bg-[color:var(--qu-accent-soft)]'
                      }
                    >
                      <span className="block text-2xl">{item.emoji}</span>
                      <span className="mt-1 block text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Journal note
                </span>
                <textarea
                  rows={6}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="hub-input resize-none"
                  placeholder="Write a quick note about your day..."
                />
              </label>

              <button type="button" onClick={addEntry} className="hub-button">
                <Plus className="h-4 w-4" />
                Save entry
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {entries.length === 0 ? (
              <div className="hub-card rounded-3xl p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                  No journal entries yet
                </h3>
                <p className="mt-2 hub-muted">
                  Add your first mood note to start tracking.
                </p>
              </div>
            ) : (
              entries.map((entry) => {
                const moodInfo = moods.find((item) => item.value === entry.mood);

                return (
                  <div key={entry.id} className="hub-card rounded-3xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{moodInfo?.emoji}</span>
                          <div>
                            <p className="font-black text-[color:var(--qu-text)]">
                              {moodInfo?.label}
                            </p>
                            <p className="text-sm hub-muted">{entry.date}</p>
                          </div>
                        </div>

                        <p className="mt-4 leading-7 text-[color:var(--qu-text)]">
                          {entry.note}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteEntry(entry.id)}
                        className="hub-icon-button shrink-0"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <aside className="hub-card h-fit rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <Smile className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Mood insights
          </h3>

          <div className="mt-6 grid gap-3">
            <Insight label="Entries" value={insights.total.toString()} />
            <Insight
              label="Average score"
              value={insights.average ? insights.average.toFixed(1) : '0.0'}
            />
            <Insight label="Most common" value={insights.commonMood} />
          </div>

          <p className="mt-5 text-sm leading-6 hub-muted">
            This tracker is for personal reflection only and is saved locally in
            your browser.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-4">
      <p className="text-sm font-bold hub-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-[color:var(--qu-text)]">
        {value}
      </p>
    </div>
  );
}