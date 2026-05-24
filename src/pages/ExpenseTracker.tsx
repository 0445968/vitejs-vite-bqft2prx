import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react';

type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
};

const STORAGE_KEY = 'quickutility-expenses';

const categories = [
  'Food',
  'Transport',
  'Housing',
  'Shopping',
  'Health',
  'Entertainment',
  'Income',
  'Other',
];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getInitialTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function money(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function ExpenseTracker() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(getInitialTransactions);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(25);
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(getToday());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    const byCategory = categories.map((item) => {
      const total = transactions
        .filter((transaction) => transaction.type === 'expense')
        .filter((transaction) => transaction.category === item)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        category: item,
        total,
      };
    });

    const largestCategory = Math.max(...byCategory.map((item) => item.total), 1);

    return {
      income,
      expenses,
      balance: income - expenses,
      byCategory,
      largestCategory,
    };
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  const addTransaction = () => {
    if (!title.trim() || amount <= 0) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount,
      category,
      type,
      date,
    };

    setTransactions((current) => [transaction, ...current]);
    setTitle('');
    setAmount(25);
    setCategory(type === 'income' ? 'Income' : 'Food');
    setDate(getToday());
  };

  const deleteTransaction = (id: string) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  };

  const changeType = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === 'income' ? 'Income' : 'Food');
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-[color:var(--qu-accent-strong)]">
          Finance
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--qu-text)]">
          Expense Tracker
        </h2>
        <p className="mt-2 hub-muted">
          Track income, expenses, categories, and your monthly-style summary.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
        <aside className="space-y-6">
          <div className="hub-card rounded-3xl p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--qu-accent-soft)] text-[color:var(--qu-accent-strong)]">
              <Wallet className="h-7 w-7" />
            </div>

            <h3 className="text-xl font-black text-[color:var(--qu-text)]">
              Add transaction
            </h3>

            <div className="mt-6 grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => changeType('expense')}
                  className={type === 'expense' ? 'hub-button' : 'hub-secondary-button'}
                >
                  Expense
                </button>

                <button
                  type="button"
                  onClick={() => changeType('income')}
                  className={type === 'income' ? 'hub-button' : 'hub-secondary-button'}
                >
                  Income
                </button>
              </div>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="hub-input"
                  placeholder="Groceries, Paycheck..."
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Amount
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="hub-input"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold text-[color:var(--qu-text)]">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="hub-input"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

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

              <button type="button" onClick={addTransaction} className="hub-button">
                <Plus className="h-4 w-4" />
                Add transaction
              </button>
            </div>
          </div>

          <div className="hub-card rounded-3xl p-6">
            <h3 className="text-xl font-black text-[color:var(--qu-text)]">
              Summary
            </h3>

            <div className="mt-5 grid gap-3">
              <SummaryCard label="Income" value={money(summary.income)} />
              <SummaryCard label="Expenses" value={money(summary.expenses)} />
              <SummaryCard
                label="Balance"
                value={money(summary.balance)}
                highlight
              />
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="hub-card rounded-3xl p-6">
            <h3 className="text-xl font-black text-[color:var(--qu-text)]">
              Spending by category
            </h3>

            <div className="mt-5 grid gap-4">
              {summary.byCategory
                .filter((item) => item.total > 0)
                .map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p className="text-sm font-black text-[color:var(--qu-text)]">
                        {item.category}
                      </p>
                      <p className="text-sm font-black hub-muted">
                        {money(item.total)}
                      </p>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[color:var(--qu-surface-soft)]">
                      <div
                        className="h-full rounded-full bg-[color:var(--qu-accent)]"
                        style={{
                          width: `${(item.total / summary.largestCategory) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

              {summary.expenses === 0 && (
                <p className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-5 text-sm hub-muted">
                  Add expenses to see category breakdowns.
                </p>
              )}
            </div>
          </div>

          <div className="hub-card rounded-3xl p-6">
            <h3 className="text-xl font-black text-[color:var(--qu-text)]">
              Transactions
            </h3>

            <div className="mt-5 grid gap-3">
              {sortedTransactions.length === 0 ? (
                <p className="rounded-2xl bg-[color:var(--qu-surface-soft)] p-5 text-sm hub-muted">
                  No transactions yet.
                </p>
              ) : (
                sortedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 rounded-2xl border border-[color:var(--qu-border)] bg-[color:var(--qu-surface-soft)] p-4"
                  >
                    <div
                      className={
                        transaction.type === 'income'
                          ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 text-green-500'
                          : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-500'
                      }
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="h-6 w-6" />
                      ) : (
                        <ArrowDownCircle className="h-6 w-6" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-[color:var(--qu-text)]">
                        {transaction.title}
                      </p>
                      <p className="text-sm hub-muted">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>

                    <p
                      className={
                        transaction.type === 'income'
                          ? 'font-black text-green-500'
                          : 'font-black text-red-500'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {money(transaction.amount)}
                    </p>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="hub-icon-button"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-2xl bg-[color:var(--qu-accent-soft)] p-4'
          : 'rounded-2xl bg-[color:var(--qu-surface-soft)] p-4'
      }
    >
      <p className="text-sm font-bold hub-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-[color:var(--qu-text)]">
        {value}
      </p>
    </div>
  );
}