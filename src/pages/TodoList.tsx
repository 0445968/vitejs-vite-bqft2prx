import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Edit3,
  ListTodo,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';

type Todo = {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'quickutility-todos';

function getInitialTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getPriorityLabel(priority: Priority) {
  if (priority === 'high') return 'High';
  if (priority === 'medium') return 'Medium';
  return 'Low';
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    const active = todos.length - completed;

    return {
      total: todos.length,
      completed,
      active,
    };
  }, [todos]);

  const sortedTodos = useMemo(() => {
    const weight: Record<Priority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (weight[a.priority] !== weight[b.priority]) {
        return weight[b.priority] - weight[a.priority];
      }

      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }

      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [todos]);

  const addTodo = () => {
    if (!title.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((current) => [todo, ...current]);
    setTitle('');
    setPriority('medium');
    setDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEdit = () => {
    if (!editingId || !editingTitle.trim()) return;

    setTodos((current) =>
      current.map((todo) =>
        todo.id === editingId ? { ...todo, title: editingTitle.trim() } : todo
      )
    );

    setEditingId(null);
    setEditingTitle('');
  };

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Productivity
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          To-Do List
        </h2>
        <p className="mt-2 hub-muted">
          Add, edit, prioritize, schedule, and complete tasks. Everything is
          saved locally.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="hub-card rounded-3xl p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_auto]">
              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Task
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') addTodo();
                  }}
                  className="hub-input"
                  placeholder="Add a new task..."
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Priority
                </span>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as Priority)}
                  className="hub-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Due date
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="hub-input"
                />
              </label>

              <div className="flex items-end">
                <button type="button" onClick={addTodo} className="hub-button w-full">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {sortedTodos.length === 0 ? (
              <div className="hub-card rounded-3xl p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
                  <ListTodo className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-[color:var(--qu-text)]">
                  No tasks yet
                </h3>
                <p className="mt-2 hub-muted">
                  Add your first task to start organizing your day.
                </p>
              </div>
            ) : (
              sortedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="hub-card rounded-3xl p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--qu-accent)]"
                >
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => toggleTodo(todo.id)}
                      className="mt-1 text-[color:var(--qu-accent-strong)]"
                      aria-label="Toggle task"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      {editingId === todo.id ? (
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <input
                            value={editingTitle}
                            onChange={(event) => setEditingTitle(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') saveEdit();
                            }}
                            className="hub-input"
                          />

                          <button
                            type="button"
                            onClick={saveEdit}
                            className="hub-button shrink-0"
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditingTitle('');
                            }}
                            className="hub-secondary-button shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p
                            className={
                              todo.completed
                                ? 'text-lg font-black text-[color:var(--qu-muted)] line-through'
                                : 'text-lg font-black text-[color:var(--qu-text)]'
                            }
                          >
                            {todo.title}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="hub-badge">
                              {getPriorityLabel(todo.priority)}
                            </span>

                            {todo.dueDate && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--qu-surface-soft)] px-3 py-1 text-xs font-black hub-muted">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {todo.dueDate}
                              </span>
                            )}

                            {todo.completed && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--qu-surface-soft)] px-3 py-1 text-xs font-black hub-muted">
                                <Check className="h-3.5 w-3.5" />
                                Completed
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {editingId !== todo.id && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(todo)}
                          className="hub-icon-button"
                          aria-label="Edit task"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTodo(todo.id)}
                          className="hub-icon-button"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="hub-card h-fit rounded-3xl p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
            <ListTodo className="h-7 w-7" />
          </div>

          <h3 className="text-xl font-black text-[color:var(--qu-text)]">
            Task summary
          </h3>

          <div className="mt-6 grid gap-3">
            <Stat label="Total tasks" value={stats.total} />
            <Stat label="Active" value={stats.active} />
            <Stat label="Completed" value={stats.completed} />
          </div>

          <button
            type="button"
            onClick={clearCompleted}
            className="hub-secondary-button mt-6 w-full"
          >
            Clear completed
          </button>
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